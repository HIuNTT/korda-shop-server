import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, Logger, ValidationError, ValidationPipe } from '@nestjs/common';
import { isDev } from './config/env';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { setupSwagger } from './setup-swagger';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationException } from './common/exceptions/validation.exception';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('query parser', 'extended');

  const configService = app.get(ConfigService<AllConfigType>);

  const { port, globalPrefix } = configService.get('app', { infer: true });

  app.enableCors({ origin: '*' });

  app.setGlobalPrefix(globalPrefix);

  if (isDev) {
    app.useGlobalInterceptors(new LoggingInterceptor());
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) => {
        const formatErrors = (errors: ValidationError[]) =>
          errors
            .map((error) => {
              return [
                ...Object.values(error.constraints),
                ...(error.children ? formatErrors(error.children) : []),
              ];
            })
            .flat();
        return new ValidationException(formatErrors(errors));
      },
    }),
  );

  const printSwaggerLog = await setupSwagger(app, configService);

  await app.listen(port, '0.0.0.0', async () => {
    const url = await app.getUrl();

    printSwaggerLog?.();

    const logger = new Logger('NestApplication');
    logger.log(`🚀 Application is running on: ${url}`);
  });
}
bootstrap();
