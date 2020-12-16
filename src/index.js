import React from 'react';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { render } from 'react-snapshot';

render(
    <App/>,
    document.getElementById('root')
  );

// If you want app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
