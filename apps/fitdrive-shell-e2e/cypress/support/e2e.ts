// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

import { isMobile } from './utils';

beforeEach(() => {
    cy.intercept(
      {
        url: '**/concordia/api/**',
        middleware: true,
      },
      (req) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          // Set the Authorization header with the access token
          req.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        // Continue the request
        return req;
      },
    );

  // Throttle API responses for mobile testing to simulate real world condition
  if (isMobile()) {
    cy.intercept({ url: 'http://localhost:4300/**', middleware: true }, (req) => {
      req.on('response', (res) => {
        // Throttle the response to 1 Mbps to simulate a mobile 3G connection
        res.setThrottle(1000);
      });
    });
  }
});
