
'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductOrderSchema extends Schema {
  up () {
    this.create('order_product', (table) => {
      table.increments()
      table.integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
        .index('productid')
      table.integer('order_id')
        .unsigned()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE')
        .index('orderid')
      table.timestamps()
    })
  }

  down () {
    this.drop('order_product')
  }
}


module.exports = ProductOrderSchema