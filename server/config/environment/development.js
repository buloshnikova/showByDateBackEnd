'use strict';

// Development specific configuration
// ==================================
module.exports = {

    // MongoDB connection options
    mongo: {
        uri: 'mongodb://pashaweb:pashak666@ds015325.mlab.com:15325/showbydate'
            //uri: 'mongodb://127.0.0.1:27017/showbydate'
    },

    // Seed database on startup
    seedDB: true

};