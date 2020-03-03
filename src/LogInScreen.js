import React from 'react';
import './BookingWindow.css';
import { thisExpression } from '@babel/types';
import ReactDOM from 'react-dom';
import './index.css';
import Menu from './Menu'
import CustomCesium from './CustomCesium';
import SignUpScreen from './SignUpScreen';

const RegisType = {
    STAFF: 0,
    REALTOR: 1,
    CONTENT_CREATOR: 2
}

class LogInScreen extends React.Component {
    signUpScreen = () => {
        ReactDOM.render(<SignUpScreen/>, document.getElementById('application'));
    };

    constructor() {
        super();
        this.state = {
            // TODO: What is the state to log in with? What is server expecting?
        }
        this.typeName = "Null";


        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {

    }

    handleChange = (event) => {
        //console.log("Changing, ", event.target);
        // Update verified password
        if (["password, email"].includes(event.target.name)) {
            // TODO: Write to state password/email
        }
        // Updating all other fields
        else {
            this.setState({ [event.target.name]: event.target.value })
        }
        //console.log("New State, ", this.state);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log("Submitting ", this.state);

        fetch('http://localhost:8080/login', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            //console.log("Response Status: " + response.status);
            if (response.status >= 400) {
                // Error
                return response.text();
            } else {
                // On Success, Go to Map Screen
                sessionStorage.setItem("logged_in", true);
                sessionStorage.setItem("current_user", response.text());
                ReactDOM.render(<Menu />, document.getElementById('root'));
                var customCesium = ReactDOM.render(<CustomCesium/>, document.getElementById('application'));
                customCesium.addListener();
            }
            return response.json();
        }).then(function(data) {
            console.log("Data:", data);
        }).catch((err) => {
            console.log("Errors: ", err.response);
        });
        //console.log("Submitted.");
    }

    renderField(labelName, fieldName, inputType) {
        return (
            <div>
                <label>{labelName}</label>
                <input type={inputType} class="inputText" required name={fieldName}></input>
            </div>
        )
    }

    render() {
        return (
            <div class="mainCenterDiv">
                <h1>iVue Real Estate Log In</h1>
                <div class="subCenterDiv">
                    <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                        {this.renderField("Email", "email", "email")}
                        {this.renderField("Password", "password", "password")}
                        <br/>
                        <button class="button fullWidth ">Log In</button>
                        <button onClick={this.signUpScreen} class="button fullWidth ">Register</button>
                    </form>
                </div>
            </div>
        )
    };
}
export default LogInScreen;