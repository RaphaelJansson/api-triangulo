'use strict'

const User = use('App/Models/User')
const crypto = require('crypto')
const moment = require('moment')
const emailforgot = require('../../../config/email')

class ForgotPasswordController {
  async store({ request , response}) {
    try {
      const { email } = request.only(['email'])

      const user = await User.findBy('email', email)
      if (user != null){
        const token = await crypto.randomBytes(10).toString('hex')

        user.token_created_at = new Date()
        user.token = token

        await user.save()

        await emailforgot.forgotPassword(user, token, () => { })
        return user
      }
      return response.status(403).send({msg:"Email não cadastrado"})

    } catch (err) {
      console.log(err)
    }
    
  }

  async update({ request, response, params }) {
    const tokenProvided = params.token // retrieving token in URL
    const emailRequesting = params.email
    const { newPassword } = request.only(['newPassword'])
    const user = await User.findByOrFail('email', emailRequesting)

    const sameToken = tokenProvided === user.token

    if (!sameToken) {
      return response
        .status(401)
        .send({ message: { error: 'Old token provided or token already used' } })
    }
    const tokenExpired = moment()
      .subtract(1, 'days')
      .isAfter(user.token_created_at)

    if (tokenExpired) {
      return response.status(401).send({ message: { error: 'Token expired' } })
    }

    user.password = newPassword

    user.token = null
    user.token_created_at = null

    // persisting data (saving)
    await user.save()
  }
}
module.exports = ForgotPasswordController
