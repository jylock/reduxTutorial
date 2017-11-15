// import expect, { createSpy, spyOn, isSpy } from 'expect';
import { createStore} from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

// reducer
const counter = (state = 0, action) => {
	switch (action.type) {
		case 'INCREMENT':
				return state + 1;
		case 'DECREMENT':
				return state - 1;
		default:
				return state;
	}
}


// a dumb component that does not contain bussiness logic
// only specifies how the current application state transforms into renderable
// output and how the callbacks, passed via props, are bound to the event handlers
// pure component
const Counter = ({
	value,
	onIncrement,
	onDecrement
}) => (
	<div>
		<h1>{value}</h1>
		<button onClick={onIncrement}>+</button>
		<button onClick={onDecrement}>-</button>
	</div>
);

const store = createStore(counter);


const render = () => {
	ReactDOM.render(
		< Counter
			value={store.getState()}
			onIncrement={() =>
				store.dispatch({
					type: 'INCREMENT'
				})
			}
			onDecrement={() =>
				store.dispatch({
					type: 'DECREMENT'
				})
			}
		/>,
		document.getElementById('root')
	);
};

store.subscribe(render);
render();
