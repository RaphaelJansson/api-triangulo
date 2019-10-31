'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {
    orders(){
        return this.belongsToMany('App/Models/Order')
    }

    users(){
        return this.belongsToMany('App/Models/Users')
    }
}

module.exports = Product
