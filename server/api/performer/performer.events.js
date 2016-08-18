/**
 * Performer model events
 */

'use strict';

import {EventEmitter} from 'events';
import Performer from './performer.model';
var PerformerEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PerformerEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Performer.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PerformerEvents.emit(event + ':' + doc._id, doc);
    PerformerEvents.emit(event, doc);
  };
}

export default PerformerEvents;
