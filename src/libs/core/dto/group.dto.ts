import { IsNotEmpty, MaxLength } from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class GroupDto {
  @ApiModelProperty()
  uuid: string;

  @MaxLength(100)
  @ApiModelProperty()
  name: string;

  @MaxLength(255)
  @ApiModelProperty()
  goal: string;

  @ApiModelProperty({ type: String })
  dateTime: Date;

  @ApiModelProperty({ type: Number })
  maxGroupSize: number;

  @ApiModelProperty({ type: Number })
  ticketCost: number;

  @ApiModelProperty()
  address: string;

  @Type(() => UserDto)
  @ApiModelProperty({ type: UserDto, isArray: false })
  alpha: UserDto;

  @Type(() => UserDto)
  @ApiModelProperty({ type: UserDto, isArray: true })
  members: UserDto[];

  @ApiModelProperty({ type: Boolean, default: false })
  cancelled: boolean;
}
