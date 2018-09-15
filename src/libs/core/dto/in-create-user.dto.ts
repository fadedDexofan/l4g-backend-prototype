import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, MaxLength, IsUUID } from 'class-validator';

export class InCreateUserDto {
  @IsUUID()
  @IsOptional()
  uuid: string;
  @MaxLength(128)
  @ApiModelPropertyOptional()
  password: string;
  @MaxLength(30)
  @ApiModelProperty()
  firstName: string;
  @MaxLength(30)
  @ApiModelProperty()
  lastName: string;
}
