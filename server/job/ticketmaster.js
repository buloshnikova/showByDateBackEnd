import website from '../api/website/website.model';
let moment = require('moment-timezone');
const Client = require('node-rest-client').Client;
const client = new Client();
const webSiteName = "ticketmaster.co.uk";
let saveToDB = require('./util/saveToDB');
let venues = new Map();
let events = [];
let webSiteID = "";
let websiteUrl = "http://www.ticketmaster.co.uk";
const args = {
    headers: {
        'Content-Type': 'application/json'
    }
};
let config = [
    { url: 'http://www.ticketmaster.co.uk/json/browse/sports?&dma_id=602', eventType: 'SportEvent', performerType: 'SportPerformer' },
    { url: 'http://www.ticketmaster.co.uk/json/browse/music?&dma_id=602', eventType: 'MusicEvent', performerType: 'MusicPerformer' },
    { url: 'http://www.ticketmaster.co.uk/json/browse/arts?&dma_id=602', eventType: 'TheaterEvent', performerType: 'TheaterPerformer' }
]
let currentConfigIndex = 0;

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
    client.get(config[currentConfigIndex].url, args,
        function(data, response) {
            events = data.response.docs.map(ev => {
                //let venue = venues.get(ev.VenueId);
                let eventName = ev.AttractionName[ev.AttractionName.length - 1];

                if (ev.AttractionName.length > 1) {
                    ev.AttractionName.pop();
                }
                let venue = {
                    "type": "Place",
                    "address": {
                        "type": "PostalAddress",
                        "addressLocality": ev.VenueAddress,
                        "streetAddress": "London"
                    },
                    "name": ev.VenueName
                }
                let performers = ev.AttractionName.map(attraction => {
                    return {
                        '@type': config[currentConfigIndex].performerType,
                        'name': attraction
                    }
                })
                return {
                    '@type': config[currentConfigIndex].eventType,
                    name: eventName,
                    url: websiteUrl + ev.VenueAttractionSeoLink,
                    location: venue,
                    startDate: moment.tz(ev.EventDate, "Europe/London").format('x'), ///el('.event-meta strong').attr('content'),
                    endDate: moment.tz(ev.EventDate, "Europe/London").format('x'),
                    performer: performers,
                    price: '',
                    eventImage: (ev.AttractionImage[0] && ev.AttractionImage[0]) ? 'http://media.ticketmaster.co.uk' + ev.AttractionImage[0] : '',
                    active: true,
                    website: webSiteID
                }
            });
            if (config[currentConfigIndex].eventType == 'TheaterEvent') {
                var myMap = new Map();
                for (let i = 0; i < events.length; i++) {
                    let name = events[i].name;
                    let tempFromMap = myMap.get(name);
                    if (tempFromMap == null) {
                        myMap.set(name, events[i])
                    } else {
                        tempFromMap.endDate = events[i].endDate;
                        myMap.set(name, tempFromMap);

                    }
                }
                events = []
                myMap.forEach(function(value, key) {
                    events.push(value)
                });
            }

            saveToDB.save(events, webSiteID, endProcess);
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