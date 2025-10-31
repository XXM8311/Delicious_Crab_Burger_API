import { Injectable } from '@nestjs/common';

@Injectable()
export class LogsService {
  findAll() {
    return `This action returns all logs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} log`;
  }

  remove(id: number) {
    return `This action removes a #${id} log`;
  }
}
