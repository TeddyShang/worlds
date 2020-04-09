import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './Dashboard.css';
import BookingDetail from './BookingDetail';

var baseURL = "http://localhost:8080";

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
        this.bookingDetail = this.bookingDetail.bind(this);
    }

    // On screen load, retrieve all the bookings from server
    componentDidMount() {
        var user = JSON.parse(sessionStorage.getItem("current_user")); //This will be the full json document of the user that is logged in
        let currentComponent = this;
        var userLink = user._links.self.href;
        this.profileId = user.profileId;


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
        });

        // Retrieve Profile Data
        fetch (baseURL + "/userprofiles/" + this.profileId, {
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
        });
    }

    // Update state info when input changes, prepare it for 'save' functionality
    handleChange = (event) => {
        if (["aboutMe", "professionalExperience"].includes(event.target.name)) {
            this.setState({ [event.target.name]: event.target.value })
        }

        if (event.target.name == "urlToProfilePicture") {
            this.profilePicToUpload = event.target.files[0];
            this.urlToRenderedProfilePic = URL.createObjectURL(this.profilePicToUpload);

            this.setState({ state: this.state }); // Changing state for url comes later when we submit
        }
    }

    // Submit edited data to server
    handleSubmit = (event) => {
        event.preventDefault();

        let currentComponent = this;
        
        // Upload picture to AWS
        this.uploadProfilePic()
        .then(() => {

            // Submitting State to User Profiles
            fetch(baseURL + '/userprofiles/' + this.profileId, {
                method: 'PUT',
                body: JSON.stringify(this.state),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                if (response.status >= 400) {
                    // Error
                    console.log("Error. Couldn't submit data about user profile. Error code: ", response.status);
                } else {
                    // On Success
                }
                return response.json();
            }).then(function(data) {
                return data;
            }).catch((err) => {
                console.log("Errors: ", err.response);
            });

        })
    }

    // A generalized function to render either AboutMe or ProfessionalExperience section
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

    // Goes to BookingDetail wrapper
    bookingDetail(booking) {
        //We should launch the booking detail page
        var booking = booking;
        ReactDOM.render(<BookingDetail booking = {booking}></BookingDetail>, document.getElementById('application'));
    }


    // Renders Booking Detail box in the overview list
    renderBookingDetail(booking) {
        return (
            <div class="dashboardBookingBox" onClick={this.bookingDetail.bind(this, booking)}>
                Status: {booking.bookingStatus} <br/>
                Address: {booking.address} <br/>
                Date Requested: {booking.dateRequested} <br/>
            </div>
    
        )
    }

    // Renders all bookings
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

    // OnClick functions for the edit/save buttons
    clickEdit = () => {
        this.editMode = true;
        this.setState({ state: this.state });
    }
    clickSave = () =>  {
        this.editMode = false;
        this.setState({ state: this.state });
        //this.handleSubmit();
    }

    // Renders edit button that can also appear as a save button
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

    // Uploading picture to database functionality
    uploadProfilePic = () => {
        if (this.profilePicToUpload == null)
            return new Promise(resolve => {
                  resolve('resolved');
            });

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
                this.state.urlToProfilePicture = finalURL;
            }
        })
        .catch(error => {
            console.log("Errors: ", error.response);
        });
    }

    // Render profile picture. Uses default pic if not available
    renderProfilePic = () => {
        var url = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
        if (this.urlToRenderedProfilePic != null)
            url = this.urlToRenderedProfilePic;
        else if (this.state.urlToProfilePicture != "")
            url = this.state.urlToProfilePicture;
        var result = [];
        
        if (this.editMode) {
            result.push(<img id="profilePic" class = "profilePicWithButton" src={url}></img>)
            result.push(<label class="profilePicLabel button" for="profilePicButton">Upload Profile Picture (PNG, JPG)</label>);
            result.push(<input  id="profilePicButton" name="urlToProfilePicture" accept="image/*" type="file"/>);
        } else {
            result.push(<img id="profilePic" src={url}></img>)
        }
        return result;
    }

    // Render Dashboard screen
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