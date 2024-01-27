import * as mongoose from 'mongoose';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';

const logger = new Logger('MongoDB');

/* eslint-disable */

const logMongoConnection = () => {
  console.log('MongoDB connected successfully');
};

const MongooseConfig = (): MongooseModuleOptions => {
  const connection = mongoose.createConnection(
    `${process.env.MONGO_URL}${process.env.MONGO_USER}${process.env.MONGO_PASSWORD}@${process.env.MONGO_DEFAULT_DATABASE}${process.env.MONGO_DATABASE_NAME}`,
  );

  connection.on('connected', logMongoConnection);
  connection.on('error', (error) => {
    logger.error(`Mongoose connection error: ${error}`);
  });
  connection.on('disconnected', () => {
    logger.warn('Mongoose disconnected from the database');
  });

  return connection
    
  
};

export default MongooseConfig;
