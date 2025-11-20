
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonsService } from './persons.service';
import { PersonsController } from './persons.controller';
import { Person } from './person.entity';
import { Party } from '../parties/party.entity';
import { Department } from '../departments/department.entity';
import { Municipality } from '../municipalities/municipality.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person, Party, Department, Municipality])],
  controllers: [PersonsController],
  providers: [PersonsService],
})
export class PersonsModule {}
