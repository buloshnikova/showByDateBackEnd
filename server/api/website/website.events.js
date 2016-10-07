/**
 * Website model events
 */

'use strict';

import {EventEmitter} from 'events';
import Website from './website.model';
var WebsiteEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
WebsiteEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Website.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    WebsiteEvents.emit(event + ':' + doc._id, doc);
    WebsiteEvents.emit(event, doc);
  }
}

export default WebsiteEvents;
