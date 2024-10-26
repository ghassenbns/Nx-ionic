const nxPreset = require('@nrwl/jest/preset').default;

module.exports = {
  ...nxPreset,
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  resolver: '@nrwl/jest/plugins/resolver',
  transformIgnorePatterns: ['node_modules/(?!.*((\\.mjs$))|(dayjs/*))'],
  moduleNameMapper: {
    'ngx-daterangepicker-material': 'testing/ngx-daterangepicker-material-mock.js'
  },
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': 'jest-preset-angular',
  },
  coverageReporters: ['lcov', 'html', 'json-summary'],
  collectCoverage: true,
};
