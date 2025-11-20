
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PartiesModule } from './parties/parties.module';
import { DepartmentsModule } from './departments/departments.module';
import { MunicipalitiesModule } from './municipalities/municipalities.module';
import { PersonsModule } from './persons/persons.module';
import { User } from './users/user.entity';
import { Party } from './parties/party.entity';
import { Department } from './departments/department.entity';
import { Municipality } from './municipalities/municipality.entity';
import { Person } from './persons/person.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [User, Party, Department, Municipality, Person],
        synchronize: false,
        logging: false,
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UsersModule,
    PartiesModule,
    DepartmentsModule,
    MunicipalitiesModule,
    PersonsModule,
  ],
  providers: [],
})
export class AppModule {}
