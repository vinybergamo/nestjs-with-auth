import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema, validate } from './helpers/validators/env';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionFilter } from './helpers/filters/api-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production', '.env.local'],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      expandVariables: true,
      validate,
      validationSchema: envSchema,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'locale', 'l']),
        AcceptLanguageResolver,
        new HeaderResolver(['locale']),
      ],
      typesOutputPath: path.join('src', 'i18n', 'types', 'i18n.types.ts'),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
})
export class AppModule {}
