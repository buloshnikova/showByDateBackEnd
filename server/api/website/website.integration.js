'use strict';

var app = require('../..');
import request from 'supertest';

var newWebsite;

describe('Website API:', function() {

  describe('GET /api/websites', function() {
    var websites;

    beforeEach(function(done) {
      request(app)
        .get('/api/websites')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          websites = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      websites.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/websites', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/websites')
        .send({
          name: 'New Website',
          info: 'This is the brand new website!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newWebsite = res.body;
          done();
        });
    });

    it('should respond with the newly created website', function() {
      newWebsite.name.should.equal('New Website');
      newWebsite.info.should.equal('This is the brand new website!!!');
    });

  });

  describe('GET /api/websites/:id', function() {
    var website;

    beforeEach(function(done) {
      request(app)
        .get('/api/websites/' + newWebsite._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          website = res.body;
          done();
        });
    });

    afterEach(function() {
      website = {};
    });

    it('should respond with the requested website', function() {
      website.name.should.equal('New Website');
      website.info.should.equal('This is the brand new website!!!');
    });

  });

  describe('PUT /api/websites/:id', function() {
    var updatedWebsite;

    beforeEach(function(done) {
      request(app)
        .put('/api/websites/' + newWebsite._id)
        .send({
          name: 'Updated Website',
          info: 'This is the updated website!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedWebsite = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedWebsite = {};
    });

    it('should respond with the updated website', function() {
      updatedWebsite.name.should.equal('Updated Website');
      updatedWebsite.info.should.equal('This is the updated website!!!');
    });

  });

  describe('DELETE /api/websites/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/websites/' + newWebsite._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when website does not exist', function(done) {
      request(app)
        .delete('/api/websites/' + newWebsite._id)
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
