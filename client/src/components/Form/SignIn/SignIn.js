import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import GoogleLogin from 'react-google-login';

import Form from '../form';
import '../form.css';
import Navbar from '../../Navbar/Navbar';


class SignIn extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      token: '',
      redirect: localStorage.getItem('userTokenTime') ? true : false
    }

    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.emailInputChangeHandler = this.emailInputChangeHandler.bind(this);
    this.passwordInputChangeHandler = this.passwordInputChangeHandler.bind(this);
    this.responseSuccessGoogle = this.responseSuccessGoogle.bind(this);
    this.responseErrorGoogle = this.responseErrorGoogle.bind(this);
  }


  async onSubmitHandler () {
    if(!(this.state.email === '' || this.state.password === '')
     && (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.state.email))) {
      axios.post('/api/signIn', {
        email: this.state.email,
        password: this.state.password
      }).then(res => {
        console.log(res);
        this.setState({
          token: res.data.token
        });
        const data = {
          token: this.state.token,
          time: new Date().getTime()
        }
        localStorage.setItem('userTokenTime', JSON.stringify(data));
        this.setState({
          redirect: true
        });
        window.location.replace("http://localhost:3000/upload");
      }).catch(err => {
        console.log(err);
      });
    } else {
      alert('Please enter valid details');
    }
  }

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

  responseSuccessGoogle(response) {
    console.log(response);
    axios({
      method: "POST",
      url: "http://localhost:3333/api/googlelogin",
      data: {
        tokenId: response.tokenId,
        time: new Date().getTime()}
    }).then (response => {
      console.log("Google Login success", response);
      localStorage.setItem('userTokenTime', JSON.stringify(response.data));
        this.setState({
          redirect: true
        });
      window.location.replace("http://localhost:3000/upload");
      
    })
  }

  responseErrorGoogle(error) {
    console.log(error);
  }


  render () {
    return (
      <React.Fragment>
        <Navbar />
        <Form onSubmit={this.onSubmitHandler.bind(this)}>
          <h3 className="text-center text-info">Login</h3>
          <div className="form-group">
            <label htmlFor="email" className="text-info">Email:</label><br />
            <input 
              id="email"
              className="form-control"
              type="email"
              name="email"
              placeholder="example@gmail.com"
              onChange={this.emailInputChangeHandler}
              required />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="text-info">Email:</label><br />
            <input 
              id="password"
              className="form-control"
              type="password"
              name="password"
              placeholder="***********"
              onChange={this.passwordInputChangeHandler}
              required />
          </div>
          <div className="d-flex justify-content-between align-items-end">
            <button onClick={this.onSubmitHandler} className="btn btn-info btn-md" type="button">Submit</button>
            
            <Link to="/signUp" className="text-info">Sign Up Here</Link>
          </div>
          <div />
          <GoogleLogin
              clientId="328323452877-89c22rms5122d9keh95lifr1ori2efuh.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={this.responseSuccessGoogle}
              onFailure={this.responseErrorGoogle}
              cookiePolicy={'single_host_origin'}
              />
        </Form>

      </React.Fragment>
    )
  }
}

export default  SignIn;