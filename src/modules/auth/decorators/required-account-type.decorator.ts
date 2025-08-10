import { AccountType } from '../../account/enums/account.enum'
import { SetMetadata } from '@nestjs/common'

export const ACCOUNT_TYPES_KEY = 'accountTypes'

export const RequiredAccountTypes = (...types: AccountType[]) =>
  SetMetadata(ACCOUNT_TYPES_KEY, types)
