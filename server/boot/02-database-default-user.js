'use strict';

module.exports = function(app) {
    var username = process.env.DEFAULT_USER_USERNAME;
    var email = process.env.DEFAULT_USER_EMAIL;
    var password = process.env.DEFAULT_USER_PASSWORD;
    if (username && email && password) {
        app.models.MMUser.findOrCreate({ where: { "email": email } }, {
            username: username,
            email: email,
            password: password
        }, function(err, user) {
            if (err) return console.log('%j', err);
            app.models.Role.findOrCreate({ where: { "name": 'admin' } }, {
                name: 'admin'
            }, function(err, role) {
                if (err) return console.log(err);

                role.principals.create({
                    principalType: app.models.RoleMapping.USER,
                    principalId: user.id
                }, function(err, principal) {
                    if (err) return console.log(err);
                });
            });
        });
    }
}