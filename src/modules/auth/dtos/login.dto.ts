import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({ example: 'johndoe' })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({ example: 'P@ssword123' })
  @IsNotEmpty()
  @IsString()
  password: string
}
