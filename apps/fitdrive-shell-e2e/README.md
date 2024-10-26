# FitDrive Shell E2E Tests

This repository contains end-to-end (E2E) tests for the FitDrive Shell project. In order to run these tests, you'll need to follow the steps outlined below. We use the `as-a` package to securely manage and inject credentials.

## Prerequisites

Before running the E2E tests, make sure you have the following prerequisites installed:

* [Node.js](https://nodejs.org/) (with npm)
* [Cypress](https://docs.cypress.io/guides/getting-started/installing-cypress.html)

## Setup

1. Install the `as-a` package as a development dependency by running the following command:

   ```cmd
   npm install as-a --save-dev
   ```
2. Create a file named `.as-a.ini` in your user's home directory under `.as-a` folder (e.g., `/Users/yourusername/.as-a/.as-a.ini` on macOS or `C:\Users\yourusername\.as-a\.as-a.ini` on Windows).
3. Inside the `.as-a.ini` file, paste the group of environment variables from `.as-a/.as-a.example.ini` as follows:

   ```cmd
   [DEV]
   ; group of environment variables for dev
   CYPRESS_username=
   CYPRESS_password=

   [PROD]
   ; group of environment variables for production
   CYPRESS_username=
   CYPRESS_password=
   ```
4. Replace the empty values for `CYPRESS_username` and `CYPRESS_password` with the actual credentials you'll use for testing.

## Running E2E Tests

To run the E2E tests with the injected credentials, use the following command:

```cmd
as-a [ENV] npm run [CMD]
```

example :

```cmd
 as-a DEV npm run ci-e2e-test
```

This command leverages `as-a` to inject the environment variables from the `.as-a.ini` file into the Cypress environment (`cypress.env.json`) before running the tests.

## Note

Make sure to keep your credentials secure and do not commit them to version control. The `.as-a.ini` file in your home directory should only contain placeholder values for `CYPRESS_username` and `CYPRESS_password`.
