import { MongooseModuleOptions } from '@nestjs/mongoose';

export interface IEnvironmentConfiguration {
  system: ISystemConfiguration;
  frontend: IFrontendConfiguration;
  jwt: IJwtConfiguration;
  database: MongooseModuleOptions;
  queue: IQueueConfiguration;
}

export interface ISystemConfiguration {
  port: number;
  host: string;
  bodyParser: object;
  disableCors: boolean;
  protocol: string;
  clusterMode: boolean;
  graphqlPlayground: boolean;
}

export interface IFrontendConfiguration {
  url: string;
}

export interface IJwtConfiguration {
  secret: string;
  expiresIn: string;
}

export interface IQueueConfiguration {
  accessKey: string;
  secretKey: string;
}
