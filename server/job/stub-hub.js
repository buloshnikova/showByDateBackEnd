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
const args = {
    headers: {
        'Authorization': 'Bearer d9814d83-4b0c-335b-8e0d-f0308d1514e9'
    }
};
let config = [
    { url: 'https://api.stubhub.com/search/catalog/events/v3?city=London&country=gb&start=0&rows=500&q=Sport', eventType: 'SportEvent', performerType: 'SportPerformer' },
    { url: 'https://api.stubhub.com/search/catalog/events/v3?city=London&country=gb&start=0&rows=500&q=Concert', eventType: 'MusicEvent', performerType: 'MusicPerformer' },
    { url: 'https://api.stubhub.com/search/catalog/events/v3?city=London&country=gb&start=0&rows=500&q=Theater', eventType: 'TheaterEvent', performerType: 'TheaterPerformer' }
]

let currentConfigIndex = 0;
let page = 0;
let limit = 500;

export function job(req, res) {
    getWebSiteID();
    return res.status(200).json({ message: "process started" })
}

function getWebSiteID(res) {
    website.findOne({ name: webSiteName })
        .then(function(response) {
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
                }).then(function(response) {
                    webSiteID = response._id;
                    getEvents();
                });
            }
        });
}

function getEvents() {
    debugger
    client.get(config[currentConfigIndex].url, args,
        function(data, response) {

            //console.log(data)
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


                return {
                    '@type': config[currentConfigIndex].eventType,
                    name: eventName,
                    url: websiteUrl + ev.webURI,
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
            // if (config[currentConfigIndex].eventType == 'TheaterEvent') {
            //     var myMap = new Map();
            //     for (let i = 0; i < events.length; i++) {
            //         let name = events[i].name;
            //         let tempFromMap = myMap.get(name);
            //         if (tempFromMap == null) {
            //             myMap.set(name, events[i])
            //         } else {
            //             tempFromMap.endDate = events[i].endDate;
            //             myMap.set(name, tempFromMap);

            //         }
            //     }
            //     events = []
            //     myMap.forEach(function(value, key) {
            //         events.push(value)
            //     });
            // }
            console.log(events)
                //saveToDB.save(events, webSiteID, endProcess);
            currentConfigIndex += 1;
            if (currentConfigIndex < config.length) {
                getEvents();
            }
        });
}


function endProcess() {
    currentConfigIndex = 0;
    console.log('End Process')
}