import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';

const { Component } = React;

let nextTodoId = 0;

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_ACTIVE':
      return todos.filter((todo) => {
        return !todo.completed;
      });
    case 'SHOW_COMPLETED':
      return todos.filter((todo) => {
        return todo.completed;
      });
    default:
      return todos;
  }
};

const todo = (state = {}, action = {type: ''}) => {
  switch (action.type) {
    case 'ADD_TODO':
      // working together with the todos reducer. Here create the object...
      return {
        id: action.id,
        text: action.text,
        completed: false
      };

    case 'TOGGLE_TODO':
      console.log('toggle todo state', state);
      if (state.id !== action.id) {
        return state;
      }
      let retVal = Object.assign({}, state, {completed: !state.completed});
      console.log('todo retval', retVal);
      return retVal;

    default:
      return state;
  }
};

const todos = (state = [], action = {type: ''}) => {
  switch (action.type) {
    case 'ADD_TODO':
      // and here append it to the array
      return [
        ...state,
        todo(undefined, action)
      ];

    case 'TOGGLE_TODO':
      console.log('toggle', state, action);
      return state.map((t) => todo(t, action));

    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action = {type: ''}) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const todoApp = combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter
});

const store = createStore(todoApp);

const FilterLink = ({
  filter,
  currentFilter,
  children
}) => {
  if (filter === currentFilter) {
    return (
      <span>{children}</span>
    );
  }
  return (
    <a href='#'
      onClick={(e) => {
        e.preventDefault();
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        });
      }}>
      {children}
    </a>
  );
};

class TodoApp extends Component {

  render () {
    const { todos, visibilityFilter } = this.props;
    const visibleTodos = getVisibleTodos(todos, visibilityFilter);

    return (
      <div>
        <input ref={(node) => {
          this.input = node;
        }} />
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          });
          this.input.value = '';
        }}>Add Todo</button>
        <ul>
          {visibleTodos.map((todo) => {
            console.log('todo', todo);
            return (
              <li key={todo.id}
                onClick={() => {
                  store.dispatch({
                    type: 'TOGGLE_TODO',
                    id: todo.id
                  });
                }}
                style={{textDecoration: todo.completed ? 'line-through' : 'none'}}>
                  {todo.text}
              </li>
            );
          })}
        </ul>
        <p> Show: &nbsp;
          <FilterLink currentFilter={visibilityFilter} filter='SHOW_ALL'>All</FilterLink> &nbsp; | &nbsp;
          <FilterLink currentFilter={visibilityFilter} filter='SHOW_ACTIVE'>Active</FilterLink> &nbsp; | &nbsp;
          <FilterLink currentFilter={visibilityFilter} filter='SHOW_COMPLETED'>Completed</FilterLink>
        </p>
      </div>
    );
  }
}

// for the linter
TodoApp.propTypes = {
  todos: React.PropTypes.array.isRequired,
  visibilityFilter: React.PropTypes.string
};

const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()} />,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
