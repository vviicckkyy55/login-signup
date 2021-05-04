import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios'

import Form from '../form';
import '../form.css';

class SignUp extends React.Component {
    
    activateAccount(event) {
        const {token} = req.body;
        if(token) {
            axios.post('/api/email-activate')
        }
    }
    
    render () {

        return (
            <button
                onClick={this.activateAccount.bind(this)}
            >link here</button>
        );
    }
}

export default SignUp;