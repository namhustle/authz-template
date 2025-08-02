import { Global, Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Account } from '../account/entities/account.entity'
import { JwtStrategy, LocalStrategy } from './strategies'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory(config: ConfigService) {
        return {
          secret:
            config.get<string>('JWT_ACCESS_SECRET') || 'your_access_secret',
          signOptions: {
            expiresIn: config.get<string>('ACCESS_TOKEN_EXPIRES_IN') || '4h',
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
