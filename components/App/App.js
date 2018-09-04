import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import Layout from '../Layout/Layout';

// const store = createStore(
//   reducer,
//   //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //this is necessary for React Native Debugger
// );

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