'use strict';

import mongoose from 'mongoose';
var addressSchema = new mongoose.Schema({

  "type": String,
  "addressLocality": String,
  "addressCountry": String,
  "streetAddress": String,
  "postalCode": String

});
var geo=new mongoose.Schema({

  "type": String,
  "latitude": Number,
  "longitude": Number
})
var PlaceSchema = new mongoose.Schema(
  {
    "type": String,
    "address": addressSchema,
    "name": String,
    "link": String,
    "geo": geo
  }
);

export default mongoose.model('Place', PlaceSchema);
