import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { combineReducers, createStore } from 'redux';

const { Component } = React;

let nextTodoId = 0;

// action creators
const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    text: text,
    id: nextTodoId++
  };
};

const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter: filter
  };
};

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id: id
  };
};

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

const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};

const mapDispatchToLinKProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
  };
};

const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinKProps)(Link);

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

let AddTodo = ({ dispatch }) => {
  let input;

  return (
    <div>
      <input ref={(node) => {
        input = node;
      }} />

      <button
        onClick={() => {
          dispatch(addTodo(input.value));
          input.value = '';
        }}>Add Todo</button>
    </div>
  );
};
AddTodo = connect(// connect with no args will wrap the component and inject store.dispatch
  null, // no need to subscribe to the store
  null // no need to specify dispatch map, still injects dispatch
)(AddTodo);

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

const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};

const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id));
    }
  };
};

const VisibleTodoList = connect(mapStateToTodoListProps, mapDispatchToTodoListProps)(TodoList);

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
