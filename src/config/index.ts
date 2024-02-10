import SystemConfiguration from '@/config/system.config';
import JwtConfiguration from '@/config/jwt.config';
import MongooseConfig from '@/config/database.config';
import QueueConfiguration from '@/config/queue.config';
import FrontendConfiguration from '@/config/frontend.config';
import BackendConfiguration from '@/config/backend.config';

import { IEnvironmentConfiguration } from '@/config/interfaces/environment.configurations.interface';


export default (): IEnvironmentConfiguration => {
  return {
    system: SystemConfiguration,
    frontend: FrontendConfiguration,
    backend: BackendConfiguration,
    jwt: JwtConfiguration,
    database: MongooseConfig(),
    queue: QueueConfiguration,
  };
};
