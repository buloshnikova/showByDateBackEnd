'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://pashaweb:pashak666@ds011389.mlab.com:11389/showbydate_test'
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'test.sqlite',
      define: {
        timestamps: false
      }
    }
  }
};
