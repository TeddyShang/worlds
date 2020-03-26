import React from 'react';
import { thisExpression } from '@babel/types';
import ReactDOM from 'react-dom';
import './index.css';
import './Dashboard.css'
import Menu from './Menu'

class DashboardScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            // About
            // Professional Experience
        }

        this.editMode = false;
        this.bookings = null;

        this.clickEdit = this.clickEdit.bind(this);
        this.clickSave = this.clickSave.bind(this);
        this.renderEditButton = this.renderEditButton.bind(this);

        this.renderProfileField = this.renderProfileField.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        // Retrieve all bookings
        var user = JSON.parse(sessionStorage.getItem("current_user")); //This will be the full json document of the user that is logged in
        let currentComponent = this;
        var userLink = user._links.self.href;
        console.log("Current user is ", user);
        console.log("userLink is ", userLink);
        fetch(userLink + '/bookings', {
            method: 'GET'
        })
            .then(function(response) {
                return response.json();
            })
            .then(function(data){
                currentComponent.bookings = data._embedded.bookings;
                currentComponent.setState({ state: currentComponent.state });
                console.log("Bookings: ", currentComponent.bookings);
        });
    }

    handleChange = (event) => {
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let currentComponent = this;

         fetch('http://localhost:8080/[TODO]', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            if (response.status >= 400) {
                // Error
                return response.text();
            } else {
                // On Success
            }
            return response.json();
        }).then(function(data) {

            return data;
        }).catch((err) => {
            console.log("Errors: ", err.response);
        });
    }

    renderProfileField(labelName, fieldName) {
        if (this.editMode) {
            return (
                <div>
                    <label>{labelName}</label>
                    <textarea class="inputText" name={fieldName}>helloEdit</textarea>
                </div>
            )
        } else {
            return (
                <div>
                    <label>{labelName}</label>
                    <textarea class="inputText" name={fieldName} readonly="">hello</textarea>
                </div>
            )
        }
        
    }

    renderBookingDetail(booking) {
        return (
            <div class="dashboardBookingBox">
                Status: {booking.bookingStatus} <br/>
                Address: {booking.address} <br/>
                Date Requested: {booking.dateRequested} <br/>
            </div>
        )
    }

    renderBookingDetailList() {
        if (this.bookings == null) {
            return (<div class="dashboardBookingBox">There are no bookings</div>);
        } else {
            var result = [];
            for (var i = 0; i < this.bookings.length; i++) {
                var booking = this.bookings[i];
                result.push(this.renderBookingDetail(booking));
            }
            return result;
        }
    }

    clickEdit = () => {
        this.editMode = true;
        this.setState({ state: this.state });
    }
    clickSave = () =>  {
        this.editMode = false;
        this.setState({ state: this.state });
    }

    renderEditButton = () => {
        if (!this.editMode) {
            return (
                <button class="button fullWidth " onClick={this.clickEdit}>Edit</button>
            )
        } else {
            return (
                <button class="button fullWidth " onClick={this.clickSave}>Save</button>
            )
        }
    }


    render() {
        return (
            <div class="mainCenterDiv">
                <h1>iVue Dashboard</h1>
                <div class="row">
                    <div class="subCenterDivHalf">
                        <img src="./profile-pic.jpg"></img>
                        <br/><br/>
                        {this.renderProfileField("About Me", "about")}
                        {this.renderProfileField("Professional Experience", "experience")}
                        <br/>
                        {this.renderEditButton()}
                    </div>
                    <div class="subCenterDivHalf">
                        <h2>My Bookings</h2>
                        {this.renderBookingDetailList() }
                    </div>
                </div>
            </div>
            )
    };
}
export default DashboardScreen;