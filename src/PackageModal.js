import React from 'react';
import './Package.css';
import BookingScreen from './BookingScreen';
import ReactDOM from 'react-dom';

class PackageModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        showComponent: false,
        };
    this._onButtonClick = this._onButtonClick.bind(this);
    }
    
    _onButtonClick() {
    this.setState({
      showComponent: true,
    });
  }
    _test(){
        ReactDOM.render(<BookingScreen/>, document.getElementById('application'));
    }
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
        <span class="price">199$</span>
        <button onClick= {this._test}>Book Now</button>
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
        <span class="price">399$</span>
        <button onClick= {this._test}>Book Now</button>
        {this.state.showComponent ?
        <BookingScreen /> : null }
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
        <span class="price">599$</span>
        <button onClick= {this._test}>Book Now</button>
        {this.state.showComponent ?
        <BookingScreen /> : null }
    </div>
</div>
        );
    }
}
export default PackageModal;