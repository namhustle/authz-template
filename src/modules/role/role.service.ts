import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Role } from './entities/role.entity'
import { DeleteResult, In, Repository } from 'typeorm'
import { CreateRoleDto, QueryRoleDto, UpdateRoleDto } from './dtos'
import { PaginationMetadata } from '../../common/interceptors'
import { Permission } from '../permission/entities/permission.entity'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(payload: CreateRoleDto): Promise<Role> {
    const { permissionIds = [], ...roleData } = payload

    // Check if role name already exists
    const existingRole = await this.roleRepository.exists({
      where: { name: payload.name },
    })
    if (existingRole) throw new ConflictException('Role name already exists')

    // Validate permissions if provided
    let permissions: Permission[] = []
    if (permissionIds.length > 0) {
      permissions = await this.permissionRepository.findBy({
        id: In(permissionIds),
      })

      if (permissions.length !== permissionIds.length)
        throw new BadRequestException('Some permissions do not exist')
    }

    const newRole = this.roleRepository.create({
      ...roleData,
      permissions,
    })

    return this.roleRepository.save(newRole)
  }

  async findMany(
    query: QueryRoleDto,
  ): Promise<{ data: Role[]; meta: PaginationMetadata }> {
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
    const { permissionIds, ...roleData } = payload

    const oldRole = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    })
    if (!oldRole) {
      throw new NotFoundException('Role not found')
    }

    // Check name conflict if name is being updated
    if (payload.name && oldRole.name !== payload.name) {
      const existingRole = await this.roleRepository.exists({
        where: { name: payload.name },
      })
      if (existingRole) throw new ConflictException('Role name already exists')
    }

    // Handle permissions update if provided
    if (permissionIds !== undefined) {
      if (permissionIds.length > 0) {
        const permissions = await this.permissionRepository.findBy({
          id: In(permissionIds),
        })

        if (permissions.length !== permissionIds.length)
          throw new BadRequestException('Some permissions do not exist')

        oldRole.permissions = permissions
      } else {
        oldRole.permissions = []
      }
    }

    // Update other fields
    Object.assign(oldRole, roleData)

    return this.roleRepository.save(oldRole)
  }

  async deleteById(roleId: string): Promise<DeleteResult> {
    return this.roleRepository.delete(roleId)
  }
}
