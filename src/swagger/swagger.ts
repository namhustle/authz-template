import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createSwaggerConfig } from './swagger.config'
import { SwaggerModule } from '@nestjs/swagger'

export function setupSwagger(app: INestApplication): void {
  const config = app.get(ConfigService)
  const swaggerDocConfig = createSwaggerConfig(config)

  const document = SwaggerModule.createDocument(app, swaggerDocConfig, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey, methodKey) => methodKey,
  })

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Template AuthZ API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      displayRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'agate',
      },
    },
  })
}
