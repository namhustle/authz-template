import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    user: any,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.sign({
        sub: user.id,
        fullName: user.fullName,
        type: user.type,
      }),
      this.jwtService.sign(
        { sub: user.id },
        {
          secret:
            this.configService.get<string>('JWT_REFRESH_SECRET') ||
            'your_refresh_secret',
          expiresIn:
            this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d',
        },
      ),
    ])

    return {
      access_token,
      refresh_token,
    }
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = this.jwtService.verify(refreshToken)
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.sign({
        sub: payload.sub,
        fullName: payload.fullName,
        type: payload.type,
      }),
      this.jwtService.sign(
        { sub: payload.sub },
        {
          secret:
            this.configService.get<string>('JWT_REFRESH_SECRET') ||
            'your_refresh_secret',
          expiresIn:
            this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d',
        },
      ),
    ])

    return {
      access_token,
      refresh_token,
    }
  }
}
