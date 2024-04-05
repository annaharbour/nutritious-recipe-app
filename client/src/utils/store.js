// import { createStore, applyMiddleware } from 'redux'
import {configureStore} from '@reduxjs/toolkit'
// import { composeWithDevTools } from 'redux-devtools-extension';
// import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import setAuthToken from './setAuthToken';

const initialState = {};

// CHANGE TO REDUX TOOLKIT
// const middleWare = [thunk];
// const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleWare)));
const store = configureStore({reducer: rootReducer, preLoadedState: initialState});

let currentState = store.getState();

store.subscribe(() => {
  // keep track of the previous and current state to compare changes
  let previousState = currentState;
  currentState = store.getState();
  // if the token changes set the value in localStorage and axios headers
  if (previousState.auth.token !== currentState.auth.token) {
    const token = currentState.auth.token;
    setAuthToken(token);
  }
});

export default store;
