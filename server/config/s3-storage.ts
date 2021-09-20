import aws from 'aws-sdk';
import path from 'path';
import multerS3 from 'multer-s3';
import uuid from 'uuid';

const {
  S3_ACCESS_KEY_ID = '',
  S3_SECRET_ACCESS_KEY = '',
  S3_REGION = '',
  S3_VIDEO_POST_BUCKET_NAME = '',
  S3_VIDEO_POST_DIR = '',
} = process.env;

export const s3 = new aws.S3({
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
});

export const s3Storage = multerS3({
  s3,
  bucket: S3_VIDEO_POST_BUCKET_NAME,
  acl: 'authenticated-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (_, file, cb) =>
    cb(
      null,
      `${S3_VIDEO_POST_DIR}${uuid.v4()}${path.extname(
        file?.originalname || '',
      )}`,
    ),
});
