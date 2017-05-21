import website from '../api/website/website.model';
let moment = require('moment-timezone');
const Client = require('node-rest-client').Client;
const client = new Client();
const webSiteName = "stubhub.com";
let saveToDB = require('./util/saveToDB');
let venues = new Map();
let events = [];
let webSiteID = "";
let websiteUrl = "https://www.stubhub.com/";
let collected = [];
const args = {
  headers: {
    'Authorization': 'Bearer d9814d83-4b0c-335b-8e0d-f0308d1514e9'
  }
};
let config = [
  {
    url: 'https://api.stubhub.com/search/catalog/events/v3?city=London&country=gb&q=Sport',
    eventType: 'SportEvent',
    performerType: 'SportPerformer'
  },
  {
    url: 'https://api.stubhub.com/search/catalog/events/v3?city=London&country=gb&q=Concert',
    eventType: 'MusicEvent',
    performerType: 'MusicPerformer'
  },
  {
    url: 'https://api.stubhub.com/search/catalog/events/v3?city=London&country=gb&q=Theater',
    eventType: 'TheaterEvent',
    performerType: 'TheaterPerformer'
  }
]

let currentConfigIndex = 0;
let start = 0;
let limit = 500;

export function job(req, res) {
  getWebSiteID();
  return res.status(200).json({message: "process started"})
}

function getWebSiteID(res) {
  website.findOne({name: webSiteName})
    .then(function (response) {
      if (response !== null) {
        webSiteID = response._id;
        //parceResult(data, res);
        getEvents();
      } else {
        website.create({
          name: webSiteName,
          websiteUrl: websiteUrl,
          rating: 5,
          logoUrl: "",
          defaultImageUrl: "",
          active: true
        }).then(function (response) {
          webSiteID = response._id;
          getEvents();
        });
      }
    });
}

function getEvents() {
console.log('getEvents: ' + '&start=' + start + '&rows=' + limit)
  let sufix = '&start=' + start + '&rows=' + limit;
  client.get(config[currentConfigIndex].url + sufix, args,
    function (data, response) {

      events = data.events.map(ev => {
        //let venue = venues.get(ev.VenueId);
        let eventName = ev.name;
        let venue = {
          "type": "Place",
          "address": {
            "type": "PostalAddress",
            "addressLocality": ev.venue.address1,
            "streetAddress": "London"
          },
          "name": ev.venue.name
        }

        let performers = [];
        if (ev.performers) {
          performers = ev.performers.map(performer => {
            return {
              '@type': config[currentConfigIndex].performerType,
              'name': performer.name
            }
          })
        } else {
          performers[0] = {
            '@type': config[currentConfigIndex].performerType,
            'name': ev.name
          };
        }

        let uri = ( config[currentConfigIndex].performerType == 'TheaterPerformer' && ev.groupings && ev.groupings.length > 1 && ev.groupings[1].webURI != null) ? ev.groupings[1].webURI : ev.webURI;
        return {
          '@type': config[currentConfigIndex].eventType,
          name: eventName,
          url: websiteUrl + uri,
          location: venue,
          startDate: moment.tz(ev.eventDateUTC, "Europe/London").format('x'), ///el('.event-meta strong').attr('content'),
          endDate: moment.tz(ev.eventDateUTC, "Europe/London").format('x'),
          performer: performers,
          price: '',
          eventImage: ev.imageUrl,
          active: false,
          website: webSiteID
        }
      });

      collected = collected.concat(events);
      if (collected.length < data.numFound) {
        start = collected.length;
        getEvents();
      } else {
        console.log('colected to save',collected.length);
        //goToNexCategory();
        if (config[currentConfigIndex].eventType != 'TheaterEvent') {
          saveToDB.save(collected, webSiteID, goToNexCategory())
        } else {
          let arrToSave = theaterReduse();
          saveToDB.save(arrToSave, webSiteID, goToNexCategory())
        }

      }

    });
}

function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function theaterReduse() {
  let temp = groupBy(collected, 'name');
  let ret = [];
  for (let i in temp) {
    console.log(i, ':', temp[i].length);
    let tempEvent = temp[i][0];
    tempEvent.endDate = temp[i][temp[i].length - 1].endDate;
    ret.push(tempEvent);
  }
  return ret

}
function goToNexCategory() {
  console.log("goToNexCategory");
  collected = [];
  start=0;
  currentConfigIndex += 1;
  if (currentConfigIndex < config.length) {
    getEvents();
  }
}


function endProcess() {
  currentConfigIndex = 0;
  console.log('End Process')
}
