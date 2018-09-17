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
import { Group } from '../entities/group.entity';
import { GroupsService } from '../services/groups.service';
import { UsersService } from '../services/users.service';
import { PassThrough } from 'stream';
import { OutGroupDto } from '../dto/out-group.dto';
import { InCreateGroupDto } from '../dto/in-create-group.dto';
import { OutGroupsDto } from '../dto/out-groups.dto';
import { GroupActionDto } from '../dto/group-action.dto';

@ApiUseTags('groups')
@ApiBearerAuth()
@Controller('/api/groups')
export class GroupsController {
  constructor(
    private readonly groupService: GroupsService,
    private readonly userService: UsersService
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OutGroupDto,
    description: 'Group has been succesfully created'
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Post()
  async create(@Body() dto: InCreateGroupDto) {
    try {
      return plainToClass(
        OutGroupDto,
        await this.groupService.create({
          item: plainToClass(Group, dto)
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
  @Get()
  async findAll() {
    try {
      return plainToClass(OutGroupsDto, await this.groupService.findAll());
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OutGroupDto,
    description: 'User joined group'
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Post('/actions')
  async addUser(@Body() dto: GroupActionDto) {
    try {
      return plainToClass(
        OutGroupDto,
        await this.groupService.addUser({
          userUuid: dto.userUuid,
          groupUuid: dto.groupUuid
        })
      );
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OutGroupDto,
    description: 'User leaved group'
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Delete('/actions')
  async removeUser(@Body() dto: GroupActionDto) {
    try {
      return plainToClass(
        OutGroupDto,
        await this.groupService.removeUser({
          userUuid: dto.userUuid,
          groupUuid: dto.groupUuid
        })
      );
    } catch (error) {
      throw error;
    }
  }
}
