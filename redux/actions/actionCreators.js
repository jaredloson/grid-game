import {SETUP_GAME, TOGGLE_PAUSE_GAME, SET_HOVERED_SLOT, SLOT_TILE, UNSLOT_TILE} from './actionTypeConstants';

export function setupGame(startGame){
    return {
        type: SETUP_GAME,
        startGame
    };
}

export function setHoveredSlot(slotLabel){
    return {
        type: SET_HOVERED_SLOT,
        slotLabel
    };
}

export function slotTile(slotLabel, tileLabel){
    return {
        type: SLOT_TILE,
        slotLabel,
        tileLabel
    };
}

export function unSlotTile(slotLabel){
    return {
        type: UNSLOT_TILE,
        slotLabel
    };
}

export function togglePauseGame(){
    return {
        type: TOGGLE_PAUSE_GAME,
    };
}