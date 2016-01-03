import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
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
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  render () {
    const props = this.props;
    const { store } = this.context;
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
FilterLink.contextTypes = {
  store: React.PropTypes.object
};

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

const AddTodo = (props, { store }) => {
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
AddTodo.contextTypes = {
  store: React.PropTypes.object
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

const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch({
        type: 'TOGGLE_TODO',
        id: id
      });
    }
  };
};

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);
/*
class VisibleTodoList extends Component {

  componentDidMount () {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  render () {
    const { store } = this.context;
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
*/

VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
};

class Provider extends Component {

  // This method makes the store available to all the children
  getChildContext () {
    return { store: this.props.store };
  };

  render () {
    return this.props.children;
  }
}

Provider.propTypes = {
  store: React.PropTypes.object,
  children: React.PropTypes.object
};

// This declaration is necessary to make the context available for the children
Provider.childContextTypes = {
  store: React.PropTypes.object
};

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
    <Provider store={createStore(todoApp)}>
      <TodoApp />
    </Provider>,
    document.getElementById('root')
  );
};

render();
