import {SETUP_GAME, TOGGLE_PAUSE_GAME, SET_XY, SLOT_TILE} from '../actions/actionTypeConstants';
import { TILES } from '../../config';
import { shuffle } from '../../utils';

// NOTE ABOUT COMBINEREDUCERS
// If we wanted to keep parts of our store and their reducers separate, we could consider using 
// combineReducers. In this case, it doesn't seem necessary, but it could be worth thinking about
// in an application where certain "domains" of the app have separate concerns, almost like mini-stores
// with their own logic governing them.
// Read more:
// - https://github.com/reduxjs/redux/blob/master/docs/recipes/reducers/UsingCombineReducers.md

export const initialState = {
    x: null,
    y: null,
    tiles: [],
    shuffledTiles: [],
    playedTiles: [],
    gameStarted: false,
    gamePaused: false,
};

const rootReducer = (state = initialState, action) => {
    switch(action.type) {

        case SETUP_GAME:
            const setupObject = {
                currentX: null,
                currentY: null,
                playedTiles: [],
                gamePaused: false
            };
            setupObject.gameStarted = action.startGame;
            setupObject.tiles = state.tiles.length > 0 
                ? state.tiles 
                : [...Array(TILES)].map( (item, idx) => ( {label: idx + 1} ));
            setupObject.shuffledTiles = shuffle(setupObject.tiles.slice());
            return {...state, ...setupObject};

        case TOGGLE_PAUSE_GAME:
            return {...state, gamePaused: !state.gamePaused}

        case SET_XY:
            return {...state, x: action.x, y: action.y}

        case SLOT_TILE:
            if (state.playedTiles.includes(action.tileLabel)) {
                return state;
            } else {
                return {...state, playedTiles: [...state.playedTiles, action.tileLabel] }
            }

        default:
            return state;

    }
};

export default rootReducer;
  