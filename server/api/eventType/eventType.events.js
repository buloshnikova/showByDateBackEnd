/**
 * EventType model events
 */

'use strict';

import {EventEmitter} from 'events';
import EventType from './eventType.model';
var EventTypeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
EventTypeEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  EventType.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    EventTypeEvents.emit(event + ':' + doc._id, doc);
    EventTypeEvents.emit(event, doc);
  }
}

export default EventTypeEvents;
