'use strict'

const Address = use('App/Models/Address')
const Database = use('Database')

class AddressController {
  
  async index ({ auth, request, response, view }) {
    const { id } = auth.user
    const userp = await User.find(id)
    if (userp.permission != 4) {
      return response.status(403).send({ 'msg': 'Você não tem permissão de administrador' })
    }
    const address = Address.all()
    return address
  }

  async create ({ request, response, view }) {
  }

  async store ({ request, response }) {
  }

  async show ({ auth ,params, request, response, view }) {
      const  {id} = auth.user
      const address = await Database.table('addresses').where('user_id', id)
  
      return address
  }

  async showname ({ auth ,params, request, response, view }) {
    const  {id} = auth.user
    const address = await Address.query('addresses').where('user_id', id).where('addressname', 'like',`%${params.name}%`).fetch()

    return address
}
  
  async edit ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = AddressController
