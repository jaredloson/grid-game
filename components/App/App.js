import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Layout from '../Layout/Layout';
import { TILES } from '../../config';
import { shuffle } from '../../utils';

const initialState = {
  showIntro: true,
  x: null,
  y: null,
  tiles: [],
  shuffledTiles: [],
  playedTiles: [],
  gameStarted: false
}

const reducer = (state = initialState, action) => {
  switch(action.type) {

    case 'SETUP_GAME':
      const gameObject = {
        showIntro: false,
        currentX: null,
        currentY: null,
        playedTiles: [],
        gameStarted: true
      };
      gameObject.tiles = state.tiles.length > 0 ? state.tiles : [...Array(TILES)].map( (item, idx) => ( {label: idx + 1} ));
      gameObject.shuffledTiles = shuffle(gameObject.tiles.slice());
      return {...state, ...gameObject};

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