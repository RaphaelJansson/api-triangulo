'use strict'

const User = use("App/Models/User");
class SessionController {
  async create({ request, auth, response }) {
    var { email, password } = request.all()
    email = email.toLowerCase()
    const user = await User.findBy('email',email);
    if (user.status == true) {
      if (user.id_father != 0){
        const father = await User.find(user.id_father)
        if (father.status == true) {
          const token = await auth.attempt(email, password)
          return ({token: token, username: user.username})
        }else{
          return response.send({msg:"Voce esta sem permissão para acessar o sistema", error:"error"})
        }
      }
      const token = await auth.attempt(email, password)
      return ({token: token, username: user.username})
    }
    return response.send({msg:"Voce esta sem permissão para acessar o sistema", error:"error"})
  }
}

module.exports = SessionController