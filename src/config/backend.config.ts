import { IBackendConfiguration } from '@/config/interfaces/environment.configurations.interface';
import { config } from 'dotenv';
config({
  path: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
});

const configurations: IBackendConfiguration = {
  url: process.env.BACKEND_URL,
  urlExternal: process.env.BACKEND_EXTERNAL_URL,
};

export default configurations;
