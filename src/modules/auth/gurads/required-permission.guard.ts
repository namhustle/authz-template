import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY, PERMISSIONS_KEY } from '../decorators'
import { AuthenticatedRequest } from '../interfaces'
import { AccountService } from '../../account/account.service'
import { AccountType } from '../../account/enums/account.enum'

@Injectable()
export class RequiredPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accountService: AccountService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    // Get required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (!requiredPermissions || requiredPermissions.length === 0) return true

    // Get user from context
    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>()
    if (!user) return false

    // Check if user type is admin
    if (user.type === AccountType.ADMIN) return true

    // Get user with roles and permissions
    const userAccount = await this.accountService.findOne({
      where: { id: user.sub },
      relations: ['roles', 'roles.permissions'],
    })

    if (!userAccount || !userAccount.roles) return false

    // Extract all permissions from user's roles
    const userPermissions = userAccount.roles
      .flatMap((role) => role.permissions || [])
      .map((permission) => permission.name)

    // Check if user has all required permissions
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    )
  }
}
