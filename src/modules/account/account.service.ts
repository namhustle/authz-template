import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Account } from './entities/account.entity'
import { DeleteResult, FindOneOptions, In, Repository } from 'typeorm'
import { CreateAccountDto, QueryAccountDto, UpdateAccountDto } from './dtos'
import * as bcrypt from 'bcrypt'
import { Role } from '../role/entities/role.entity'
import { PaginationMetadata } from '../../common/interceptors'

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

  async findMany(
    query: QueryAccountDto,
  ): Promise<{ data: Account[]; meta: PaginationMetadata }> {
    const { page = 1, limit = 10, search, type } = query
    const skip = (page - 1) * limit
    const queryBuilder = this.accountRepository.createQueryBuilder('account')

    if (search) {
      queryBuilder.andWhere('account.fullName ILIKE :search', {
        search: `%${search}%`,
      })
    }

    if (type) {
      queryBuilder.andWhere('account.type = :type', { type })
    }

    queryBuilder.orderBy('account.createdAt', 'DESC').skip(skip).take(limit)

    const [data, total] = await queryBuilder.getManyAndCount()

    const meta: PaginationMetadata = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }

    return { data, meta }
  }

  async findOne(options: FindOneOptions): Promise<Account | null> {
    return this.accountRepository.findOne(options)
  }

  async findOneById(accountId: string): Promise<Account> {
    const account = await this.accountRepository.findOneBy({ id: accountId })
    if (!account) throw new NotFoundException()
    return account
  }

  async updateById(
    accountId: string,
    payload: UpdateAccountDto,
  ): Promise<Account> {
    const { password, roles, ...rest } = payload

    // Find existing account
    const existingAccount = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: ['roles'],
    })

    if (!existingAccount) {
      throw new NotFoundException('Account not found')
    }

    // Check username conflict if username is being updated
    if (payload.username && existingAccount.username !== payload.username) {
      const usernameExists = await this.accountRepository.findOne({
        where: { username: payload.username },
      })
      if (usernameExists) {
        throw new ConflictException('Username already exists')
      }
    }

    // Validate roles if provided
    let roleEntities: Role[] = existingAccount.roles || []
    if (roles !== undefined) {
      if (roles.length > 0) {
        roleEntities = await this.roleRepository.findBy({ id: In(roles) })
        if (roleEntities.length !== roles.length) {
          throw new BadRequestException('Some roles do not exist')
        }
      } else {
        roleEntities = []
      }
    }

    // Update account data
    Object.assign(existingAccount, rest)

    // Update password if provided
    if (password) {
      existingAccount.hashedPassword = bcrypt.hashSync(password, 10)
    }

    // Update roles
    existingAccount.roles = roleEntities

    const updatedAccount = await this.accountRepository.save(existingAccount)

    // Return safe data without password
    const { hashedPassword, ...safeData } = updatedAccount
    return safeData
  }

  async deleteById(accountId: string): Promise<DeleteResult> {
    return this.accountRepository.delete(accountId)
  }
}
