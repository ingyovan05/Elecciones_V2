
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuditableEntity } from '../shared/base.entity';

@Entity('departments')
export class Department extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'dane_code', length: 10 })
  daneCode: string;

  @Column()
  name: string;
}
