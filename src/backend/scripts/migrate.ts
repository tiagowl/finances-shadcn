import knex from 'knex';
import { config } from 'dotenv';
import * as path from 'path';

config();

// Carregar configuração do knexfile
// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexConfig = require('../knexfile.js');

const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

async function runMigrations() {
  try {
    console.log('Running migrations...');
    await db.migrate.latest();
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

runMigrations();

