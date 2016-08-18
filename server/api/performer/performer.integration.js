'use strict';

var app = require('../..');
import request from 'supertest';

var newPerformer;

describe('Performer API:', function() {
  describe('GET /api/performers', function() {
    var performers;

    beforeEach(function(done) {
      request(app)
        .get('/api/performers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          performers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      performers.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/performers', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/performers')
        .send({
          name: 'New Performer',
          info: 'This is the brand new performer!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPerformer = res.body;
          done();
        });
    });

    it('should respond with the newly created performer', function() {
      newPerformer.name.should.equal('New Performer');
      newPerformer.info.should.equal('This is the brand new performer!!!');
    });
  });

  describe('GET /api/performers/:id', function() {
    var performer;

    beforeEach(function(done) {
      request(app)
        .get(`/api/performers/${newPerformer._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          performer = res.body;
          done();
        });
    });

    afterEach(function() {
      performer = {};
    });

    it('should respond with the requested performer', function() {
      performer.name.should.equal('New Performer');
      performer.info.should.equal('This is the brand new performer!!!');
    });
  });

  describe('PUT /api/performers/:id', function() {
    var updatedPerformer;

    beforeEach(function(done) {
      request(app)
        .put(`/api/performers/${newPerformer._id}`)
        .send({
          name: 'Updated Performer',
          info: 'This is the updated performer!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPerformer = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPerformer = {};
    });

    it('should respond with the original performer', function() {
      updatedPerformer.name.should.equal('New Performer');
      updatedPerformer.info.should.equal('This is the brand new performer!!!');
    });

    it('should respond with the updated performer on a subsequent GET', function(done) {
      request(app)
        .get(`/api/performers/${newPerformer._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let performer = res.body;

          performer.name.should.equal('Updated Performer');
          performer.info.should.equal('This is the updated performer!!!');

          done();
        });
    });
  });

  describe('PATCH /api/performers/:id', function() {
    var patchedPerformer;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/performers/${newPerformer._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Performer' },
          { op: 'replace', path: '/info', value: 'This is the patched performer!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPerformer = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPerformer = {};
    });

    it('should respond with the patched performer', function() {
      patchedPerformer.name.should.equal('Patched Performer');
      patchedPerformer.info.should.equal('This is the patched performer!!!');
    });
  });

  describe('DELETE /api/performers/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/performers/${newPerformer._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when performer does not exist', function(done) {
      request(app)
        .delete(`/api/performers/${newPerformer._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
