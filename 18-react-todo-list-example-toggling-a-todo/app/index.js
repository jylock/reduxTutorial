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




const store = createStore(todoApp);

let nextTodoId = 0;
class TodoApp extends React.Component {
	render() {
		return (
			<div>
					<input ref={node => {
						this.input = node;
					}} />
					<button onClick={() => {
						store.dispatch({
							type: 'ADD_TODO',
							id: nextTodoId++,
							text: this.input.value
						});
						this.input.value = '';
					}}>
						Add Todo
					</button>
					<ul>
						{this.props.todos.map(todo =>
							<li key={todo.id}
								onClick={() => {
									store.dispatch({
										type: 'TOGGLE_TODO',
										id: todo.id
									});
								}}
								style={{
									textDecoration:
										todo.completed ?
											'line-through' :
											'none'
								}}
								>
								{todo.text}
							</li>
						)}
					</ul>
			</div>
		);
	}
};

const render = () => {
	ReactDOM.render(
		<TodoApp
			todos={store.getState().todos}
		/>,
		document.getElementById('root')
	);
};

store.subscribe(render);
render();
