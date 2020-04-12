import React from 'react';
import './BaseIVueStyle.css';
import ModalButton from './ModalBtn.js';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

/**
 * This class will
 * 1. get the metadatas for a booking using information from previous page
 * 2. Display medias for the booking, otherwise alert that no media is uploaded.
 */
class View extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            booking: null,
            mediametadatas: null,
            numMedia: 0,
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

    componentWillReceiveProps(nextProps) {
        if(this.props.booking !== nextProps.booking) {
            var booking = nextProps.booking;
            let currentComponent = this;
            var listOfIds = booking.mediaIdsByRoom[this.state.roomIndex];
            var numMedia = listOfIds.length;
    
            let listOfMediaMetaDatas = [];
    
            listOfIds.forEach(element => {
                fetch("http://localhost:8080/mediametadatas/" + element, {
                    method: 'GET'
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(data){
                    listOfMediaMetaDatas.push(data);
                    currentComponent.setState({
                        mediametadatas : listOfMediaMetaDatas
                    })
                });
            })

            this.setState ({
                booking: booking,
                numMedia: numMedia,
                mediametadatas : listOfMediaMetaDatas,
            })
        }
    }


    componentDidMount(){
        //get all necessary information from previous screen
        var booking = this.props.booking;
        var roomIndex = this.props.roomIndex;
        let currentComponent = this;

        //get all relevant MediaMetaDatas
        var listOfIds = booking.mediaIdsByRoom[roomIndex];
        var numMedia = listOfIds.length;

        let listOfMediaMetaDatas = [];

        listOfIds.forEach(element => {
            fetch("http://localhost:8080/mediametadatas/" + element, {
                method: 'GET'
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data){
                listOfMediaMetaDatas.push(data);
                currentComponent.setState({
                    mediametadatas : listOfMediaMetaDatas
                })
            });
        })

        this.setState ({
            booking: booking,
            numMedia: numMedia,
            mediametadatas : listOfMediaMetaDatas,
            roomIndex: roomIndex
        })
    }

    render() {
        if (this.state.numMedia == 0) {
            return <p>No media uploaded</p>
        } else if (this.state.numMedia > 0){
            return (
                <React.Fragment>
                    <ModalButton handleClick={this.showModal}>View Media</ModalButton>
                    <Modal isOpen={this.state.modalOpen} onRequestClose={this.hideModal} className={"bookingModal"}>
                        <div class="mainCenterDiv">
                            <h1>View Media of {this.state.booking.rooms[this.state.roomIndex][0]}</h1>
                            <div class="mainCenterDiv">
                                <Carousel showThumbs={false} infiniteLoop={true}> 
                                    {this.state.mediametadatas.map((value) => {
                                        var temp = value.urlToMedia.split(".");
                                        var filetype = temp[temp.length - 1];
                                        if (filetype == "ogg") {
                                            return (
                                                <video width="700" height="500" src={value.urlToMedia} controls>Your browser does not support .ogg video formats</video>
                                            )
                                        } else if (filetype == "mp4") {
                                            return (
                                                <div>
                                                    <video width="700" height="500" src={value.urlToMedia} controls>Your browser does not support .mp4 video formats</video>
                                                </div>
                                            )
                                        } else if (filetype == "webm") {
                                            return (
                                                <video width="700" height="500" src={value.urlToMedia} controls>Your browser does not support .webm video formats</video>
                                            )
                                        } else {
                                            return (
                                                <div>
                                                    <img width="700" height="500" src={value.urlToMedia}></img>
                                                </div>
                                            )
                                        }
                                    })}
                                </Carousel>

                            </div>
                            
                            <button onClick={this.hideModal}>Close Media Screen</button>
                        </div>

                    </Modal>

                </React.Fragment>
            );

        }
        return <h1>Error State</h1>

    }


}
export default View;