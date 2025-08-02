import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { RoleService } from './role.service'
import { CreateRoleDto, QueryRoleDto, UpdateRoleDto } from './dtos'

@Controller('roles')
@ApiTags('Role')
@ApiBearerAuth('access-token')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiConflictResponse({ description: 'Conflict' })
  async create(@Body() payload: CreateRoleDto) {
    return this.roleService.create(payload)
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiOkResponse({ description: 'OK' })
  async find(
    @Query() query: QueryRoleDto,
  ) {
    return this.roleService.find(query)
  }

  @Get(':roleId')
  @ApiOperation({ summary: 'Get a role by id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async getById(
    @Param('roleId') roleId: string,
  ) {
    return this.roleService.getById(roleId)
  }

  @Patch(':roleId')
  @ApiOperation({ summary: 'Update a role' })
  @ApiOkResponse({ description: 'OK' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async updateById(
    @Param('roleId') roleId: string,
    @Body() payload: UpdateRoleDto,
  ) {
    return this.roleService.updateById(roleId, payload)
  }

  @Delete(':roleId')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async deleteById(roleId: string) {
    return this.roleService.deleteById(roleId)
  }
}
