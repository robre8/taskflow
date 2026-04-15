import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  apiPrefix: string;
  corsOrigins: string[];
}

export default registerAs('app', (): AppConfig => {
  const values = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || 'api',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  };

  const validationSchema = Joi.object({
    port: Joi.number().default(3000),
    nodeEnv: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    apiPrefix: Joi.string().default('api'),
    corsOrigins: Joi.array().items(Joi.string()).default(['http://localhost:3000']),
  });

  const { error } = validationSchema.validate(values, { allowUnknown: true });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return values;
});
