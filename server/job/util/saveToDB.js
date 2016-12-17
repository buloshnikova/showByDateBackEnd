/**
 * Created by Pavel.Kogan on 14/08/2016.
 */
import show_by_date_event from '../../api/event/event.model';
var locationToID = require('./locationToID');
var eventTypeToID = require('./eventTypeToID');
var performerToID = require('./performerToID');
var async = require('async');
export function save(arr, websiteID, cb) {
  let out = [];
  async.eachSeries(arr,
    function (item, next) {
      let outItem = {};
      async.waterfall([
        function (callback) {
          show_by_date_event.findOne({name: item.name})
            .then(function (response) {
              if (response !== null) {
                callback(true);
              } else {
                callback(null);
              }
            });
        },
        function (callback) {
          //console.log("not exist");
          //get propretis ids
          async.parallel({
              eventTypeID: function (callback) {
                eventTypeToID.getID(item['@type'], callback);
              },
              location: function (callback) {
                locationToID.getID(item.location, callback);
              },
              performers: function (callback) {
                performerToID.getID(item.performer, callback);
              }
            }
            , function (err, results) {
              // results is now equals to: {one: 1, two: 2}
              //console.log("results", results);
              outItem.eventType = results.eventTypeID;
              outItem.location = results.location;
              outItem.performer = results.performers;
              out.push(outItem);
              callback(null)
            });
          // arg1 now equals 'one' and arg2 now equals 'two'
          //callback(null, 'three');
        },
        function (callback) {

          outItem.name = item.name;
          outItem.url = item.url;
          outItem.startDate = item.startDate;
          outItem.website = websiteID;
          outItem.price = null;
          outItem.eventImage = item.eventImage;
          outItem.active = true;
         // console.log("Create: ", outItem.name);

          show_by_date_event.create(outItem)
            .then(function (res) {
              callback(null, 'done');
            })
          // arg1 now equals 'three')

        }
      ], function (err, result) {
        if (err) {
          next();
        } else {
          out.push(outItem);
          next();
        }
      });
    },
    function (err) {
      // console.log(out);
      //return res.status(200).json(out)
      cb();
    })
}
