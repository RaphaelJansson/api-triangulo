var amqp = require('amqplib/callback_api');
var q = 'tasks';

module.exports = {
    construct: function (data, callback) {
        var message = JSON.stringify(data)
        amqp.connect('amqp://localhost', function (err, conn) {
            conn.createChannel(function (err, ch) {
                ch.assertQueue(q, { durable: false });
                ch.sendToQueue(
                    q, Buffer.from(message),
                    setTimeout(function () {
                        conn.close()
                        return callback()
                    }, 500));
            });
        });
    }
}

