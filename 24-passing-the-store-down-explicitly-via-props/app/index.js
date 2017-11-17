import expect, { createSpy, spyOn, isSpy } from 'expect';
import { createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import deepFreeze from 'deep-freeze';

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

// FilterLink container componet
// provides data and behavior
// delegates all rendering to Link Presentational componet
class FilterLink extends React.Component {
	componentDidMount() {
		const { store } = this.props;
		this.unsubscribe = store.subscribe(() =>
			this.forceUpdate()
		);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const props = this.props;
		const { store } = props;
		const state = store.getState();

		return (
			<Link
				active={
					props.filter ===
					state.visibilityFilter
				}
				onClick={() =>
					store.dispatch({
						type: 'SET_VISIBILITY_FILTER',
						filter: props.filter
					})
				}
			>
				{props.children}
			</Link>
		);
	}
}

// Presentational Containers
const Footer = ({ store }) => (
	<p>
		Show:
		{' '}
		<FilterLink
			filter='SHOW_ALL'
			store={store}
		>
			ALL
		</FilterLink>
		{' '}
		<FilterLink
			filter='SHOW_ACTIVE'
			store={store}
		>
			Active
		</FilterLink>
		{' '}
		<FilterLink
			filter='SHOW_COMPLETED'
			store={store}
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

let nextTodoId = 0;
const AddTodo = ({ store }) => {
	let input;

	return (
		<div>
			<input ref={node => {
				input = node;
			}} />
			<button onClick={() => {
				store.dispatch({
					type: 'ADD_TODO',
					id: nextTodoId++,
					text: input.value
				})
				input.value = '';
			}}>
				Add Todo
			</button>
		</div>
	);
};



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


class VisibleTodoList extends React.Component {
	componentDidMount() {
		// es6 destruction syntax
		const { store } = this.props;
		this.unsubscribe = store.subscribe(() =>
			this.forceUpdate()
		);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const props = this.props;
		const { store } = props;
		const state = store.getState();
		return (
			<TodoList
				todos={
					getVisibleTodos(
						state.todos,
						state.visibilityFilter
					)
				}
				onTodoClick={id =>
					store.dispatch({
						type: 'TOGGLE_TODO',
						id
					})
				}
			/>
		);
	}
}

const TodoApp = ({ store }) => (
	<div>
			<AddTodo store={store} />
			<VisibleTodoList store={store} />
			<Footer store={store} />
	</div>
);


ReactDOM.render(
	<TodoApp store={createStore(todoApp)} />,
	document.getElementById('root')
);