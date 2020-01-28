import React from 'react';
import './BookingWindow.css';

export default function BookingScreen() {
    return(
<React.Fragment>
<script src="%PUBLIC_URL%/BookingScript.js"></script>
<body onload="createTable()">
    <div id="bookingDetail">
        <div class="bookingForm">
            <p>
                <li> Name: </li>
                <input type="text" id="username" />
                <li> Address: </li>
                <input type="text" id="address" />
            </p>
            <div id="roomList"></div>
            <p>
                <input type="button" id="addRow" value="Add Row" onclick="addRow()" />
                <input type="button" id="submit" value="Submit Data"/>
                <li> Date: </li>
                <input type="datetime" id="date" />
            </p>
        </div>
    </div>
</body>
</React.Fragment>
    );
}