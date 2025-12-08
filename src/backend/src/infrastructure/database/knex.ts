import knex, { Knex } from 'knex';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../../knexfile.js');

const environment = process.env.NODE_ENV || 'development';
const knexConfig = config[environment];

export const db: Knex = knex(knexConfig);

