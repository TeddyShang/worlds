import React from 'react';
import './BaseIVueStyle.css';
import ModalButton from './ModalBtn.js';
import Modal from 'react-modal';

class ProfilePictureUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked : false,
            file: null,
          };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    onClick() {
        this.setState({
            clicked: true
        });
    }
    showModal() {
        this.setState(prevState => ({ modalOpen: true }));
    }
    hideModal() {
        this.setState(prevState => ({ modalOpen: false }));
    }

    handleFileUpload = (event) => {
        this.setState({file: event.target.files});
    }

    submitFile = (event) => {
        event.preventDefault();

        let userProfile;
        let finalURL;
        
        //This will be the full json document of the user that is logged in
        var user = sessionStorage.getItem("current_user");

        //Uncomment for use of session user.
        //var profileId = user.profileId;

        //temp for testing
        var profileId = "5e586a7ab69af82f68c9c6d5"

        fetch('http://localhost:8080/userprofiles/' + profileId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            //handle response
            .then(response => response.json())
            .then(function (data) {
                userProfile = data;
                var userprofileUrl = userProfile._links.self.href;
                var split = userprofileUrl.split("/");
                profileId = split[split.length - 1];
            })
            .then(() => {
                //submit to AWS (the file)
                var baseUrl = 'https://worlds-media.s3.amazonaws.com/';
                let AWSresponse;
                var finalKey = "ProfilePictures/" + profileId + "/" + this.state.file[0].name;
                finalURL = baseUrl + finalKey;
                const formData = new FormData();
                formData.append('key', finalKey);
                formData.append('file', this.state.file[0]);
                formData.append('Content-Type', this.state.file.type);

                fetch(baseUrl, {
                    method: 'POST',
                    body: formData
                }).then((response) => {
                    //handle response
                    if (response.status == 204) {
                        //then successful
                    }
                })
                    .catch(error => {
                        //handle error
                    });
            })

            .then(() => {
                //handle PUT back to our server
                var finalUserProfile = {
                    "aboutMe": userProfile.aboutMe,
                    "urlToProfilePicture": finalURL,
                    "professionalExperience": userProfile.professionalExperience
                };
                fetch('http://localhost:8080/userprofiles/' + profileId, {
                    method: 'PUT',
                    body: JSON.stringify(finalUserProfile),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .catch(error => {
                    //handle error
                })
            })
    }

    render() {
        return (
            <React.Fragment>
                <ModalButton handleClick={this.showModal}>Upload Profile Picture</ModalButton>
                <Modal isOpen={this.state.modalOpen} onRequestClose={this.hideModal} className={"bookingModal"}>
                    <div class="mainCenterDiv">
                        <h1>Choose Local Photos/Videos to upload</h1>
                        <form onSubmit={this.submitFile}>
                            <div class="subCenterDiv">
                                <input type='file' class="inputText" required onChange={this.handleFileUpload} />
                            </div>
                            <button type='submit'>Upload</button>
                        </form>
                        <button onClick={this.hideModal}>Close Upload Screen</button>

                    </div>

                </Modal>

            </React.Fragment>
        );
    }


}
export default ProfilePictureUpload;