'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var eventTypeCtrlStub = {
  index: 'eventTypeCtrl.index',
  show: 'eventTypeCtrl.show',
  create: 'eventTypeCtrl.create',
  update: 'eventTypeCtrl.update',
  destroy: 'eventTypeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var eventTypeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './eventType.controller': eventTypeCtrlStub
});

describe('EventType API Router:', function() {

  it('should return an express router instance', function() {
    eventTypeIndex.should.equal(routerStub);
  });

  describe('GET /api/eventTypes', function() {

    it('should route to eventType.controller.index', function() {
      routerStub.get
        .withArgs('/', 'eventTypeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/eventTypes/:id', function() {

    it('should route to eventType.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'eventTypeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/eventTypes', function() {

    it('should route to eventType.controller.create', function() {
      routerStub.post
        .withArgs('/', 'eventTypeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/eventTypes/:id', function() {

    it('should route to eventType.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'eventTypeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/eventTypes/:id', function() {

    it('should route to eventType.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'eventTypeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/eventTypes/:id', function() {

    it('should route to eventType.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'eventTypeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
