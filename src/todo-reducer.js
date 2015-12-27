import expect from 'expect';
import deepFreeze from 'deep-freeze';
// import React from 'react';
// import ReactDOM from 'react-dom';

const toggleTodo = (todo) => {
  // mutate so hard
  /* todo.completed = !todo.completed;
  return todo; */
  return Object.assign({}, todo, {
    completed: !todo.completed
  });
};

const testToggleTodo = () => {
  const todoBefore = {
    id: 0,
    text: 'Learn Redux',
    completed: false
  };
  const todoAfter = {
    id: 0,
    text: 'Learn Redux',
    completed: true
  };
  deepFreeze(todoBefore);
  expect(
    toggleTodo(todoBefore)
  ).toEqual(todoAfter);
};
testToggleTodo();
console.log('all tests pass');
