import React from 'react';
import './index.css';
import Menu from './Menu'

class BookingDetail extends React.Component {

    // constructor() {
    //     super();

    //     this.handleDelete = this.handleSubmit.bind(this);
    //     this.handleChange = this.handleChange.bind(this);
    // }

    handleChange = (event) => {
    }

    handleDelete = (event) => {
    }

    renderBookingLoad(booking, realtor, creator, dateRequested) {
        return (
            <div>
                <label>{booking}</label>
                <textarea class="inputText" readonly name={booking}>booking num</textarea>
            </div>
        )
    }


    render() {
        return (
            <div class="mainCenterDiv">
                <h1>iVue Booking Detail</h1>
                <div class="col">
                    <div>
                        <li>booking:</li>
                        <li>realtor:</li>
                        <li>creator:</li>
                        <li>date requested:</li>
                    </div>
                    <div>
                        <table>
                            <tr>
                                <th>Room Name</th>
                                <th>Photos</th>
                                <th>Videos</th>
                                <th>Upload / View</th>
                            </tr>
                            <tr>
                                <td>Example</td>
                                <td>1</td>
                                <td>1</td>
                                <td><button>View</button></td>
                            </tr>
                        </table>
                        <button class="button fullWidth ">Edit</button>
                    </div>
                </div>
            </div>
            )
    };
}
export default BookingDetail;