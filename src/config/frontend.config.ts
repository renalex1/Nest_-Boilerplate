import { IFrontendConfiguration } from '@/config/interfaces/environment.configurations.interface';

const configurations: IFrontendConfiguration = {
  url: process.env.FRONTEND_URL,
};

export default configurations;
