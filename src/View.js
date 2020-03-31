import React from 'react';
import './BaseIVueStyle.css';
import ModalButton from './ModalBtn.js';
import Modal from 'react-modal';


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
            var numMedia = nextProps.booking.mediaIdsByRoom[this.state.roomIndex].length;
            this.setState({booking: nextProps.booking,
            numMedia: numMedia})
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
                            {this.state.mediametadatas.map((value) => {
                               return <p1>{value.urlToMedia}</p1>
                            })}
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