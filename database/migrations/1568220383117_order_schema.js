
'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSchema extends Schema {
  up () {
    this.create('orders', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.timestamps()
      table.json('address').notNullable()
      table.string('po')
      table.boolean('quickbooks').notNullable().defaultTo(false)
      table.decimal('price', 20, 2).notNullable()
      table.json('itens').notNullable()
      table.string('obs').notNullable().defaultTo("1 - Pedido Criado")
      table.integer('refnumber')
      table.boolean('status').defaultTo(true)
      table.boolean('transition').defaultTo(false)
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrderSchema
