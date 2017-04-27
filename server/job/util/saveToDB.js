import show_by_date_event from '../../api/event/event.model';
import Favorite from '../../api/favorite/favorite.model'
var locationToID = require('./locationToID');
var eventTypeToID = require('./eventTypeToID');
var performerToID = require('./performerToID');
var async = require('async');
export function save(arr, websiteID, cb) {
    let out = [];
    async.eachSeries(arr,
        function(item, next) {
            let outItem = {};
            async.waterfall([
                function(callback) {
                    let tempName = item.name.toLowerCase();
                    let query = item['@type'] == 'TheaterEvent' ? { name_lower: tempName } : { name_lower: tempName, startDate: item.startDate, endDate: item.endDate }
                    show_by_date_event.findOne({ name_lower: tempName, startDate: item.startDate, endDate: item.endDate })
                        .then(function(response) {
                            if (response !== null) {
                                callback(true);
                            } else {
                                callback(null);
                            }
                        });
                },
                function(callback) {
                    let tempName = item.name.toLowerCase();
                    Favorite.findOne({ name_lower: tempName })
                        .then(function(res) {
                            if (res != null) {
                                outItem.favorite = true;
                            } else {
                                outItem.favorite = false;
                            }
                            callback(null);
                        });
                },
                function(callback) {
                    //console.log("not exist");
                    //get propretis ids
                    async.parallel({
                        eventTypeID: function(callback) {
                            eventTypeToID.getID(item['@type'], callback);
                        },
                        location: function(callback) {
                            locationToID.getID(item.location, callback);
                        },
                        performers: function(callback) {
                            performerToID.getID(item.performer, callback);
                        }
                    }, function(err, results) {
                        // results is now equals to: {one: 1, two: 2}
                        //console.log("results", results);
                        outItem.eventType = results.eventTypeID;
                        if (results.performers.hasFavorites) {
                            outItem.favorite = true;
                        }
                        outItem.location = results.location;
                        outItem.performer = results.performers.idsList;
                        out.push(outItem);
                        callback(null)
                    });
                    // arg1 now equals 'one' and arg2 now equals 'two'
                    //callback(null, 'three');
                },
                function(callback) {

                    outItem.name = item.name;
                    outItem.name_lower = item.name.toLowerCase();
                    outItem.url = item.url;
                    outItem.startDate = item.startDate;
                    outItem.endDate = item.endDate;
                    outItem.website = websiteID;
                    outItem.price = null;
                    outItem.eventImage = item.eventImage;
                    outItem.active = true;
                    console.log("Create: ", outItem.name);

                    show_by_date_event.create(outItem)
                        .then(function(res) {
                            callback(null, 'done');
                        }, function(err) {
                            console.log('error:', err);
                            callback(null, 'done');
                            // handle error here.
                        })
                        // arg1 now equals 'three')

                }
            ], function(err, result) {
                if (err) {
                    next();
                } else {
                    out.push(outItem);
                    next();
                }
            });
        },
        function(err) {
            // console.log(out);
            //return res.status(200).json(out)
            cb();
        })
}