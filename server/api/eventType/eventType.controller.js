/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/eventTypes              ->  index
 * POST    /api/eventTypes              ->  create
 * GET     /api/eventTypes/:id          ->  show
 * PUT     /api/eventTypes/:id          ->  update
 * DELETE  /api/eventTypes/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import EventType from './eventType.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of EventTypes
export function index(req, res) {
  return EventType.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single EventType from the DB
export function show(req, res) {
  return EventType.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new EventType in the DB
export function create(req, res) {
  return EventType.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing EventType in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return EventType.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a EventType from the DB
export function destroy(req, res) {
  return EventType.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
