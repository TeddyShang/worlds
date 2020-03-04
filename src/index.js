import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SimpleMenu from './Menu'
import './BaseIVueStyle.css'
import * as serviceWorker from './serviceWorker';
import CustomCesium from './CustomCesium';
import LogInScreen from './LogInScreen';


var loggedIn = sessionStorage.getItem("logged_in");
if (loggedIn) {
    ReactDOM.render(<SimpleMenu />, document.getElementById('root'));
    var customCesium = ReactDOM.render(<CustomCesium/>, document.getElementById('application'));
    customCesium.addListener();
} else {
    ReactDOM.render(<LogInScreen/>, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
