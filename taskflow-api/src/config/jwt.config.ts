import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export default registerAs('jwt', (): JwtConfig => {
  const values = {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  };

  const validationSchema = Joi.object({
    secret: Joi.string().required(),
    expiresIn: Joi.string().default('1h'),
    refreshSecret: Joi.string().required(),
    refreshExpiresIn: Joi.string().default('7d'),
  });

  const { error } = validationSchema.validate(values, { allowUnknown: true });

  if (error) {
    throw new Error(`JWT config validation error: ${error.message}`);
  }

  return values;
});
