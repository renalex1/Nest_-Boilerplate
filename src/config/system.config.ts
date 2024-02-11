import { config } from 'dotenv';
config({
  path: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
});
import { ISystemConfiguration } from '@/config/interfaces/environment.configurations.interface';

const configurations: ISystemConfiguration = {
  port: parseInt(process.env.SERVER_PORT) || 3000,
  host: process.env.SERVER_HOST || 'http',
  bodyParser: process.env.SERVER_BODY_PARSER ? { limit: process.env.SERVER_BODY_PARSER } : {},
  disableCors: process.env.SERVER_DISABLE_CORS === 'true',
  protocol: process.env.SERVER_PROTOCOL || 'http',
  clusterMode: process.env.SERVER_CLUSTER_MODE === 'true',
  graphql: process.env.SERVER_GRAPHQL === 'true',
  graphqlPlayground: process.env.SERVER_GRAPHQL_PLAYGROUND === 'true',
};

export default configurations;
