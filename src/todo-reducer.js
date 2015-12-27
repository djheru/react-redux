import expect from 'expect';
import deepFreeze from 'deep-freeze';
// import React from 'react';
// import ReactDOM from 'react-dom';
const todos = (state = [], action = {type: ''}) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ];

    case 'TOGGLE_TODO':
      return state.map(todo => {
        return (todo.id === action.id)
          ? Object.assign({}, todo, {completed: !todo.completed}) : todo;
      });

    default:
      return state;
  }
};

const testAddTodo = () => {
  const stateBefore = [];
  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  };
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    }
  ];
  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
};

const testToggleTodo = () => {
  const stateBefore = [
    {id: 0, text: 'Learn Redux', completed: false},
    {id: 1, text: 'Go Shopping', completed: false}
  ];
  const stateAfter = [
    {id: 0, text: 'Learn Redux', completed: false},
    {id: 1, text: 'Go Shopping', completed: true}
  ];
  const action = {
    type: 'TOGGLE_TODO',
    id: 1
  };

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
};

testAddTodo();
testToggleTodo();
console.log('all tests pass');
