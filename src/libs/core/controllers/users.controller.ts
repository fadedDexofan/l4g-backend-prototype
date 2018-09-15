import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiImplicitParam,
  ApiImplicitQuery,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { plainToClass, classToPlain } from 'class-transformer';
import { InCreateUserDto } from '../dto/in-create-user.dto';
import { OutUserDto } from '../dto/out-user.dto';
import { User } from '../entities/user.entity';
import { ParseIntWithDefaultPipe } from '../pipes/parse-int-with-default.pipe';
import { UsersService } from '../services/users.service';
import { InUserDto } from '../dto/in-user.dto';
import { PassThrough } from 'stream';

@ApiUseTags('users')
@ApiBearerAuth()
@Controller('/api/users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OutUserDto,
    description: 'User has been succesfully created.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Post()
  async create(@Body() dto: InCreateUserDto) {
    try {
      return plainToClass(
        OutUserDto,
        await this.service.create({
          item: await plainToClass(User, dto).setPassword(dto.password),
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OutUserDto,
    description: 'User has been successfully updated.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiImplicitParam({ name: 'uuid', type: String })
  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() dto: InUserDto) {
    try {
      return plainToClass(
        OutUserDto,
        await this.service.update({
          uuid,
          item: await plainToClass(User, dto).setPassword(dto.password),
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OutUserDto,
    description: '',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiImplicitParam({ name: 'uuid', type: String })
  @Get(':uuid')
  async findByUuid(@Param('uuid') uuid: string) {
    try {
      return plainToClass(
        OutUserDto,
        await this.service.findByUuid({
          uuid,
        }),
      );
    } catch (error) {
      throw error;
    }
  }
}
