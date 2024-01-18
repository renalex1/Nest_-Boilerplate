import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '@/app.module';
import { NestApplication } from '@nestjs/core';
import * as httpsServer from '@/server/https.service';
import { ClusterService } from '@/server/cluster.service';
import { Logger, NestApplicationOptions } from '@nestjs/common';

const bootstrap = async (
  port?: number,
  maxAttempts: number = 10,
): Promise<void> => {
  const logger = new Logger(bootstrap.name);

  ConfigModule.forRoot({
    envFilePath: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
  });

  const PORT = port || parseInt(process.env.PORT) || 4000;
  const HOST = process.env.HOST || 'localhost';
  const protocol = process.env.PROTOCOL;
  console.log(PORT);

  const options: NestApplicationOptions = {};
  const app: NestApplication = await NestFactory.create<NestApplication>(
    AppModule,
    options,
  );

  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.enableCors();
  app.useBodyParser('json', { limit: '10mb' });

  const server = await httpsServer.createHttpsServer(app);
  console.log(maxAttempts);

  try {
    if (server) {
      server.listen(PORT);
    } else {
      await app.listen(PORT);
    }
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
      if (maxAttempts > 0) {
        console.log(`Trying the next port...`);
        await bootstrap(PORT + 1, maxAttempts - 1);
      } else {
        console.error(
          `Exceeded maximum attempts. Could not find an available port.`,
        );
        process.exit(1); // Optionally exit the process if needed
      }
    } else {
      console.error('Error starting the server:', error);
    }
  }

  console.log(`
  🚀  NestJs GraphQL API server, launched at ${protocol}://${HOST}:${PORT}/graphql`);
};

if (process.env.CLUSTER_MODE === 'true') {
  ClusterService.clusterize(bootstrap);
} else {
  bootstrap();
}
