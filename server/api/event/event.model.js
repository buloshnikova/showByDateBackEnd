'use strict';

import mongoose from 'mongoose';

var EventSchema = new mongoose.Schema({
  eventType: {type: mongoose.Schema.Types.ObjectId, ref: 'EventType'},
  name: String,
  url: String,
  location: {type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
  startDate: Date,
  performer: [{type: mongoose.Schema.Types.ObjectId, ref: 'Performer'}],
  website: String, // TODO: create an object for websites holding website_name, website_url, website_rating, website_icon
  price: String,
  eventImage: String,
  active: Boolean
});

export default mongoose.model('Event', EventSchema);
