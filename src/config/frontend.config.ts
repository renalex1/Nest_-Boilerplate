import { config } from 'dotenv';
config({
  path: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
});
import { IFrontendConfiguration } from '@/config/interfaces/environment.configurations.interface';

const configurations: IFrontendConfiguration = {
  url: process.env.FRONTEND_URL,
  urlExternal: process.env.FRONTEND_URL_EXTERNAL,
};

export default configurations;
