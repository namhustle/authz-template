import { ConfigService } from '@nestjs/config'
import { DocumentBuilder } from '@nestjs/swagger'

export const createSwaggerConfig = (config: ConfigService) => {
  return new DocumentBuilder()
    .setTitle('NestJS AuthZ Template APIs')
    .setDescription('API documentation for Authorization service')
    .setVersion('1.0.0')
    .addServer(
      `http://localhost:${config.get('PORT') || 3000}`,
      `Development API [PORT=${config.get('PORT') || 3000}]`,
    )
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token', // security name
    )
    .build()
}
