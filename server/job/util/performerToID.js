/**
 * Created by Pavel.Kogan on 13/08/2016.
 */
import Performer from '../../api/performer/performer.model';
import Favorite from '../../api/favorite/favorite.model'
var async = require('async');
export function getID(list, cb) {
    let idsList = [];
    let hasFavorites = false;
    //console.log(list.length)
    async.eachSeries(list,
        function(item, next) {
            Performer.findOne({ name: item.name })
                .then(function(res) {
                    if (res !== null) {
                        idsList.push(res._id);
                        if (res.favorite) {
                            hasFavorites = true;
                        }
                        next();
                    } else {
                        async.waterfall([function(callback) {
                                    let tempName = item.name.toLowerCase();
                                    Favorite.findOne({ name_lower: tempName })
                                        .then(function(res) {
                                            if (res != null) {
                                                item.favorite = true;
                                                hasFavorites = true;
                                            } else {
                                                item.favorite = false;
                                            }
                                            callback(null);
                                        });
                                },
                                function(callback) {
                                    Performer.create({
                                            type: item["@type"],
                                            name: item["name"],
                                            name_lower: item["name"].toLowerCase(),
                                            link: item["sameAs"],
                                            favorite: item.favorite,
                                            active: true
                                        })
                                        .then(function(res) {
                                            //console.log("Per Created arr: ", res[0].id);
                                            //console.log("Per Created: ", res.id);
                                            idsList.push(res._id);
                                            callback(null);
                                        })
                                }
                            ],
                            function(err, result) {
                                next();
                            })



                    }
                })
        },
        function(err) {
            //console.log(idsList)
            cb(null, { idsList: idsList, hasFavorites: hasFavorites })
        }
    )
}