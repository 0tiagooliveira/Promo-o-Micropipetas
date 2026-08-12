module.exports = {
  apps: [
    {
      name: 'ionlab-promo-app',
      script: 'server.ts',
      interpreter: 'npx',
      interpreter_args: 'tsx',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
