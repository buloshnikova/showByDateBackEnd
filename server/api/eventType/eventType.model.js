'use strict';

import mongoose from 'mongoose';

var EventTypeSchema = new mongoose.Schema({
  eventTypeName: String,
  active: Boolean //include into the search
});

export default mongoose.model('EventType', EventTypeSchema);
