import React from 'react';
import './BookingWindow.css';
import ReactDOM from 'react-dom';
import './index.css';
import LogInScreen from './LogInScreen';

const RegisType = {
    STAFF: 0,
    REALTOR: 1,
    CONTENT_CREATOR: 2
}
const baseUrl = "http://localhost:8080/";

// Choosing which registration type you want
class SignUpScreen extends React.Component {

    goToRegistrationRealtor = () => {
        ReactDOM.render(<SignUpScreenRegistration type={RegisType.REALTOR}/>, document.getElementById('root'));
    }
    goToRegistrationContentCreator = () => {
        ReactDOM.render(<SignUpScreenRegistration type={RegisType.CONTENT_CREATOR}/>, document.getElementById('root'));
    }


    // Render first selection choosing which type of registration you are doing: creator or realtor
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

// Actual registration
class SignUpScreenRegistration extends React.Component {

    // Return to login screen functionality
    cancelRegistration = () => {
        ReactDOM.render(<LogInScreen/>, document.getElementById('root'));
    }

    constructor() {
        super();
        this.state = {
            firstName: "",
            lastName: "",
            userType: 0,    // Number [0/1/2]
            hashedPassword: "",             // Not actually hashed. Will be hashed on server
            email:    "",
            realtorId: "",
            approvalText: ""
        }
        this.typeName = "Null";
        // Used to verify both fields are the same
        this.passwords = {
            password1: "",
            password2: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.errorMessage = "";
    }

    // On screen load, choose what type name
    componentDidMount() {
        var type = this.props.type;
        this.setState({
            userType: type,
        })
        this.typeName = type === 0 ? "Staff" : type === 1 ? "Realtor" :"Content Creator";
    }

    // Updating state when user changes input
    handleChange = (event) => {
        // Update verified password
        if (["password1", "password2"].includes(event.target.name)) {
            this.passwords[event.target.name] = event.target.value;
            if (this.passwords.password1 === this.passwords.password2) {
                this.setState({hashedPassword: this.passwords.password1});
            }
        }
        // Updating all other fields
        else {
            this.setState({ [event.target.name]: event.target.value })
        }
    }

    // Submitting registration data to server
    handleSubmit = (event) => {
        event.preventDefault();

        let currentComponent = this;

        fetch(baseUrl + 'users', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            if (response.status >= 400) {
                return response.text();
            } else {
                // Go to Login Screen
                ReactDOM.render(<LogInScreen></LogInScreen>, document.getElementById('root'));
            }
            return response.json();
        }).then(function(data) {
             currentComponent.errorMessage = data;
             currentComponent.setState({["email"]: currentComponent.state.email});
        }).catch((err) => {
            console.log("Errors: ", err.response);
        });
    }

    // Reusable function to render a generalized input text field
    renderField(labelName, fieldName, inputType) {
        return (
            <div>
                <label>{labelName}</label>
                <input type={inputType} class="inputText" required name={fieldName}></input>
            </div>
        )
    }

    // Render the registration screen
    render() {
        var state = this.state;
        if (state.userType === RegisType.REALTOR) {
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
                            <br />
                            <span class="errorMessage">{this.errorMessage}</span>
                            <br />
                            <button class="button fullWidth ">Register</button>
                        </form>
                        <button onClick={this.cancelRegistration} class="button fullWidth ">Cancel</button>
                    </div>
                </div>
            )
        } else {
            return (
                <div class="mainCenterDiv">
                    <h1>iVue Real Estate Sign Up</h1>
                    <div class="subCenterDiv">
                        <h2>Sign up as a {this.typeName}</h2>
                        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                            {this.renderField("First Name", "firstName", "text")}
                            {this.renderField("Last Name", "lastName", "text")}
                            {this.renderField("Email", "email", "email")}
                            {this.renderField("Password", "password1", "password")}
                            {this.renderField("Confirm Password", "password2", "password")}
                            {this.renderField("Free text field to enter credentials (portfolio links, equipment specs, etc.) Enter sufficient detail to be approved.", "approvalText", "text")}
                            <br />
                            <span class="errorMessage">{this.errorMessage}</span>
                            <br />
                            <button class="button fullWidth ">Register</button>
                        </form>
                        <button onClick={this.cancelRegistration} class="button fullWidth ">Cancel</button>
                    </div>
                </div>
            )
        }

    };
}