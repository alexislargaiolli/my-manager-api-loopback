'use strict';

module.exports = function(app) {
    app.dataSources.mysql.autoupdate('AccessToken');
    app.dataSources.mysql.autoupdate('ACL');
    app.dataSources.mysql.autoupdate('RoleMapping');
    app.dataSources.mysql.autoupdate('Role');
    app.dataSources.mysql.autoupdate('Note');
    app.dataSources.mysql.autoupdate('Gain');
    app.dataSources.mysql.autoupdate('HistoryEntry');
    app.dataSources.mysql.autoupdate('Task');
    app.dataSources.mysql.autoupdate('MMUser');
    app.dataSources.mysql.autoupdate('Project');
    app.dataSources.mysql.autoupdate('Client');
    app.dataSources.mysql.autoupdate('ProjectClient');
}