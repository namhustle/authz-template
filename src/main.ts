import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { ConfigService } from '@nestjs/config'
import helmet from '@fastify/helmet'
import fastifyCsrf from '@fastify/csrf-protection'
import compression from '@fastify/compress'
import { ErrorInterceptor, TransformInterceptor } from './common/interceptors'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { setupSwagger } from './swagger/swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  const config = app.get<ConfigService>(ConfigService)

  // CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })

  // Helmet (optional, security headers)
  if (config.get<string>('NODE_ENV') === 'production') {
    await app.register(helmet)
  }

  // CSRF Protection (optional, for stateless apps)
  await app.register(fastifyCsrf)

  // Compression (optional, for better performance)
  await app.register(compression)

  // Interceptors
  app.useGlobalInterceptors(new ErrorInterceptor(), new TransformInterceptor())

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      // exceptionFactory: (errors) => {
      //   const formattedErrors: Record<string, string> = {}
      //   for (const error of errors) {
      //     if (error.constraints) {
      //       formattedErrors[error.property] = Object.values(
      //         error.constraints,
      //       )[0]
      //     }
      //   }
      //   return new BadRequestException(formattedErrors)
      // },
    }),
  )

  // Swagger
  setupSwagger(app)

  await app.listen(config.get<number>('PORT') ?? 3000, '0.0.0.0')
  return app.getUrl()
}

void bootstrap().then((url) => {
  console.log(`🚀 Server is running on: ${url}`)
  console.log(`🚀 Swagger UI is available at: ${url}/docs`)
})
