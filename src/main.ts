import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '@/app.module';
import { NestApplication } from '@nestjs/core';
import * as httpsServer from '@/server/https.service';
import { ClusterService } from '@/server/cluster.service';
import { NestApplicationOptions, Logger } from '@nestjs/common';
import {
  IEnvironmentConfiguration,
  ISystemConfiguration,
} from '@/config/interfaces/environment.configurations.interface';

(async () => {
  const options: NestApplicationOptions = { rawBody: true };

  const app: NestApplication = await NestFactory.create<NestApplication>(
    AppModule,
    options,
  );

  const configService = app.get(ConfigService<IEnvironmentConfiguration>);

  const systemConfig = configService.get<ISystemConfiguration>('system');

  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.enableCors({
    origin: systemConfig.disableCors,
  });

  app.useBodyParser('json', systemConfig.bodyParser);

  const bootstrap = async (
    port?: number,
    maxAttempts: number = 10,
  ): Promise<void> => {
    const logger = new Logger(bootstrap.name);

    let isPortUsed = false;

    const PORT = port || systemConfig.port;

    try {
      const server = await httpsServer.createHttpsServer(app);
      if (server) {
        server.listen(PORT);
      } else {
        await app.listen(PORT);
      }
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use.`);
        if (maxAttempts > 0) {
          logger.log(`Trying the next port...`);
          isPortUsed = true;
          await bootstrap(PORT + 1, maxAttempts - 1);
        } else {
          logger.error(
            `Exceeded maximum attempts. Could not find an available port.`,
          );
          process.exit(1);
        }
      } else {
        console.error('Error starting the server:', error);
      }
    }

    if (!isPortUsed) {
      console.log(`
        🚀  NestJs GraphQL API server, launched at ${systemConfig.protocol}://${systemConfig.host}:${PORT}/graphql`);
    }
  };

  if (systemConfig.clusterMode) {
    ClusterService.clusterize(bootstrap);
  } else {
    bootstrap();
  }
})();
