import React from 'react';
import './BookingWindow.css';
import { thisExpression } from '@babel/types';
import ReactDOM from 'react-dom';
import './index.css';
import Menu from './Menu'
import CustomCesium from './CustomCesium';


class SignUpScreen extends React.Component {

    render() {
        return (
            <div class="mainCenterDiv">
                <h1>iVue Real Estate Sign Up</h1>
                <div class="subCenterDiv">
                    <h2>Sign up as a:</h2>
                    <button class="button fullWidth ">Realtor</button>
                    <button class="button fullWidth ">Content Creator</button>
                </div>
            </div>
        )
    };
}
export default SignUpScreen;