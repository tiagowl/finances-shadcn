import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('simulation_expenses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.date('date').notNullable();
    table.timestamps(true, true);

    table.index('user_id');
    table.index('date');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('simulation_expenses');
}





