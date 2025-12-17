declare const config: {
  development: {
    client: string;
    connection: string | {
      host: string;
      port: number;
      database: string;
      user: string;
      password: string;
      ssl?: { rejectUnauthorized: boolean } | false;
    };
    pool: {
      min: number;
      max: number;
    };
    migrations: {
      tableName: string;
      directory: string;
    };
    seeds?: {
      directory: string;
    };
  };
  production: {
    client: string;
    connection: string | {
      host: string;
      port: number;
      database: string;
      user: string;
      password: string;
      ssl?: { rejectUnauthorized: boolean } | false;
    };
    pool: {
      min: number;
      max: number;
    };
    migrations: {
      tableName: string;
      directory: string;
    };
  };
};

export default config;

