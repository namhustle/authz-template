import { Controller } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@Controller('role')
@ApiTags('Role')
@ApiBearerAuth()
export class RoleController {}
