import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('snacks', (table) => {
        table.uuid('id').primary()
        table.text('name').notNullable()
        table.text('description').notNullable()
        table.text('date').notNullable()
        table.text('hour').notNullable()
        table.boolean('diet_include').notNullable()
        table.uuid('user_id').references('id').inTable('users')
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('snacks')
}

