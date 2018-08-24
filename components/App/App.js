import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Layout from '../Layout/Layout';
import { TILES } from '../../config';
import { shuffle } from '../../utils';

const initialState = {
  hoveredSlot: {slot: null, tile: null},
  tiles: [],
  shuffledTiles: [],
  gameStarted: false,
  gamePaused: false,
  slottedTiles: []
}

const reducer = (state = initialState, action) => {
  switch(action.type) {

    case 'SETUP_GAME':
      const setupObject = initialState;
      setupObject.gameStarted = action.startGame
      setupObject.tiles = [...Array(TILES)].map( (item, idx) => ( {label: idx + 1, child: null} ));
      setupObject.shuffledTiles = shuffle(setupObject.tiles.slice()).map( tile => tile.label );
      return {...state, ...setupObject};

    case 'TOGGLE_PAUSE_GAME':
      return {...state, gamePaused: !state.gamePaused}

    case 'SET_HOVERED_SLOT': 
      return {
        ...state,
        hoveredSlot: {slot: action.slotLabel, tile: action.tileLabel}
      }

    case 'TOGGLE_SLOT_TILE':
      const idx = state.slottedTiles.findIndex( node => node.slot === action.slotLabel );
      const shuffledIdx = state.shuffledTiles.indexOf(action.tileLabel);
      if (idx === -1) {
        return {
          ...state,
          slottedTiles: [
            ...state.slottedTiles,
            {slot: action.slotLabel, tile: action.tileLabel}
          ],
          shuffledTiles: [
            action.tileLabel,
            ...state.shuffledTiles.slice(0, shuffledIdx),
            ...state.shuffledTiles.slice(shuffledIdx + 1)
          ],
          hoveredSlot: {slot: null, tile: null}
        }
      } else {
        return {
          ...state,
          slottedTiles: [
            ...state.slottedTiles.slice(0, idx),
            ...state.slottedTiles.slice(idx + 1)
          ],
          hoveredSlot: {slot: null, tile: null}
        }
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