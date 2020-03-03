import React from 'react';
import './BookingWindow.css';
import { thisExpression } from '@babel/types';
import ReactDOM from 'react-dom';
import './index.css';
import Menu from './Menu'
import CustomCesium from './CustomCesium';
import LogInScreen from './LogInScreen';

const RegisType = {
    STAFF: 0,
    REALTOR: 1,
    CONTENT_CREATOR: 2
}

class SignUpScreen extends React.Component {

    goToRegistrationRealtor = () => {
        ReactDOM.render(<SignUpScreenRegistration type={RegisType.REALTOR}/>, document.getElementById('application'));
    }
    goToRegistrationContentCreator = () => {
        ReactDOM.render(<SignUpScreenRegistration type={RegisType.CONTENT_CREATOR}/>, document.getElementById('application'));
    }


    render() {
        return (
            <div class="mainCenterDiv">
                <h1>iVue Real Estate Sign Up</h1>
                <div class="subCenterDiv">
                    <h2>Sign up as a:</h2>
                    <button onClick = {this.goToRegistrationRealtor} class="button fullWidth ">Realtor</button>
                    <button onClick = {this.goToRegistrationContentCreator} class="button fullWidth ">Content Creator</button>
                </div>
            </div>
        )
    };
}
export default SignUpScreen;

class SignUpScreenRegistration extends React.Component {

    cancelRegistration = () => {
        ReactDOM.render(<LogInScreen/>, document.getElementById('application'));
    }

    constructor() {
        super();
        this.state = {
            firstName: "",
            lastName: "",
            userType: RegisType.REALTOR,    // Number [0/1/2]
            hashedPassword: "",             // Not actually hashed. Will be hashed on server
            email:    "",
            realtorId: ""
        }
        this.typeName = "Null";
        // Used to verify both fields are the same
        this.passwords = {
            password1: "",
            password2: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        var type = this.props.type;
        this.setState({
            type: type,
        })
        this.typeName = type == 0 ? "Staff" : type == 1 ? "Realtor" :"Content Creator";
    }

    handleChange = (event) => {
        console.log("Changing, ", event.target);
        // Update verified password
        if (["password1", "password2"].includes(event.target.name)) {
            this.passwords[event.target.name] = event.target.value;
            if (this.passwords.password1 == this.passwords.password2) {
                this.setState({hashedPassword: this.passwords.password1});
            }
        }
        // Updating all other fields
        else {
            this.setState({ [event.target.name]: event.target.value })
        }
        console.log("New State, ", this.state);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log("Submitting ", this.state);

        fetch('http://localhost:8080/users', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            console.log("Response Status: " + response.status);
            if (response.status >= 400) {
                return response.text();
            } else {
                // Go to Map Screen
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
        console.log("Submitted.");
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
                <h1>iVue Real Estate Sign Up</h1>
                <div class="subCenterDiv">
                    <h2>Sign up as a {this.typeName}</h2>
                    <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                        {this.renderField("First Name", "firstName", "text")}
                        {this.renderField("Last Name", "lastName", "text")}

                        {this.renderField("Realtor ID", "realtorID", "text")}
                        {this.renderField("Email", "email", "email")}
                        {this.renderField("Password", "password1", "password")}
                        {this.renderField("Confirm Password", "password2", "password")}
                        <br/>
                        <button class="button fullWidth ">Register</button>
                        <button onClick={this.cancelRegistration} class="button fullWidth ">Cancel</button>
                    </form>
                </div>
            </div>
        )
    };
}