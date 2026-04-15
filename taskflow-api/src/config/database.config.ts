import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  entities: string[];
  migrations: string[];
  seeds: string[];
}

export default registerAs('database', (): TypeOrmModuleOptions => {
  const values = {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'taskflow',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    seeds: [__dirname + '/../seeds/*{.ts,.js}'],
  };

  const validationSchema = Joi.object({
    type: Joi.string().valid('postgres').default('postgres'),
    host: Joi.string().default('localhost'),
    port: Joi.number().default(5432),
    username: Joi.string().required(),
    password: Joi.string().required(),
    database: Joi.string().required(),
    synchronize: Joi.boolean().default(false),
    logging: Joi.boolean().default(false),
    entities: Joi.array().items(Joi.string()).default([]),
    migrations: Joi.array().items(Joi.string()).default([]),
    seeds: Joi.array().items(Joi.string()).default([]),
  });

  const { error } = validationSchema.validate(values, { allowUnknown: true });

  if (error) {
    throw new Error(`Database config validation error: ${error.message}`);
  }

  return values;
});
