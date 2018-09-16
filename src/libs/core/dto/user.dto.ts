import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { MaxLength, IsUUID, IsMobilePhone } from 'class-validator';

export class UserDto {
  @ApiModelProperty({ type: String })
  uuid: string;
  @Exclude()
  @ApiModelPropertyOptional()
  password: string;
  @MaxLength(30)
  @ApiModelProperty()
  firstName: string;
  @MaxLength(30)
  @ApiModelProperty()
  lastName: string;
  @ApiModelProperty()
  @MaxLength(12)
  @IsMobilePhone('ru-RU')
  phone: string;
}
