import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { AccountService } from './account.service'
import { CreateAccountDto, QueryAccountDto, UpdateAccountDto } from './dtos'
import { RequiredAccountTypes } from '../auth/decorators'
import { AccountType } from './enums/account.enum'
import { Public } from '../auth/decorators'

@Controller('account')
@ApiTags('Account')
@ApiBearerAuth('access-token')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @Public()
  @RequiredAccountTypes(AccountType.ADMIN)
  @ApiOperation({ summary: 'Create a new account' })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async create(@Body() payload: CreateAccountDto) {
    return this.accountService.create(payload)
  }

  @Get()
  @ApiOperation({ summary: 'Find many accounts' })
  @ApiOkResponse()
  async findMany(@Query() query: QueryAccountDto) {
    return this.accountService.findMany(query)
  }

  @Get(':accountId')
  @ApiOperation({ summary: 'Get account by Id' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiOkResponse()
  async findOneById(@Param('accountId') accountId: string) {
    return this.accountService.findOneById(accountId)
  }

  @Patch(':accountId')
  @ApiOperation({ summary: 'Update an account' })
  @ApiOkResponse()
  @RequiredAccountTypes(AccountType.ADMIN)
  async updateById(
    @Param('accountId') accountId: string,
    @Body() payload: UpdateAccountDto,
  ) {
    return this.accountService.updateById(accountId, payload)
  }

  @Delete(':accountId')
  @RequiredAccountTypes(AccountType.ADMIN)
  @ApiOperation({ summary: 'Delete account' })
  @ApiOkResponse()
  async deleteById(@Param('accountId') accountId: string) {
    return this.accountService.deleteById(accountId)
  }
}
