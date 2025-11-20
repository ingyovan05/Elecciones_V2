
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  daneCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
