"use strict"

// Import the dependencies
import _ from 'lodash';
const cheerio = require("cheerio")
  , req = require("tinyreq")
  ;

// Define the scrape function
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

export function getHtmlPage(req, res) {
  console.log(req.dateFrom,req.dateTo);
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
    return res.status(200).send(data);
  });

}
