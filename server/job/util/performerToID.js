/**
 * Created by Pavel.Kogan on 13/08/2016.
 */
import Performer from '../../api/performer/performer.model';
var async = require('async');
export function getID(list, cb) {
  let idsList = [];
  //console.log(list.length)
  async.eachSeries(list,
    function (item, next) {
      Performer.findOne({name: item.name})
        .then(function (res) {
          if (res!==null) {
            idsList.push(res._id);
            next();
          } else {
            Performer.create({
              type: item["@type"],
              name: item["name"],
              link: item["sameAs"],
              active: true
            })
              .then(function (res) {
                //console.log("Per Created arr: ", res[0].id);
                //console.log("Per Created: ", res.id);
                idsList.push(res._id);
                next();
              })
          }
        })
    },
    function (err) {
      //console.log(idsList)
      cb(null, idsList)
    }
  )
}


