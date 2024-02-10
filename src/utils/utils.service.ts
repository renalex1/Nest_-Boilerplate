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
    } catch (err) {
      return false;
    }
  }

  createPath(path: string | string[], mode: boolean = true): string {
    if (!path) return;
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
        await Promise.all(
          path.map(async (element) => {
            await this.checkPathExistence(element);
          }),
        );
      } else {
        await this.checkPathExistence(path);
      }
      return true;
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
      return true;
    } catch (err) {
      this.loggerService.error(`Error create folder:`, JSON.stringify(err));
      return false;
    }
  }

  async deletePathAsync(path: string): Promise<boolean> {
    if (!path) return false;

    try {
      if (await this.isExistPathAsync(path)) {
        await fsPromises.rm(path, { recursive: true, force: true });
        return true;
      }
      return false;
    } catch (err) {
      this.loggerService.error(`Error delete file:`, JSON.stringify(err));
      return false;
    }
  }

  async writeFileAsync(path: string, data: string): Promise<boolean> {
    if (!path || !data) return false;

    try {
      await fsPromises.writeFile(path, data, 'utf-8');
      return true;
    } catch (err) {
      this.loggerService.error(`Error writing to ${path} file:`, JSON.stringify(err));
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
          this.loggerService.log(`Moved ${sourcePath} to ${targetPath}`);
        }
      }
    } catch (err) {
      this.loggerService.error(err);
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
            this.loggerService.error(err);
            reject(err);
          } else {
            resolve(zipFileName);
          }
        });
      });
    } catch (err) {
      this.loggerService.error(err);
      throw err;
    }
  }
}
