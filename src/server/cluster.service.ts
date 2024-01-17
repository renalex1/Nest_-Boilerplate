import { Injectable } from '@nestjs/common';
// eslint-disable-next-line
const cluster = require('cluster');
import * as process from 'node:process';
import * as os from 'os';

const numCPUs = os.cpus().length || 1;

type CallbackFunction = () => void;

@Injectable()
export class ClusterService {
  static clusterize(callback: CallbackFunction): void {
    if (
      cluster.isMaster &&
      typeof os.cpus().length === 'number' &&
      os.cpus().length > 0
    ) {
      console.log(`MASTER SERVER (${process.pid}) IS RUNNING `);

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
      });
    } else {
      callback();
    }
  }
}
