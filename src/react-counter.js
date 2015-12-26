import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';

// import { createStore } from 'redux';// implement it ourselves

const createStore = (reducer) => {
  let state;
  let listeners = [];
  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };
  const subscribe = (listener) => {
    listeners.push(listener);
    // instead of an unsubscribe method, we can just return a function that removes this listener
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  // do a dummy dispatch() to initialize
  dispatch({});
  return {getState, dispatch, subscribe};
};

const counter = (state = 0, action = {type: ''}) => {
  switch (action.type) {
    case 'INCREMENT':
      console.log(state);
      return state + 1;
    case 'DECREMENT':
      console.log(state);
      return state - 1;
    default:
      return state;
  }
};

const Counter = ({ value, onIncrement, onDecrement }) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

const render = () => {
  // document.body.innerText = store.getState();
  ReactDOM.render(
    <Counter value={store.getState()}
             onIncrement={() => store.dispatch({type: 'INCREMENT'})}
             onDecrement={() => store.dispatch({type: 'DECREMENT'})} />,
    document.getElementById('root')
  );
};

const store = createStore(counter);
store.subscribe(render);
render();

expect(
  counter(0, {type: 'INCREMENT'})
).toEqual(1);

expect(
  counter(1, {type: 'INCREMENT'})
).toEqual(2);

expect(
  counter(2, {type: 'DECREMENT'})
).toEqual(1);

expect(
  counter(1, {type: 'DECREMENT'})
).toEqual(0);

expect(
  counter(1, {type: 'DECCREEMENTE'})
).toEqual(1);

expect(
  counter(undefined, {})
).toEqual(0);

console.log('tests passed');
