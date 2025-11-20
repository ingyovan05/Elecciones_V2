
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Municipality } from './municipality.entity';
import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { Department } from '../departments/department.entity';

@Injectable()
export class MunicipalitiesService {
  constructor(
    @InjectRepository(Municipality)
    private readonly repo: Repository<Municipality>,
    @InjectRepository(Department)
    private readonly deptRepo: Repository<Department>,
  ) {}

  findAll(departmentId?: string) {
    const where: any = { isActive: true };
    if (departmentId) where.department = { id: departmentId };
    return this.repo.find({
      where,
      relations: { department: true, createdBy: true, updatedBy: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({ where: { id }, relations: { department: true } });
    if (!entity) throw new NotFoundException('Municipio no encontrado');
    return entity;
  }

  async create(dto: CreateMunicipalityDto, auditUserId?: string) {
    const department = await this.deptRepo.findOne({ where: { id: dto.departmentId } });
    if (!department) throw new NotFoundException('Departamento no existe');
    const entity = this.repo.create({
      daneCode: dto.daneCode,
      name: dto.name,
      department,
      createdBy: auditUserId ? ({ id: auditUserId } as any) : undefined,
      updatedBy: auditUserId ? ({ id: auditUserId } as any) : undefined,
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateMunicipalityDto, auditUserId?: string) {
    const entity = await this.findOne(id);
    if (dto.departmentId) {
      entity.department = await this.deptRepo.findOne({ where: { id: dto.departmentId } });
    }
    Object.assign(entity, dto);
    if (auditUserId) {
      entity.updatedBy = { id: auditUserId } as any;
    }
    return this.repo.save(entity);
  }

  async deactivate(id: string) {
    await this.repo.update(id, { isActive: false });
  }
}
