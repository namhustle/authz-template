import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'
import { AccountType } from '../enums/account.enum'
import { PaginationDto } from '../../../common/dtos'

export class CreateAccountDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  fullName: string

  @ApiProperty({ example: 'johndoe' })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({ example: 'P@ssword123' })
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiPropertyOptional({ example: AccountType.USER })
  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4', { each: true })
  roles?: string[]
}

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}

export class QueryAccountDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType
}
