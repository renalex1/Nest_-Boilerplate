import { config } from 'dotenv';
config({
  path: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
});
import { ISystemConfiguration } from '@/config/interfaces/environment.configurations.interface';

const configurations: ISystemConfiguration = {
  port: parseInt(process.env.SERVER_PORT) || 3000,
  host: process.env.SERVER_HOST || 'http',
  bodyParser: process.env.SERVER_BODY_PARSER
    ? { limit: process.env.SERVER_BODY_PARSER }
    : {},
  disableCors: process.env.DISABLE_CORS === 'true',
  protocol: process.env.SERVER_PROTOCOL || 'http',
  clusterMode: process.env.CLUSTER_MODE === 'true',
  graphqlPlayground:process.env.SERVER_GRAPHQL_PLAYGROUND === 'true'
};

export default configurations;
