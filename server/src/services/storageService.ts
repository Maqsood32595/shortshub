
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config();

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || 'shortshub-uploads');

export class StorageService {
  static async uploadFile(file: Buffer, filename: string, contentType: string): Promise<string> {
    try {
      const blob = bucket.file(filename);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType,
        },
      });

      return new Promise((resolve, reject) => {
        blobStream.on('error', reject);
        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve(publicUrl);
        });
        blobStream.end(file);
      });
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload file');
    }
  }

  static async deleteFile(filename: string): Promise<void> {
    try {
      await bucket.file(filename).delete();
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error('Failed to delete file');
    }
  }

  static async getSignedUrl(filename: string): Promise<string> {
    try {
      const [url] = await bucket.file(filename).getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });
      return url;
    } catch (error) {
      console.error('Signed URL error:', error);
      throw new Error('Failed to get signed URL');
    }
  }
}
