import { get, set } from 'lodash';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import configurations from '@/config';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { JwtService } from '@/jwt/jwt.service';
import { UtilsModule } from '@/utils/utils.module';

console.log(configurations());

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
      load: [() => configurations()],
    }),
    MongooseModule.forRoot(configurations().database.uri, {
      connectionFactory: configurations().database.connectionFactory,
    }),
    ...(configurations().system.graphql
      ? [
          GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            playground: configurations().system.graphqlPlayground,
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
            },
          }),
        ]
      : []),
    UserModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
