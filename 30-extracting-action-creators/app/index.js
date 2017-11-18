import expect, { createSpy, spyOn, isSpy } from 'expect';
import { createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import deepFreeze from 'deep-freeze';
import PropTypes from 'prop-types';
// named export
import { Provider, connect } from 'react-redux';

// installed babel-preset-stage-3 to support object literal spread operator
// npm install --save-dev babel-preset-stage-3


const todo = (state, action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return {
				id: action.id,
				text: action.text,
				completed: false
			};
		case 'TOGGLE_TODO':
			if(state.id != action.id){
				return state;
			}

			return {
				...state,
				completed: !state.completed
			};
		default:
			return state;
	}
};


// composer reducer
const todos = (state=[], action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return [
				...state,
				todo(undefined, action)
			];

		case 'TOGGLE_TODO':
			return state.map(t => todo(t, action));
		default:
			return state;
	}
};

// reducer
const visibilityFilter = (
	state = 'SHOW_ALL',
	action
) => {
	switch (action.type) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default:
			return state;
	}
};


// Using combineReducers() API
const todoApp = combineReducers({
	todos: todos,
	visibilityFilter: visibilityFilter

	// ES6 object literal shorthand notation
	// todos,
	// visibilityFilter
});



// Action creators
let nextTodoId = 0;
const addTodo = (text) => {
	return {
		type: 'ADD_TODO',
		id: nextTodoId++,
		text
	};
};

const toggleTodo = (id) => {
	return {
		type: 'TOGGLE_TODO',
		id
	};
};

const setVisibilityFilter = (filter) => {
	return {
		type: 'SET_VISIBILITY_FILTER',
		filter
	};
};




// Link Presentational Component
// only specifies the appeareance of the link
const Link = ({
	active,
	children,
	onClick
}) => {
	if(active) {
		return <span>{children}</span>;
	}

	return (
		<a href='#'
			onClick={e => {
				e.preventDefault();
				onClick();
			}}
		>
			{children}
		</a>
	);
};



const mapStateToLinkProps = (
	state,
	ownProps
) => {
	return {
		active:
			ownProps.filter ===
			state.visibilityFilter
	};
};
const mapDispatchToLinkProps = (
	dispatch,
	ownProps
) => {
	return {
		onClick: () => {
			dispatch(setVisibilityFilter(ownProps.filter));
		}
	};
};
const FilterLink = connect(
	mapStateToLinkProps,
	mapDispatchToLinkProps
)(Link);

// Presentational Containers
const Footer = () => (
	<p>
		Show:
		{' '}
		<FilterLink
			filter='SHOW_ALL'
		>
			ALL
		</FilterLink>
		{' '}
		<FilterLink
			filter='SHOW_ACTIVE'
		>
			Active
		</FilterLink>
		{' '}
		<FilterLink
			filter='SHOW_COMPLETED'
		>
			Completed
		</FilterLink>
	</p>
);


const Todo = ({
	onClick,
	completed,
	text
}) => (
	<li
		onClick={onClick}
		style={{
			textDecoration:
				completed ?
					'line-through' :
					'none'
		}}
	>
		{text}
	</li>
);

const TodoList = ({
	todos,
	onTodoClick
}) => (
	<ul>
		{todos.map(todo =>
			<Todo
				key={todo.id}
				{...todo}
				onClick={() => onTodoClick(todo.id)}
			/>
		)}
	</ul>
);


// destruction 2nd argument
let AddTodo = ({ dispatch }) => {
	let input;

	return (
		<div>
			<input ref={node => {
				input = node;
			}} />
			<button onClick={() => {
				dispatch(addTodo(input.value));
				input.value = '';
			}}>
				Add Todo
			</button>
		</div>
	);
};
// AddTodo = connect(
// 	state => {
// 		return {};
// 	},
// 	dispatch => {
// 		return { dispatch };
// 	}
// )(AddTodo);
AddTodo = connect()(AddTodo);


const getVisibleTodos = (
	todos,
	filter
) => {
	switch (filter) {
		case 'SHOW_ALL':
			return todos
		case 'SHOW_COMPLETED':
			return todos.filter(
				t => t.completed
			);
		case 'SHOW_ACTIVE':
			return todos.filter(
				t => !t.completed
			);
	}
};

// takes state from redux store and returns the props for the Presentational
// component
const mapStateToTodoListProps = (
	state
) => {
	return {
		todos: getVisibleTodos(
			state.todos,
			state.visibilityFilter
		)
	};
};
// takes store dispatch method and returns the callback props needed for the
// Presentational component
const mapDispatchToTodoListProps = (
	dispatch
) => {
	return {
		onTodoClick: (id) => {
			dispatch(toggleTodo(id));
		}
	};
};
const VisibleTodoList = connect(
	mapStateToTodoListProps,
	mapDispatchToTodoListProps
)(TodoList);



const TodoApp = () => (
	<div>
			<AddTodo />
			<VisibleTodoList />
			<Footer />
	</div>
);

ReactDOM.render(
	<Provider store={createStore(todoApp)}>
		<TodoApp  />
	</Provider>,
	document.getElementById('root')
);
