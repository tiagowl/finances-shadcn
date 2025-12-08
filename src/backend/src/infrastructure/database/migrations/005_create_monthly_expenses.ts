import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('monthly_expenses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.integer('day_of_month').notNullable().checkBetween([1, 31]);
    table.string('cancellation_link', 500);
    table.timestamps(true, true);

    table.index('user_id');
    table.index('day_of_month');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('monthly_expenses');
}





