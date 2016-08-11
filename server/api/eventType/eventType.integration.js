'use strict';

var app = require('../..');
import request from 'supertest';

var newEventType;

describe('EventType API:', function() {

  describe('GET /api/eventTypes', function() {
    var eventTypes;

    beforeEach(function(done) {
      request(app)
        .get('/api/eventTypes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          eventTypes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      eventTypes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/eventTypes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/eventTypes')
        .send({
          name: 'New EventType',
          info: 'This is the brand new eventType!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newEventType = res.body;
          done();
        });
    });

    it('should respond with the newly created eventType', function() {
      newEventType.name.should.equal('New EventType');
      newEventType.info.should.equal('This is the brand new eventType!!!');
    });

  });

  describe('GET /api/eventTypes/:id', function() {
    var eventType;

    beforeEach(function(done) {
      request(app)
        .get('/api/eventTypes/' + newEventType._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          eventType = res.body;
          done();
        });
    });

    afterEach(function() {
      eventType = {};
    });

    it('should respond with the requested eventType', function() {
      eventType.name.should.equal('New EventType');
      eventType.info.should.equal('This is the brand new eventType!!!');
    });

  });

  describe('PUT /api/eventTypes/:id', function() {
    var updatedEventType;

    beforeEach(function(done) {
      request(app)
        .put('/api/eventTypes/' + newEventType._id)
        .send({
          name: 'Updated EventType',
          info: 'This is the updated eventType!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedEventType = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedEventType = {};
    });

    it('should respond with the updated eventType', function() {
      updatedEventType.name.should.equal('Updated EventType');
      updatedEventType.info.should.equal('This is the updated eventType!!!');
    });

  });

  describe('DELETE /api/eventTypes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/eventTypes/' + newEventType._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when eventType does not exist', function(done) {
      request(app)
        .delete('/api/eventTypes/' + newEventType._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
