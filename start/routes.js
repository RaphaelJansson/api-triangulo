'use strict'

const Route = use('Route')
//##produtos##
Route.get('/productorders/:id', 'UserController.showorders').middleware('auth')
Route.resource('product', 'ProductController').apiOnly().middleware('auth')
Route.get('productrule', 'ProductController.productrule').middleware('auth')
Route.get('freight', 'ProductController.shippingfreight').middleware('auth')

//##Pedidos##
Route.resource('order', 'OrderController').apiOnly().middleware('auth')
Route.put('order/conclude', 'OrderController.conclude').middleware('auth')
Route.put('order/cancel', 'OrderController.cancel').middleware('auth')
Route.get('showorders', 'OrderController.showopenorders').middleware('auth')

//##users##
Route.post('/users/create', 'UserController.create')
Route.put('/users/newpassword', 'UserController.showpassword').middleware('auth')
Route.resource('/users', 'UserController').apiOnly().middleware('auth')

//##Enderecos##
Route.resource('/address', 'AddressController').apiOnly().middleware('auth')
Route.get('address/showaddress/:id', 'UserController.showaddresses').middleware('auth')

//##PriceRule##
Route.resource('/pricerule', 'PriceruleController').apiOnly().middleware('auth')

Route.post('/sessions', 'SessionController.create')

Route.get('/', function () {
  return 'App funcionando' 
})

Route.post('users/forgotPassword', 'ForgotPasswordController.store')
Route.put('users/forgotPassword/:token/:email', 'ForgotPasswordController.update')


