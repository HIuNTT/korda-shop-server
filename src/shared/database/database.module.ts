import { dbRegToken, IDatabaseConfig } from '#/config';
import { env } from '#/config/env';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, LoggerOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        let loggerOptions: LoggerOptions = env('DB_LOGGING') as 'all';

        try {
          loggerOptions = JSON.parse(loggerOptions);
        } catch {
          // ignore
        }

        return {
          ...configService.get<IDatabaseConfig>(dbRegToken),
          autoLoadEntities: true,
          logging: loggerOptions,
        };
      },
      // dataSource receives the configured DataSourceOptions
      // and returns a Promise<DataSource>.
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
  ],
})
export class DatabaseModule {}
