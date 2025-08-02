import { ApiProperty, PartialType } from '@nestjs/swagger'
import { PaginationDto } from '../../../common/dtos'

export class CreateRoleDto {
  @ApiProperty({ example: 'moderator' })
  name: string

  @ApiProperty({ example: 'Moderator role' })
  description?: string
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

export class QueryRoleDto extends PaginationDto {}
