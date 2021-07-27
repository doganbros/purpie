import { Injectable } from '@nestjs/common';
import path from 'path';
import ehbs from 'express-handlebars';
import sendGrid, { MailDataRequired } from '@sendgrid/mail';

const rootViewPath = path.join(__dirname, '..', '..', 'mail', 'views');

const viewEngine = ehbs.create({
  layoutsDir: path.join(rootViewPath, 'layouts'),
  partialsDir: path.join(rootViewPath, 'partials'),
  defaultLayout: 'main-layout',
});

const { SENDGRID_API_KEY = '', SENDGRID_FROM_EMAIL = '' } = process.env;
sendGrid.setApiKey(SENDGRID_API_KEY);

@Injectable()
export class MailService {
  async sendMailByView(
    to: string,
    subject: string,
    viewName: string,
    context: Record<string, any> = {},
  ) {
    const result = await this.renderMail(viewName, context);
    const message: MailDataRequired = {
      to,
      from: SENDGRID_FROM_EMAIL,
      subject,
      html: result,
    };
    return sendGrid.send(message);
  }

  async sendMailByText(to: string, subject: string, msg: string) {
    const message: MailDataRequired = {
      to,
      from: SENDGRID_FROM_EMAIL,
      subject,
      html: msg,
    };
    return sendGrid.send(message);
  }

  renderMail(
    viewName: string,
    context: Record<string, any> = {},
  ): Promise<string> {
    return new Promise((res, rej) => {
      viewEngine.renderView(
        path.join(rootViewPath, 'templates', `${viewName}.handlebars`),
        context,
        (err, content = '') => {
          if (err) return rej(err);

          return res(content);
        },
      );
    });
  }
}
