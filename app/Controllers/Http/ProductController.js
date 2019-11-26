'use strict'

const Product = use('App/Models/Product')
const Rule = use('App/Models/Pricerule')
const User = use("App/Models/User")
const Category = use("App/Models/Category")


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
  async productrule({ auth, params }) {
    const { id } = auth.user
    const user = await User.find(id)
    const rule = await Rule.query().where('rule', user.rule).fetch()
    var category = await Category.findBy('id', params.category)
    var arrayproduct = []
    for (const productrule of rule.rows) {
      try {
        if (productrule.price > 0) {
          const product = await Product.findBy('name', productrule.name)
            if(category!= undefined){
              if (category.name == product.category){
                product.price = productrule.price
                arrayproduct.push(product)
              }
            }else if(params.category == "0") {
              product.price = productrule.price
              arrayproduct.push(product)
            }       
        }
      } catch (e) {
        continue;
      }
    }
    const order = arrayproduct.sort(function (a, b) {
      if (a.unitofmeasuredefault == b.unitofmeasuredefault) {
        return a.category < b.category ? -1 : a.category > b.category ? 1 : 0;
      }
      return a.unitofmeasuredefault < b.unitofmeasuredefault ? -1 : a.unitofmeasuredefault > b.unitofmeasuredefault ? 1 : 0;
    });
    return order;
  }

  async showcategory({ auth }) {
    const { id } = auth.user
    const user = await User.find(id)
    const rule = await Rule.query().where('rule', user.rule).fetch()

    var arraycategory = []
    for (const productrule of rule.rows) {
      try {
        if (productrule.price > 0) {
          const product = await Product.findBy('name', productrule.name)
          if (product != undefined) {
            var category = await Category.findBy('name', product.category)
            if (category != undefined) {
              const result = arraycategory.find(o => o.name == product.category)
              if (result == undefined) {
                arraycategory.push(category)
              }
            } else {
              var category = await Category.create({ name: product.category })
              arraycategory.push(category)
            }
          }
        }
      } catch (e) {
        continue;
      }
    }
    return arraycategory;
  }

  async shippingfreight({ auth }) {
    const { id } = auth.user
    const user = await User.find(id)

    const shipping = await Rule.query().where('rule', user.rule).where('name', 'like', '%Shipping%').fetch()

    return shipping;
  }

}

module.exports = ProductController
