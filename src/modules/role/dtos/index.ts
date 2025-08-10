import { ApiProperty, PartialType } from '@nestjs/swagger'
import { PaginationDto } from '../../../common/dtos'
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

export class CreateRoleDto {
  @ApiProperty({ example: 'moderator' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ example: 'Moderator role' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ example: ['uuid1', 'uuid2'] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[]
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

export class QueryRoleDto extends PaginationDto {}
