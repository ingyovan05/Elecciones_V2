
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePartyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;
}
