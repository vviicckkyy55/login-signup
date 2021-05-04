import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

import Form from '../form';
import '../form.css';

class SignUp extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            redirect: localStorage.getItem('userTokenTime') ? true : false
        }

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.nameInputChangeHandler = this.nameInputChangeHandler.bind(this);
        // this.lastNameInputChangeHandler = this.lastNameInputChangeHandler.bind(this);
        this.emailInputChangeHandler = this.emailInputChangeHandler.bind(this);
        this.passwordInputChangeHandler = this.passwordInputChangeHandler.bind(this);
    }

    onSubmitHandler (e) {
        e.preventDefault();
        if (!(this.state.firstName === '' || this.state.lastName === '' || this.state.email === '' || this.state.password === '')
          &&(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.state.email))) {
            this.props.history.push('/signIn')
            axios.post('/api/signUp', {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
            }).then(res => {
                console.log(res);
                this.setState({
                    redirect: true
                });
                window.location.replace("http://localhost:3000/signIn");
            }).catch(err => {
                console.log(err);
            });
        } else {
            alert('Please enter valid details');
        }
    }

    nameInputChangeHandler(event) {
        this.setState({
            name: event.target.value
        });
    }

    // lastNameInputChangeHandler(event) {
    //     this.setState({
    //         lastName: event.target.value
    //     });
    // }

    emailInputChangeHandler(event) {
        this.setState({
            email: event.target.value
        });
    }

    passwordInputChangeHandler(event) {
        this.setState({
            password: event.target.value
        });
    }

    render () {

        return (
            <Form onSubmit={this.onSubmitHandler.bind(this)}>
                <h3 className="text center text-info">Register</h3>
                <div className="form-group">
                    <label htmlFor="name" className="text-info">Name</label><br />
                    <input
                    id="name"
                    className="form-control"
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={this.nameInputChangeHandler}
                    required />
                </div>
                {/* <div className="form-group">
                    <label htmlFor="last-name" className="text-info">Last Name</label><br />
                    <input
                    id="last-name"
                    className="form-control"
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    onChange={this.lastNameInputChangeHandler}
                    required />
                </div> */}
                <div className="form-group">
                    <label htmlFor="email" className="text-info">Email</label><br />
                    <input
                    id="email"
                    className="form-control"
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={this.emailInputChangeHandler}
                    required />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="text-info">Password</label><br />
                    <input
                    id="password"
                    className="form-control"
                    type="text"
                    name="password"
                    placeholder="*********"
                    onChange={this.passwordInputChangeHandler}
                    required />
                </div>
                <div className="d-flex justify-content-between align-items-end">
                    <input type="submit" name="submit" className="btn btn-info btn-md" value="Submit" />
                    <Link to="/signIn" className="text-info">Login here</Link>
                </div>
            </Form>
        );
    }
}

export default SignUp;