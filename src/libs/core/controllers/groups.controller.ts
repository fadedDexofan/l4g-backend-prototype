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
import { PassThrough } from 'stream';
import { OutGroupDto } from '../dto/out-group.dto';
import { InCreateGroupDto } from '../dto/in-create-group.dto';
import { OutGroupsDto } from '../dto/out-groups.dto';

@ApiUseTags('groups')
@ApiBearerAuth()
@Controller('/api/groups')
export class GroupsController {
  constructor(private readonly service: GroupsService) {}

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
        await this.service.create({
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
      return plainToClass(OutGroupsDto, await this.service.findAll());
    } catch (error) {
      throw error;
    }
  }
}
