import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  Logger,
  HttpException,
} from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { FastifyRequest } from 'fastify'

interface ApiErrorResponse {
  statusCode: number
  message: string
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<FastifyRequest>()

    return next.handle().pipe(
      catchError((err) => {
        const errStack = err instanceof Error ? err.stack : undefined
        this.logger.error(`Path: ${request.url}`)
        this.logger.error(`Method: ${request.method}`)
        this.logger.error(`Error occurred: ${err.message || err}`, errStack)

        const statusCode =
          err instanceof HttpException
            ? err.getStatus()
            : err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR

        const message =
          err instanceof HttpException
            ? err.message || err.getResponse()
            : err.message || 'Internal server error'

        const apiErrorResponse: ApiErrorResponse = {
          statusCode,
          message: err.response?.message || message,
        }

        return throwError(() => new HttpException(apiErrorResponse, statusCode))
      }),
    )
  }
}
