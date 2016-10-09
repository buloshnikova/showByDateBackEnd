/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /y              ->  index
 * POST    /y              ->  create
 * GET     /y/:id          ->  show
 * PUT     /y/:id          ->  update
 * DELETE  /y/:id          ->  destroy
 */
'use strict';

import _ from 'lodash';
import Event from './event.model';
var moment = require('moment');

function respondWithResult(res, statusCode) {

  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function removeAllEntity(res) {
  return function () {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Events
export function index(req, res) {
  return Event.find()
    .populate('eventType performer location website')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getEventByDatesRangeAndType(req, res) {
  let dateFrom = moment.unix(req.params.dateFrom / 1000).toDate();
  let type = req.params.eventType;
  let dateTo = moment.unix(req.params.dateTo / 1000).toDate();
  let query = {"startDate": {"$gte": dateFrom, "$lt": dateTo}};
  let limit = Number(req.params.limit);
  let skip = Number(req.params.skip);
  return Event.find(query)
    .limit(limit)
    .skip(skip)
    .populate('eventType performer location website')
    .exec(function (err, events) {
      Event.count(query).exec(function (err, count) {
        res.status(200).json({
          events: events,
          total: count
        });
        //respondWithResult()
      })
    })
    //.exec()
    //.then(respondWithResult(res))
    .catch(handleError(res));
}


// Gets a single Event from the DB
export function show(req, res) {
  console.log("show");
  return Event.findById(req.params.id)
    .populate('eventType')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Event in the DB
export function create(req, res) {
  return Event.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Event in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Event.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Event from the DB
export function destroy(req, res) {
  return Event.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Deletes all events
export function destroyAll(req, res) {
  Event.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
  //return Event.remove({}).exec()
  //  .then(respondWithResult("ok",200))
  //  .then(respondWithResult("ok",200))
  //  .catch(handleError(res));
}

//test function

export function test(req, res) {
  console.log("Start:")
  var request = require("request");
  var cheerio = require("cheerio");

  request({
    uri: "http://ionicabizau.net",
  }, function (error, response, body) {
    var $ = cheerio.load(body);
    console.log("Got Body");

    ///console.log($);

    var list = [];
    var index = 0

    console.log("Body:", body)
    console.log("Left:", $("a")[0])
    //$("a").each(function() {
    //  index++
    //  console.log($(".header h1").text());
    //
    //  //console.log(text + " -> " + href);
    //  res.status(200).json({"test":$(".header h1").text()});
    //});

  });

  //
}
