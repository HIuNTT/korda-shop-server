import { AzureConfig, IAzureConfig } from '#/config';
import { generateRandomValue } from '#/utils/tool.util';
import { BlobServiceClient } from '@azure/storage-blob';
import { Inject, Injectable } from '@nestjs/common';
import { extname } from 'node:path';

@Injectable()
export class UploadService {
  private readonly blobServiceClient: BlobServiceClient;

  constructor(@Inject(AzureConfig.KEY) private readonly azureConfig: IAzureConfig) {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(azureConfig.connectionString);
  }

  async uploadFile(file: Express.Multer.File) {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.azureConfig.tempContainerName,
    );
    const blobName = generateRandomValue() + extname(file.originalname);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    return {
      url: blockBlobClient.url,
      key: blockBlobClient.name,
    };
  }

  async moveToPermanentContainer(key: string) {
    const tempContainerClient = this.blobServiceClient.getContainerClient(
      this.azureConfig.tempContainerName,
    );
    const permanentContainerClient = this.blobServiceClient.getContainerClient(
      this.azureConfig.imagesContainerName,
    );

    const tempBlobClient = tempContainerClient.getBlockBlobClient(key);
    const permanentBlobClient = permanentContainerClient.getBlockBlobClient(key);

    // Copy the blob to the permanent container
    await permanentBlobClient.beginCopyFromURL(tempBlobClient.url);
  }

  /** Xóa ảnh ở images container */
  async moveToTemporaryContainer(key: string) {
    const permanentContainerClient = this.blobServiceClient.getContainerClient(
      this.azureConfig.imagesContainerName,
    );

    const permanentBlobClient = permanentContainerClient.getBlockBlobClient(key);

    await permanentBlobClient.deleteIfExists();
  }

  async moveToIconContainer(key: string) {
    const tempContainerClient = this.blobServiceClient.getContainerClient(
      this.azureConfig.tempContainerName,
    );
    const iconContainerClient = this.blobServiceClient.getContainerClient(
      this.azureConfig.iconContainerName,
    );

    const tempBlobClient = tempContainerClient.getBlockBlobClient(key);
    const iconBlobClient = iconContainerClient.getBlockBlobClient(key);

    // Copy the blob to the icon container
    await iconBlobClient.beginCopyFromURL(tempBlobClient.url);
  }

  /** Xóa ảnh ở icon container */
  async moveToTemporaryFromIconContainer(key: string) {
    const iconContainerClient = this.blobServiceClient.getContainerClient(
      this.azureConfig.iconContainerName,
    );

    const iconBlobClient = iconContainerClient.getBlockBlobClient(key);

    await iconBlobClient.deleteIfExists();
  }

  getImageUrl(key: string): string {
    return `https://${this.azureConfig.accountName}.blob.${this.azureConfig.endpointSuffix}/${this.azureConfig.imagesContainerName}/${key}`;
  }

  getKeyFromUrl(url: string): string {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1];
  }

  getIconUrl(key: string): string {
    return `https://${this.azureConfig.accountName}.blob.${this.azureConfig.endpointSuffix}/${this.azureConfig.iconContainerName}/${key}`;
  }

  getPrefixTempImageUrl() {
    return `https://${this.azureConfig.accountName}.blob.${this.azureConfig.endpointSuffix}/${this.azureConfig.tempContainerName}/`;
  }

  getPrefixPermanentImageUrl() {
    return `https://${this.azureConfig.accountName}.blob.${this.azureConfig.endpointSuffix}/${this.azureConfig.imagesContainerName}/`;
  }
}
