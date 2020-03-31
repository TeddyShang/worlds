import React from 'react';
import './BaseIVueStyle.css';
import ModalButton from './ModalBtn.js';
import Modal from 'react-modal';


class Upload extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            clicked : false,
            file: null,
            creatorId: "",
            bookingInformation: null,
            roomIndex: 0
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


    componentDidMount(){
        //get all necessary information from previous screen
        var creatorId = this.props.creatorId;
        var bookingInformation = this.props.bookingInformation;
        var roomIndex = this.props.roomIndex;
        this.setState ({
            creatorId: creatorId,
            bookingInformation : bookingInformation,
            roomIndex : this.props.roomIndex
        })
    }

    submitFile = (event) => {
        event.preventDefault();

        let finalMediaMetadata;
        let mediametadataId;
        let finalURL;
        let booking = this.state.bookingInformation;
        let bookingId;

        //first send to server POST new mediametadata object
        var initialMediaMetaData = {
            "creatorId": this.state.creatorId,
            "roomInformation": this.state.bookingInformation.rooms[0][0],
            "urlToMedia": ""
        };
        fetch('http://localhost:8080/mediametadatas', {
            method: 'POST',
            body: JSON.stringify(initialMediaMetaData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        //handle response
            .then(response => response.json())
            .then(function (data) {
                finalMediaMetadata = data;
                var mediametadataUrl = finalMediaMetadata._links.self.href;
                var split = mediametadataUrl.split("/");
                mediametadataId = split[split.length - 1];
            })
            .then(() => {
                //submit to AWS (the file)
                var bookingUrl = this.state.bookingInformation._links.self.href;
                var split = bookingUrl.split("/");
                bookingId = split[split.length - 1];

                var baseUrl = 'https://worlds-media.s3.amazonaws.com/';
                let AWSresponse;
                var finalKey = "MediaContent/" + bookingId + "/" + mediametadataId + "/" + this.state.file[0].name;
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
                //handle PUT back to our server for the mediametadata object
                var finalMetadataBody = {
                    "creatorId": finalMediaMetadata.creatorId,
                    "dateUploaded": finalMediaMetadata.dateUploaded, 
                    "roomInformation": finalMediaMetadata.roomInformation, 
                    "urlToMedia": finalURL
                }
                fetch('http://localhost:8080/mediametadatas/' + mediametadataId, {
                    method: 'PUT',
                    body: JSON.stringify(finalMetadataBody),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .catch(error => {
                    //handle error
                })
            })
            .then(() => {
                //Lastly, update the booking object
                var mediaIds = booking.mediaIds;
                mediaIds.push(mediametadataId);
                var mediaIdsByRoom = booking.mediaIdsByRoom;
                mediaIdsByRoom[this.state.roomIndex].push(mediametadataId);
                var finalBookingBody = {
                    "mediaIds": mediaIds,
                    "dateCreated": booking.dateCreated ,
                    "dateRequested": booking.dateRequested,
                    "realtorId": booking.realtorId,
                    "locationCoordinates": booking.locationCoordinates,
                    "address": booking.address,
                    "tags": booking.tags,
                    "rooms": booking.rooms,
                    "bookingPrivacy": booking.bookingPrivacy,
                    "bookingStatus": booking.bookingStatus,
                    "deletedBooking":booking.deletedBooking,
                    "creatorId": booking.creatorId,
                    "mediaIdsByRoom":  mediaIdsByRoom,
                    "dateCompleted": booking.dateCompleted
                }
                fetch('http://localhost:8080/bookings/' + bookingId, {
                    method: 'PUT',
                    body: JSON.stringify(finalBookingBody),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .catch(error => {
                    //handle error
                })

            })
            .catch(error => {
                //handle error
            });
            alert("Success! Media Uploaded to Cloud. We are now processing the data, please use the refresh button below to view it");
            this.setState({
                modalOpen: false
            })
    }
    render() {
        return (
            <React.Fragment>
                <ModalButton handleClick={this.showModal}>Upload Media</ModalButton>
                <Modal isOpen={this.state.modalOpen} onRequestClose={this.hideModal} className={"bookingModal"}>
                    <div class="mainCenterDiv">
                        <h1>Choose Local Photos/Videos to upload</h1>
                        <form onSubmit={this.submitFile}>
                            <div class="subCenterDiv">
                                <input type='file' accept = "image/*,video/*"class="inputText" required onChange={this.handleFileUpload} />
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
export default Upload;