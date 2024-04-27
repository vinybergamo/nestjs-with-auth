import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ApiException } from '../exceptions/api.exception';
import { I18nService } from 'nestjs-i18n';
import { Response } from 'express';

@Catch(ApiException)
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18nService: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const error = exception.getResponse() as any;

    let message = exception.getResponse() as any;

    message = this.i18nService.translate(`exceptions.${message.key}`, {
      args: message.args,
      lang: ctx.getRequest().i18nLang,
    });

    response.status(statusCode).json({
      status: statusCode,
      message,
      error: error.key,
    });
  }
}
