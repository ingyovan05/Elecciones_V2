
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';

@Controller('persons')
export class PersonsController {
  constructor(private readonly service: PersonsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query() query: any,
  ) {
    const { page = 0, size = 10, ...filters } = query;
    return this.service.findAll(filters, Number(page), Number(size));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreatePersonDto,
    @CurrentUser() current: RequestUser,
  ) {
    return this.service.create(dto, current.sub, false);
  }

  @Post('anonymous')
  createAnonymous(@Body() dto: CreatePersonDto) {
    const anonId = process.env.ANON_USER_ID;
    return this.service.create(dto, anonId, true);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePersonDto,
    @CurrentUser() current: RequestUser,
  ) {
    return this.service.update(id, dto, current.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() current: RequestUser) {
    return this.service.deactivate(id, current.sub);
  }
}
