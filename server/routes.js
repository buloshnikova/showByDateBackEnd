/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/websites', require('./api/website'));
  app.use('/api/performers', require('./api/performer'));
  app.use('/api/locations', require('./api/location'));
  app.use('/api/eventTypes', require('./api/eventType'));
  app.use('/api/events', require('./api/event'));
  app.use('/api/things', require('./api/thing'));
  app.use('/job', require('./job')); //folder job/index.js

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
