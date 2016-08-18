'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var locationCtrlStub = {
  index: 'locationCtrl.index',
  show: 'locationCtrl.show',
  create: 'locationCtrl.create',
  upsert: 'locationCtrl.upsert',
  patch: 'locationCtrl.patch',
  destroy: 'locationCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var locationIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './location.controller': locationCtrlStub
});

describe('Location API Router:', function() {
  it('should return an express router instance', function() {
    locationIndex.should.equal(routerStub);
  });

  describe('GET /y', function() {
    it('should route to location.controller.index', function() {
      routerStub.get
        .withArgs('/', 'locationCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /y/:id', function() {
    it('should route to location.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'locationCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /y', function() {
    it('should route to location.controller.create', function() {
      routerStub.post
        .withArgs('/', 'locationCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /y/:id', function() {
    it('should route to location.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'locationCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /y/:id', function() {
    it('should route to location.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'locationCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /y/:id', function() {
    it('should route to location.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'locationCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
