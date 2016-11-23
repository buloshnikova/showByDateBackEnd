/**
 * Created by Pavel.Kogan on 13/08/2016.
 */
import Location from '../../api/location/location.model';
export function getID(location, cb) {
  Location.findOne({'name': location.name})
    .then(function (res) {
      if (res != null) {
        cb(null, res._id);
      } else {
        Location.create({
          "type": "Place",
          "address": {
            "type": "PostalAddress",
            "addressLocality": location.address ? location.address.addressLocality : "",
            "addressCountry": location.address ? location.address.addressCountry : "",
            "streetAddress": location.address ? location.address.streetAddress : "",
            "postalCode": location.address ? location.address.postalCode : ""
          },
          "name": location.name,
          "link": location.sameAs ? location.sameAs : "",
          "geo": {
            "type": "GeoCoordinates",
            "latitude": location.geo ? location.geo.latitude : 0,
            "longitude": location.geo ? location.geo.longitude : 0
          }

        })
          .then(function (res) {
            cb(null, res._id);
          })
      }
    })
}


