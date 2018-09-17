import { ApiModelProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GroupActionDto {
  @IsUUID()
  @ApiModelProperty()
  userUuid: string;

  @IsUUID()
  @ApiModelProperty()
  groupUuid: string;
}
