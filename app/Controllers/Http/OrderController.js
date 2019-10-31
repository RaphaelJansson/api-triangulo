'use strict'

const Order = use('App/Models/Order')
const User = use("App/Models/User")
const Database = use('Database')
const rabbitmq = require('../../../config/rabbitmq')
class OrderController {

  async index({ auth, request, response, view }) {
    const { id } = auth.user
    const userp = await User.find(id)
    if (userp.permission != 4) {
      return response.status(403).send({ 'msg': 'Você não tem permissão de administrador' })
    }
    const order = Order.all()
    return order
  }

  async store({ auth, request, response }) {
    const { id } = auth.user
    const { itens, ...data } = request.only(['address', 'products', 'price', 'obs', 'itens'])
    const count = await Order.query().where('quickbooks', '=', false).getCount()
    /**
     * FIXME:
     * Verificar se da erro quando usa o JSON.Stringify
     */
    data.itens = JSON.stringify(itens)
    data.refnumber = parseInt(count)
    const order = await Order.create({ ...data, user_id: id })
   
    return order
  }

  async show({ auth, params, request, response, view }) {
    const order = await Order.findOrFail(params.id)
    const { id } = auth.user
    if (order.user_id != id) {
      return response.status(403).send({ 'msg': 'Você não é dono desta ordem de pedido' })
    }
    await order.load('products')

    return order
  }

  async showopenorders({ auth, params, request, response, view }) {
    const { id } = auth.user
    const order = await Database.table('orders').where('user_id', id)

    //await order.load('products')

    return order
  }

  async update({ auth, params, request, response }) {
    const order = await Order.findOrFail(params.id)
    const { id } = auth.user
    if (order.user_id != id) {
      return response.status(403).send({ 'msg': 'Você não é dono desta ordem de pedido' })
    }
    const { products, ...data } = request.only(['title', 'products', 'price'])

    if (products && products.length > 0) {
      await order.products().attach(products)
      await order.load('products')
    }

    order.merge(data)

    await order.save()

    return order
  }

  async conclude({ auth, params, request, response }) {
    const order = await Order.findOrFail(params.id)
    const { id } = auth.user
    if (order.user_id != id) {
      return response.status(403).send({ 'msg': 'Você não é dono desta ordem de pedido' })
    }
    const { products, ...data } = request.only(['title', 'products', 'status'])

    if (products && products.length > 0) {
      await order.products().attach(products)
      await order.load('products')
    }

    order.merge(data)

    await order.save()

    return order
  }

  async cancel({ auth, params, request, response }) {
    const order = await Order.findOrFail(params.id)
    const { id } = auth.user
    if (order.user_id != id) {
      return response.status(403).send({ 'msg': 'Você não é dono desta ordem de pedido' })
    }
    const { data } = request.only(['title', 'status'])

    order.merge(data)

    await order.save()

    return order
  }

  async destroy({ auth, params, request, response }) {
    const order = await Order.findOrFail(params.id)
    const { id } = auth.user
    const userp = await User.find(id)
    if (order.user_id != id || userp.permission != 4) {
      return response.status(403).send({ 'msg': 'Você não tem permissão para excluir este pedido' })

    }
    await order.delete()

    return response.status(200).send({ 'msg': 'Removido' })
  }
}

module.exports = OrderController
