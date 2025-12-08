import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('wishes', (table) => {
    table.uuid('category_id').nullable().references('id').inTable('categories').onDelete('SET NULL');
    table.decimal('amount', 10, 2).nullable();
    
    table.index('category_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('wishes', (table) => {
    table.dropIndex('category_id');
    table.dropColumn('category_id');
    table.dropColumn('amount');
  });
}



