'use strict'

const User = use("App/Models/User")
const Price = use("App/Models/Pricerule")
const excel = require('../../../config/excel')
const Database = use('Database')

class PriceruleController {

  async index({auth, request, response, view }) {
    const { id } = auth.user
    const userp = await User.find(id)
    if (userp.permission != 4) {
      return response.status(403).send({ 'msg': 'Você não tem permissão para atualizar a PriceRuleList' })
    }
    var arrayrules = []
    const rule = await Price.all()
    for (const rules of rule.rows){
      const result = arrayrules.find(r=> r.rule == rules.rule)
      if (result == undefined){
        arrayrules.push({rule: rules.rule})
      } 
    }
    return arrayrules
  }

  async store({ auth, request, response }) {
    const { id } = auth.user
    const userp = await User.find(id)
    if (userp.permission != 4) {
      return response.status(403).send({ 'msg': 'Você não tem permissão para atualizar a PriceRuleList' })
    }
    const listusers = await excel.storcustomerrule()
    await Database.table('users').update('rule', '')
    for (const customer of listusers) {
      try {
        var name = customer.name
        const user = await User.findBy('username', name)
        const datauser = {
          rule: customer.rule
        }
        user.merge(datauser)
        await user.save()
      } catch (e) {
        console.log(`Não achou o usuario ${name}`)
      }
    }
    const listitens = await excel.storitensrule()
    await Price.truncate()
    for (const rule in listitens) {
      const dataitem = { rule: listitens[rule].rulename }
      for (const item in listitens[rule].itens) {
        if (item != 0) {
          dataitem.name = listitens[rule].itens[item].name
          dataitem.price = listitens[rule].itens[item].price
          await Price.create(dataitem)
        }
      }
    }
    return response.status(200).send({ mgs: "Upload concluido" })
  }

  async show({ params, request, response, view }) {
  }

  async update({ params, request, response }) {
  }

  async destroy({ params, request, response }) {
  }
}

module.exports = PriceruleController
