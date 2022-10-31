import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SendTestMailDto } from './dto/send-test-mail.dto';
import { MailService } from './mail.service';
import { ErrorTypes } from '../../types/ErrorTypes';

@ApiTags('mail')
@Controller({ version: '1', path: 'mail' })
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('test')
  sendTestMail(@Body() body: SendTestMailDto) {
    if (process.env.NODE_ENV !== 'development')
      throw new ForbiddenException(
        ErrorTypes.TEST_MAIL_FOR_ONLY_DEV,
        'Test mails are allowed in only development',
      );
    return this.mailService.sendTestMail(
      body.subject,
      body.viewName,
      body.context,
    );
  }
}
