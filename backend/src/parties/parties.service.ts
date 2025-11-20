
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Party } from './party.entity';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';

@Injectable()
export class PartiesService {
  constructor(
    @InjectRepository(Party)
    private readonly partiesRepo: Repository<Party>,
  ) {}

  findAll() {
    return this.partiesRepo.find({
      where: { isActive: true },
      relations: { createdBy: true, updatedBy: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const party = await this.partiesRepo.findOne({ where: { id } });
    if (!party) throw new NotFoundException('Partido no encontrado');
    return party;
  }

  async create(dto: CreatePartyDto, auditUserId?: string) {
    const party = this.partiesRepo.create({
      ...dto,
      createdBy: auditUserId ? ({ id: auditUserId } as any) : undefined,
      updatedBy: auditUserId ? ({ id: auditUserId } as any) : undefined,
    });
    return this.partiesRepo.save(party);
  }

  async update(id: string, dto: UpdatePartyDto, auditUserId?: string) {
    const party = await this.findOne(id);
    Object.assign(party, dto);
    if (auditUserId) {
      party.updatedBy = { id: auditUserId } as any;
    }
    return this.partiesRepo.save(party);
  }

  async deactivate(id: string) {
    await this.partiesRepo.update(id, { isActive: false });
  }
}
