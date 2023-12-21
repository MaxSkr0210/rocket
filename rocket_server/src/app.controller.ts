import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  code: string = '';
  accessToken: string = '';
  refreshToken: string = '';
  time: number = 0;
  clientId: string = '';

  @Get('/api/leads')
  async getLeads(@Req() req: Request, @Res() res: Response) {
    try {
      const query = req.query.query as string;

      const leads = await this.appService.getLeads(this.accessToken, query);
      res.json(leads);
    } catch (error) {
      console.log(error.message);

      res.redirect('/');
    }
  }

  @Get()
  async amocrm(@Req() req: Request, @Res() res: Response) {
    this.code = process.env.CODE;
    this.clientId = process.env.CLIENT_ID;

    try {
      const { access_token, expires_in, refresh_token } =
        await this.appService.Auth(this.code, this.clientId, this.refreshToken);

      this.accessToken = access_token;
      this.refreshToken = refresh_token;
      this.time = expires_in;

      res.redirect('/api/leads');
    } catch (err) {
      console.log(err.message);
    }
  }
}
