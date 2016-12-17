// to call from the client:
// my-domain/job
//with parameters on server: my-domain/job:param1/:param2/:param3
//with parameters from client: my-domain/job/param1/param2/param3

'use strict';

var express = require('express');

//var controller = require('./songclick'); //name of the controller
var songclick = require('./songclick'); //name of the controller
var ticketsLondon = require('./tickets.london'); //name of the controller
var londonEventful = require('./london.eventful'); //name of the controller

var router = express.Router();

router.get('/sn', songclick.job); //function at songclick.js, date format 08/05/2016
router.get('/tl', ticketsLondon.job); //function at songclick.js, date format 08/05/2016
router.get('/le', londonEventful.job); //function at london.eventful, date format 08/05/2016

module.exports = router;
