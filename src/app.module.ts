import { get, set } from 'lodash';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { JwtService } from '@/jwt/jwt.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI +
        process.env.MONGO_USER +
        process.env.MONGO_PASSWORD +
        process.env.MONGO_DEFAULT_DATABASE +
        process.env.MONGO_DATABASE_NAME,
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // autoSchemaFile: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => {
        // // Get the cookie from request
        // const token = get(req, 'cookies.token');

        // // Verify the cookie
        // const user = token ? decode(get(req, 'cookies.token')) : null;

        // // Attach the user object to the request object
        // if (user) {
        //   set(req, 'user', user);
        // }

        return { req, res };
      },
      buildSchemaOptions: {
        numberScalarMode: 'integer',
        // dateScalarMode: 'timestamp',
      },
      // installSubscriptionHandlers: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
