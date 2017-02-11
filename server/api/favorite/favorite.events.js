/**
 * Favorite model events
 */

'use strict';

import {EventEmitter} from 'events';
import Favorite from './favorite.model';
var FavoriteEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FavoriteEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Favorite.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    FavoriteEvents.emit(event + ':' + doc._id, doc);
    FavoriteEvents.emit(event, doc);
  };
}

export default FavoriteEvents;
