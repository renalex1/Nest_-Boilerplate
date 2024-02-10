import { config } from 'dotenv';
config({
  path: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
});
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';

const logger = new Logger('MongoDB');
/* eslint-disable */


const MongooseConfig = (): MongooseModuleOptions => {
  return {
    uri: `${process.env.MONGO_URL}${process.env.MONGO_USER}${process.env.MONGO_PASSWORD}${process.env.MONGO_DEFAULT_DATABASE}${process.env.MONGO_DATABASE_NAME}`,
    connectionFactory: (connection) => {
      connection.plugin(require('mongoose-autopopulate'));
      logger.log(`Database connection attempt  --  ${connection.name}  --`)
      connection.on('connected', () => {
        logger.log('Mongoose connected to the database');
      });
  
      connection.on('error', (error) => {
        logger.error(`Mongoose connection error  ${error}`);
      });
  
      connection.on('disconnected', () => {
        logger.warn('Mongoose disconnected from the database');
      });

      if (connection.readyState) 
        logger.log(`Successfully connected with the database  --  ${connection.name}  --`);
    

      connection.set('debug', process.env.MONGO_DEBUG === 'true');

      return connection;
    },
  };
};

export default MongooseConfig;
