/**
 * Created by inna on 04/10/2016.
 */

const cheerio = require("cheerio"),
  req = require("tinyreq");

var args = process.argv.slice(2);
console.log('Hello ' + args.join(' ') + '!');
