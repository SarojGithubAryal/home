const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const pool = require('./config/database');
const migrate = require('./config/migrate');
const uploadMedia = require('./utils/uploadMedia');
const DropboxService = require('./services/DropboxService');

const start = async () => {
  try {
    // Test database connection
    const client = await pool.connect();
    logger.info('Database connection established');
    client.release();

    // Register Dropbox as the upload provider
    try {
      const dropboxService = new DropboxService(env.dropboxAccessToken);
      uploadMedia.setProvider('dropbox', dropboxService);
      logger.info('Dropbox provider registered');
    } catch (err) {
      logger.error('Failed to register Dropbox provider:', err);
      process.exit(1);
    }

    // Run migrations (idempotent)
    await migrate();

    app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port} [${env.nodeEnv}]`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();