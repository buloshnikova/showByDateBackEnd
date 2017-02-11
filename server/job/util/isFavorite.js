import Favorite from '../../api/favorite/favorite.model'
var async = require('async');

export function getFavorite(name, cb) {
    let isFavorite = false;
    Favorite.findOne({ name_lower: name })
        .then(function(res) {
            if (res != null) {
                callback(true);
            } else {
                callback(false);
            }
        });
}