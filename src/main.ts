import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
  });

  const config = app.get(ConfigService);
  const port = config.get('PORT', 3333);

  app.enableVersioning({
    prefix: 'v',
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  app.enableCors();

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludePrefixes: ['_'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      responseBodyFormatter(host, exc, formattedErrors) {
        console.log(host);
        return {
          statusCode: exc.getStatus(),
          message: formattedErrors,
          error: exc.message,
        };
      },
    }),
  );

  await app.listen(port, async () => {
    logger.log(`Application is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
