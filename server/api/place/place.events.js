/**
 * Place model events
 */

'use strict';

import {EventEmitter} from 'events';
import Place from './place.model';
var PlaceEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PlaceEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Place.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PlaceEvents.emit(event + ':' + doc._id, doc);
    PlaceEvents.emit(event, doc);
  };
}

export default PlaceEvents;
