'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up() {
    this.create('products', (table) => {
      table.increments()
      table.string('listid').notNullable().unique()
      table.string('name').notNullable().unique()
      table.string('description')
      table.string('price').notNullable()
      table.integer("quantity").notNullable()
      table.string("category")
      table.string("unitofmeasuredefault")
      table.string("valueuntiofmeasure")
      table.string("unitofmeasure")
      table.timestamps()
    })
  }

  down() {
    this.drop('products')
  }
}

module.exports = ProductSchema
