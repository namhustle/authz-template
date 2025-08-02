import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Account } from './entities/account.entity'
import { In, Repository } from 'typeorm'
import { CreateAccountDto } from './dtos'
import * as bcrypt from 'bcrypt'
import { Role } from '../role/entities/role.entity'

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(payload: CreateAccountDto): Promise<Account> {
    const { password, roles = [], ...rest } = payload

    // check username exists, validate roles
    const [existingAccount, roleEntities] = await Promise.all([
      this.accountRepository.findOne({
        where: { username: payload.username },
      }),
      roles.length > 0
        ? this.roleRepository.findBy({ id: In(roles) })
        : Promise.resolve([]),
    ])

    if (existingAccount) {
      throw new ConflictException('Username already exists')
    }

    if (roles.length > 0 && roleEntities.length !== roles.length) {
      throw new BadRequestException('Some roles do not exist')
    }

    const newAcc = this.accountRepository.create({
      ...rest,
      hashedPassword: bcrypt.hashSync(password, 10),
      roles: roleEntities,
    })

    const savedAcc = await this.accountRepository.save(newAcc)

    const { hashedPassword, ...safeData } = savedAcc
    return safeData
  }
}
