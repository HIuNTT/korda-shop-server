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

  async uploadImage(file: Express.Multer.File) {
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

  async moveToTemporaryContainer(key: string) {
    const permanentContainerClient = this.blobServiceClient.getContainerClient(
      this.azureConfig.imagesContainerName,
    );
    const tempContainerClient = this.blobServiceClient.getContainerClient(
      this.azureConfig.tempContainerName,
    );

    const permanentBlobClient = permanentContainerClient.getBlockBlobClient(key);
    const tempBlobClient = tempContainerClient.getBlockBlobClient(key);

    // Copy the blob to the temporary container
    await tempBlobClient.beginCopyFromURL(permanentBlobClient.url);
  }
}
