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


        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
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
        return (
            <div>
                <label>{labelName}</label>
                <textarea class="inputText" readonly name={fieldName}>hello</textarea>
            </div>
        )
    }

    renderBookingDetail(location) {
        return (
            <div class="dashboardBookingBox">Location: {location}</div>
        )
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
                        <button class="button fullWidth ">Edit</button>
                    </div>
                    <div class="subCenterDivHalf">
                        <h2>My Bookings</h2>
                        {this.renderBookingDetail("My House") }
                        {this.renderBookingDetail("My School")}
                        {this.renderBookingDetail("My School")}
                        {this.renderBookingDetail("My School")}
                        {this.renderBookingDetail("My School")}
                        {this.renderBookingDetail("My School")}
                        {this.renderBookingDetail("My School")}
                        {this.renderBookingDetail("My School")}
                        {this.renderBookingDetail("My School")}
                        {this.renderBookingDetail("My School")}
                        {this.renderBookingDetail("My School")}
                        {this.renderBookingDetail("My School")}
                        {this.renderBookingDetail("My School")}
                        {this.renderBookingDetail("My School")}
                    </div>
                </div>
            </div>
            )
    };
}
export default DashboardScreen;