import website from '../api/website/website.model';
let moment = require('moment-timezone');
const Client = require('node-rest-client').Client;
const client = new Client();
const webSiteName = "londontheatredirect.com";
let saveToDB = require('./util/saveToDB');
let venues = new Map();
let events = [];
let webSiteID = "";
const args = {
    headers: {
        'Api-Key': 'gtemuger8779r4thqth7ptab',
        'Content-Type': 'application/json'
    }
};

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
                getVenues();
            } else {
                website.create({
                    name: webSiteName,
                    websiteUrl: "https://www.londontheatredirect.com",
                    rating: 5,
                    logoUrl: "",
                    defaultImageUrl: "",
                    active: true
                }).then(function(response) {
                    webSiteID = response._id;
                    getVenues();
                });
            }
        });
}

function getVenues() {
    venues = new Map();
    client.get("https://api.londontheatredirect.com/rest/v2/Venues", args,
        function(data, response) {
            let venuesTemp = data.Venues.map(loc => {
                return {
                    "VenueId": loc.VenueId,
                    "type": "Place",
                    "address": {
                        "type": "PostalAddress",
                        "addressLocality": loc.City,
                        "streetAddress": loc.Address,
                        "postalCode": loc.Postcode
                    },
                    "name": loc.Name
                }
            });
            for (var i = 0; i < venuesTemp.length; i++) {
                venues.set(venuesTemp[i].VenueId, venuesTemp[i])
            }
            getEvents();
        });
}

function getEvents() {
    events = [];
    client.get("https://api.londontheatredirect.com/rest/v2/Events", args,
        function(data, response) {

            events = data.Events.map(ev => {
                let venue = venues.get(ev.VenueId);
                return {
                    '@type': 'TheaterEvent',
                    name: ev.Name,
                    url: ev.EventDetailUrl,
                    location: venue,
                    startDate: moment.tz(ev.StartDate, "Europe/London").format('x'), ///el('.event-meta strong').attr('content'),
                    endDate: moment.tz(ev.EndDate, "Europe/London").format('x'),
                    performer: [{
                        '@type': 'TheaterPerformer',
                        'name': ev.Name
                            //'sameAs': sitePrefix + el('h3 a').attr("href")
                    }],
                    price: '',
                    eventImage: ev.SmallImageUrl,
                    active: true,
                    website: webSiteID
                }
            });
            saveToDB.save(events, webSiteID, endProcess);

        });
}

function endProcess() {
    console.log('End Process')
}