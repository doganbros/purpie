module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'API',
      script: 'server/dist/src/main.js',
      watch: false,
      exec_mode: 'fork',
      log_date_format: 'DD-MM-YY HH:mm',
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'API_LOCAL',
      script: 'server/dist/src/main.js',
      watch: true,
      exec_mode: 'fork',
      ignoreWatch: ['.idea/*', '.git/*'],
      log_date_format: 'DD-MM-YY HH:mm',
      env: {
        NODE_ENV: 'development',
        node_args: ['--debug=7000'],
      },
    },
  ],
};
