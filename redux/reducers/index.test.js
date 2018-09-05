import reducer from "./index";
import * as actionTypes from "../actions/actionTypeConstants";
import { TILES } from "../../config";

//This is used below as the expected initial state for the store
const mockInitState = {
  tiles: [],
  shuffledTiles: [],
  gameStarted: false,
  gamePaused: false,
  slottedTiles: [],
  hoveredSlot: null
};

//This is used below as an example post SETUP_GAME state.
const mockSetupState = {
  tiles: [
    { label: 1, child: null },
    { label: 2, child: null },
    { label: 3, child: null },
    { label: 4, child: null },
    { label: 5, child: null },
    { label: 6, child: null }
  ],
  shuffledTiles: [5, 3, 1, 6, 2, 4],
  gameStarted: undefined,
  gamePaused: false,
  slottedTiles: [],
  hoveredSlot: null
};

//Borrowing heavily from https://medium.com/@netxm/testing-redux-reducers-with-jest-6653abbfe3e1
//and the docs https://redux.js.org/recipes/writingtests#reducers
describe("reducer", () => {
  it("should return an initial state", () => {
    //See above for the mockInitState values. If these change in the reducer, the test should be updated
    expect(reducer(undefined, {})).toEqual(mockInitState);
  });

  it("should handle SETUP_GAME", () => {
    //General case
    //Set up the action
    let action = {
      type: actionTypes.SETUP_GAME
    };
    //get the state
    let state = reducer(undefined, action);
    //check the values of the state after setup
    expect(state.tiles.length).toBe(TILES);
    expect(state.shuffledTiles.length).toBe(TILES);
    expect(state.slottedTiles.length).toBe(0);
    expect(state.slottedTiles.gamePaused).toBe(false);
    expect(state.slottedTiles.hoveredSlot).toBe(false);
    expect(state.startGame).toBe(false);

    //startGame param true
    //set up action and get state
    action = {
      type: actionTypes.SETUP_GAME,
      startGame: true
    };
    state = reducer(undefined, action);
    expect(state.startGame).toBe(true);

    //startGame param false
    //set up action and get state
    action = {
      type: actionTypes.SETUP_GAME,
      startGame: false
    };
    state = reducer(undefined, action);
    expect(state.startGame).toBe(false);
  });

  it("should handle TOGGLE_PAUSE_GAME", () => {
    //Toggling true to false
    //setting initial state with gamePaused set to true
    let initialState = { ...mockSetupState, gamePaused: true };
    //toggle pause and get state
    let action = {
      type: actionTypes.TOGGLE_PAUSE_GAME
    };
    let state = reducer(initialState, action);
    //Expect state to have been toggled, with no side effects
    expect(state).toEqual({
      ...initialState,
      gamePaused: false
    });

    //Toggling false to true
    //setting initial state with gamePaused set to false
    initialState = { ...mockSetupState, gamePaused: false };
    //toggle pause and get state
    action = {
      type: actionTypes.TOGGLE_PAUSE_GAME
    };
    state = reducer(initialState, action);
    //Expect state to have been toggled, with no side effects
    expect(state).toEqual({
      ...initialState,
      gamePaused: true
    });
  });

  it("should handle SET_HOVERED_SLOT", () => {
    //set up the initial state (post setup)
    let initialState = { ...mockSetupState };
    //test various values
    let testVals = [1, 2, 3, 5, 6, "20", "test", false];
    testVals.forEach(val => {
      //set up action and get state
      let action = {
        type: actionTypes.SET_HOVERED_SLOT,
        slotLabel: val
      };
      let state = reducer(initialState, action);
      //Expect the hoveredSlot to have been toggled with no side effects
      expect(state).toEqual({
        ...initialState,
        hoveredSlot: val
      });
    });
  });

  it("should handle SLOT_TILE", () => {
    //Default, working example
    //set up the initial state (post setup)
    //We're giving a hoveredSlot so that we can check whether it gets reset
    let initialState = { ...mockSetupState, hoveredSlot: 5 };
    //set up the action and get state
    let action = {
      type: actionTypes.SLOT_TILE,
      slotLabel: 6,
      tileLabel: 2
    };
    let state = reducer(initialState, action);
    //the newly slotted tile should be added to the end of the slottedTiles list
    expect(state.slottedTiles.length).toBe(
      initialState.slottedTiles.length + 1
    );
    expect(state.slottedTiles[state.slottedTiles.length - 1]).toEqual({
      slot: 6,
      tile: 2
    });
    //the shuffled tiles should put the new shuffled tile at the front of the array
    expect(state.shuffledTiles.length).toBe(initialState.shuffledTiles.length);
    expect(state.shuffledTiles[0]).toBe(2);
    //hoveredSlot should be set to null
    expect(state.hoveredSlot).toBe(null);

    //Running a second time
    //set up the action and get state
    action = {
      type: actionTypes.SLOT_TILE,
      slotLabel: 4,
      tileLabel: 3
    };
    let secondPassState = reducer(state, action);
    //the newly slotted tile should be added to the end of the slottedTiles list
    expect(secondPassState.slottedTiles.length).toBe(
      state.slottedTiles.length + 1
    );
    expect(
      secondPassState.slottedTiles[secondPassState.slottedTiles.length - 1]
    ).toEqual({
      slot: 4,
      tile: 3
    });
    //the shuffled tiles should put the new shuffled tile at the front of the array
    expect(secondPassState.shuffledTiles.length).toBe(
      state.shuffledTiles.length
    );
    expect(secondPassState.shuffledTiles[0]).toBe(3);
    //hoveredSlot should be set to null
    expect(secondPassState.hoveredSlot).toBe(null);

    //Example where a tile with the given tileLabel does not exist
    action = {
      type: actionTypes.SLOT_TILE,
      slotLabel: 4,
      tileLabel: 100
    };
    let failedState = reducer(initialState, action);
    //no change to the state
    expect(failedState).toEqual(initialState);
    //hoveredSlot should be set to null
    expect(failedState.hoveredSlot).toBe(null);
  });

  it("should handle UNSLOT_TILE", () => {
    //Default, working example
    //set up the initial state (post setup)
    //set hoveredSlot to 5 so we can null it out
    //set the slotted tiles so that we can unslot them
    let initialState = {
      ...mockSetupState,
      hoveredSlot: 5,
      slottedTiles: [
        {
          slot: 1,
          tile: 2
        },
        {
          slot: 4,
          tile: 4
        },
        {
          slot: 5,
          tile: 3
        }
      ]
    };
    //set up the action and get state
    let action = {
      type: actionTypes.UNSLOT_TILE,
      slotLabel: 5
    };
    let state = reducer(initialState, action);
    //Expect the tile to have been removed
    expect(state.slottedTiles.length).toBe(
      initialState.slottedTiles.length - 1
    );
    expect(state.slottedTiles.filter(val => val.slot === 5).length).toBe(
      initialState.slottedTiles.filter(val => val.slot === 5).length - 1
    );
    //hoveredSlot should be set to null
    expect(state.hoveredSlot).toBe(null);

    //Run a second time to be sure
    action = {
      type: actionTypes.UNSLOT_TILE,
      slotLabel: 1
    };
    secondPassState = reducer(state, action);
    //Expect the tile to have been removed
    expect(secondPassState.slottedTiles.length).toBe(
      state.slottedTiles.length - 1
    );
    expect(
      secondPassState.slottedTiles.filter(val => val.slot === 1).length
    ).toBe(state.slottedTiles.filter(val => val.slot === 1).length - 1);
    //hoveredSlot should be set to null
    expect(secondPassState.hoveredSlot).toBe(null);

    //Try to unslot a tile that does not exist
    action = {
      type: actionTypes.UNSLOT_TILE,
      slotLabel: 100
    };
    failedState = reducer(initialState, action);
    //Expect expect no difference besides the hoveredSlot being set to null
    expect(failedState).toEqual({
      ...initialState,
      hoveredSlot: null
    });
  });
});
