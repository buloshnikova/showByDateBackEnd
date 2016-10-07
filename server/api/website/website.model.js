'use strict';

import mongoose from 'mongoose';

var WebsiteSchema = new mongoose.Schema({
  name: String,
  websiteUrl: String,
  rating: Number,
  logoUrl: String,
  defaultImageUrl: String,
  active: Boolean
});

export default mongoose.model('Website', WebsiteSchema);
