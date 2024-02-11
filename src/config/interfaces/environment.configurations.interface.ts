import { MongooseModuleOptions } from '@nestjs/mongoose';

export interface IEnvironmentConfiguration {
  system: ISystemConfiguration;
  frontend: IFrontendConfiguration;
  backend: IBackendConfiguration;
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
  graphql: boolean;
  graphqlPlayground: boolean;
}

export interface IFrontendConfiguration {
  url: string;
  urlExternal: string;
}

export interface IBackendConfiguration {
  url: string;
  urlExternal: string;
}

export interface IJwtConfiguration {
  secret: string;
  expiresIn: string;
}

export interface IQueueConfiguration {
  accessKeyID: string;
  secretAccessKey: string;
  endpoint: string;
  region: string;
  queueSuffix: string;
}
