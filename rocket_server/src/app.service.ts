import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  accessToken: string = '';
  constructor(private readonly configService: ConfigService) {}
  async Auth(code: string, clientId: string, refresh_token: string = '') {
    const clientSecret = this.configService.get('CLIENT_SECRET');
    const redirectUri = this.configService.get('REDIRECT_URI');

    if (!code || code.length === 0) {
      throw new Error('Невозможно получить код авторизации');
    } else {
      let body;
      if (refresh_token.length === 0) {
        body = {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        };
      } else {
        body = {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          refresh_token,
          redirect_uri: redirectUri,
        };
      }

      const res = await axios.post(
        'https://maxskr03.amocrm.ru/oauth2/access_token',
        body,
      );

      return await res.data;
    }
  }

  async getLeads(accessToken: string, query: string = '') {
    const resLeads = await axios.get(
      'https://maxskr03.amocrm.ru/api/v4/leads?query=' + query,
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      },
    );

    if (resLeads.data === '') {
      return '';
    }

    let leads = resLeads.data._embedded.leads;

    for (let i = 0; i < leads.length; i++) {
      const lead = await leads[i];

      lead.responsible_user_id = (
        await this.getUser(accessToken, lead.responsible_user_id)
      ).data;
      leads[i] = lead;
    }

    for (let i = 0; i < leads.length; i++) {
      const lead = await leads[i];

      lead.status_id = (
        await this.getStatus(accessToken, lead.pipeline_id, lead.status_id)
      ).data;

      leads[i] = lead;
    }

    for (let i = 0; i < leads.length; i++) {
      const lead = await leads[i];

      lead.created_at = await this.getDate(leads[i].created_at);

      leads[i] = lead;
    }

    return leads;
  }

  async getUser(accessToken: string, id: number) {
    return await axios.get(`https://maxskr03.amocrm.ru/api/v4/users/${id}`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
  }

  async getStatus(accessToken: string, pipeline_id: number, status_id: number) {
    return await axios.get(
      `https://maxskr03.amocrm.ru/api/v4/leads/pipelines/${pipeline_id}/statuses/${status_id}`,
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      },
    );
  }
  async getDate(dateLead: number) {
    const date: Date = new Date(dateLead * 1000);
    let str: string = `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    return str;
  }
}
