// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');


// var request = require('supertest');
// describe('loading express', function () {
//   var server;
//   beforeEach(function () {
//     server = require('./server');
//   });
//   afterEach(function () {
//     server.close();
//   });
//   it('responds to /', function testSlash(done) {
//   request(server)
//     .get('/')
//     .expect(200, done);
//   });
//   it('404 everything else', function testPath(done) {
//     request(server)
//       .get('/foo/bar')
//       .expect(404, done);
//   });
// });

describe('Members Route', function () {

  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  describe('Unauthenticated request', function () {

    var guestAgent;

    beforeEach('Create guest agent', function () {
      guestAgent = supertest.agent(app);
    });

    it('should get a 200 response', function (done) {
      guestAgent.get('/')
        .expect(200)
        .end(done);
    });

  });

  // describe('Authenticated request', function () {

  //   var loggedInAgent;

  //   var userInfo = {
  //     email: 'joe@gmail.com',
  //     password: 'shoopdawoop'
  //   };

  //   beforeEach('Create a user', function (done) {
  //     User.create(userInfo, done);
  //   });

  //   beforeEach('Create loggedIn user agent and authenticate', function (done) {
  //     loggedInAgent = supertest.agent(app);
  //     loggedInAgent.post('/login').send(userInfo).end(done);
  //   });

  //   it('should get with 200 response and with an array as the body', function (done) {
  //     loggedInAgent.get('/api/members/secret-stash').expect(200).end(function (err, response) {
  //       if (err) return done(err);
  //       expect(response.body).to.be.an('array');
  //       done();
  //     });
  //   });

  // });

});
