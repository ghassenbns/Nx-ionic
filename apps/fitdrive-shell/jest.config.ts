/* eslint-disable */
export default {
  displayName: 'fitdrive-shell',
  coverageDirectory: '../../coverage/apps/fitdrive-shell',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*((\\.mjs$))|(dayjs/*))'],
  moduleNameMapper: {
    'ngx-daterangepicker-material': 'testing/ngx-daterangepicker-material-mock.js'
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
