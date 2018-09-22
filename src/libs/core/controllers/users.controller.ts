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
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiImplicitParam,
  ApiImplicitQuery,
  ApiResponse,
  ApiUseTags
} from '@nestjs/swagger';
import { plainToClass, classToPlain } from 'class-transformer';
import { InCreateUserDto } from '../dto/in-create-user.dto';
import { OutUserDto } from '../dto/out-user.dto';
import { User } from '../entities/user.entity';
import { ParseIntWithDefaultPipe } from '../pipes/parse-int-with-default.pipe';
import { UsersService } from '../services/users.service';
import { InUserDto } from '../dto/in-user.dto';
import { PassThrough } from 'stream';
import { OutGroupsDto } from '../dto/out-groups.dto';
import { GroupsService } from '../services/groups.service';

@ApiUseTags('users')
@ApiBearerAuth()
@Controller('/api/users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly groupService: GroupsService
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OutUserDto,
    description: 'User has been succesfully created.'
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Post()
  async create(@Body() dto: InCreateUserDto) {
    try {
      return plainToClass(
        OutUserDto,
        await this.userService.create({
          item: await plainToClass(User, dto).setPassword(dto.password)
        })
      );
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OutUserDto,
    description: 'User has been successfully updated.'
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiImplicitParam({ name: 'uuid', type: String })
  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() dto: InUserDto) {
    try {
      return plainToClass(
        OutUserDto,
        await this.userService.update({
          uuid,
          item: plainToClass(User, dto)
        })
      );
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OutUserDto,
    description: ''
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiImplicitParam({ name: 'uuid', type: String })
  @Get(':uuid')
  async findByUuid(@Param('uuid') uuid: string) {
    try {
      return plainToClass(
        OutUserDto,
        await this.userService.findByUuid({
          uuid
        })
      );
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OutGroupsDto,
    description: ''
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiImplicitParam({ name: 'uuid', type: String })
  @Get(':uuid/journal')
  async userJournal(@Param('uuid') uuid: string) {
    try {
      return plainToClass(
        OutGroupsDto,
        await this.groupService.findUserGroups({
          userUuid: uuid
        })
      );
    } catch (error) {
      throw error;
    }
  }
}
