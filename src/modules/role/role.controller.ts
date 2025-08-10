import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
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
import { RequiredPermissions } from '../auth/decorators'

@Controller('roles')
@ApiTags('Role')
@ApiBearerAuth('access-token')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @RequiredPermissions('CREATE:ROLE')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiCreatedResponse({ description: 'Role created successfully' })
  @ApiConflictResponse({ description: 'Role name already exists' })
  @ApiBadRequestResponse({ description: 'Invalid permissions provided' })
  async create(@Body() payload: CreateRoleDto) {
    return this.roleService.create(payload)
  }

  @Get()
  @RequiredPermissions('GET:ROLE')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiOkResponse({ description: 'OK' })
  async findMany(@Query() query: QueryRoleDto) {
    return this.roleService.findMany(query)
  }

  @Get(':roleId')
  @RequiredPermissions('GET:ROLE')
  @ApiOperation({ summary: 'Get a role by id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async getById(@Param('roleId') roleId: string) {
    return this.roleService.getById(roleId)
  }

  @Patch(':roleId')
  @RequiredPermissions('UPDATE:ROLE')
  @ApiOperation({ summary: 'Update a role' })
  @ApiOkResponse({ description: 'Role updated successfully' })
  @ApiConflictResponse({ description: 'Role name already exists' })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @ApiBadRequestResponse({ description: 'Invalid permissions provided' })
  async updateById(
    @Param('roleId') roleId: string,
    @Body() payload: UpdateRoleDto,
  ) {
    return this.roleService.updateById(roleId, payload)
  }

  @Delete(':roleId')
  @RequiredPermissions('DELETE:ROLE')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async deleteById(roleId: string) {
    return this.roleService.deleteById(roleId)
  }
}
