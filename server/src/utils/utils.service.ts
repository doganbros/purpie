import { Injectable, OnModuleInit } from '@nestjs/common';
import WebSocketClient from 'helpers/mm_websocket_client';
import { Client4 } from 'mattermost-redux/client';

@Injectable()
export class UtilsService implements OnModuleInit {
  public webSocketClient: WebSocketClient;

  public mattermostClient: typeof Client4;

  async onModuleInit() {
    this.mattermostClient = Client4;

    const {
      MM_SERVER_URL = 'http://localhost:8065',
      MM_BOT_TOKEN = '',
    } = process.env;

    this.mattermostClient.setUrl(MM_SERVER_URL);
    this.mattermostClient.setToken(MM_BOT_TOKEN);

    this.webSocketClient = new WebSocketClient();
    this.webSocketClient.initialize(
      Client4.getWebSocketUrl().replace('http', 'ws'),
      MM_BOT_TOKEN,
    );
  }
}
