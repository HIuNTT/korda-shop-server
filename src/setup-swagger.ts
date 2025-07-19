import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType, IAppConfig, ISwaggerConfig } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResOp } from './common/model/response.model';
import metadata from './metadata';

export async function setupSwagger(
  app: INestApplication,
  configService: ConfigService<AllConfigType>,
) {
  const { name, globalPrefix } = configService.get<IAppConfig>('app');
  const { enable, path, serverUrl } = configService.get<ISwaggerConfig>('swagger');

  if (!enable) return;

  const swaggerPath = `${serverUrl}/${path}`;

  const documentBuilder = new DocumentBuilder()
    .setTitle(`${name} - API Documentation`)
    .setDescription(
      `
🔷 **Base URL**: \`${serverUrl}/${globalPrefix}\` <br>
🧾 **Swagger JSON**: [See document JSON](${swaggerPath}/json)

📌 [Korda-shop-backend](https://github.com/HIuNTT/korda-shop-server) Backend API Document. Frontend demo [Korda UI](https://github.com/HIuNTT/korda-shop-client)
    `,
    )
    .setVersion('1.0')
    .addServer(`${serverUrl}`, 'Base URL')
    .addBearerAuth();

  await SwaggerModule.loadPluginMetadata(metadata);
  const documentFactory = () =>
    SwaggerModule.createDocument(app, documentBuilder.build(), {
      extraModels: [ResOp],
    });

  SwaggerModule.setup(path, app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    jsonDocumentUrl: `${path}/json`,
  });

  return () => {
    const logger = new Logger('SwaggerModule');
    logger.log(`Swagger UI: ${swaggerPath}`);
    logger.log(`Swagger JSON: ${swaggerPath}/json`);
  };
}
