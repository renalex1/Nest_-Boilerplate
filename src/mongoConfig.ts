import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class MongooseConfig implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri:`${process.env.MONGO_URL}${process.env.MONGO_USER}${process.env.MONGO_PASSWORD}1@${process.env.MONGO_DEFAULT_DATABASE}${process.env.MONGO_DATABASE_NAME}`,
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        connection.on('connected', () => {
          console.log('Mongoose connected to the database');
        });

        connection.on('error', (error) => {
          console.error(`Mongoose connection error: ${error}`);
        });

        connection.on('disconnected', () => {
          console.warn('Mongoose disconnected from the database');
        });
console.log();

        connection.set('debug', true);

        return connection;
      },
    };
  }
}
