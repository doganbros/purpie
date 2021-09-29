import { loadEnv } from 'helpers/utils';

import './select-query-builder-extend';

export function initApp() {
  loadEnv();
  if (!global.WebSocket) {
    global.WebSocket = require('ws');
  }
}
