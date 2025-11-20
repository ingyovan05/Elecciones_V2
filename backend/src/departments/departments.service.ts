
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly repo: Repository<Department>,
  ) {}

  findAll() {
    return this.repo.find({
      where: { isActive: true },
      relations: { createdBy: true, updatedBy: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Departamento no encontrado');
    return entity;
  }

  create(dto: CreateDepartmentDto, auditUserId?: string) {
    const entity = this.repo.create({
      ...dto,
      createdBy: auditUserId ? ({ id: auditUserId } as any) : undefined,
      updatedBy: auditUserId ? ({ id: auditUserId } as any) : undefined,
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateDepartmentDto, auditUserId?: string) {
    const entity = await this.findOne(id);
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
