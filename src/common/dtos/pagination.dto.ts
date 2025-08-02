import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    default: 1,
    type: Number,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    type: Number,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10

  @ApiPropertyOptional({
    description: 'Search term to filter results',
    type: String,
  })
  @IsString({ message: 'Search term must be a string' })
  @IsOptional()
  search?: string
}
