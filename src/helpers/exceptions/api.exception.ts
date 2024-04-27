import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nTranslations } from 'src/i18n/types/i18n.types';

export class ApiException extends HttpException {
  constructor(
    message: {
      key: keyof I18nTranslations['exceptions'];
      args?: Record<string, any>;
    },
    status: keyof typeof HttpStatus = 'INTERNAL_SERVER_ERROR',
  ) {
    super(
      {
        key: message.key,
        args: message.args,
      },
      HttpStatus[status],
    );
  }
}
