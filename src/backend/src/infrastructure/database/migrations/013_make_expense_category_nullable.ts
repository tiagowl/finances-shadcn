import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('expenses', (table) => {
    table.uuid('category_id').nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('expenses', (table) => {
    // Note: This will fail if there are any NULL values in category_id
    // In a real scenario, you'd need to handle existing NULL values first
    table.uuid('category_id').notNullable().alter();
  });
}




