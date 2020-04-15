
# worlds
## Description
* User interface for WorldsiVue, created using React
# Release Notes version 1.0:
## New Features:
* Edit addresses in pending booking(s)
* Payment with credit card (Paypal integration)
## Bug Fixes:
* No bug fixes
## Known Bugs:
* No known bugs
## Install Information:
### Prerequisites
* Optional: some type of IDE (VS Code, Intellij IDEA, etc.)
* Latest Version of npm (https://www.npmjs.com/get-npm) and/or 
* latest version of Yarn (https://classic.yarnpkg.com/en/docs/install/#mac-stable)
### Dependent Libraries
* Dependent libraries can be found in ‘package.json’ under ‘dependencies’
    * "@babel/runtime": "^7.8.3",
    * "@craco/craco": "^5.6.3",
    * "@material-ui/core": "^4.8.3",
    * "@testing-library/jest-dom": "^4.2.4",
    * "@testing-library/react": "^9.3.2",
    * "@testing-library/user-event": "^7.1.2",
    * "cesium": "^1.67.0",
    * "craco-cesium": "^1.2.0",
    * "react": "^16.12.0",
    * "react-accessible-accordion": "^3.0.1",
    * "react-bootstrap": "^1.0.0-beta.16",
    * "react-datepicker": "^2.11.0",
    * "react-dom": "^16.12.0",
    * "react-modal": "^3.11.1",
    * "react-paypal-express-checkout": "^1.0.5",
    * "react-popup": "^0.10.0",
    * "react-responsive-carousel": "^3.1.51",
    * "react-scripts": "3.3.0",
    * "reactjs-popup": "^1.5.0",
    * "reactstrap": "^8.3.2",
    * "resium": "^1.10.0"
## Download instructions
* Clone or download from this repository
## Build instructions
* From Terminal
  * Download CesiumJS by running:
  * npm install --save @craco/craco craco-cesium cesium resium or
  * yarn add @craco/craco craco-cesium cesium resium 
  * (https://github.com/darwin-education/craco-cesium) 
* Using Yarn
  * To install packages “yarn install” in the worlds folder
* Using NPM
  * To install packages “npm install” in the worlds folder

## Installation
* Place folder wherever
* React application launches on http://localhost:3000/
## Run instructions
* To run in terminal execute “yarn start” or “npm start” from the worlds folder
* NOTE: Database/server must be running before starting Worlds application for best results
* To exit the application (in same terminal as "npm/yarn start" was run):
  * MAC/iOS: In terminal, execute: ctrl-xc
  * Windows: In terminal, execute: ctrl-c
## Troubleshooting
* System does not recognise command ‘yarn’?
  * Try to reinstall ‘Yarn’ by executing “npm install -g yarn” in terminal/command prompt
  * On Windows ensure that yarn or npm is added to environmental variables
