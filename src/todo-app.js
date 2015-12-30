import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';

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
  children,
  onClick
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
        onClick(filter);
      }}>
      {children}
    </a>
  );
};

const Footer = ({
  visibilityFilter,
  onFilterClick
}) => {
  return (
    <p> Show: &nbsp;
      <FilterLink
        currentFilter={visibilityFilter}
        onClick={onFilterClick}
        filter='SHOW_ALL'>All</FilterLink> &nbsp; | &nbsp;
      <FilterLink
        currentFilter={visibilityFilter}
        onClick={onFilterClick}
        filter='SHOW_ACTIVE'>Active</FilterLink> &nbsp; | &nbsp;
      <FilterLink
        currentFilter={visibilityFilter}
        onClick={onFilterClick}
        filter='SHOW_COMPLETED'>Completed</FilterLink>
    </p>
  );
};

const AddTodo = ({onAddClick}) => {
  let input;
  return (
    <div>
      <input ref={(node) => {
        input = node;
      }} />

      <button onClick={() => {
        onAddClick(input.value);
        input.value = '';
      }}>Add Todo</button>
    </div>
  );
};

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li onClick={onClick}
      style={{textDecoration: completed ? 'line-through' : 'none'}}>
    {text}
  </li>
);

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map((todo) => {
      return (
        <Todo
          key={todo.id }
          completed={todo.completed}
          text={todo.text}
          onClick={() => onTodoClick(todo.id)} />
      );
    })}
  </ul>
);

const TodoApp = ({
    todos,
    visibilityFilter
  }) => {
  return (
    <div>

      <AddTodo
        onAddClick={(text) => {
          store.dispatch({
            type: 'ADD_TODO',
            text: text,
            id: nextTodoId++
          });
        }} />

      <TodoList
        todos={getVisibleTodos(todos, visibilityFilter)}
        onTodoClick={(id) => {
          store.dispatch({
            type: 'TOGGLE_TODO',
            id: id
          });
        }}/>

      <Footer
        onFilterClick={(filter) => {
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: filter
          });
        }}
        visibilityFilter={visibilityFilter} />

    </div>
  );
};

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
