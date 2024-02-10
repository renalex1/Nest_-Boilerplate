import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosService {
  async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      return await axios(config);
    } catch (err) {
      throw err;
    }
  }
}
