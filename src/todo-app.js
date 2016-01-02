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

const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return (
      <span>{children}</span>
    );
  }
  return (
    <a href='#'
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}>
      {children}
    </a>
  );
};

class FilterLink extends Component {

  componentDidMount () {
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  render () {
    const props = this.props;
    const state = store.getState();

    return (
      <Link
        active={ props.filter === state.visibilityFilter }
        onClick={() => {
          store.dispatch({ type: 'SET_VISIBILITY_FILTER', filter: props.filter });
        }}>{props.children}</Link>
    );
  }
}

const Footer = () => {
  return (
    <p> Show: &nbsp;
      <FilterLink
        filter='SHOW_ALL'>All</FilterLink> &nbsp; | &nbsp;
      <FilterLink
        filter='SHOW_ACTIVE'>Active</FilterLink> &nbsp; | &nbsp;
      <FilterLink
        filter='SHOW_COMPLETED'>Completed</FilterLink>
    </p>
  );
};

const AddTodo = () => {
  let input;
  return (
    <div>
      <input ref={(node) => {
        input = node;
      }} />

      <button
        onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: input.value,
            id: nextTodoId++
          });
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

class VisibleTodoList extends Component {

  componentDidMount () {
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  render () {
    // const props = this.props;
    const state = store.getState();

    return (
      <TodoList
        todos={getVisibleTodos(state.todos, state.visibilityFilter)}
        onTodoClick={(id) => {
          store.dispatch({
            type: 'TOGGLE_TODO',
            id: id
          });
        }}/>
    );
  }
}

const TodoApp = () => {
  return (
    <div>

      <AddTodo />
      <VisibleTodoList />
      <Footer />

    </div>
  );
};

const render = () => {
  ReactDOM.render(
    <TodoApp />,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
