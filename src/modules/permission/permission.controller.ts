import { Controller } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@Controller('permission')
@ApiTags('Permission')
@ApiBearerAuth()
export class PermissionController {}
