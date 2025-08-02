import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { Account } from '../../account/entities/account.entity'
import { Permission } from '../../permission/entities/permission.entity'
import { BaseEntity } from '../../database/entities/base.entity'

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @Column({ unique: true })
  name: string

  @Column({ nullable: true })
  description: string

  @ManyToMany(() => Account, (account) => account.roles)
  accounts: Account[]

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    eager: true,
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions: Permission[]
}
