
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { validatePasswordPolicy } from '../auth/password-policy.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find({ where: { isActive: true } });
  }

  async findById(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(dto: CreateUserDto, auditUserId?: string) {
    const policyError = validatePasswordPolicy(dto.password, dto.username);
    if (policyError) {
      throw new BadRequestException(policyError);
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      username: dto.username,
      passwordHash,
      role: dto.role,
      isActive: dto.isActive ?? true,
      createdBy: auditUserId ? ({ id: auditUserId } as User) : undefined,
      updatedBy: auditUserId ? ({ id: auditUserId } as User) : undefined,
    });
    return this.usersRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async changePassword(dto: ChangePasswordDto, username: string) {
    const user = await this.findById(dto.userId);
    const policyError = validatePasswordPolicy(dto.newPassword, username);
    if (policyError) throw new BadRequestException(policyError);
    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    user.failedAttempts = 0;
    user.isBlocked = false;
    return this.usersRepository.save(user);
  }

  async incrementFailedAttempts(id: string) {
    const user = await this.findById(id);
    user.failedAttempts += 1;
    if (user.failedAttempts >= 3) {
      user.isBlocked = true;
    }
    await this.usersRepository.save(user);
  }

  async resetFailedAttempts(id: string) {
    await this.usersRepository.update(id, { failedAttempts: 0, isBlocked: false });
  }
}
