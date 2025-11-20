
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Party } from '../parties/party.entity';
import { Department } from '../departments/department.entity';
import { Municipality } from '../municipalities/municipality.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly repo: Repository<Person>,
    @InjectRepository(Party)
    private readonly partiesRepo: Repository<Party>,
    @InjectRepository(Department)
    private readonly deptRepo: Repository<Department>,
    @InjectRepository(Municipality)
    private readonly muniRepo: Repository<Municipality>,
  ) {}

  async findAll(filters: any = {}, page = 0, size = 10) {
    const qb = this.repo
      .createQueryBuilder('person')
      .leftJoinAndSelect('person.party', 'party')
      .leftJoinAndSelect('person.department', 'department')
      .leftJoinAndSelect('person.municipality', 'municipality')
      .leftJoinAndSelect('person.createdByUser', 'creator')
      .where('person.isActive = true');

    if (filters.cedula) qb.andWhere('person.cedula ILIKE :cedula', { cedula: `%${filters.cedula}%` });
    if (filters.name) {
      qb.andWhere(
        `(person.firstName || ' ' || coalesce(person.middleName,'') || ' ' || person.lastName || ' ' || coalesce(person.secondLastName,'')) ILIKE :name`,
        { name: `%${filters.name}%` },
      );
    }
    if (filters.partyId) qb.andWhere('party.id = :partyId', { partyId: filters.partyId });
    if (filters.departmentId)
      qb.andWhere('department.id = :departmentId', { departmentId: filters.departmentId });
    if (filters.municipalityId)
      qb.andWhere('municipality.id = :municipalityId', { municipalityId: filters.municipalityId });

    const [items, total] = await qb.skip(page * size).take(size).getManyAndCount();
    return { items, total, page, size };
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: { party: true, department: true, municipality: true },
    });
  }

  private async attachRelations(dto: CreatePersonDto | UpdatePersonDto, entity: Person) {
    if (dto.partyId) {
      entity.party = await this.partiesRepo.findOne({ where: { id: dto.partyId } });
    }
    if (dto.departmentId) {
      entity.department = await this.deptRepo.findOne({ where: { id: dto.departmentId } });
    }
    if (dto.municipalityId) {
      entity.municipality = await this.muniRepo.findOne({ where: { id: dto.municipalityId } });
    }
  }

  async create(
    dto: CreatePersonDto,
    userId: string,
    isAnonymous: boolean,
  ): Promise<{ conflict: boolean; person: Person }> {
    if (!isAnonymous) {
      const existing = await this.repo.findOne({
        where: { cedula: dto.cedula, isActive: true },
        relations: { party: true, department: true, municipality: true, createdByUser: true },
      });
      if (existing) {
        return { conflict: true, person: existing };
      }
    }
    const person = this.repo.create({
      ...dto,
      createdByUser: { id: userId } as User,
      createdBy: { id: userId } as User,
      updatedBy: { id: userId } as User,
    });
    await this.attachRelations(dto, person);
    const saved = await this.repo.save(person);
    return { conflict: false, person: saved };
  }

  async update(id: string, dto: UpdatePersonDto, userId: string) {
    const person = await this.findOne(id);
    if (!person) throw new NotFoundException('Persona no encontrada');
    Object.assign(person, dto);
    await this.attachRelations(dto, person);
    person.updatedBy = { id: userId } as User;
    return this.repo.save(person);
  }

  async deactivate(id: string, userId: string) {
    const person = await this.findOne(id);
    if (!person) throw new NotFoundException('Persona no encontrada');
    person.isActive = false;
    person.updatedBy = { id: userId } as User;
    await this.repo.save(person);
  }
}
