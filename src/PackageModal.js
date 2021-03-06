import React from 'react';
import './Package.css';
import BookingScreen from './BookingScreen';
import ReactDOM from 'react-dom';


class PackageModal extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
        showComponent: false,
        packageCosts : [199,399,599]
        };
    this._onButtonClick = this._onButtonClick.bind(this);
    this.book = this.book.bind(this);
    }
    
    // Toggling Component Showing
    _onButtonClick() {
    this.setState({
      showComponent: true,
    });
  }
    // Change to booking screen given parameter of what was selected
    book(index){
        var cost = this.state.packageCosts[index];
        ReactDOM.render(<BookingScreen cost = {cost} locationCoordinates={this.props.locationCoordinates} address={this.props.address}/>, document.getElementById('application'));
    }
    // Render window
    render () {
        return (
            <div>
                <div class="bookingWindow">
                    <h2>Photos</h2>
                    <ul>
                        <li>60 Interior/Exterior Photos</li>
                        <li>Schedule Anytime</li>
                        <li>Edited & Formatted for MLS</li>
                        <li>Delivered within 48 hours</li>
                    </ul>
                    <span class="price">${this.state.packageCosts[0]}</span>
                    <button onClick={() => {this.book(0)}} >Book Now</button>
                </div>
                <div class="bookingWindow">
                    <h2>Photo & Video</h2>
                    <ul>
                        <li>60 Interior/Exterior Photos</li>
                        <li>90 Second Video</li>
                        <li>Schedule Anytime</li>
                        <li>Photos Edited & Formatted for MLS</li>
                        <li>Photos Delivered Within 48 Hours</li>
                        <li>Video Delivered Within 3-5 Days</li>
                    </ul>
                    <span class="price">${this.state.packageCosts[1]}</span>
                    <button onClick={() => {this.book(1)}}>Book Now</button>
                </div>
                <div class="bookingWindow">
                    <h2>Photo, Video, & Drone</h2>
                    <ul>
                        <li>60 Ground/Aerial Photos</li>
                        <li>90 Second Video (Incl. Drone)</li>
                        <li>Schedule Anytime</li>
                        <li>Photos Edited & Formatted for MLS</li>
                        <li>Photos Delivered Within 48 Hours</li>
                        <li>Video Delivered Within 3-5 Days</li>
                    </ul>
                    <span class="price">${this.state.packageCosts[2]}</span>
                    <button onClick={() => {this.book(2)}}>Book Now</button>
                </div>
            </div>
        );
    }
}
export default PackageModal;