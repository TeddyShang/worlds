import React from 'react';
import './BookingWindow.css';
import ReactDOM from 'react-dom';
import './index.css';
import Menu from './Menu'
import CustomCesium from './CustomCesium';
import SignUpScreen from './SignUpScreen';

const baseUrl = 'http://localhost:8080/';

class LogInScreen extends React.Component {
    signUpScreen = () => {
        ReactDOM.render(<SignUpScreen/>, document.getElementById('root'));
    };

    constructor() {
        super();
        this.state = {
            // Email
            // Password
        }
        this.typeName = "Null";
        this.errorMessage = "";


        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // On screen load, reset error message
    componentDidMount() {
        this.errorMessage = "";
    }

    // Update username and password
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    // Submits login data functionality
    handleSubmit = (event) => {
        event.preventDefault();
        let currentComponent = this;

        //new
        let errorStatus = null;

         fetch(baseUrl + 'login', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            if (response.status >= 400) {
                errorStatus = true;
                // Error
                return response.text();
            } else {
                errorStatus = false;
                return response.json();

            }
        }).then(function (data) {
            if (errorStatus) {
                //this.errorMessage = data;
                currentComponent.errorMessage = data;
                currentComponent.setState({ ["email"]: currentComponent.state.email });
                return data;
            } else {
                // On Success, Go to Map Screen
                sessionStorage.setItem("logged_in", true);
                sessionStorage.setItem("current_user", JSON.stringify(data));
                ReactDOM.render(<Menu />, document.getElementById('root'));
                var customCesium = ReactDOM.render(<CustomCesium />, document.getElementById('application'));
                customCesium.addListener();
            }    
        }).catch((err) => {
            console.log("Errors: ", err.response);
        });
    }

    // Simple reusable log in field rendering
    renderField(labelName, fieldName, inputType) {
        return (
            <div>
                <label>{labelName}</label>
                <input type={inputType} class="inputText" required name={fieldName}></input>
            </div>
        )
    }


    // Renders login screen
    render() {
        return (
            <div class="mainCenterDiv">
                <h1>iVue Real Estate Log In</h1>
                <div class="subCenterDiv">
                    <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                        {this.renderField("Email", "email", "email")}
                        {this.renderField("Password", "password", "password")}
                        
                        <span class="errorMessage">{this.errorMessage}</span>
                        <br/>
                        <button class="button fullWidth ">Log In</button>
                    </form>
                    <button onClick={this.signUpScreen} class="button fullWidth ">Register</button>
                </div>
            </div>
        )
    };
}
export default LogInScreen;