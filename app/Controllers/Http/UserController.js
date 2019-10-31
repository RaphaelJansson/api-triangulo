'use strict'

const User = use("App/Models/User")
const Database = use('Database')

class UserController {
  
  async index({auth,response}) {
    const { id } = auth.user
    const userp = await User.find(id)
    if (userp.permission != 4) {
      return response.status(403).send({ 'msg': 'Você não tem permissão' })
    }
    const user = User.all()
    return user
  }

  async showpassword({auth,response}) {
    const { id } = auth.user
    const userp = await User.find(id)
    if (userp.permission != 4) {
      return response.status(403).send({ 'msg': 'Você não tem permissão' })
    }
    const user = await Database.table('users').where('password', null)

    return user
  }
  async create({ request, response, view }) {
  
    const data = request.only(["username", "email", "password", "permission"])

    const user = await User.create(data)

    return user
  }

  async store({ auth, request, response, view }) {
    const { id } = auth.user
    const userp = await User.find(id)
    if (userp.permission != 4) {
      return response.status(403).send({ 'msg': 'Você não tem permissão' })
    }
    const data = request.only(["username", "email", "password", "permission"])

    const user = await User.create(data)

    return user
  }

  async show({auth, params, request, response, view }) {
    const { id } = auth.user
    const user = await User.findOrFail(id)

    return user
  }

  async showorders({auth, params, request, response, view }) {
    //const { id } = auth.user
    const user = await User.findOrFail(params.id)

    await user.load('orders')

    return user
  }

  async showaddresses({auth, params, request, response, view }) {
    const { id } = auth.user
    const user = await User.findOrFail(id)//(params.id)

    await user.load('addresses')

    return user
  }

  async update({auth, params, request, response }) {
    const { id } = auth.user
    const userp = await User.find(id)
    if (userp.permission != 4) {
      return response.status(403).send({ 'msg': 'Você não tem permissão' })
    }

    const data = request.only(["password", "permission", "status", "rule"])
    const user = await User.findOrFail(params.id)
    user.merge(data)

    await user.save()

    return user
  }

  
}

module.exports = UserController
