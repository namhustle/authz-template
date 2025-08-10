import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Permission } from './entities/permission.entity'
import { Repository } from 'typeorm'
import { QueryPermissionDto } from './dtos'
import { PaginationMetadata } from '../../common/interceptors'

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findMany(
    query: QueryPermissionDto,
  ): Promise<{ data: Permission[]; meta: PaginationMetadata }> {
    const { page = 1, limit = 10, search } = query
    const skip = (page - 1) * limit
    const queryBuilder =
      this.permissionRepository.createQueryBuilder('permission')

    if (search) {
      queryBuilder.andWhere('permission.name ILIKE :search', {
        search: `%${search}%`,
      })
    }

    queryBuilder.orderBy('permission.createdAt', 'DESC').skip(skip).take(limit)

    const [data, total] = await queryBuilder.getManyAndCount()

    const meta: PaginationMetadata = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }

    return { data, meta }
  }

  async findById(permissionId: string): Promise<Permission | null> {
    return this.permissionRepository.findOneBy({ id: permissionId })
  }
}
