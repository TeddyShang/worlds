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
            aboutMe: "",
            //URL to photo
            urlToProfilePicture: "",
            // Professional Experience
            professionalExperience: ""
        }

        this.editMode = false;
        this.bookings = null;
        this.userProfile = null;
        this.profileId = undefined;
        this.profilePicToUpload = null;
        this.urlToRenderedProfilePic = null; // For when you select an image to upload

        this.clickEdit = this.clickEdit.bind(this);
        this.clickSave = this.clickSave.bind(this);
        this.renderEditButton = this.renderEditButton.bind(this);

        this.renderProfileField = this.renderProfileField.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        var user = JSON.parse(sessionStorage.getItem("current_user")); //This will be the full json document of the user that is logged in
        let currentComponent = this;
        var userLink = user._links.self.href;
        this.profileId = user.profileId;

        console.log("User is: ", user);


        // Retrieve all bookings
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

        // Retrieve Profile Data
        fetch ("http://localhost:8080/userprofiles/" + this.profileId, {
            method: 'GET'
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            currentComponent.userProfile = data;
            // Grabbing the data from server and updating front end
            currentComponent.setState({ aboutMe: data.aboutMe });
            currentComponent.setState({ professionalExperience: data.professionalExperience });
            currentComponent.setState({ urlToProfilePicture: data.urlToProfilePicture });
            console.log("UserProfile: ", currentComponent.userProfile);
        });
    }

    handleChange = (event) => {
        console.log("Event Name: ", event.target.name);
        if (["aboutMe", "professionalExperience"].includes(event.target.name)) {
            this.setState({ [event.target.name]: event.target.value })
            console.log("New State, ", this.state);
        }

        if (event.target.name == "urlToProfilePicture") {
            console.log("New Image: ", event.target.files[0]);
            this.profilePicToUpload = event.target.files[0];
            this.urlToRenderedProfilePic = URL.createObjectURL(this.profilePicToUpload);

            this.setState({ state: this.state }); // Changing state for url comes later when we submit

            console.log("urlToRenderedProfilePic: ", this.urlToRenderedProfilePic);
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let currentComponent = this;
        
        // Upload picture to AWS
        this.uploadProfilePic()
        .then(() => {

            // Submitting State to User Profiles
            fetch('http://localhost:8080/userprofiles/' + this.profileId, {
                method: 'PUT',
                body: JSON.stringify(this.state),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                if (response.status >= 400) {
                    // Error
                    console.log("Failure.")
                } else {
                    // On Success
                    console.log("Success!")
                }
                return response.json();
            }).then(function(data) {
                return data;
            }).catch((err) => {
                console.log("Errors: ", err.response);
            });

        })
    }

    renderProfileField(labelName, fieldName) {
        if (this.editMode) {
            return (
                <div>
                    <label>{labelName}</label>
                    <textarea class="inputText" name={fieldName} defaultValue="Hello!"></textarea>
                </div>
            )
        } else {
            return (
                <div>
                    <label>{labelName}</label>
                    <textarea class="inputText" name={fieldName} readonly="" defaultValue="Hello!" value={this.state[fieldName]}></textarea>
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
        //this.handleSubmit();
    }

    renderEditButton = () => {
        if (!this.editMode) {
            return (
                <button class="button fullWidth " onClick={this.clickEdit}>Edit</button>
            )
        } else {
            return (
                <button class="button fullWidth " onClick={this.clickSave} type="button">Save</button>
            )
        }
    }

    uploadProfilePic = () => {
        //submit to AWS (the file)
        var baseUrl = 'https://worlds-media.s3.amazonaws.com/';
        let AWSresponse;
        var finalKey = "ProfilePictures/" + this.profileId + "/" + this.profilePicToUpload.name;
        let finalURL = baseUrl + finalKey;
        const formData = new FormData();
        formData.append('key', finalKey);
        formData.append('file', this.profilePicToUpload);

        return fetch(baseUrl, {
            method: 'POST',
            body: formData
        }).then((response) => {
            if (response.status == 204) {
                console.log("Uploaded Profile Picture Succesfully!");
                this.state.urlToProfilePicture = finalURL;
            }
        })
        .catch(error => {
            console.log("Errors: ", error.response);
        });
    }

    renderProfilePic = () => {
        var url = "https://faceswaponline.com/wp-content/uploads/2019/12/DonkeyClinton-496a0ef1ecec9f4086480d722d3454d6.jpg";
        if (this.urlToRenderedProfilePic != null)
            url = this.urlToRenderedProfilePic;
        else if (this.state.urlToProfilePicture != "")
            url = this.state.urlToProfilePicture;
        var result = [];
        
        if (this.editMode) {
            result.push(<img id="profilePic" class = "profilePicWithButton" src={url}></img>)
            //result.push(<input class="button fullWidth" id="profilePicButton" onClick={this.uploadProfilePic} type="file">Upload Profile Picture</input>);
            result.push(<label class="profilePicLabel button" for="profilePicButton">Upload Profile Picture (PNG, JPG)</label>);
            result.push(<input  id="profilePicButton" name="urlToProfilePicture" accept="image/*" type="file"/>);
        } else {
            result.push(<img id="profilePic" src={url}></img>)
        }
        return result;
    }


    render() {
        return (
            <div class="mainCenterDiv">
                <h1>iVue Dashboard</h1>
                <div class="row">
                    <div class="subCenterDivHalf">
                        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                            {this.renderProfilePic()}
                            <br/><br/>
                            {this.renderProfileField("About Me", "aboutMe")}
                            {this.renderProfileField("Professional Experience", "professionalExperience")}
                            <br/>
                            {this.renderEditButton()}
                        </form>
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