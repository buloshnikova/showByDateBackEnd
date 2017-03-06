/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/favorites              ->  index
 * POST    /api/favorites              ->  create
 * GET     /api/favorites/:id          ->  show
 * PUT     /api/favorites/:id          ->  upsert
 * PATCH   /api/favorites/:id          ->  patch
 * DELETE  /api/favorites/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Favorite from './favorite.model';
import Event from '../event/event.model'
import Performer from '../performer/performer.model';
var async = require('async');

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if (entity) {
            res.status(statusCode).json(entity);
        }
    };
}

function patchUpdates(patches) {
    return function(entity) {
        try {
            jsonpatch.apply(entity, patches, /*validate*/ true);
        } catch (err) {
            return Promise.reject(err);
        }

        return entity.save();
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

// Gets a list of Favorites
export function index(req, res) {
    return Favorite.find().exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Favorite from the DB
export function show(req, res) {
    return Favorite.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Favorite in the DB
export function create(req, res) {
    let $favorite = {};
    //console.log(req.body)
    let events = [];
    return Favorite.create(req.body)

    .then(res => {
            Event.update({ name_lower: res._doc.name_lower }, { favorite: true });
            Performer.update({ name_lower: res._doc.name_lower }, { favorite: true });
            Performer.find({ name_lower: res._doc.name_lower })
                .then(list => {
                    list = list.map(item => item.id)
                    Event.update({ performer: { $in: list } }, { favorite: true })
                        .then(res => console.log(res));
                    let ev = Event.find({ performer: { $in: list } })
                        .then(res => console.log(res));
                    console.log('list', ev);
                });

            return res;
        })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Creates Multi  new Favorites in the DB
export function createMulti(req, res) {

    let newFavorites = req.body.map(item => { return { name: item, name_lower: item.toLowerCase() } });
    return Favorite.create(newFavorites)
        .then(res => {
            res.map(fr => {
                // debugger
                Event.update({ name_lower: fr._doc.name_lower }, { favorite: true });
                Performer.update({ name_lower: fr._doc.name_lower }, { favorite: true })
                    .then(ttt => console.log("Perf:", ttt));
                Performer.find({ name_lower: fr._doc.name_lower })
                    .then(list => {
                        list = list.map(item => item.id)
                        Event.update({ performer: { $in: list } }, { favorite: true })
                            .then(res => console.log(res));
                        let ev = Event.find({ performer: { $in: list } })
                            .then(res => console.log(res));
                        //console.log('list', ev);
                    });

            });
            return res;
        })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));

    //console.log(newFavorites);

    //return res.status(200).json(req.body);
}

// Upserts the given Favorite in the DB at the specified ID
export function upsert(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return Favorite.findOneAndUpdate(req.params.id, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()

    .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Favorite in the DB
export function patch(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return Favorite.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Favorite from the DB
export function destroy(req, res) {
    return Favorite.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}