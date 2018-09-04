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
const getSlottedTiles = state => state.slottedTiles;
const getTileLabel = (state, props) => props.label;


// //Memoized Selectors
export const getStartIndex = createSelector(
    [getShuffledTiles, getSlottedTiles, getTileLabel],
    (shuffledTiles, slottedTiles, tileLabel) => {
      const playableTiles = shuffledTiles.filter( label => {
      const idx = slottedTiles.findIndex( node => node.tile === label );
        return idx === -1;
      });
      return playableTiles.indexOf(tileLabel);
    }
);
  
export const getStartXY = createSelector(
    [getStartIndex],
    (idx) => {
        const x = ( -idx + (COLUMNS - 1) ) * WIDTH;
        const y = STAGEHEIGHT - HEIGHT;
        return {x, y};
    }
);

export const getIsSlottted = createSelector(
    [getSlottedTiles, getTileLabel],
    (slottedTiles, tileLabel)=>{
        return slottedTiles.findIndex( pair => pair.tile === tileLabel ) > -1
    }
);

export const getGameComplete = createSelector(
    [getSlottedTiles],
    (slottedTiles) => {
        return slottedTiles.filter( pair => pair.slot === pair.tile ).length === TILES
    }
)
