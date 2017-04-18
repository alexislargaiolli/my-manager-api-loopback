'use strict';

module.exports = function(app) {
    if (process.env.NODE_ENV == 'test') {

        app.models.MMUser.create({
            username: 'test',
            email: "test@test.fr",
            password: "password",
            emailVerified: true
        }, function(err, user) {
            if (err) throw err;
            console.log('Model created: \n', user);

            app.models.Role.create({
                name: 'admin'
            }, function(err, role) {
                if (err) throw err;

                //make bob an admin
                role.principals.create({
                    principalType: app.models.RoleMapping.USER,
                    principalId: user.id
                }, function(err, principal) {
                    if (err) throw err;

                    console.log('Roles créés: \n', principal);
                });
            });

            app.models.Client.create([{
                    name: "WeAreLearning",
                    user: user
                },
                {
                    name: "Freeness",
                    user: user
                }
            ], function(err, clients) {
                if (err) throw err;
                console.log('Models created: \n', clients);


                app.models.Project.create([{
                    name: 'WeAreLearning',
                    user: user
                }, {
                    name: 'Freness',
                    user: user,
                }, {
                    name: 'Caffe Artigiano',
                    user: user
                }, ], function(err, projects) {
                    if (err) throw err;

                    console.log('Models created: \n', projects);

                    app.models.Gain.create([{
                        title: "testgain",
                        budget: 1000,
                        projectId: projects[0].id
                    }, {
                        title: "testgain2",
                        budget: 2000,
                        devis: true,
                        projectId: projects[1].id
                    }]);



                    app.models.ProjectClient.create([{
                        project: projects[0],
                        client: clients[0]
                    }], function(err, clientproject) {
                        if (err) throw err;

                        console.log('Models created: \n', clientproject);

                    });
                });
            });

        });
    }
};