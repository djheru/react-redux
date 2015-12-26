import expect from 'expect';

import { createStore } from 'redux';

const counter = (state = 0, action = {type: ''}) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

const render = () => {
  document.body.innerText = store.getState();
};

const store = createStore(counter);
store.subscribe(render);
render();

document.addEventListener('click', () => {
  store.dispatch({type: 'INCREMENT'});
});
console.log(store.getState());

expect(
  counter(0, { type: 'INCREMENT' })
).toEqual(1);

expect(
  counter(1, { type: 'INCREMENT' })
).toEqual(2);

expect(
  counter(2, { type: 'DECREMENT' })
).toEqual(1);

expect(
  counter(1, { type: 'DECREMENT' })
).toEqual(0);

expect(
  counter(1, { type: 'DECCREEMENTE' })
).toEqual(1);

expect(
  counter(undefined, {})
).toEqual(0);

console.log('tests passed');
