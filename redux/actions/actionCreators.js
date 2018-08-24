import {SETUP_GAME, TOGGLE_PAUSE_GAME, SET_XY, SLOT_TILE} from './actionTypeConstants';

//Tile Action creators. Used in Tile component
export function setTileXY(x, y){
    return {
        type: SET_XY,
        x,
        y,
    };
}

export function slotTile(tileLabel){
    return {
        type: SLOT_TILE,
        tileLabel
    };
}
