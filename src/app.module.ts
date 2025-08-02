import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AccountModule } from './modules/account/account.module'
import { AuthModule } from './modules/auth/auth.module'
import { RoleModule } from './modules/role/role.module'
import { PermissionModule } from './modules/permission/permission.module'
import { DatabaseModule } from './modules/database/database.module'
import { JwtAuthGuard } from './modules/auth/gurads'
import { AccountTypeGuard } from './modules/auth/gurads/account-type.guard'

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
      useClass: AccountTypeGuard,
    }
  ],
})
export class AppModule {}
