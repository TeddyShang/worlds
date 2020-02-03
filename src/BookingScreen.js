import React from 'react';
import './BookingWindow.css';

export default function BookingScreen() {
    return(
<React.Fragment>
<script src="%PUBLIC_URL%/BookingScript.js"></script>
<div id="bookingDetail">
    <div class="bookingForm">
        <p>
            <label>Name</label><br/>
            <input type="text" id="username" class="text"/>
            <label>Address</label><br/>
            <input type="text" id="address" class="text"/>
        </p>
        <div id="roomList"></div>
        <p>
            <input type="button" id="addRow" value="Add Row" onclick="addRow()" />
            <input type="button" id="submit" value="Submit Data"/>
            <br></br>
            <label>Date</label><br/>
            <input type="datetime" id="date" class="text" />
        </p>
    </div>
</div>
</React.Fragment>
    );
}