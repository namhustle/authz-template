import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity'
import { DeleteResult, Repository } from 'typeorm'
import { CreateRoleDto, QueryRoleDto, UpdateRoleDto } from './dtos'
import { PaginationMetadata } from '../../common/interceptors'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {
  }

  async create(payload: CreateRoleDto): Promise<Role> {
    const newRole = this.roleRepository.create(payload)
    return this.roleRepository.save(newRole)
  }

  async find(query: QueryRoleDto): Promise<{ data: Role[], meta: PaginationMetadata }> {
    const { page = 1, limit = 10, search } = query
    const queryBuilder = this.roleRepository.createQueryBuilder('role')

    if (search) {
      queryBuilder.where('role.name LIKE :search', { search: `%${search}%` })
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('role.createdAt', 'DESC')
      .getManyAndCount()

    const meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }

    return { data, meta }
  }

  async getById(roleId: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    })
    if (!role) {
      throw new NotFoundException('Role not found')
    }
    return role
  }

  async updateById(roleId: string, payload: UpdateRoleDto): Promise<Role> {
    const oldRole = await this.roleRepository.findOne({ where: { id: roleId } })
    if (!oldRole) {
      throw new NotFoundException('Role not found')
    }

    if (payload.name && oldRole.name !== payload.name) {
      const existingRole = await this.roleRepository.exists({
        where: { name: payload.name },
      })
      if (existingRole) {
        throw new ConflictException('Role name already exists')
      }
    }

    const updatedRole = this.roleRepository.merge(oldRole, payload)
    return this.roleRepository.save(updatedRole)
  }

  async deleteById(roleId: string): Promise<DeleteResult> {
    return this.roleRepository.delete(roleId)
  }
}
