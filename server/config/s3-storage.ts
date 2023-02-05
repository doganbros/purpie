import aws, { AWSError, S3 } from 'aws-sdk';
import path from 'path';
import multerS3 from 'multer-s3';
import uuid from 'uuid';
import { promisify } from 'util';

const {
  S3_ACCESS_KEY_ID = '',
  S3_SECRET_ACCESS_KEY = '',
  S3_REGION = '',
  S3_BUCKET_NAME = '',
  S3_ENDPOINT_URL,
  NODE_ENV,
} = process.env;

const endpointParams = NODE_ENV !== 'production' &&
  S3_ENDPOINT_URL && {
    endpoint: S3_ENDPOINT_URL,
    s3ForcePathStyle: true,
    sslEnabled: false,
  };

export const s3 = new aws.S3({
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
  ...endpointParams,
});

export const deleteObject = promisify(
  (
    params: S3.DeleteObjectRequest,
    cb: (err: AWSError, data: S3.Types.HeadObjectOutput) => void,
  ) => s3.deleteObject(params, cb),
);

export const s3HeadObject = promisify(
  (
    params: S3.Types.HeadObjectRequest,
    cb: (err: AWSError, data: S3.Types.HeadObjectOutput) => void,
  ) => s3.headObject(params, cb),
);

export const s3Storage = (dir: string) =>
  multerS3({
    s3,
    bucket: S3_BUCKET_NAME,
    acl: 'authenticated-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_, file, cb) =>
      cb(null, `${dir}${uuid.v4()}${path.extname(file?.originalname || '')}`),
  });
