import { config as dotenv, } from 'dotenv';
import { Sequelize, } from 'sequelize-typescript';

dotenv();

function configLoad() {
  return {
    auth: {
      jwt: {
        file: {
          secret: process.env['FA_SECRET'],
        },
        user: {
          secret: process.env['UA_SECRET'],
        },
        admin: {
          secret: process.env['AA_SECRET'],
        },
      },
    },
    cors: {
      origin: process.env['CORS_ORIGIN'] ? (JSON.parse(process.env['CORS_ORIGIN']) as string[]) : ['*'],
      maxAge: process.env['CORS_MAX_AGE'] ? Number(process.env['CORS_MAX_AGE']) : 600,
      headers: process.env['CORS_HEADERS'] ? (JSON.parse(process.env['CORS_HEADERS']) as string[]) : ['Accept', 'Content-Type', 'Authorization'],
      credentials: process.env['CORS_ALLOW_CREDENTIALS'] === 'true',
      exposedHeaders: process.env['CORS_EXPOSE_HEADERS']
        ? (JSON.parse(process.env['CORS_EXPOSE_HEADERS']) as string[])
        : ['Content-Type', 'Content-length', 'Content-Disposition'],
    },
    debug: process.env['DEBUG'] === 'true',
    development: process.env['NODE_ENV'] === 'development',
    db: <Sequelize>{},
    env: process.env['NODE_ENV'] as 'development' | 'stage' | 'test' | 'production',
    server: {
      port: process.env['SERVER_PORT'] ? Number(process.env['SERVER_PORT']) : 3000,
      host: process.env['SERVER_HOST'] ?? 'localhost',
      shutdownTimeout: process.env['SERVER_SHUTDOWN_TIMEOUT'] ? Number(process.env['SERVER_SHUTDOWN_TIMEOUT']) : 15000,
    },
    test: process.env['NODE_ENV'] === 'test' ? true : false,
  };
}

export const config = configLoad();
