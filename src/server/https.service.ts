import * as fs from 'fs';
import * as https from 'https';
import { ConfigModule } from '@nestjs/config';
import { INestApplication } from '@nestjs/common/interfaces';

export const createHttpsServer = async (app: INestApplication) => {
  ConfigModule.forRoot({
    envFilePath: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
  });

  const PRIVATE_KEY = process.env.SSL_PATH_PRIVATE_KEY
    ? fs.readFileSync(process.env.SSL_PATH_PRIVATE_KEY)
    : '';
  const CERTIFICATE_KEY = process.env.SSL_PATH_CERTIFICATE_KEY
    ? fs.readFileSync(process.env.SSL_PATH_CERTIFICATE_KEY)
    : '';

  const credentials = {
    key: PRIVATE_KEY,
    cert: CERTIFICATE_KEY,
  };
  if (PRIVATE_KEY && CERTIFICATE_KEY) {
    const httpsOptions = credentials;

    const server = https.createServer(
      httpsOptions,
      app.getHttpAdapter().getInstance(),
    );
    await app.init();
    return server;
  } else {
    return null;
  }
};
