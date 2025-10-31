import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class axiosService {
  async get(url: string, params?: any) {
    const res = await axios.get(url, { params });
    return res.data;
  }
  async post<T>(url: string, data: T) {
    const res = await axios.post(url, data);
    return res.data;
  }
}
