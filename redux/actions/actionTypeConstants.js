//From what I've seen is that this allows for two main things:
// 1) Allow intellisense / variable detection in your text editor to pick up 
// 2) Name space your action types better

// Dan Abramov (the creator of redux)gives the following reasoning for using these constants 
// in this GH Issue: https://github.com/reduxjs/redux/issues/628#issuecomment-137547668
// 1) It helps keep the naming consistent because all action types are gathered in a single place.
// 2) Sometimes you want to see all existing actions before working on a new feature. 
//    It may be that the action you need was already added by somebody on the team, but 
//    you didn’t know.
// 3) The list of action types that were added, removed, and changed in a Pull Request helps 
//    everyone on the team keep track of scope and implementation of new features.
// 4) If you make a typo when importing an action constant, you will get undefined. 
//    This is much easier to notice than a typo when you wonder why nothing happens when 
//    the action is dispatched.

export const SETUP_GAME = 'SETUP_GAME';
export const TOGGLE_PAUSE_GAME = 'TOGGLE_PAUSE_GAME';
export const SET_HOVERED_SLOT = 'SET_XY';
export const SLOT_TILE = 'SLOT_TILE';
export const UNSLOT_TILE = 'UNSLOT_TILE';