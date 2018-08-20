import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Layout from '../Layout/Layout';
import { TILES } from '../../config';
import { shuffle } from '../../utils';

const initialState = {
  x: null,
  y: null,
  tiles: [],
  shuffledTiles: [],
  playedTiles: [],
  gameStarted: false,
  gamePaused: false
}

const reducer = (state = initialState, action) => {
  switch(action.type) {

    case 'SETUP_GAME':
      const setupObject = {
        currentX: null,
        currentY: null,
        playedTiles: [],
        gamePaused: false
      };
      setupObject.gameStarted = action.startGame
      setupObject.tiles = state.tiles.length > 0 ? state.tiles : [...Array(TILES)].map( (item, idx) => ( {label: idx + 1} ));
      setupObject.shuffledTiles = shuffle(setupObject.tiles.slice());
      return {...state, ...setupObject};

    case 'TOGGLE_PAUSE_GAME':
      return {...state, gamePaused: !state.gamePaused}

    case 'SET_XY':
      return {...state, x: action.x, y: action.y}

    case 'SLOT_TILE':
      if (state.playedTiles.includes(action.tileLabel)) {
        return state;
      } else {
        return {...state, playedTiles: [...state.playedTiles, action.tileLabel] }
      }

    default:
      return state;

  }
};

const store = createStore(reducer);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Layout />
      </Provider>
    );
  }
}

export default App;