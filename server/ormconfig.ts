import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';
import { loadEnv } from 'helpers/utils';

loadEnv();
loadEnv(path.resolve(__dirname, '..', '.env'));

const {
  NODE_ENV = 'development',
  DB_PASSWORD,
  DB_USER,
  DB_DATABASE,
  DB_HOST,
} = process.env;

const env: any = {
  development: {
    database: DB_DATABASE,
  },
  production: {
    database: `${process.env.DB_DATABASE}_prod`,
  },
  test: {
    database: `${process.env.DB_DATABASE}_test`,
  },
};

const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: 5432,
  username: DB_USER,
  migrationsRun: true,
  password: DB_PASSWORD,
  database: env[NODE_ENV].database,
  entities: [path.join(__dirname, 'entities', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations', '*{.ts,.js}')],
  cli: {
    migrationsDir: 'migrations',
  },
  synchronize: false,
};

export default ormConfig;
