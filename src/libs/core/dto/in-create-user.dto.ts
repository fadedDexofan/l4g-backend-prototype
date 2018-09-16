import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, MaxLength, IsUUID, IsMobilePhone } from 'class-validator';

export class InCreateUserDto {
  @IsOptional()
  uuid: string;
  @MaxLength(128)
  @ApiModelProperty()
  password: string;
  @MaxLength(30)
  @ApiModelProperty()
  firstName: string;
  @MaxLength(30)
  @ApiModelProperty()
  lastName: string;
  @MaxLength(12)
  @ApiModelProperty()
  @IsMobilePhone('ru-RU')
  phone: string;
}
