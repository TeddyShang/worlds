import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Menu from './Menu'
import * as serviceWorker from './serviceWorker';
import CustomCesium from './CustomCesium';

ReactDOM.render(<Menu />, document.getElementById('root'));
var customCesium = ReactDOM.render(<CustomCesium/>, document.getElementById('application'));
customCesium.addListener();




// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
