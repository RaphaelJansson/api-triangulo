'use strict'

const Product = use('App/Models/Product')
const Rule = use('App/Models/Pricerule')
const User = use("App/Models/User")
const Database = use('Database')

class ProductController {

  async index() {
    const product = Product.all()
    return product
  }

  async store({ auth, request, response }) {
    const { id } = auth.user
    const userp = await User.find(id)
    if (userp.permission != 4) {
      return response.status(403).send({ 'msg': 'Você não tem permissão' })
    }
    const { orders, ...data } = request.only(['listid', 'name', 'vendor', 'price', 'quantity', 'orders'])
    const product = await Product.create(data)

    if (orders && orders.length > 0) {
      await product.orders().attach(orders)
      await product.load('orders')
    }

    return product
  }

  async showorders({ auth, params, request, response, view }) {
    const { id } = auth.user
    const userp = await User.find(id)
    if (userp.permission != 4) {
      return response.status(403).send({ 'msg': 'Você não tem permissão' })
    }
    const product = await Product.findOrFail(params.id)

    await product.load('orders')

    return product
  }

  async show({ auth, params, request, response, view }) {
    const product = await Product.findOrFail(params.id)

    return product
  }
  
  async productrule({ auth }) {
    const { id } = auth.user
    const user = await User.find(id)
    const rule = await Rule.query().where('rule', user.rule).fetch()

    var arrayproduct = []
    for (const productrule of rule.rows) {
      try {
        if (productrule.price > 0) {
          const product = await Product.findBy('name', productrule.name)
          product.price = productrule.price
          arrayproduct.push(product)
        }
      } catch (e) {
        continue;
      }
    }
    return arrayproduct;
  }

  async shippingfreight({ auth }) {
    const { id } = auth.user
    const user = await User.find(id)

    const shipping = await Rule.query().where('rule', user.rule).where('name', 'like', '%Shipping%').fetch()

    return shipping;
  }

}

module.exports = ProductController
