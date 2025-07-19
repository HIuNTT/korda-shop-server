import { DataSourceOptions } from 'typeorm';
import { env, envBoolean, envNumber } from './env';
import { ConfigType, registerAs } from '@nestjs/config';

export const dbRegToken = 'database';

export const DatabaseConfig = registerAs(
  dbRegToken,
  (): DataSourceOptions => ({
    type: 'postgres',
    host: env('DB_HOST', 'localhost'),
    port: envNumber('DB_PORT', 5432),
    username: env('DB_USER'),
    password: env('DB_PASSWORD'),
    database: env('DB_NAME'),
    synchronize: envBoolean('DB_SYNCHRONIZE', false),
    entities: ['dist/modules/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    subscribers: ['dist/modules/**/*.subscriber{.ts,.js}'],
  }),
);

export type IDatabaseConfig = ConfigType<typeof DatabaseConfig>;
