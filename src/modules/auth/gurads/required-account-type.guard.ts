import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../decorators'
import { AccountType } from '../../account/enums/account.enum'
import { ACCOUNT_TYPES_KEY } from '../decorators'
import { AuthenticatedRequest } from '../interfaces'

@Injectable()
export class RequiredAccountTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const requiredAccountTypes = this.reflector.getAllAndOverride<
      AccountType[]
    >(ACCOUNT_TYPES_KEY, [context.getHandler(), context.getClass()])

    if (!requiredAccountTypes) {
      return true
    }

    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>()

    if (!user) {
      return false
    }

    return requiredAccountTypes.some((type) => user.type === type)
  }
}
