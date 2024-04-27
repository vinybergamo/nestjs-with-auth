import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          type: 'postgres',
          url: configService.get('DATABASE_URL'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') === 'development',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
