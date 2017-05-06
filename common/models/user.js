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
            const totalPaid = devis.reduce((prevVal, current) => {
                return prevVal + (current.state === 4 ? current.budget : 0);
            }, 0);
            const totalInvoiced = devis.reduce((prevVal, current) => {
                return prevVal + (current.state === 2 ? current.budget : 0);
            }, 0);
            const totalPotential = devis.reduce((prevVal, current) => {
                return prevVal + (current.state == 1 ? current.budget : 0);
            }, 0);
            callback(null, totalPaid, totalInvoiced, totalPotential);
        });
    };

};