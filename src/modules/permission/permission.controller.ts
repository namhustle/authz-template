import { Controller, Get, Query } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { PermissionService } from './permission.service'
import { RequiredAccountTypes } from '../auth/decorators'
import { AccountType } from '../account/enums/account.enum'
import { QueryPermissionDto } from './dtos'

@Controller('permission')
@ApiTags('Permission')
@ApiBearerAuth('access-token')
@RequiredAccountTypes(AccountType.ADMIN)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiOperation({ summary: 'Find many permissions' })
  @ApiOkResponse({ description: 'Find many permissions successfully' })
  async findMany(@Query() query: QueryPermissionDto) {
    return this.permissionService.findMany(query)
  }

  @Get(':permissionId')
  @ApiOperation({ summary: 'Find a permission' })
  @ApiOkResponse({ description: 'Find a permission successfully' })
  async findById(id: string) {
    return this.permissionService.findById(id)
  }
}
