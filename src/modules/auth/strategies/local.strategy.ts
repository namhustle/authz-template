import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm'
import { Account } from '../../account/entities/account.entity'
import { Repository } from 'typeorm'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {
    super()
  }

  async validate(username: string, password: string): Promise<any> {
    const account = await this.accountRepository
      .createQueryBuilder('account')
      .where('account.username = :username', { username })
      .select('account.id')
      .addSelect('account.fullName')
      .addSelect('account.type')
      .addSelect('account.hashedPassword')
      .getOne()

    if (
      account &&
      account.hashedPassword &&
      bcrypt.compareSync(password, account.hashedPassword)
    ) {
      const { hashedPassword, ...rest } = account

      return rest
    }

    throw new UnauthorizedException('Invalid credentials')
  }
}
