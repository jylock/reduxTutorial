import expect, { createSpy, spyOn, isSpy } from 'expect';
import { createStore} from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import deepFreeze from 'deep-freeze';

// installed babel-preset-stage-3 to support object literal spread operator
// npm install --save-dev babel-preset-stage-3

// reducer
const todos = (state=[], action) => {
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
				if(todo.id != action.id){
					return todo;
				}

				return {
					...todo,
					completed: !todo.completed
				};
			});
		default:
			state;
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
		{
			id: 0,
			text: 'Learn Redux',
			completed: false
		},
		{
			id: 1,
			text: 'Go shopping',
			completed: false
		}
	];

	const action = {
		type: 'TOGGLE_TODO',
		id: 1
	};

	const stateAfter = [
		{
			id: 0,
			text: 'Learn Redux',
			completed: false
		},
		{
			id: 1,
			text: 'Go shopping',
			completed: true
		}
	];

	deepFreeze(stateBefore);
	deepFreeze(action);

	expect(
		todos(stateBefore, action)
	).toEqual(stateAfter);

};


testAddTodo();
testToggleTodo();
console.log('All tests passed.');
