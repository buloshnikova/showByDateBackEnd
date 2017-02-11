'use strict';

import mongoose from 'mongoose';

var PerformerSchema = new mongoose.Schema({
    type: String,
    name: String,
    name_lower: String,
    favorite: Boolean,
    link: String,
    active: Boolean
});

export default mongoose.model('Performer', PerformerSchema);