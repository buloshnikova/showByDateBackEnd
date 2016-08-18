'use strict';

import mongoose from 'mongoose';

var PerformerSchema = new mongoose.Schema({
  type: String,
  name: String,
  link: String,
  active: Boolean
});

export default mongoose.model('Performer', PerformerSchema);
