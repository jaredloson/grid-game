import {createStore} from 'redux';
import rootReducer from './reducers/index';

// Note: this is where we could think about integrating Redux Devtools or other middleware/enhancers
// For example, you react devtools for a browser might be loaded like so:
// const store = createStore(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// This middleware sounds like it could be pretty important for development, and some middleware
// exists specifically for RN. Check out:
// - https://github.com/zalmoxisus/remote-redux-devtools
// - https://github.com/jhen0409/remotedev-rn-debugger
// 

// - https://github.com/evgenyrodionov/redux-logger is simply for logging actions, etc.
const store = createStore(rootReducer);

//Hot module replacement for reducer updates (not just component updates)
if(module.hot){
    module.hot.accept('./reducers/', ()=>{
        const nextRootReducer = require('./reducers/index').default;
        store.replaceReducer(nextRootReducer);
    });
}

export default store;