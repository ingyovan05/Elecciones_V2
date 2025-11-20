
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuditableEntity } from '../shared/base.entity';
import { Department } from '../departments/department.entity';

@Entity('municipalities')
export class Municipality extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'dane_code', length: 10 })
  daneCode: string;

  @Column()
  name: string;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;
}
