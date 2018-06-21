'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Authenticator = mongoose.model('Authenticator'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  authenticator;

/**
 * Authenticator routes tests
 */
describe('Authenticator CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Authenticator
    user.save(function () {
      authenticator = {
        name: 'Authenticator name'
      };

      done();
    });
  });

  it('should be able to save a Authenticator if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Authenticator
        agent.post('/api/authenticators')
          .send(authenticator)
          .expect(200)
          .end(function (authenticatorSaveErr, authenticatorSaveRes) {
            // Handle Authenticator save error
            if (authenticatorSaveErr) {
              return done(authenticatorSaveErr);
            }

            // Get a list of Authenticators
            agent.get('/api/authenticators')
              .end(function (authenticatorsGetErr, authenticatorsGetRes) {
                // Handle Authenticators save error
                if (authenticatorsGetErr) {
                  return done(authenticatorsGetErr);
                }

                // Get Authenticators list
                var authenticators = authenticatorsGetRes.body;

                // Set assertions
                (authenticators[0].user._id).should.equal(userId);
                (authenticators[0].name).should.match('Authenticator name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Authenticator if not logged in', function (done) {
    agent.post('/api/authenticators')
      .send(authenticator)
      .expect(403)
      .end(function (authenticatorSaveErr, authenticatorSaveRes) {
        // Call the assertion callback
        done(authenticatorSaveErr);
      });
  });

  it('should not be able to save an Authenticator if no name is provided', function (done) {
    // Invalidate name field
    authenticator.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Authenticator
        agent.post('/api/authenticators')
          .send(authenticator)
          .expect(400)
          .end(function (authenticatorSaveErr, authenticatorSaveRes) {
            // Set message assertion
            (authenticatorSaveRes.body.message).should.match('Please fill Authenticator name');

            // Handle Authenticator save error
            done(authenticatorSaveErr);
          });
      });
  });

  it('should be able to update an Authenticator if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Authenticator
        agent.post('/api/authenticators')
          .send(authenticator)
          .expect(200)
          .end(function (authenticatorSaveErr, authenticatorSaveRes) {
            // Handle Authenticator save error
            if (authenticatorSaveErr) {
              return done(authenticatorSaveErr);
            }

            // Update Authenticator name
            authenticator.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Authenticator
            agent.put('/api/authenticators/' + authenticatorSaveRes.body._id)
              .send(authenticator)
              .expect(200)
              .end(function (authenticatorUpdateErr, authenticatorUpdateRes) {
                // Handle Authenticator update error
                if (authenticatorUpdateErr) {
                  return done(authenticatorUpdateErr);
                }

                // Set assertions
                (authenticatorUpdateRes.body._id).should.equal(authenticatorSaveRes.body._id);
                (authenticatorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Authenticators if not signed in', function (done) {
    // Create new Authenticator model instance
    var authenticatorObj = new Authenticator(authenticator);

    // Save the authenticator
    authenticatorObj.save(function () {
      // Request Authenticators
      request(app).get('/api/authenticators')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Authenticator if not signed in', function (done) {
    // Create new Authenticator model instance
    var authenticatorObj = new Authenticator(authenticator);

    // Save the Authenticator
    authenticatorObj.save(function () {
      request(app).get('/api/authenticators/' + authenticatorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', authenticator.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Authenticator with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/authenticators/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Authenticator is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Authenticator which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Authenticator
    request(app).get('/api/authenticators/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Authenticator with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Authenticator if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Authenticator
        agent.post('/api/authenticators')
          .send(authenticator)
          .expect(200)
          .end(function (authenticatorSaveErr, authenticatorSaveRes) {
            // Handle Authenticator save error
            if (authenticatorSaveErr) {
              return done(authenticatorSaveErr);
            }

            // Delete an existing Authenticator
            agent.delete('/api/authenticators/' + authenticatorSaveRes.body._id)
              .send(authenticator)
              .expect(200)
              .end(function (authenticatorDeleteErr, authenticatorDeleteRes) {
                // Handle authenticator error error
                if (authenticatorDeleteErr) {
                  return done(authenticatorDeleteErr);
                }

                // Set assertions
                (authenticatorDeleteRes.body._id).should.equal(authenticatorSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Authenticator if not signed in', function (done) {
    // Set Authenticator user
    authenticator.user = user;

    // Create new Authenticator model instance
    var authenticatorObj = new Authenticator(authenticator);

    // Save the Authenticator
    authenticatorObj.save(function () {
      // Try deleting Authenticator
      request(app).delete('/api/authenticators/' + authenticatorObj._id)
        .expect(403)
        .end(function (authenticatorDeleteErr, authenticatorDeleteRes) {
          // Set message assertion
          (authenticatorDeleteRes.body.message).should.match('User is not authorized');

          // Handle Authenticator error error
          done(authenticatorDeleteErr);
        });

    });
  });

  it('should be able to get a single Authenticator that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Authenticator
          agent.post('/api/authenticators')
            .send(authenticator)
            .expect(200)
            .end(function (authenticatorSaveErr, authenticatorSaveRes) {
              // Handle Authenticator save error
              if (authenticatorSaveErr) {
                return done(authenticatorSaveErr);
              }

              // Set assertions on new Authenticator
              (authenticatorSaveRes.body.name).should.equal(authenticator.name);
              should.exist(authenticatorSaveRes.body.user);
              should.equal(authenticatorSaveRes.body.user._id, orphanId);

              // force the Authenticator to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Authenticator
                    agent.get('/api/authenticators/' + authenticatorSaveRes.body._id)
                      .expect(200)
                      .end(function (authenticatorInfoErr, authenticatorInfoRes) {
                        // Handle Authenticator error
                        if (authenticatorInfoErr) {
                          return done(authenticatorInfoErr);
                        }

                        // Set assertions
                        (authenticatorInfoRes.body._id).should.equal(authenticatorSaveRes.body._id);
                        (authenticatorInfoRes.body.name).should.equal(authenticator.name);
                        should.equal(authenticatorInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Authenticator.remove().exec(done);
    });
  });
});
