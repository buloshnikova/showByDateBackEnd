'use strict';

import mongoose from 'mongoose';

var EventSchema = new mongoose.Schema({
  eventType: {type: mongoose.Schema.Types.ObjectId, ref: 'EventType'},
  name: String,
  url: String,
  location: {type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
  startDate: Date,
  performer: [{type: mongoose.Schema.Types.ObjectId, ref: 'Performer'}],
  website: {type: mongoose.Schema.Types.ObjectId, ref: 'Website'},
  price: String,
  eventImage: String,
  active: Boolean
});

export default mongoose.model('Event', EventSchema);
