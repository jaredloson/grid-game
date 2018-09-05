import {SETUP_GAME, TOGGLE_PAUSE_GAME, SET_HOVERED_SLOT, SLOT_TILE, UNSLOT_TILE} from '../actions/actionTypeConstants';
import { TILES } from '../../config';
import { shuffle } from '../../utils';

// NOTE ABOUT COMBINEREDUCERS
// If we wanted to keep parts of our store and their reducers separate, we could consider using 
// combineReducers. In this case, it doesn't seem necessary, but it could be worth thinking about
// in an application where certain "domains" of the app have separate concerns, almost like mini-stores
// with their own logic governing them.
// Read more:
// - https://github.com/reduxjs/redux/blob/master/docs/recipes/reducers/UsingCombineReducers.md

//Note: if the initial state changes, make sure you update the appropriate test in index.test.js
const initialState = {
  tiles: [],
  shuffledTiles: [],
  gameStarted: false,
  gamePaused: false,
  slottedTiles: [],
  hoveredSlot: null
}

const rootReducer = (state = initialState, action) => {
  switch(action.type) {

    case SETUP_GAME:
      const setupObject = initialState;
      setupObject.gameStarted = action.startGame
      setupObject.tiles = [...Array(TILES)].map( (item, idx) => ( {label: idx + 1, child: null} ));
      setupObject.shuffledTiles = shuffle(setupObject.tiles.slice()).map( tile => tile.label );
      return {...state, ...setupObject};

    case TOGGLE_PAUSE_GAME:
      return {...state, gamePaused: !state.gamePaused}

    case SET_HOVERED_SLOT:
      console.log(action.slotLabel); 
      return {
        ...state,
        hoveredSlot: action.slotLabel
      }

    case SLOT_TILE:
      const shuffledIdx = state.shuffledTiles.indexOf(action.tileLabel);
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
        hoveredSlot: null
      }

    case UNSLOT_TILE:
      const slotIdx = state.slottedTiles.findIndex( node => node.slot === action.slotLabel );
      return {
        ...state,
        slottedTiles: [
          ...state.slottedTiles.slice(0, slotIdx),
          ...state.slottedTiles.slice(slotIdx + 1)
        ],
        hoveredSlot: null
      }

    default:
      return state;

  }
};

export default rootReducer;
  