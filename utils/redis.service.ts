import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
@Injectable()
export class redisService {
  private redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
    });
  }

  async get(key: string) {
    const exists = await this.redisClient.exists(key);
    if (exists == 1) {
      return await this.redisClient.get(key);
    } else {
      return false;
    }
  }

  async setex(key: string, value: string, time: number) {
    const exists = await this.redisClient.exists(key);
    if (exists !== 1) {
      await this.redisClient.setex(key, time, value);
      return true;
    } else {
      return false;
    }
  }

  async del(key: string) {
    const exists = await this.redisClient.exists(key);
    if (exists == 1) {
      await this.redisClient.del(key);
      return true;
    } else {
      return false;
    }
  }
}
