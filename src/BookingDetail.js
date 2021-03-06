import React from 'react';
import './index.css';
import Upload from './Upload';
import View from './View';
import { Viewer} from "resium";
import { Cartesian3, Rectangle} from "cesium";

const baseUrl = "http://localhost:8080/";
class BookingDetail extends React.Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef()
        this.state = {
            booking: null,
            bookingId: null,
            loaded: false,
            realtor: null,
            creator: null,
            dateRequested: null,
            dateCompleted: null,
            dateCreated: null,
            address: null,
            bookingPrivacy: null,
            bookingStatus: null,
            currentUser: null
        }
        this.refresh = this.refresh.bind(this);
        this.creatorComplete = this.creatorComplete.bind(this);
        this.realtorCancel = this.realtorCancel.bind(this);
        this.realtorConfirm = this.realtorConfirm.bind(this);
        this.editMode = false;
        this.clickEdit = this.clickEdit.bind(this);
        this.clickSave = this.clickSave.bind(this);
    }

    //On component mount, get all the data we need and set initial state
    componentDidMount() {
        //Setup
        var booking = this.props.booking;
        let currentComponent = this;
        var bookingId = booking._links.self.href
        bookingId = bookingId.split("/");
        bookingId = bookingId[bookingId.length - 1];

        //First get the name of the realtor
        var realtorUserId = booking.realtorId;
        let realtor;

        fetch( baseUrl + 'users/' + realtorUserId, {
            method: 'GET'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                realtor = data.firstName + " " + data.lastName + " [ID: " + realtorUserId + " ]";
                currentComponent.setState({ realtor: realtor })
            })
            .catch(console.log);

        //Next get the name of the creator if possible
        var creatorUserId = booking.creatorId;
        let creator;

        if (creatorUserId === "" || creatorUserId === null) {
            creator = "Not Assigned Yet";
            currentComponent.setState({ creator: creator })
        } else {
            fetch( baseUrl + 'users/' + creatorUserId, {
                method: 'GET'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    creator = data.firstName + " " + data.lastName + " [ID: " + realtorUserId + " ]";
                    currentComponent.setState({ creator: creator })

                })
                .catch(console.log);
        }

        //dateRequested is fine
        var dateRequested = booking.dateRequested;

        var dateCompleted = booking.dateCompleted;

        //Convert dateCompleted to readable date/time
        if (dateCompleted === null || dateCompleted === "") {
            dateCompleted = "Not Completed Yet";

        } else {
            var date = new Date(dateCompleted);
            dateCompleted = date.toLocaleDateString();
        }

        ////Convert dateCreated to readable date/time
        var dateCreated = booking.dateCreated;

        var tempDate = new Date(dateCreated);
        dateCreated = tempDate.toLocaleDateString();

        //Address, bookingPrivacy, and bookingStatus are fine
        var address = booking.address;
        var bookingPrivacy = booking.bookingPrivacy;
        var bookingStatus = booking.bookingStatus;

        var user = JSON.parse(sessionStorage.getItem("current_user"));
        this.setState({
            booking: booking,
            loaded: true,
            bookingId: bookingId,
            dateRequested: dateRequested,
            dateCompleted: dateCompleted,
            dateCreated: dateCreated,
            address: address,
            bookingPrivacy: bookingPrivacy,
            bookingStatus: bookingStatus,
            user: user
        })
    }

    //Refreshes the page and gets latest data
    refresh() {
        let currentComponent = this;
        fetch(this.state.booking._links.self.href, {
            method: 'GET'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                currentComponent.setState({ booking: data });
            });
    }

    //Set the booking as tentatively complete, set to complete once realtor verifies
    creatorComplete() {
        let currentComponent = this;
        var booking = currentComponent.state.booking;
        var bookingLink = booking._links.self.href;
        var finalBookingBody = {
            "mediaIds": booking.mediaIds,
            "dateCreated": booking.dateCreated,
            "dateRequested": booking.dateRequested,
            "dateCompleted": booking.dateCompleted,
            "realtorId": booking.realtorId,
            "locationCoordinates": booking.locationCoordinates,
            "address": booking.address,
            "tags": booking.tags,
            "rooms": booking.rooms,
            "bookingPrivacy": booking.bookingPrivacy,
            "bookingStatus": "TENTATIVE",
            "deletedBooking": booking.deletedBooking,
            "creatorId": booking.creatorId,
            "mediaIdsByRoom": booking.mediaIdsByRoom
        }
        fetch(bookingLink, {
            method: 'PUT',
            body: JSON.stringify(finalBookingBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json()
        }).then(function (data) {
            currentComponent.setState({
                booking: data,
                bookingStatus: "TENTATIVE"
            });
        })
    }

    //Set the booking as cancelled
    realtorCancel() {
        let currentComponent = this;
        var booking = currentComponent.state.booking;
        var bookingLink = booking._links.self.href;
        var finalBookingBody = {
            "mediaIds": booking.mediaIds,
            "dateCreated": booking.dateCreated,
            "dateRequested": booking.dateRequested,
            "dateCompleted": booking.dateCompleted,
            "realtorId": booking.realtorId,
            "locationCoordinates": booking.locationCoordinates,
            "address": booking.address,
            "tags": booking.tags,
            "rooms": booking.rooms,
            "bookingPrivacy": booking.bookingPrivacy,
            "bookingStatus": "CANCELLED",
            "deletedBooking": booking.deletedBooking,
            "creatorId": booking.creatorId,
            "mediaIdsByRoom": booking.mediaIdsByRoom
        }
        fetch(bookingLink, {
            method: 'PUT',
            body: JSON.stringify(finalBookingBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json()
        }).then(function (data) {
            currentComponent.setState({
                booking: data,
                bookingStatus: "CANCELLED"
            });
        })
    }

    // enable user to edit the requested date.
    clickEdit = () => {
        this.editMode = true;
        this.setState({ state: this.state });
    }

    // save current booking detail with PUT request.
    clickSave = () =>  {
        this.editMode = false;
        let currentComponent = this;
        var booking = currentComponent.state.booking;
        var bookingLink = booking._links.self.href;

        //process address and send whole booking when resolved
        var address = document.getElementById("Address").value
        const node = this.ref.current;
        const geocoder = node.cesiumElement.geocoder.viewModel._geocoderServices[1];
        let loc;
        let searchPosition = address;
        let aPosition;
        geocoder.geocode(searchPosition).then((result) => {
            loc = result[0].destination;
            if (loc instanceof Rectangle){
              let finalLocation = Rectangle.center(loc);
              aPosition = Cartesian3.fromRadians(finalLocation.longitude, finalLocation.latitude);
            }
            if (loc instanceof Cartesian3) {
              aPosition = loc
            }
            var finalBookingBody = {
                "mediaIds": booking.mediaIds,
                "dateCreated": booking.dateCreated,
                "dateRequested": document.getElementById("Date Requested").value,
                "dateCompleted": booking.dateCompleted,
                "realtorId": booking.realtorId,
                "locationCoordinates": aPosition.toString(),
                "address": address,
                "tags": booking.tags,
                "rooms": booking.rooms,
                "bookingPrivacy": booking.bookingPrivacy,
                "bookingStatus": booking.bookingStatus,
                "deletedBooking": booking.deletedBooking,
                "creatorId": booking.creatorId,
                "mediaIdsByRoom": booking.mediaIdsByRoom
            }
            fetch(bookingLink, {
                method: 'PUT',
                body: JSON.stringify(finalBookingBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                return response.json()
            }).then(function (data) {
                currentComponent.setState({
                    dateRequested: document.getElementById("Date Requested").value,
                    address: address 
                });
            })
          });
        
    }

    //Set the booking as completed, also mark the time completed
    realtorConfirm() {
        let currentComponent = this;
        var booking = currentComponent.state.booking;
        var bookingLink = booking._links.self.href;
        var completedDate = Date.now();
        var finalBookingBody = {
            "mediaIds": booking.mediaIds,
            "dateCreated": booking.dateCreated,
            "dateRequested": booking.dateRequested,
            "dateCompleted": completedDate,
            "realtorId": booking.realtorId,
            "locationCoordinates": booking.locationCoordinates,
            "address": booking.address,
            "tags": booking.tags,
            "rooms": booking.rooms,
            "bookingPrivacy": booking.bookingPrivacy,
            "bookingStatus": "COMPLETED",
            "deletedBooking": booking.deletedBooking,
            "creatorId": booking.creatorId,
            "mediaIdsByRoom": booking.mediaIdsByRoom
        }
        fetch(bookingLink, {
            method: 'PUT',
            body: JSON.stringify(finalBookingBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json()
        }).then(function (data) {
            var dateCompleted = data.dateCompleted;
            var date = new Date(dateCompleted);
            dateCompleted = date.toLocaleDateString();
            currentComponent.setState({
                booking: data,
                bookingStatus: "COMPLETED",
                dateCompleted: dateCompleted
            });
        })
    }

    //Screens depend on user type. Buttons displayed depend on booking state
    render() {
        if (this.state.loaded && (this.state.user.userType === "CREATOR" || this.state.user.userType === "STAFF")) {
            return (
                <div class="mainCenterDiv">
                    <h1>iVue Booking Detail</h1>
                    <div class="col">
                        <div>
                            <li>Booking ID: {this.state.bookingId}</li>
                            <li>Realtor: {this.state.realtor}</li>
                            <li>Creator: {this.state.creator}</li>
                            <li>Date Created: {this.state.dateCreated}</li>
                            <li>Date Requested: {this.state.dateRequested}</li>
                            <li>Date Completed: {this.state.dateCompleted}</li>
                            <li>Booking Status: {this.state.bookingStatus}</li>
                            <li>Address: {this.state.address}</li>
                            <li>Booking Privacy: {this.state.bookingPrivacy}</li>
                        </div>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Room Name</th>
                                        <th>Photos</th>
                                        <th>Videos</th>
                                        <th>Upload</th>
                                        <th>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.booking.rooms.map((value, index) => {
                                        return (
                                            <tr>
                                                <td>{value[0]}</td>
                                                <td>{value[1]}</td>
                                                <td>{value[2]}</td>
                                                <td>
                                                    {<Upload creatorId={this.state.booking.creatorId} roomIndex={index} bookingInformation={this.state.booking}></Upload>}
                                                </td>
                                                <td>
                                                    {<View roomIndex={index} booking={this.state.booking}></View>}
                                                </td>
                                            </tr>
                                        )

                                    })}
                                </tbody>


                            </table>
                            {(this.state.booking.bookingStatus === "COMPLETED" || this.state.booking.bookingStatus === "TENTATIVE") &&
                                <button class="button fullWidth" disabled >Marked As Complete</button>
                            }
                            {(this.state.booking.bookingStatus === "MATCHED") &&
                                <button class="button fullWidth" onClick={this.creatorComplete} >Mark As Complete</button>
                            }
                            <button onClick={this.refresh} class="button fullWidth ">Refresh</button>
                        </div>
                    </div>
                </div>
            )

        } else if (this.state.loaded && this.state.user.userType === "REALTOR") {
            if (this.editMode){
                return (
                    <div class="mainCenterDiv">
                        <h1>iVue Booking Detail</h1>
                        <div class="col">
                            <div>
                                <li>Booking ID: {this.state.bookingId}</li>
                                <li>Realtor: {this.state.realtor}</li>
                                <li>Creator: {this.state.creator}</li>
                                <li>Date Created: {this.state.dateCreated}</li>
                                <li>Date Requested: </li>
                                <input type="date" id="Date Requested" name="Date Requested:" defaultValue = {this.state.dateRequested}></input>
                                <li>Date Completed: {this.state.dateCompleted}</li>
                                <li>Booking Status: {this.state.bookingStatus}</li>
                                <li>Address: </li>
                                <input type="text" id="Address" name="Address:" defaultValue = {this.state.address}></input>
                                <li>Booking Privacy: {this.state.bookingPrivacy}</li>
                            </div>
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Room Name</th>
                                            <th>Photos</th>
                                            <th>Videos</th>
                                            <th>View</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.booking.rooms.map((value, index) => {
                                            return (
                                                <tr>
                                                    <td>{value[0]}</td>
                                                    <td>{value[1]}</td>
                                                    <td>{value[2]}</td>
                                                    <td>
                                                        {<View roomIndex={index} booking={this.state.booking}></View>}
                                                    </td>
    
                                                </tr>
                                            )
    
                                        })}
    
                                    </tbody>
    
                                </table>
                                {(this.state.booking.bookingStatus === "PENDING") &&
                                    <button class="button fullWidth" onClick={this.realtorCancel} >Cancel Booking</button>
                                }
                                {(this.state.booking.bookingStatus === "PENDING") &&
                                    <button class="button fullWidth" onClick={this.clickSave}>Save Booking</button>
                                }
                               
                                {(this.state.booking.bookingStatus === "TENTATIVE") &&
                                    <button class="button fullWidth" onClick={this.realtorConfirm} >Confirm Booking is Complete</button>
                                }
                                <button onClick={this.refresh} class="button fullWidth ">Refresh</button>

                                <div hidden>
                                    <Viewer ref={this.ref}></Viewer>
                                </div>
    
                            </div>
                        </div>
                    </div>
                )

            } else{
                return (
                    <div class="mainCenterDiv">
                        <h1>iVue Booking Detail</h1>
                        <div class="col">
                            <div>
                                <li>Booking ID: {this.state.bookingId}</li>
                                <li>Realtor: {this.state.realtor}</li>
                                <li>Creator: {this.state.creator}</li>
                                <li>Date Created: {this.state.dateCreated}</li>
                                <li>Date Requested: {this.state.dateRequested}</li>
                                <li>Date Completed: {this.state.dateCompleted}</li>
                                <li>Booking Status: {this.state.bookingStatus}</li>
                                <li>Address: {this.state.address}</li>
                                <li>Booking Privacy: {this.state.bookingPrivacy}</li>
                            </div>
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Room Name</th>
                                            <th>Photos</th>
                                            <th>Videos</th>
                                            <th>View</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.booking.rooms.map((value, index) => {
                                            return (
                                                <tr>
                                                    <td>{value[0]}</td>
                                                    <td>{value[1]}</td>
                                                    <td>{value[2]}</td>
                                                    <td>
                                                        {<View roomIndex={index} booking={this.state.booking}></View>}
                                                    </td>
    
                                                </tr>
                                            )
    
                                        })}
    
                                    </tbody>
    
                                </table>
                                {(this.state.booking.bookingStatus === "PENDING") &&
                                    <button class="button fullWidth" onClick={this.realtorCancel} >Cancel Booking</button>
                                }
                                {(this.state.booking.bookingStatus === "PENDING") &&
                                    <button class="button fullWidth" onClick={this.clickEdit} >Edit Booking</button>
                                }
                               
                                {(this.state.booking.bookingStatus === "TENTATIVE") &&
                                    <button class="button fullWidth" onClick={this.realtorConfirm} >Confirm Booking is Complete</button>
                                }
                                <button onClick={this.refresh} class="button fullWidth ">Refresh</button>
    
                            </div>
                        </div>
                    </div>
                )

            }
        }
        return (
            <div class="mainCenterDiv">
                <h1>This is an error state</h1>
            </div>
        )
    };
}
export default BookingDetail;