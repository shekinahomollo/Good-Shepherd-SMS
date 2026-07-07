import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  region: 'auto',
  endpoint: config.R2_ENDPOINT,       // from Cloudflare R2 dashboard
  credentials: {
    accessKeyId:     config.R2_ACCESS_KEY,
    secretAccessKey: config.R2_SECRET_KEY,
  },
});

export const uploadFile = async (
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  folder: string    // e.g. 'assignments' | 'submissions'
): Promise<{ key: string; url: string }> => {
  const ext = originalName.split('.').pop();
  const key = `${folder}/${uuidv4()}.${ext}`;

  await s3.send(new PutObjectCommand({
    Bucket: config.R2_BUCKET,
    Key:    key,
    Body:   buffer,
    ContentType: mimeType,
  }));

  return { key, url: `${config.R2_PUBLIC_URL}/${key}` };
};

export const getPresignedUrl = async (key: string): Promise<string> =>
  getSignedUrl(s3, new GetObjectCommand({ Bucket: config.R2_BUCKET, Key: key }), { expiresIn: 3600 });