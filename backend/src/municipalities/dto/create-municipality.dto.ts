
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMunicipalityDto {
  @IsString()
  @IsNotEmpty()
  daneCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  departmentId: string;
}
