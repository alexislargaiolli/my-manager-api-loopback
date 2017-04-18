'use strict';
var app = require('../../server/server');

module.exports = function(MMUser) {
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
        app.models.Gain.find({
            include: {
                relation: 'project',
                scope: {
                    where: {
                        'userId': userId
                    }
                }
            }
        }).then(gains => {
            const totalPaid = gains.reduce((prevVal, current) => {
                return prevVal + (current.paid ? current.budget : 0);
            }, 0);
            const totalInvoiced = gains.reduce((prevVal, current) => {
                return prevVal + (current.invoiced && !current.paid ? current.budget : 0);
            }, 0);
            const totalPotential = gains.reduce((prevVal, current) => {
                return prevVal + (!current.invoiced && !current.paid ? current.budget : 0);
            }, 0);
            callback(null, totalPaid, totalInvoiced, totalPotential);
        });
    };

};