"use strict"

// Import the dependencies
import _ from 'lodash';
import website from '../api/website/website.model';

const cheerio = require("cheerio"), req = require("tinyreq");
const webSiteName = "tickets.london";
var webSiteID = "";
var async = require('async');
var saveToDB = require('./util/saveToDB');
var moment = require('moment');
var page = 0;
var resp;
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
    var count = $("#event-listings li[title]").length;
    if (count > 0) {
      $("#event-listings li[title]").each(function (i, elem) {
        let el = cheerio.load($(this).html());
        let obj = JSON.parse(el(".microformat script").text());
        obj = obj[0]
        obj.url = "https://www.songkick.com" + el(".thumb").attr("href");
        obj.eventImage = el('.thumb img').attr("src");
        pageData.push(obj);
      });
      cb(null, pageData);
    } else {
      cb(true, "no more data");

    }


  });
}

// Extract some data from my website
function locationCB(data) {

  respondWithResult(data, 200);
}
function getWebSiteID(res) {
  website.findOne({name: webSiteName})
    .then(function (response) {
      if (response !== null) {
        webSiteID = response._id;
        //parceResult(data, res);
        getHtmlPage();
      } else {
        website.create({
          name: webSiteName,
          websiteUrl: "http://www.visitlondon.com",
          rating: 5,
          logoUrl: "https://pbs.twimg.com/profile_images/771414363307708416/MxAAQdjT.jpg",
          defaultImageUrl: "http://assets.sk-static.com/assets/default_images/huge_avatar/default-event-798b09a.png",
          active: true
        }).then(function (response) {
          webSiteID = response._id;
          getHtmlPage();
        });
      }
    });
}
export function job(req, res) {
  console.log("Started");
  page = 0;
  getWebSiteID();
  resp=res;
  return res.status(200).json({message: "process started"})
}

function getHtmlPage() {
  page++;
  console.log("Get Page:", page);
  scrape("http://tickets.london/search?browseorder=soonest&distance=0&availableonly=False&se=False&pageSize=30&c=3&c=156&pageIndex="+page
    , {
      //scrape("http://www.w3schools.com/", {
      // Get the website title (from the top header)
      title: "a.w3schools-logo"
      // ...and the description
      , description: ".listing li"
    }, (err, data) => {

      //check the db for a songlick website
      if (err) {
        //process.exit();
        console.log("End of process");
        return;
      } else {
       /// parceResult(data);
       // saveToDB.save(data, webSiteID, getHtmlPage);
      }
    });
}


function checkWebsiteInDB() {

}
