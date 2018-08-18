# grid-game
Playing around with React Native and a basic game/activity engine for dragging objects into defined slots

## installation with Expo XDE
- clone the repo and run `npm install`
- download the Expo XDE: https://docs.expo.io/versions/latest/introduction/installation (requires signing up for an Expo account)
- open the XDE, and then use "Open existing project" and point to the cloned repo
- once the project is opened, click "Device" and then select the simulator on which to run the app

## run on physical device
- download the Expo app on your device
- sign into the app while running the project in Expo XDE; project should be available to install on your device
- NOTE: computer running Expo XDE and device running Expo app must be on the same wifi network

## game config
At the moment, many values that determine the game layout are in `config.js`. For example, update `const TILES = N` to change the number of tiles that get rendered.
