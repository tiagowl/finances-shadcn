import knex from 'knex';
import { config } from 'dotenv';
import * as path from 'path';

config();

// Carregar configuração do knexfile
// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexConfig = require('../knexfile.js');

const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

async function runSeeds() {
  try {
    console.log('Running seeds...');
    await db.seed.run();
    console.log('✅ Seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

runSeeds();

