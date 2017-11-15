import expect, { createSpy, spyOn, isSpy } from 'expect';
import { createStore} from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import deepFreeze from 'deep-freeze';

// avoiding object mutations with Object.assign() and ...spread

const toggleTodo = (todo) => {
	// todo.completed = !todo.completed;
	// return todo;

	// Has to use stage 2 preset
	// return {
	// 	...todo,
	// 	completed: !todo.completed
	// };

	return Object.assign({}, todo, {
		completed: !todo.completed
	});
};




const toggleTodoTest = () => {
	const todoBefore = {
		id: 0,
		text: 'Learn Redux',
		completed: false
	};

	const todoAfter = {
		id: 0,
		text: 'Learn Redux',
		completed: true
	};

	deepFreeze(todoBefore);

	expect(
		toggleTodo(todoBefore)
	).toEqual(todoAfter);
}



toggleTodoTest();
console.log('All tests passed.');
