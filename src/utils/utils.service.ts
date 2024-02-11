import { Logger } from '@nestjs/common';
import * as AdmZip from 'adm-zip';
import { promises as fsPromises } from 'fs';
import { dirname, join } from 'path';

export class UtilsService {
  private readonly rootPath: string;
  private readonly loggerService: Logger;

  constructor() {
    this.rootPath = dirname(require.main.filename);
    this.loggerService = new Logger('Utils');
  }

  private async checkPathExistence(path: string): Promise<boolean> {
    if (!path) return;

    try {
      await fsPromises.stat(path);
      return true;
    } catch (err) {
      return false;
    }
  }

  createPath(path: string | string[], mode: boolean = false): string {
    if (!path) {
      this.loggerService.error(`[CreatePath]: Error missing path!`);
      return;
    }
    const root = mode ? '' : this.rootPath;

    if (Array.isArray(path)) {
      return join(root, ...path);
    } else {
      return join(root, path);
    }
  }

  async isExistPathAsync(path: string | string[]): Promise<boolean> {
    if (!path) return;
    try {
      if (Array.isArray(path)) {
        const results = await Promise.all(
          path.map(async (element) => {
            await this.checkPathExistence(element);
          }),
        );
        return results.every((result) => result);
      } else {
        return await this.checkPathExistence(path);
      }
    } catch (err) {
      return false;
    }
  }

  async createDirAsync(path: string): Promise<boolean> {
    if (!path) return false;

    try {
      if (!(await this.isExistPathAsync(path))) {
        await fsPromises.mkdir(path);
      }
      this.loggerService.log(`[CreateDirAsync]: Folder create successful: ${path}`);
      return true;
    } catch (err) {
      this.loggerService.error(`[CreateDirAsync]: Error create folder: ${JSON.stringify(err)}`);
      return false;
    }
  }

  async deletePathAsync(path: string): Promise<boolean> {
    if (!path) return false;

    try {
      if (await this.isExistPathAsync(path)) {
        await fsPromises.rm(path, { recursive: true, force: true });
        this.loggerService.log(`[DeletePathAsync]: Folder delete successful: ${path}`);
        return true;
      }
      return false;
    } catch (err) {
      this.loggerService.error(`[DeletePathAsync]: Error delete file: ${JSON.stringify(err)}`);
      return false;
    }
  }

  async writeFileAsync(path: string, data: string, parameters?: any): Promise<boolean> {
    if (!path || !data) return false;

    try {
      const info = parameters ? JSON.stringify(data, ...parameters) : data;

      await fsPromises.writeFile(path, info, 'utf-8');

      this.loggerService.log(`[WriteFileAsync]: Write file successful: ${path}`);

      return true;
    } catch (err) {
      this.loggerService.error(`[WriteFileAsync]: Error writing to ${path} file: ${JSON.stringify(err)}`);
      return false;
    }
  }

  async readFileAsync(path: string): Promise<any> {
    if (!path) return false;

    try {
      if (await this.isExistPathAsync(path)) {
        return await fsPromises.readFile(path, 'utf-8');
      } else {
        this.loggerService.error(`[WriteFileAsync]: File ${path} don't exist`);
      }
    } catch (err) {
      this.loggerService.error(`[WriteFileAsync]: Error reading file ${path} : ${JSON.stringify(err)}`);
      return false;
    }
  }

  async readAndMoveFiles(sourceFolder: string, targetFolder: string, shortName: boolean): Promise<void> {
    try {
      let num = 0;
      const items = await fsPromises.readdir(sourceFolder);

      for (const item of items) {
        const extension = item.split('.').pop();
        const sourcePath = join(sourceFolder, item);
        const targetPath = shortName ? join(targetFolder, `${num++}.${extension}`) : join(targetFolder, item);

        const itemStat = await fsPromises.stat(sourcePath);

        if (itemStat.isFile()) {
          await fsPromises.rename(sourcePath, targetPath);

          this.loggerService.log(`[ReadAndMoveFiles]: Successful move files from ${sourceFolder} to ${targetFolder}: `);
        }
      }
    } catch (err) {
      this.loggerService.error(
        `[ReadAndMoveFiles]: Error move files from ${sourceFolder} to ${targetFolder}: ${JSON.stringify(err)}`,
      );
      throw err;
    }
  }

  async zipDirectory(directory: string): Promise<string> {
    try {
      if (!directory) throw new Error('Directory is not provided');
      return new Promise((resolve, reject) => {
        const baseDir = directory.split('/').pop();
        const zip = new AdmZip();

        zip.addLocalFolder(directory);

        const zipFileName = `${baseDir}.zip`;
        const outputPath = `${directory}/${zipFileName}`;

        zip.writeZip(outputPath, (err: any) => {
          if (err) {
            reject(err);
          } else {
            this.loggerService.error(`[zipDirectory]: Successful zip folder ${directory}: ${JSON.stringify(err)}`);
            resolve(zipFileName);
          }
        });
      });
    } catch (err) {
      this.loggerService.error(`[zipDirectory]: Error zip folder ${directory}: ${JSON.stringify(err)}`);
      throw err;
    }
  }
}
