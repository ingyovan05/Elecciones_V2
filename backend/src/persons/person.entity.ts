
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditableEntity } from '../shared/base.entity';
import { Party } from '../parties/party.entity';
import { Department } from '../departments/department.entity';
import { Municipality } from '../municipalities/municipality.entity';
import { User } from '../users/user.entity';

@Entity('persons')
export class Person extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cedula: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'middle_name', nullable: true })
  middleName?: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'second_last_name', nullable: true })
  secondLastName?: string;

  @ManyToOne(() => Party, { nullable: true })
  @JoinColumn({ name: 'party_id' })
  party?: Party;

  @Column({ name: 'votes_congress', default: false })
  votesCongress: boolean;

  @Column({ name: 'votes_president', default: false })
  votesPresident: boolean;

  @Column({ name: 'accepts_terms', default: false })
  acceptsTerms: boolean;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'department_id' })
  department?: Department;

  @ManyToOne(() => Municipality, { nullable: true })
  @JoinColumn({ name: 'municipality_id' })
  municipality?: Municipality;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;
}
