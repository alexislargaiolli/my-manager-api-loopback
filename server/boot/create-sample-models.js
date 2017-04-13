module.exports = function(app) {
  app.dataSources.mysql.automigrate('AccessToken');
  app.dataSources.mysql.automigrate('ACL');
  app.dataSources.mysql.automigrate('RoleMapping');
  app.dataSources.mysql.automigrate('Role');
  app.dataSources.mysql.automigrate('Note');
  app.dataSources.mysql.automigrate('Gain');
  app.dataSources.mysql.automigrate('HistoryEntry');
  app.dataSources.mysql.automigrate('Task');

  app.dataSources.mysql.automigrate('MMUser', function(err) {
    if (err) throw err;

    app.models.MMUser.create({
      username: 'test',
      email:"test@test.fr",
      password: "password",
      emailVerified: true
    }, function(err, user) {
      if (err) throw err;
      console.log('Model created: \n', user);

      app.dataSources.mysql.automigrate('Role', function(err) {
        if (err) throw err;
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
      });

      app.dataSources.mysql.automigrate('Client', function(err) {
        if (err) throw err;
        app.models.Client.create([{
          name : "WeAreLearning",
          user: user
        },
        {
          name : "Freeness",
          user: user
        }], function(err, clients) {
          if (err) throw err;
          console.log('Models created: \n', clients);

          app.dataSources.mysql.automigrate('Project', function(err) {
            if (err) throw err;

            app.models.Project.create([{
              name: 'WeAreLearning',
              user: user,
            }, {
              name: 'Freness',
              user: user,
            }, {
              name: 'Caffe Artigiano',
              user: user
            }, ], function(err, projects) {
              if (err) throw err;

              console.log('Models created: \n', projects);

               app.dataSources.mysql.automigrate('ProjectClient', function(err) {
                if (err) throw err;
                
                app.models.ProjectClient.create([{
                  project: projects[0],
                  client: clients[0]
                }], function(err, clientproject){
                  if (err) throw err;

                  console.log('Models created: \n', clientproject);

                });
              });
            });
          });
        });
      });
    });
  });
  
};