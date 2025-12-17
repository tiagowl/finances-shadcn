import knex, { Knex } from 'knex';
import config from '../../../knexfile.js';

const environment = (process.env.NODE_ENV || 'development') as 'development' | 'production';
const knexConfig = config[environment];

export const db: Knex = knex(knexConfig);

