import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class exceptionInterception implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const path = req.url.split('?')[0];
    const exceptionResponse = exception.getResponse();
    const message = typeof exceptionResponse === 'string' 
      ? exceptionResponse 
      : (exceptionResponse as any)?.message || exception.message || '服务器错误';
    res.status(status).send({
      message: message,
      path: path,
      code: status,
      msg: '出错啦',
      time: new Date().toLocaleString(),
    });
  }
}
