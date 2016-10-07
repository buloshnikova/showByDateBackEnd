'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var websiteCtrlStub = {
  index: 'websiteCtrl.index',
  show: 'websiteCtrl.show',
  create: 'websiteCtrl.create',
  update: 'websiteCtrl.update',
  destroy: 'websiteCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var websiteIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './website.controller': websiteCtrlStub
});

describe('Website API Router:', function() {

  it('should return an express router instance', function() {
    websiteIndex.should.equal(routerStub);
  });

  describe('GET /api/websites', function() {

    it('should route to website.controller.index', function() {
      routerStub.get
        .withArgs('/', 'websiteCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/websites/:id', function() {

    it('should route to website.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'websiteCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/websites', function() {

    it('should route to website.controller.create', function() {
      routerStub.post
        .withArgs('/', 'websiteCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/websites/:id', function() {

    it('should route to website.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'websiteCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/websites/:id', function() {

    it('should route to website.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'websiteCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/websites/:id', function() {

    it('should route to website.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'websiteCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
