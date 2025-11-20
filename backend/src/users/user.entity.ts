
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditableEntity } from '../shared/base.entity';
import { Person } from '../persons/person.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  NORMAL = 'NORMAL',
  ANON = 'ANON',
}

@Entity('users')
export class User extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 64 })
  username: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ name: 'is_blocked', default: false })
  isBlocked: boolean;

  @Column({ name: 'failed_attempts', default: 0 })
  failedAttempts: number;

  @OneToMany(() => Person, (person) => person.createdByUser)
  persons: Person[];
}
