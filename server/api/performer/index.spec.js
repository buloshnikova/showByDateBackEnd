'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var performerCtrlStub = {
  index: 'performerCtrl.index',
  show: 'performerCtrl.show',
  create: 'performerCtrl.create',
  upsert: 'performerCtrl.upsert',
  patch: 'performerCtrl.patch',
  destroy: 'performerCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var performerIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './performer.controller': performerCtrlStub
});

describe('Performer API Router:', function() {
  it('should return an express router instance', function() {
    performerIndex.should.equal(routerStub);
  });

  describe('GET /api/performers', function() {
    it('should route to performer.controller.index', function() {
      routerStub.get
        .withArgs('/', 'performerCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/performers/:id', function() {
    it('should route to performer.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'performerCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/performers', function() {
    it('should route to performer.controller.create', function() {
      routerStub.post
        .withArgs('/', 'performerCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/performers/:id', function() {
    it('should route to performer.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'performerCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/performers/:id', function() {
    it('should route to performer.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'performerCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/performers/:id', function() {
    it('should route to performer.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'performerCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
