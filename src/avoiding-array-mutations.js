import expect from 'expect';
import deepFreeze from 'deep-freeze';
// import React from 'react';
// import ReactDOM from 'react-dom';

const addCounter = (list) => {
  // list.push(0); // lolwtfgtfo mutation
  // return list;

  // return list.concat([0]); // make a new array like a big boy
  return [...list, 0]; // spread operator
};

const removeCounter = (list, index) => {
  // list.splice(index, 1);// Do you even functional, bro?
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ]; // so fansayyy
};

const incrementCounter = (list, index) => {
  // list[index]++; // omg you mutate so hard
  // return list;
  /* return list
    .slice(0, index)
    .concat([list[index] + 1])
    .concat(list.slice(index + 1)); */
  return [ // return a new array, not a mutated old array
    ...list.slice(0, index), // spread on the left
    list[index] + 1, // increment the item at the index
    ...list.slice(index + 1) // spread on the right
  ];
};

const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];
  deepFreeze(listBefore);
  expect(
    addCounter(listBefore)
  ).toEqual(listAfter);
};

const testRemoveCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 20];
  deepFreeze(listBefore);
  expect(
    removeCounter(listBefore, 1)
  ).toEqual(listAfter);
};

const testIncrementCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 11, 20];
  deepFreeze(listBefore);
  expect(
    incrementCounter(listBefore, 1)
  ).toEqual(listAfter);
};

testAddCounter();
testRemoveCounter();
testIncrementCounter();
console.log('All tests passed');
