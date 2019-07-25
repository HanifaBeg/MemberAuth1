'use strict';
module.exports = function (server) {
    // Install a `/` route that returns server status
    var router = server.loopback.Router();
    router.get('/', server.loopback.status());
    router.get('/Members/login', function (req, res, next) {
        server.models.Role.find({}, function (err, customer) {
            if (err) return next(err);
            console.log("hi")
            res.send({
                customer: customer
            });
        });
    });
    server.use(router);
};