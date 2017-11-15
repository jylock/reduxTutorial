import expect, { createSpy, spyOn, isSpy } from 'expect';
import { createStore} from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import deepFreeze from 'deep-freeze';


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

testAddTodo();
console.log('All tests passed.');
