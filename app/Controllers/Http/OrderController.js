'use strict'

const Order = use('App/Models/Order')
const User = use("App/Models/User")
const Database = use('Database')


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
    var { id } = auth.user
    const user = await User.find(id)
    if (user.id_father != 0){
      const father = await User.find(user.id_father)
      id = father.id
    }
    const msg = await Database.select('message').from('webmessages')
    const { itens, address, ...data } = request.only(['address', 'products', 'price', 'obs', 'itens','po'])
    data.itens = JSON.stringify(itens)
    data.address = JSON.stringify(address)
    data.obs = msg[0].message
    const order = await Order.create({ ...data, user_id: id })
    return order
  }

  async show({ auth, params, request, response, view }) {
    const order = await Order.findOrFail(params.id)
    var { id } = auth.user
    const user = await User.find(id)
    if (user.id_father != 0){
      const father = await User.find(user.id_father)
      id = father.id
    }
    if (order.user_id != id) {
      return response.status(403).send({ 'msg': 'Você não é dono desta ordem de pedido' })
    }
    await order.load('products')

    return order
  }

  async showopenorders({ auth, params, request, response, view }) {
    var { id } = auth.user
    const user = await User.find(id)
    if (user.id_father != 0){
      const father = await User.find(user.id_father)
      id = father.id
    }
    const order = await Database.table('orders').where('user_id', id).where('status', true).orderBy('refnumber','desc')

    //await order.load('products')

    return order
  }

  async update({ auth, params, request, response }) {
    const order = await Order.findOrFail(params.id)
    var { id } = auth.user
    const user = await User.find(id)
    if (user.id_father != 0){
      const father = await User.find(user.id_father)
      id = father.id
    }
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
    var { id } = auth.user
    const user = await User.find(id)
    if (user.id_father != 0){
      const father = await User.find(user.id_father)
      id = father.id
    }
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
    var { id } = auth.user
    const user = await User.find(id)
    if (user.id_father != 0){
      const father = await User.find(user.id_father)
      id = father.id
    }
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
    var { id } = auth.user
    const user = await User.find(id)
    if (user.id_father != 0){
      const father = await User.find(user.id_father)
      id = father.id
    }
    if (order.user_id != id || user.permission != 4) {
      return response.status(403).send({ 'msg': 'Você não tem permissão para excluir este pedido' })

    }
    await order.delete()

    return response.status(200).send({ 'msg': 'Removido' })
  }
}

module.exports = OrderController
