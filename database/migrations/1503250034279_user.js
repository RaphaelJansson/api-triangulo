'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable()
      table.string('iduser')
      table.string('password', 60)
      table.string('companyname')
      table.string('jobtitle')
      table.string('token')
      table.string('rule')
      table.timestamp('token_created_at')
      table.integer('permission').defaultTo(1)
      table.boolean('status').defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
