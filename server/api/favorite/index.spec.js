'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var favoriteCtrlStub = {
  index: 'favoriteCtrl.index',
  show: 'favoriteCtrl.show',
  create: 'favoriteCtrl.create',
  upsert: 'favoriteCtrl.upsert',
  patch: 'favoriteCtrl.patch',
  destroy: 'favoriteCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var favoriteIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './favorite.controller': favoriteCtrlStub
});

describe('Favorite API Router:', function() {
  it('should return an express router instance', function() {
    favoriteIndex.should.equal(routerStub);
  });

  describe('GET /api/favorites', function() {
    it('should route to favorite.controller.index', function() {
      routerStub.get
        .withArgs('/', 'favoriteCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/favorites/:id', function() {
    it('should route to favorite.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'favoriteCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/favorites', function() {
    it('should route to favorite.controller.create', function() {
      routerStub.post
        .withArgs('/', 'favoriteCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/favorites/:id', function() {
    it('should route to favorite.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'favoriteCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/favorites/:id', function() {
    it('should route to favorite.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'favoriteCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/favorites/:id', function() {
    it('should route to favorite.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'favoriteCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
