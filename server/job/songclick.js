"use strict"

// Import the dependencies
import _ from 'lodash';
var async = require('async');
import show_by_date_event from '../api/event/event.model';
const cheerio = require("cheerio"), req = require("tinyreq");
var locationToID = require('./util/locationToID');
var eventTypeToID = require('./util/eventTypeToID');
var performerToID = require('./util/performerToID');
var parsedJSON = require('./fakeData.json');
// Define the scrape function
function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}
function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}
function scrape(url, data, cb) {
  // 1. Create the request
  req(url, (err, body) => {
    if (err) {
      console.log("error:", err)
      return cb(err);
    }

    // 2. Parse the HTML
    let $ = cheerio.load(body)
      , pageData = []
      ;

    //3. Extract the data
    //Object.keys(data).forEach(k => {
    //  pageData[k] = $(data[k]).text();
    //});
    var count = 0;
    //var list=$(".listing li").contents();
    //$(".w3-navbar li").each(function(i, elem) {

    $("#event-listings li[title] .microformat script").each(function (i, elem) {
      //var title = $(this,".microformat script").html();
      //var date = $(this).attr('title');
      pageData.push(JSON.parse($(this).text()))

    });
    cb(null, pageData);
  });
}

// Extract some data from my website
function locationCB(data) {

  respondWithResult(data, 200);
}
export function getHtmlPage(req, res) {
//console.log(parsedJSON);
  console.log(req.dateFrom, req.dateTo);
  scrape("https://www.songkick.com/metro_areas/24426-uk-london?utf8=true&filters[minDate]="
    + req.dateFrom + "&filters[maxDate]="
    + req.dateTo + "#date-filter-form", {
    //scrape("http://www.w3schools.com/", {
    // Get the website title (from the top header)
    title: "a.w3schools-logo"
    // ...and the description
    , description: ".listing li"
  }, (err, data) => {
    console.log("pre Output", err || data);
    parceResult(data, res);
    //return res.status(200).json({data: data});
  });
 // parceResult(parsedJSON, res);
}

function parceResult(arr, res) {
  let locations = [];
  let eventsTypes = [];

  for (var i in arr) {
    //console.log("Log: ", i);
    locations.push(arr[i][0]["location"]);
    //locations.push(arr[i][0]["location"]);
  }
  let traceOutput = function (data) {
    var out = [];
    for (var i  in arr) {
      out.push({
        name: arr[i][0]['name'],
        url: arr[i][1]['url'],
        location: data[i]
      })
    }
    return res.status(200).json(out);
  }
  let cb = function (data) {
    console.log(data);
    traceOutput(data);
    //return res.status(200).json(data);
  }
  // let loc = LocationToID.locationToID(locations, cb);
  let out = [];
  let index = 0;
  async.eachSeries(arr,
    function (item, next) {

      item = item[0];
      let outItem = {};
      async.waterfall([
        function (callback) {
          callback(null, 'one', 'two');
        },
      ], function (err, result) {
        // result now equals 'done'
      });
      async.waterfall([
        function (callback) {
          show_by_date_event.findOne({name: item.name})
            .then(function (responce) {
              console.log("Event from db: ", responce);
              if (responce !== null) {
                callback(true);
              } else {
                callback(null);
              }
            });
        },
        function (callback) {
          console.log("not exist");
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
          outItem.website = null;
          outItem.price = null;
          outItem.eventImage = null;
          outItem.active = true;
          console.log("Create: ", outItem.name);
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
      return res.status(200).json(out)
    })

}
