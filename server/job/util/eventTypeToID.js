/**
 * Created by Pavel.Kogan on 14/08/2016.
 */
import EventType from '../../api/eventType/eventType.model';
var async = require('async');
export function getID(name, cb) {
  EventType.findOne({eventTypeName:name})
    .then(function(res){
      if(res!==null){
        cb(null,res._id)
        //return res;
      }else{
        EventType.create({
          eventTypeName: name,
          active: true
        }).then(function(res){
          cb(null,res._id);
          //return res;
        })
      }
    })
    .catch(function (err) {
      cb(err,null);
      return err;
    });
}
