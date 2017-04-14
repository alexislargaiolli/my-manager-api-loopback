'use strict';
var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:3000/api');

describe('Authentication', function() {

    it('errors if wrong basic auth', function(done) {
        api.get('/projects')
            .auth('test@test.fr', 'test')
            .expect(401, done)
    });

});