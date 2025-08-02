import { Body, Controller, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { AccountService } from './account.service'
import { CreateAccountDto } from './dtos'
import { AccountTypes } from '../auth/decorators/account-type.decorator'
import { AccountType } from './enums/account.enum'

@Controller('account')
@ApiTags('Account')
@ApiBearerAuth('access-token')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @AccountTypes(AccountType.ADMIN)
  @ApiOperation({ summary: 'Create a new account' })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async create(@Body() payload: CreateAccountDto) {
    return this.accountService.create(payload)
  }
}
