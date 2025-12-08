import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('simulation_credit_purchases', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.integer('installments').notNullable().defaultTo(1);
    table.date('purchase_date').notNullable();
    table.timestamps(true, true);

    table.index('user_id');
    table.index('purchase_date');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('simulation_credit_purchases');
}





