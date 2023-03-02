import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';
import { loadEnv } from 'helpers/utils';

loadEnv();
loadEnv(path.resolve(__dirname, '..', '.env'));

const {
  DB_PASSWORD,
  DB_USER,
  DB_DATABASE,
  DB_HOST,
  DB_PORT = 5432,
} = process.env;

const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  migrationsRun: true,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: [path.join(__dirname, 'entities', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations', '*{.ts,.js}')],
  cli: {
    migrationsDir: 'migrations',
  },
  synchronize: false,
  // logging: process.env.NODE_ENV === 'development',
};

export default ormConfig;
