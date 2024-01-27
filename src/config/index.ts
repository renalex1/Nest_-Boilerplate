import { config } from 'dotenv';
config({
  path: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
});

import SystemConfiguration from '@/config/system.config';
import JwtConfiguration from '@/config/jwt.config';
import MongooseConfig from '@/config/database.config';
import QueueConfiguration from '@/config/queue.config';
import FrontendConfiguration from '@/config/frontend.config';

import { IEnvironmentConfiguration } from '@/config/interfaces/environment.configurations.interface';

export default (): IEnvironmentConfiguration => {
  return {
    system: SystemConfiguration,
    frontend: FrontendConfiguration,
    jwt: JwtConfiguration,
    database: MongooseConfig(),
    queue: QueueConfiguration,
  };
};
