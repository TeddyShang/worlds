import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SimpleMenu from './Menu'
import './BaseIVueStyle.css'
import * as serviceWorker from './serviceWorker';
import CustomCesium from './CustomCesium';
import LogInScreen from './LogInScreen';
import Upload from './Upload';
import ProfilePictureUpload from './ProfilePictureUpload';

 var loggedIn = sessionStorage.getItem("logged_in");
 if (loggedIn) {
     ReactDOM.render(<SimpleMenu />, document.getElementById('root'));
     var customCesium = ReactDOM.render(<CustomCesium/>, document.getElementById('application'));
     customCesium.addListener();
 } else {
     ReactDOM.render(<LogInScreen/>, document.getElementById('root'));
}

/*
let booking;
fetch('http://localhost:8080/bookings/5e586b6cb69af82f68c9c6df')
    .then(res => res.json())
    .then((function(data){
        booking = data;
        console.log(booking);
        ReactDOM.render(<Upload creatorId = {"5e586a7ab69af82f68c9c6d6"} roomIndex = {0} bookingInformation = {booking}/>, document.getElementById("root"));

    }));

*/
/*
let userProfile;
fetch('http://localhost:8080/userprofiles/5e586a7ab69af82f68c9c6d5')
.then(res => res.json())
.then((function(data){
    userProfile = data;
    console.log(userProfile);
    ReactDOM.render(<ProfilePictureUpload/>, document.getElementById("root"));
}));
*/
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
