
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
      table.string('address').notNullable()
      table.string('PO')
      table.boolean('quickbooks').notNullable().defaultTo(false)
      table.decimal('price', 6, 2).notNullable()
      table.json('itens').notNullable()
      table.string('obs').notNullable().defaultTo("1 - Pedido Criado")
      table.integer('refnumber')
      table.boolean('transition').defaultTo(false)
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrderSchema
