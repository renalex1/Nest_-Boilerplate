import { config } from 'dotenv';
config({
  path: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
});
import { IQueueConfiguration } from '@/config/interfaces/environment.configurations.interface';

const configurations: IQueueConfiguration = {
  accessKeyID: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_ENDPOINT,
  region: process.env.AWS_REGION,
  queueSuffix: process.env.AWS_QUEUE_SUFFIX,
};

export default configurations;
