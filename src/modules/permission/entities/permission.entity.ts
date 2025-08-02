import { Column, Entity, ManyToMany } from 'typeorm'
import { Role } from '../../role/entities/role.entity'
import { BaseEntity } from '../../database/entities/base.entity'

@Entity({ name: 'permissions' })
export class Permission extends BaseEntity {
  @Column({ unique: true })
  name: string

  @Column({ nullable: true })
  description: string

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[]
}
