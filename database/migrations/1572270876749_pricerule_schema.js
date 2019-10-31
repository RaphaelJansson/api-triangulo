'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PriceruleSchema extends Schema {
  up () {
    this.create('pricerules', (table) => {
      table.increments()
      table.string('name')
      table.string('price')
      table.string('rule')
      table.timestamps()
    })
  }

  down () {
    this.drop('pricerules')
  }
}

module.exports = PriceruleSchema
