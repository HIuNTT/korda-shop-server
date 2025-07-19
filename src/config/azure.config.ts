import { ConfigType, registerAs } from '@nestjs/config';
import { env } from './env';

export const azureRegToken = 'azure';

export const AzureConfig = registerAs(azureRegToken, () => ({
  accountName: env('AZURE_ACCOUNT_NAME'),
  tempContainerName: env('AZURE_TEMP_CONTAINER_NAME'),
  imagesContainerName: env('AZURE_IMAGES_CONTAINER_NAME'),
  iconContainerName: env('AZURE_ICON_CONTAINER_NAME'),
  connectionString: env('AZURE_CONNECTION_STRING'),
  endpointSuffix: env('AZURE_ENDPOINT_SUFFIX'),
}));

export type IAzureConfig = ConfigType<typeof AzureConfig>;
