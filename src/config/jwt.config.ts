import { config } from 'dotenv';
config({
  path: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
});
import { IJwtConfiguration } from '@/config/interfaces/environment.configurations.interface';

const configurations: IJwtConfiguration = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
};

export default configurations;
