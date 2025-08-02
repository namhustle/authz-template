import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto, RefreshTokenDto } from './dtos'
import { LocalAuthGuard } from './gurads'
import { Public } from './decorators'
import { AuthenticatedRequest } from './interfaces'

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login' })
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ description: 'OK' })
  async login(@Req() req: AuthenticatedRequest, @Body() payload: LoginDto) {
    return {
      statusCode: 200,
      message: 'Login successful',
      data: await this.authService.login(req.user),
    }
  }

  @Post('refresh-token')
  @Public()
  @ApiOperation({ summary: 'Refresh token' })
  async refreshToken(@Body() payload: RefreshTokenDto) {
    return {
      statusCode: 200,
      message: 'Refresh token successful',
      data: await this.authService.refreshToken(payload.refresh_token),
    }
  }
}
