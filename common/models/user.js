'use strict';
var app = require('../../server/server');
var path = require('path');

module.exports = function(MMUser) {
    MMUser.beforeRemote('create', function(context, user, next) {
        var data = context.args.data;
        if (!(data.firstname && data.lastname && data.email)) {

            return next(new Error('Missing parametters'));
        }
        next();
    });

    MMUser.afterRemote('create', function(context, user, next) {
        app.models.Profile.create({
            lastname: context.args.data.lastname,
            firstname: context.args.data.firstname,
            email: context.args.data.email,
            userId: user.id
        }, () => {
            var options = {
                type: 'email',
                to: user.email,
                from: 'my.freelance.manager@gmail.com',
                subject: 'Thanks for registering.',
                template: path.resolve(__dirname, '../../server/views/verify.ejs'),
                redirect: '/verified',
                user: user
            };

            user.verify(options, function(err, response) {
                if (err) {
                    User.deleteById(user.id);
                    return next(err);
                }
                next();
                // context.res.render('response', {
                //     title: 'Signed up successfully',
                //     content: 'Please check your email and click on the verification link ' +
                //         'before logging in.',
                //     redirectTo: '/',
                //     redirectToLinkText: 'Log in'
                // });
            });
        });
    });

    MMUser.afterRemote('prototype.verify', function(context, user, next) {
        next();
        // context.res.render('response', {
        //     title: 'A Link to reverify your identity has been sent ' +
        //         'to your email successfully',
        //     content: 'Please check your email and click on the verification link ' +
        //         'before logging in',
        //     redirectTo: '/',
        //     redirectToLinkText: 'Log in'
        // });
    });

    /**
     * Return the total pain gain for a given user
     * @param {Function(Error)} callback
     */

    MMUser.prototype.totalPaidGain = function(options, callback) {
        // TODO
        // Gain.find({
        //     where: {
        //         'gain.project.user': ''
        //     }
        // })
        const token = options && options.accessToken;
        const userId = token && token.userId;
        app.models.Devis.find({
            include: {
                relation: 'project',
                scope: {
                    where: {
                        'userId': userId
                    }
                }
            }
        }).then(devis => {
            const totalDevisWaining = devis.reduce((prevVal, current) => {
                return prevVal + (current.state === 1 ? current.totalPrice : 0);
            }, 0);
            const totalDevisAccepted = devis.reduce((prevVal, current) => {
                return prevVal + (current.state == 2 ? current.totalPrice : 0);
            }, 0);

            app.models.Invoice.find({
                include: {
                    relation: 'project',
                    scope: {
                        where: {
                            'userId': userId
                        }
                    }
                }
            }).then(invoices => {
                const invoicesTotalToPaid = invoices.reduce((prevVal, current) => {
                    return prevVal + (current.state === 1 ? current.totalPrice : 0);
                }, 0);
                const invoicesTotalPaid = invoices.reduce((prevVal, current) => {
                    return prevVal + (current.state === 2 ? current.totalPrice : 0);
                }, 0);

                callback(null, totalDevisWaining, totalDevisAccepted, invoicesTotalToPaid, invoicesTotalPaid);
            });
        });
    };

};