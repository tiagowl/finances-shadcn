import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('shopping_list_items', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.decimal('price', 10, 2).notNullable().defaultTo(0);
    table.boolean('is_purchased').notNullable().defaultTo(false);
    table.timestamps(true, true);

    table.index('user_id');
    table.index('is_purchased');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('shopping_list_items');
}





