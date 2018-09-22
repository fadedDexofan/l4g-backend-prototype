import { MaxLength, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class InUserDto {
  @MaxLength(30)
  @IsString()
  @ApiModelProperty()
  firstName: string;
  @MaxLength(30)
  @IsString()
  @ApiModelProperty()
  lastName: string;
}
