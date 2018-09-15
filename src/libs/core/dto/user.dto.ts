import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { MaxLength, IsUUID } from 'class-validator';

export class UserDto {
  @IsUUID()
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
}
