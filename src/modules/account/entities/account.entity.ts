import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { AccountType } from '../enums/account.enum'
import { Role } from '../../role/entities/role.entity'
import { BaseEntity } from '../../database/entities/base.entity'

@Entity({ name: 'accounts' })
export class Account extends BaseEntity {
  @Column({ unique: true })
  username?: string

  @Column()
  hashedPassword: string

  @Column({ type: 'enum', enum: AccountType, default: AccountType.USER })
  type?: AccountType

  @ManyToMany(() => Role, (role) => role.accounts, { eager: true })
  @JoinTable({
    name: 'account_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[]
}
