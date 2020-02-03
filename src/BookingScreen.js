import React from 'react';
import './BookingWindow.css';


class BookingScreen extends React.Component {

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleSubmit(event) {
        console.log("Submitting");
        event.preventDefault();
        const data = new FormData(event.target);
        
        fetch('/api/form-submit-url', {
          method: 'POST',
          body: data,
        });
      }

    render() {
        return (
        <div id="bookingDetail">
            <div class="bookingForm">
                <form onSubmit={this.handleSubmit}>
                    <label>Name</label><br/>
                    <input type="text" id="username" name="name" class="text"/>
                    <label>Address</label><br/>
                    <input type="text" id="address" name="Address" class="text"/>
                    <label>Date</label><br/>
                    <input type="datetime" id="date" name="Date" class="text" />
                
                    <div id="roomList">

                        <div class="roomEntry">
                            <label>Living Room</label>
                            <select>
                                <option value = "1">1</option>
                                <option value = "2">2</option>
                                <option value = "3">3</option>
                                <option value = "4">4</option>
                            </select>
                            <input type="checkbox"></input>
                        </div>
                    </div>
                    <input type="button" id="addRow" value="Add Row" onclick="addRow()" />
                    <br></br>
                    <button> Submit Data</button>
                </form>
            </div>
        </div>
        )
    };
}
export default BookingScreen;