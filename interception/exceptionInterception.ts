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
    res.status(status).send({
      message: exception,
      path: req.url,
      code: status,
      msg: '出错啦',
      time: new Date().toLocaleString,
    });
  }
}
