import { Controller } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccountService } from './account.service'

@Controller('account')
@ApiTags('Account')
@ApiBearerAuth()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
}
