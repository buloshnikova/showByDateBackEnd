'use strict';

var app = require('../..');
import request from 'supertest';

var newPlace;

describe('Place API:', function() {
  describe('GET /api/places', function() {
    var places;

    beforeEach(function(done) {
      request(app)
        .get('/api/places')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          places = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      places.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/places', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/places')
        .send({
          name: 'New Place',
          info: 'This is the brand new place!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPlace = res.body;
          done();
        });
    });

    it('should respond with the newly created place', function() {
      newPlace.name.should.equal('New Place');
      newPlace.info.should.equal('This is the brand new place!!!');
    });
  });

  describe('GET /api/places/:id', function() {
    var place;

    beforeEach(function(done) {
      request(app)
        .get(`/api/places/${newPlace._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          place = res.body;
          done();
        });
    });

    afterEach(function() {
      place = {};
    });

    it('should respond with the requested place', function() {
      place.name.should.equal('New Place');
      place.info.should.equal('This is the brand new place!!!');
    });
  });

  describe('PUT /api/places/:id', function() {
    var updatedPlace;

    beforeEach(function(done) {
      request(app)
        .put(`/api/places/${newPlace._id}`)
        .send({
          name: 'Updated Place',
          info: 'This is the updated place!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPlace = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPlace = {};
    });

    it('should respond with the original place', function() {
      updatedPlace.name.should.equal('New Place');
      updatedPlace.info.should.equal('This is the brand new place!!!');
    });

    it('should respond with the updated place on a subsequent GET', function(done) {
      request(app)
        .get(`/api/places/${newPlace._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let place = res.body;

          place.name.should.equal('Updated Place');
          place.info.should.equal('This is the updated place!!!');

          done();
        });
    });
  });

  describe('PATCH /api/places/:id', function() {
    var patchedPlace;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/places/${newPlace._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Place' },
          { op: 'replace', path: '/info', value: 'This is the patched place!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPlace = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPlace = {};
    });

    it('should respond with the patched place', function() {
      patchedPlace.name.should.equal('Patched Place');
      patchedPlace.info.should.equal('This is the patched place!!!');
    });
  });

  describe('DELETE /api/places/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/places/${newPlace._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when place does not exist', function(done) {
      request(app)
        .delete(`/api/places/${newPlace._id}`)
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
