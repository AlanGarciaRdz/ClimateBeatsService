module.exports = {
  apps: [
    {
      name: 'ClimateBeatsService', // Application name
      script: './src/app.js', // Entry point for your app (change this to your entry file)
      instances: 1, // Number of instances to run (e.g., 'max' for all CPU cores)
      autorestart: true, // Automatically restart the app if it crashes
      watch: true, // Enable file watching for automatic restarts
      max_memory_restart: '500M', // Restart if memory usage exceeds 500M
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
    },
  ],
};
