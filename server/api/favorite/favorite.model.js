'use strict';

import mongoose from 'mongoose';

var FavoriteSchema = new mongoose.Schema({
    name: String,
    name_lower: String,
    active: Boolean
});

export default mongoose.model('Favorite', FavoriteSchema);