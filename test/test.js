'use strict';
var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:5000');

var assert = require('assert');
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1, 2, 3].indexOf(4));
        });
    });
});