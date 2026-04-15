import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';

export const config = {
  app: appConfig,
  database: databaseConfig,
  jwt: jwtConfig,
};

export const validationSchema = {
  ...appConfig,
  ...databaseConfig,
  ...jwtConfig,
};
