"use strict"

// Import the dependencies
import _ from 'lodash';
import show_by_date_event from '../api/event/event.model';
import website from '../api/website/website.model';

const cheerio = require("cheerio"), req = require("tinyreq");
const songkickName = "Songkick";
var songkickID = "";
var async = require('async');
var locationToID = require('./util/locationToID');
var eventTypeToID = require('./util/eventTypeToID');
var performerToID = require('./util/performerToID');
var moment = require('moment');

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
    let $ = cheerio.load(body), pageData = [];
    var count = 0;
    $("#event-listings li[title]").each(function (i, elem) {
      let el = cheerio.load($(this).html());
      let obj = JSON.parse(el(".microformat script").text());
      obj=obj[0]
      obj.url = "https://www.songkick.com" + el(".thumb").attr("href");
      obj.eventImage = el('.thumb img').attr("src");
      pageData.push(obj);
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
  let dateFrom = encodeURI(moment().format('DD/MM/YYYY'));
  let dateTo = encodeURI(moment().add(6, 'months').format('DD/MM/YYYY'));
  if (req.dateFrom !== null){
    dateFrom = req.dateFrom;
  }
  if (req.dateTo !== null) {
    dateTo = req.dateTo;
  }
  scrape("https://www.songkick.com/metro_areas/24426-uk-london?utf8=true" //&filters[minDate]="+ dateFrom + "&filters[maxDate]="+ dateTo + "#date-filter-form"
, {
    //scrape("http://www.w3schools.com/", {
    // Get the website title (from the top header)
    title: "a.w3schools-logo"
    // ...and the description
    , description: ".listing li"
  }, (err, data) => {

  //check the db for a songlick website
  website.findOne({name: songkickName})
      .then(function(response){
        if (response !== null){
          songkickID = response._id;
          parceResult(data, res);
        } else {
          website.create({
              name: songkickName,
              websiteUrl: "https://www.songkick.com",
              rating: 5,
              logoUrl: "https://www.songkick.com",
              defaultImageUrl: "http://assets.sk-static.com/assets/default_images/huge_avatar/default-event-798b09a.png",
              active: true
          }).then(function(response){
            songkickID = response._id;
            parceResult(data, res);
          });
        }
      });
  });
}

function parceResult(arr, res) {
  //console.log("Arr: ",arr)
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
          outItem.website = songkickID;
          outItem.price = null;
          outItem.eventImage ="http:" + item.eventImage;
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

function checkWebsiteInDB(){

}
