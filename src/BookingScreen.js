import React from 'react';
import './BookingWindow.css';
import ReactDOM from 'react-dom';
import './index.css';
import Menu from './Menu'
import CustomCesium from './CustomCesium';
import PaypalButton from './PaypalButton';

const baseUrl = "http://localhost:8080/";

// The screen with the many rooms to be booked
class BookingScreen extends React.Component {

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
        
        this.state = {
           rooms : [],
           payment_successful : false,
           payment_cancelled : false,
           payment_errored : false,
           details_confirmed: false,
           realtorId: "",
           address: "",
           name: "",
           dateRequested: "",
           locationCoordinates: "",
           tags:[],
           cost: 0,
           confirmed_booking: null
        }

        // Populate rooms array
        this.rooms.map((val, idx) => {
            this.state.rooms.push([
                val,
                "0",
                "False"
            ])
        })
        //this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.payment_successful = this.payment_successful.bind(this);
        this.payment_cancelled = this.payment_cancelled.bind(this);
        this.payment_errored = this.payment_errored.bind(this);
        this.confirmDetails = this.confirmDetails.bind(this);
    }

    // Confirming payment
    payment_successful(){
        let currentComponent = this;
        let httpStatus;
        fetch(baseUrl + 'bookings', {
            method: 'POST',
            body: JSON.stringify(currentComponent.state.confirmed_booking),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            httpStatus = response.status;
            if(response.status >= 400) {
                return response.text()
            } else {
                return response.json()
            }
        }).then(function(data) {
            //booking did not get posted
            if (httpStatus >= 400) {
                alert("Error. Booking was not saved");
            } else {
                ReactDOM.render(<Menu />, document.getElementById('root'));
                var customCesium = ReactDOM.render(<CustomCesium/>, document.getElementById('application'));
                customCesium.addListener();
                alert("Payment and Booking Complete!");
            }

        });

    }

    // Payment cancelled
    payment_cancelled(){
        this.setState({
            payment_cancelled: true
        })
    }

    // Payment error
    payment_errored(){
        this.setState({
            payment_errored: true
        })
    }

    // Confirm details for payment
    confirmDetails(event){
        event.preventDefault();

        //Duplicate array
        var tagsarr = [];
        var filteredRooms = [];

        for (var i = 0; i < this.state.rooms.length; i++) {
            if (this.state.rooms[i][1] > 0) {
                tagsarr.push("Photos");
            }
            if (this.state.rooms[i][2] === "True") {
                tagsarr.push("Videos");
            }
            if ((this.state.rooms[i][1] > 0 || this.state.rooms[i][2] === "True")) {
                filteredRooms.push(this.state.rooms[i]);
            }
        }
        // Filter unique values to put into tags array.
        const unique = (value, index, self) => {
            return self.indexOf(value) === index
        }
       var tags = tagsarr.filter(unique);

       // Grab booking information
       var booking = {
           realtorId: this.state.realtorId,
           address : this.state.address,
           dateRequested : this.state.dateRequested,
           rooms : filteredRooms,
           tags : tags,
           locationCoordinates :this.state.locationCoordinates
       }

        this.setState({
            details_confirmed: true,
            tags:tags,
            confirmed_booking:booking
        })
    }

    // On screen load, set settigs
    componentDidMount() {
        var locationCoordinates = this.props.locationCoordinates;
        var address = this.props.address;
        var user = JSON.parse(sessionStorage.getItem("current_user"));
        var userLink = user._links.self.href;
        var temp = userLink.split('/');
        var id = temp[temp.length - 1];
        var cost = this.props.cost;
        var name = user.firstName + ' ' + user.lastName;
        this.setState ({
            address: address,
            locationCoordinates : locationCoordinates,
            realtorId: id,
            cost : cost,
            name: name
        })
    }

    // Updates screens based on input
    handleChange(event) {
        // Fancy handling if part of room
        if (["photos", "video"].includes(event.target.className)) {
            let rooms = [...this.state.rooms];
            let val = 0;
            if (event.target.className === "photos") {
                val = event.target.value;
                rooms[event.target.dataset.id][1] = val;

            } else if (event.target.className === "video") {
                val = (event.target.checked ? "True" : "False");
                rooms[event.target.dataset.id][2] = val;
            }
            this.setState({ rooms });

            // Update Photo Counter
            this.photosRequested = 0;
            for (var i = 0; i < rooms.length; i++) {
                this.photosRequested += parseInt(rooms[i][1]);
            }
        } else {
            // Address, date updating. Not name (dead field for now)
            if (event.target.name !== "name") {
                this.setState({ [event.target.name]: event.target.value })
            }
        }
    }

    // Renders a specific room details
    renderRoom(idx, readOnly) {
        return (<RoomBookingEntry readOnly={readOnly} myDataProp={this.state.rooms[idx][0]} dataId={idx}></RoomBookingEntry>)
    }
    // Render a banner to split sections
    renderBanner(title) {
        return (<div class="banner">{title}</div>)
    }
    // Render counter for all rooms on how many photos selcted
    renderPhotoCounter() {
        return (<div id="photoCounter">{this.photosRequested} / 60 Photos</div>)
    }

    // Render all rooms
    renderAllRooms(readOnly) {
        var roomsToRender = [];
        for (var i = 0; i < this.state.rooms.length; i++) {
            var bannerTitle = "";
            switch (i) {
                case 0: bannerTitle = "Home Interior | Highlight Rooms"; break;
                case 9: bannerTitle = "Property Exterior | Outside"; break;
                case 18: bannerTitle = "House & Property Additional Rooms or Features"; break;
            }
            if (bannerTitle !== "") {
                roomsToRender.push(this.renderBanner(bannerTitle));
            }

            roomsToRender.push(this.renderRoom(i, readOnly));
        }
        return roomsToRender;
    }

    // Render entire screen
    render() {
        if(!this.state.details_confirmed) {
            return (
                <div id="bookingDetail">
                    <h1>iVue Real Estate Media Checklist</h1>
                    <div class="bookingForm">
                        <form onSubmit={this.confirmDetails} onChange={this.handleChange}>
                            <label>Name</label><br />
                            <input type="text" id="name" name="name" class="text" value={this.state.name} readOnly />
                            <label>Address</label><br />
                            <input type="text" id="address" name="address" value = {this.state.address} class="text" readOnly/>
                            <label>Date</label><br />
                            <input type="date" id="date" name="dateRequested" class="text" />
    
                            <div id="roomList">
    
                                {this.renderAllRooms(false)}
    
                            </div>
                            {this.renderPhotoCounter()}
                            <label>Total Cost: {this.state.cost}</label>
                            <br></br>
                            <button>Confirm Details</button>
                        </form>
                    </div>
                </div>
            )
        } else if (this.state.details_confirmed && !this.state.payment_successful) {

            return (
                <div id="bookingDetail">
                    <h1>iVue Real Estate Media Checklist</h1>
                    <div class="bookingForm">
                        <form onSubmit={this.confirmDetails} onChange={this.handleChange}>
                            <label>Name</label><br />
                            <input type="text" id="name" name="name" class="text" value={this.state.name} readOnly />
                            <label>Address</label><br />
                            <input type="text" id="address" name="address" value={this.state.address} class="text" readOnly />
                            <label>Date</label><br />
                            <input type="date" id="date" name="dateRequested" class="text" readOnly />

                            <div id="roomList">

                                {this.renderAllRooms(true)}

                            </div>
                            {this.renderPhotoCounter()}
                            <label>Total Cost: {this.state.cost}</label>
                            <br></br>
                            <button disabled>Details Confirmed! Complete transaction with Paypal</button>
                            <PaypalButton order_total={this.state.cost} payment_successful={this.payment_successful} payment_cancelled={this.payment_cancelled} payment_errored={this.payment_errored}></PaypalButton>
                        </form>
                    </div>
                </div>
            )
        } else if (this.state.payment_successful) {
            return (
                <p>Booking Complete, but should not be here ever</p>
            )
        } else {

            return (
                <p>Error State: We should not be here.</p>
            )
        }

    };
}
export default BookingScreen;




class RoomBookingEntry extends React.Component {

    constructor(props) {
        super(props);
    }
    // Render small section containing input for a specific room
    render() {
        if(this.props.readOnly) {
            return (
                <div class="roomEntry">
                    <label>{this.props.myDataProp}</label>
                    <select class="photos" name="photos" data-id={this.props.dataId} disabled>
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </select>
                    <input class="video" type="checkbox" data-id={this.props.dataId} disabled></input>
                </div>
            )
        }
        return (
            <div class="roomEntry">
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