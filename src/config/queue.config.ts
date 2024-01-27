import { IQueueConfiguration } from '@/config/interfaces/environment.configurations.interface';

const configurations: IQueueConfiguration = {
  accessKey: process.env.AWS_ACCESS_KEY_ID,
  secretKey: process.env.AWS_SECRET_ACCESS_KEY,
};

export default configurations;
