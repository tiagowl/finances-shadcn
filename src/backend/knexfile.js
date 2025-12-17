import dotenv from 'dotenv';
dotenv.config();

// Helper para criar conexão do banco
function getConnection() {
  // Se DATABASE_URL estiver disponível, use ela (formato do Neon)
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Caso contrário, use as variáveis individuais
  const ssl = process.env.DATABASE_SSL === 'true' 
    ? { rejectUnauthorized: false } 
    : false;

  const connection = {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    database: process.env.DATABASE_NAME || 'finance_control',
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
  };
  
  if (ssl) {
    connection.ssl = ssl;
  }
  
  return connection;
}

export default {
  development: {
    client: 'postgresql',
    connection: getConnection(),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/infrastructure/database/migrations',
    },
    seeds: {
      directory: './src/infrastructure/database/seeds',
    },
  },

  production: {
    client: 'postgresql',
    connection: getConnection(),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/infrastructure/database/migrations',
    },
  },
};





