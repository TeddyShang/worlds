import React from 'react';
import './BookingWindow.css';
import { thisExpression } from '@babel/types';
import ReactDOM from 'react-dom';
import './index.css';
import Menu from './Menu'
import CustomCesium from './CustomCesium';


class BookingScreen extends React.Component {

    state = {
        realtorId: "5e42cae94331f24e84a9a6f5", //hardcoded
        address: "",
        dateRequested: "",
        locationCoordinates: "",
        rooms: [
            // {
            //     name: "Living Room",
            //     photos: "0",
            //     video: "False"
            // }
        ]
    }
    photosRequested = 0; // amount of photos currently selected
    rooms = [
        "Entryway", "Kitchen", "Living Room",
        "Home Office", "Dining Room", "Laundry Room",
        "Master Bedroom", "Master Bathroom", "Master Closet",

        "Home | Frontview", "Garage", "Front Yard",
        "Driveway", "Side Yard", "Backyard",
        "Deck", "Patio", "Shed",

        "Bedroom 1", "Full Bathroom 1", "Storage Room",
        "Bedroom 2", "Full Bathroom 2", "Sun Room",
        "Bedroom 3", "Half Bathroom 1", "Attic",
        "Bedroom 4", "Half Bathroom 2", "Home Gym",
    ]

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);



        // Populate rooms array
        this.state.rooms = [];
        this.rooms.map((val, idx) => {
            this.state.rooms.push([
                val,
                "0",
                "False"
            ])
        })
    }

    componentDidMount() {

        var locationCoordinates = this.props.locationCoordinates;
        var address = this.props.address;
        this.setState({
            address: address,
            locationCoordinates : locationCoordinates
        })
        //console.log("Entering location coordinates", this.props.location, this.props.address);
    }

    handleSubmit(event) {
        event.preventDefault();
        //const data = new FormData(this.state);
        //console.log("Submitting ", this.state);

        fetch('http://localhost:8080/bookings', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(() =>{
            ReactDOM.render(<Menu />, document.getElementById('root'));
            var customCesium = ReactDOM.render(<CustomCesium/>, document.getElementById('application'));
            customCesium.addListener();
        });
        //console.log("Submitted.");

    }

    handleChange(event) {
        //console.log("Changing, ", event.target);

        // Fancy handling if part of room
        if (["photos", "video"].includes(event.target.className)) {
            let rooms = [...this.state.rooms];
            let val = 0;
            if (event.target.className == "photos") {
                val = event.target.value;
                rooms[event.target.dataset.id][1] = val;
            } else if (event.target.className == "video") {
                val = (event.target.checked ? "True" : "False");
                rooms[event.target.dataset.id][2] = val;
            }
            //rooms[event.target.dataset.id][event.target.className] = val;
            this.setState({ rooms }, () => console.log(this.state.rooms));

            // Update Photo Counter
            this.photosRequested = 0;
            for (var i = 0; i < rooms.length; i++) {
                this.photosRequested += parseInt(rooms[i][1]);
            }
        } else {
            // address, date updating. Not name (dead field for now)
            if (event.target.name != "name") {
                this.setState({ [event.target.name]: event.target.value })
            }
        }
        //console.log("New State, ", this.state);
    }

    renderRoom(idx) {
        return (<RoomBookingEntry myDataProp={this.state.rooms[idx][0]} dataId={idx}></RoomBookingEntry>)
    }
    renderBanner(title) {
        return (<div class="banner">{title}</div>)
    }
    renderPhotoCounter() {
        return (<div id="photoCounter">{this.photosRequested} / 60 Photos</div>)
    }

    renderAllRooms() {
        var roomsToRender = [];
        for (var i = 0; i < this.state.rooms.length; i++) {
            var bannerTitle = "";
            switch (i) {
                case 0: bannerTitle = "Home Interior | Highlight Rooms"; break;
                case 9: bannerTitle = "Property Exterior | Outside"; break;
                case 18: bannerTitle = "House & Property Additional Rooms or Features"; break;
            }
            if (bannerTitle != "") {
                roomsToRender.push(this.renderBanner(bannerTitle));
            }

            roomsToRender.push(this.renderRoom(i));
        }
        return roomsToRender;
    }

    render() {
        return (
            <div id="bookingDetail">
                <h1>iVue Real Estate Media Checklist</h1>
                <div class="bookingForm">
                    <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                        <label>Name</label><br />
                        <input type="text" id="name" name="name" class="text" />
                        <label>Address</label><br />
                        <input type="text" id="address" name="address" value = {this.state.address} class="text" readOnly/>
                        <label>Date</label><br />
                        <input type="date" id="date" name="dateRequested" class="text" />

                        <div id="roomList">

                            {this.renderAllRooms()}

                        </div>
                        {this.renderPhotoCounter()}
                        {/* <input type="button" id="addRow" value="Add Row" onclick="addRow()" /> */}
                        <br></br>
                        <button> Submit Data</button>
                    </form>
                </div>
            </div>
        )
    };
}
export default BookingScreen;

class RoomBookingEntry extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <           div class="roomEntry">
                <label>{this.props.myDataProp}</label>
                <select class="photos" name="photos" data-id={this.props.dataId}>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                </select>
                <input class="video" type="checkbox" data-id={this.props.dataId}></input>
            </div>
        )
    }
}