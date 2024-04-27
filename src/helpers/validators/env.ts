import { plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, IsString, validateSync } from 'class-validator';
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.string().optional().default('development'),
  PORT: z.number().optional().default(3333),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().optional().default('1d'),
});

export class EnvirontmentVariables {
  @IsString()
  @IsOptional()
  NODE_ENV: string = 'development';

  @IsNumber()
  @IsOptional()
  PORT: number = 3333;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string;
}

export function validate(config: Record<string, unknown>) {
  const validateConfig = plainToInstance(EnvirontmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validateConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(errors.toString());
  }

  return validateConfig;
}
