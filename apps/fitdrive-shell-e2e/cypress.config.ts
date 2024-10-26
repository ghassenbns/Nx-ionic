import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 't4ute5',
  includeShadowDom: true,
  retries: {
    runMode: 2,
  },
  e2e: {
    ...nxE2EPreset(__dirname),
    baseUrl: 'http://localhost:4300/',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder:'cypress/videos',
    experimentalRunAllSpecs: true,
    viewportHeight: 1000,
    viewportWidth: 1280,
  },
  env: {
    mobileViewportWidthBreakpoint: 992,
    coverage: false,
    codeCoverage: {
      url: 'http://localhost:4300/__coverage__',
      exclude: 'cypress/**/*.*',
    },

  },
});
