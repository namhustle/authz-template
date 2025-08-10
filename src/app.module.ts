import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AccountModule } from './modules/account/account.module'
import { AuthModule } from './modules/auth/auth.module'
import { RoleModule } from './modules/role/role.module'
import { PermissionModule } from './modules/permission/permission.module'
import { DatabaseModule } from './modules/database/database.module'
import {
  JwtAuthGuard,
  RequiredAccountTypeGuard,
  RequiredPermissionGuard,
} from './modules/auth/gurads'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AccountModule,
    AuthModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RequiredAccountTypeGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RequiredPermissionGuard,
    },
  ],
})
export class AppModule {}
