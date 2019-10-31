'use strict'

const User = use("App/Models/User");
class SessionController {
  async create({ request, auth, response }) {
    const { email, password } = request.all()
    const user = await User.findBy('email',email);
    if (user.status == true) {
    const token = await auth.attempt(email, password)
    return ({token: token, username: user.username})
    }
    return response.send({msg:"Voce esta sem permissão para acessar o sistema", error:"error"})
  }
}

module.exports = SessionController