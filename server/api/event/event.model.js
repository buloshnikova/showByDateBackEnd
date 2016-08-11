'use strict';

import mongoose from 'mongoose';

var EventSchema = new mongoose.Schema({
  eventType: String,
  name: String,
  url: String,
  location: {
    locationType: String,
    address: {
      addressType: String,
      addressLocality: String,
      addressCountry: String,
      streetAddress: String,
      postalCode: String
    },
    locationName: String,
    locationUrl: String,
    geo: {
      geotype: String,
      latitude: Number,
      longitude: Number
    }
  },
  startDate: Date,
  performer: [
    {
      performerType: String,
      name: String,
      performerUrl: String
    }
  ],
  website: String, // TODO: create an object for websites holding website_name, website_url, website_rating, website_icon
  price: String,
  eventImage: String,
  active: Boolean
});

export default mongoose.model('Event', EventSchema);
