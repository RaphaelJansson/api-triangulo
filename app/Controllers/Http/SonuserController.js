'use strict'

const User = use("App/Models/User")

class SonuserController {

  //todos os sonusers
  async index({ auth, request, response, view }) {
    const { id } = auth.user
    const user = await User.find(id)
    if (user.permission != 4) {
      return response.status(403).send({ 'msg': 'Você não tem permissão' })
    }
    const sonuser = User.query().where('id_father', '>', 0).fetch()
    return sonuser
  }
  //todos os usuarios com seus subusers
  async indexbyuser({ auth, request, response, view }) {
    const { id } = auth.user
    const userp = await User.find(id)
    if (userp.permission != 4) {
      return response.status(403).send({ 'msg': 'Você não tem permissão' })
    }
    var arrayuser = []
    const users = await User.query().where('id_father', '=', 0).fetch()
    for (const user of users.rows) {
      const subusers = await User.query().where('id_father', '=', user.id).fetch()
      var arraysubuser = []
      for (const subuser of subusers.rows) {
        arraysubuser.push(subuser)
      }
      var userlist = {
        user: user.username,

        subusers: arraysubuser
      }
      arrayuser.push(userlist)
    }
    return arrayuser
  }
  //cria um subuser
  async store({ auth, request, response }) {
    const { id } = auth.user
    const user = await User.find(id)
    if (user.permission < 3) {
      return response.status(403).send({ 'msg': 'Você não tem permissão' })
    }
    const data = request.only(["username", "email", "password"])
    data.id_father = id
    const sonuser = await User.create(data)

    return sonuser
  }

  async show({ auth, params, request, response, view }) {
  }
  // todos subuser de um user
  async showbyuser({ auth, params, request, response, view }) {
    const { id } = auth.user
    const user = await User.find(id)
    if (user.permission < 3) {
      return response.status(403).send({ 'msg': 'Você não tem permissão' })
    }
    const sonuser = await User.query().where('id_father', '=', params.id).fetch()

    return sonuser
  }

  async update({ auth, params, request, response }) {
  }
  // deletar subuser
  async destroy({auth, params, request, response }) {
    const { id } = auth.user
    const user = await User.find(id)
    if (user.permission < 3) {
      return response.status(403).send({ 'msg': 'Você não tem permissão' })
    }
    const sonuser = await User.find(params.id)
    await sonuser.delete()

    return response.send({ 'msg': 'User deletado' })
  }
}

module.exports = SonuserController
