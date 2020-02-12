import React from 'react';
import './CustomCesium.css';
import { Viewer, Entity, EntityDescription} from "resium";
import { Cartesian3, Rectangle} from "cesium";
import ModalButton from './ModalBtn.js';
import Modal from 'react-modal';
import PackageModal from './PackageModal';



//Note Cartesian3.fromDegrees(LONG, LAT, elevation)
const pointGraphics = { pixelSize: 10 };

//TODO: Dynamically generate Entities based on DB
class CustomCesium extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef()
    this.state = {
      hasSearched : false,
      searchPos: null,
      searchLoc: null,
      modalOpen: false,
      bookings: []
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }
  showModal() {
    this.setState(prevState => ({ modalOpen: true }));
  }
  hideModal() {
    this.setState(prevState => ({ modalOpen: false }));
  }

  render() {
    const {hasSearched, bookings} = this.state;
    //If we have a search, create a new point to display
    //TODO: Keep previously installed points
    if (hasSearched) {
      return <React.Fragment>
      <Viewer full ref={this.ref}>
      {bookings.map((booking) => (
          <Entity position={booking.locationCoordinates} point={pointGraphics} name={booking.address}>


            <EntityDescription>
              <h1>Address: {booking.address}</h1>
              <p>Date Requested: {booking.dateRequested}</p>
              <p>RealtorId: {booking.realtorId}</p>
              <p>Booking Privacy: {booking.bookingPrivacy}</p>
              <p>Booking Status: {booking.bookingStatus}</p>
              <p>Rooms:</p> <table> <tr><th>Room Name</th> <th># Photos</th> <th>Videos?</th></tr>
              {booking.rooms.map((row) => (
                <tr>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                </tr>
              ))}
              </table>
            </EntityDescription>
          </Entity>
        ))}

        <Entity position={this.state.searchPos} point={pointGraphics} name={this.state.searchLoc}>
          <EntityDescription>
            <ModalButton handleClick={this.showModal}>
              Book Now!
            </ModalButton>
            <p>{this.state.searchLoc}</p>
          </EntityDescription>
        </Entity>
      </Viewer>
  
      <div>
        <Modal isOpen = {this.state.modalOpen} onRequestClose={this.hideModal}
          className={"bookingModal"}>
          <PackageModal location={this.state.searchPos.toString()}/>
          <button onClick={this.hideModal}>
          Close Booking Screen
        </button>
        </Modal>
      </div>

  </React.Fragment>
    } else {
      return <Viewer full ref={this.ref}>

        {bookings.map((booking) => (
          <Entity position={booking.locationCoordinates} point={pointGraphics} name={booking.address}>


            <EntityDescription>
              <h1>Address: {booking.address}</h1>
              <p>Date Requested: {booking.dateRequested}</p>
              <p>RealtorId: {booking.realtorId}</p>
              <p>Booking Privacy: {booking.bookingPrivacy}</p>
              <p>Booking Status: {booking.bookingStatus}</p>
              <p>Rooms:</p> <table> <tr><th>Room Name</th> <th># Photos</th> <th>Videos?</th></tr>
              {booking.rooms.map((row) => (
                <tr>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                </tr>
              ))}
              </table>
            </EntityDescription>
          </Entity>
        ))}


      </Viewer>
    }

  }
  //Code to fetch booking objects from server
  componentDidMount() {
    let currentComponent = this;
    fetch('http://localhost:8080/bookings')
    .then(res => res.json())
    .then((function(data){
      var tempBookings = data._embedded.bookings;
      tempBookings.forEach(function(booking){
        var parseString = booking.locationCoordinates.substring(1, booking.locationCoordinates.length - 1);
        var posArray = parseString.split(",");
        var locationCoordinates = Cartesian3.fromElements(parseFloat(posArray[0]), parseFloat(posArray[1]), parseFloat(posArray[2]));
        booking.locationCoordinates = locationCoordinates;
      });
      currentComponent.setState({bookings: tempBookings})
    }))
    .catch(console.log)
  }



  //Add listeners to search, triggers function to create new entity
  addListener(){
    const node = this.ref.current;

    //Saves search text for later
    node.cesiumElement.geocoder.viewModel.search.beforeExecute.addEventListener((e) => {
      var searchPosition = node.cesiumElement.geocoder.viewModel.searchText;
      this.setState((state) => {
        return {searchLoc: searchPosition}
      });
    });

    //When search is done executing, find out where the new entity will be placed
    //Save this information in the state so that the component rerenders with the new entity
    node.cesiumElement.geocoder.viewModel.search.afterExecute.addEventListener((e) => {
      let aPosition;
      const geocoder = node.cesiumElement.geocoder.viewModel._geocoderServices[1];
      let loc;
      let searchPosition = this.state.searchLoc;
      geocoder.geocode(searchPosition).then((result) => {
        loc = result[0].destination;
        if (loc instanceof Rectangle){
          let finalLocation = Rectangle.center(loc);
          aPosition = Cartesian3.fromRadians(finalLocation.longitude, finalLocation.latitude);
        }
        if (loc instanceof Cartesian3) {
          aPosition = loc
        }
        this.setState({hasSearched:true, searchPos:aPosition});
      });
    });
  }
}
export default CustomCesium;
