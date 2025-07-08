import { Storage } from '@google-cloud/storage';
import { format } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
});

const bucketName = process.env.GCS_BUCKET_NAME;
if (!bucketName) {
    throw new Error("GCS_BUCKET_NAME is not defined in the environment variables.");
}
const bucket = storage.bucket(bucketName);

/**
 * Uploads a file to Google Cloud Storage.
 * @param {Express.Multer.File} file The file object from multer.
 * @returns {Promise<string>} The public URL of the uploaded file.
 */
export const uploadFile = (file: Express.Multer.File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const { originalname, buffer } = file;
        
        // Create a unique filename
        const blob = bucket.file(Date.now() + '-' + originalname.replace(/ /g, "_"));
        
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on('finish', () => {
            const publicUrl = format(
                `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            );
            resolve(publicUrl);
        })
        .on('error', (err) => {
            reject(`Unable to upload image, something went wrong: ${err}`);
        })
        .end(buffer);
    });
};
