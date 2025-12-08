import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Use raw SQL to change the column type from VARCHAR(500) to TEXT
  // Knex's alter() method doesn't support changing column types directly
  await knex.raw('ALTER TABLE wishes ALTER COLUMN purchase_link TYPE TEXT');
}

export async function down(knex: Knex): Promise<void> {
  // Revert back to VARCHAR(500) - Note: This may fail if there are values longer than 500 characters
  await knex.raw('ALTER TABLE wishes ALTER COLUMN purchase_link TYPE VARCHAR(500)');
}

