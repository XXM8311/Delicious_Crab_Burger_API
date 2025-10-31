import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
const saltRounds = 10;
@Injectable()
export class bcryptService {
  async hashEncrypt(password: string): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
  }
  async hashCompare(password: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }
}
