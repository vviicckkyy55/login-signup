import React from 'react';
import { Route } from 'react-router-dom';

import SignIn from './components/Form/SignIn/SignIn';
import SignUp from './components/Form/SignUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Upload from './components/Upload/Upload';
import SignOut from './components/SignOut/SignOut'

function App() {
  return (
    <React.Fragment>
      <Route exact path="/signIn" component={SignIn} />
      <Route exact path="/signUp" component={SignUp} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/upload" component={Upload} />
      <Route exact path="/signOut" component={SignOut} />
    </React.Fragment>
    
  );
}

export default App;
