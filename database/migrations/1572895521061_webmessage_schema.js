'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WebmessageSchema extends Schema {
  up () {
    this.create('webmessages', (table) => {
      table.increments()
      table.string('message')
      table.timestamps()
    })
  }

  down () {
    this.drop('webmessages')
  }
}

module.exports = WebmessageSchema
