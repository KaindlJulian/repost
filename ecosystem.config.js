// Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
module.exports = {
  apps: [
    {
      name: 'api',
      script: './build/src/api/index.js',
      exec_mode: 'cluster',
      autorestart: true,
      merge_logs: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        API_KEY: 'k',
      },
    },
  ],
};
