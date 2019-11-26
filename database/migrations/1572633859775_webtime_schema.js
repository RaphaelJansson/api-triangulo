'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WebtimeSchema extends Schema {
  up () {
    this.create('webtimes', (table) => {
      table.increments()
      table.string('lastrun')
      table.string('name')
      table.timestamps()
    })
  }

  down () {
    this.drop('webtimes')
  }
}

module.exports = WebtimeSchema
