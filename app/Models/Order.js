'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {
    products(){
        return this.belongsToMany('App/Models/Product')
    }

    users () {
        return this.belongsTo('App/Models/User')
      }

}

module.exports = Order
