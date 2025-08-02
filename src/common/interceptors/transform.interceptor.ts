import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface PaginationMetadata {
  page?: number
  limit?: number
  total?: number
  totalPages?: number
}

interface ApiResponse<T> {
  statusCode: number
  message?: string
  data?: any
  meta?: PaginationMetadata
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse()

    return next.handle().pipe(
      map((res) => {
        return {
          statusCode: res.statusCode || response.statusCode || HttpStatus.OK,
          message: res.message || 'SUCCESS',
          data: res.data || res || undefined,
          meta: res.meta || undefined,
        }
      }),
    )
  }
}
