import { createSelector } from 'reselect';
import { STAGEWIDTH, STAGEHEIGHT, TILES, COLUMNS, WIDTH, HEIGHT } from '../../config';

// Learn more about reselect and selectors
// https://redux.js.org/recipes/computingderiveddata
// https://github.com/reduxjs/reselect

//createSelector takes two arguments:
// [inputSelectors]: an array of non-memoized input selectors (values or functions which return non-transformed data)
// resultFunction: a function which is fed the input selector values as arguments
//if createSelector has already encountered the given inputSelectors before, it returns the cached/
// memoized result of resultFunction

//TILE SELECTORS

// //NON memoized functions which will serve as input selectors
const getTiles = state => state.tiles;
const getShuffledTiles = state => state.shuffledTiles;
const getPlayedTiles = state => state.playedTiles;
const getTileLabel = (state, props) => props.label;

// //Memoized Selectors
export const getStartIndex = createSelector(
    [getShuffledTiles, getPlayedTiles, getTileLabel],
    (shuffledTiles, playedTiles, tileLabel) => {
        const playableTiles = shuffledTiles.filter( tile => !playedTiles.includes(tile.label) );
        return playableTiles.findIndex( tile => tile.label === tileLabel );
    }
);
  
export const getStartXY = createSelector(
    [getStartIndex],
    (idx) => {
        // const idx = startIndex;
        const x = ( -idx + (COLUMNS - 1) ) * WIDTH;
        const y = STAGEHEIGHT - HEIGHT;
        return {x, y};
    }
);
  
export const getTargetIndex = createSelector(
    [getTiles, getTileLabel],
    (tiles, tileLabel) => {
        return tiles.findIndex( tile => tile.label === tileLabel);
    }
);

export const getTargetXY = createSelector(
    [getTargetIndex],
    (idx) => {
        // const idx = getTargetIndex(state, props);
        const x = (idx % COLUMNS) * WIDTH;
        const y = Math.floor(idx / COLUMNS) * HEIGHT;
        return {x, y};
    }
);

export const getIsPlayed = createSelector(
    [getPlayedTiles, getTileLabel],
    (playedTiles, tileLabel)=>{
        return playedTiles.includes(tileLabel);
    }
);

export const getGameComplete = createSelector(
    [getPlayedTiles],
    (playedTiles) => {
        return playedTiles.length === TILES;
    }
)
