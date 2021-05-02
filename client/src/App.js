import './App.css';
import { Fragment, useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import * as auth from './services/authService';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Homepage from './components/Homepage';
import NotFound from './components/NotFound';
import Logout from './components/auth/Logout';
import Navbar from './components/Navbar';
import Profile from './components/profile/Profile';
import InvalidToken from './components/InvalidToken';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const login = async () => {
      const token = auth.getJwtWithSession();
      if (token) {
        try {
          const currentUser = await auth.loginWithJwt();
          setUser(currentUser);
        } catch (error) {}
      }
    };
    login();
  }, []);

  return (
    <Fragment>
      <Navbar user={user} />
      <Switch>
        <Route path="/login">
          <Login user={user} setUser={setUser} />
        </Route>

        <Route path="/register">
          <Register />
        </Route>

        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>

        <Route path="/reset-password/:token">
          <ResetPassword />
        </Route>

        <Route path="/invalid-token">
          <InvalidToken />
        </Route>

        <Route path="/not-found">
          <NotFound />
        </Route>

        {auth.getJwtWithSession() ? '' : <Redirect to="/login" />}

        <Route path="/logout">
          <Logout />
        </Route>

        <Route path="/user">
          <Profile user={user ? user : { name: '' }} setUser={setUser} />
        </Route>

        <Route exact path="/">
          <Homepage user={user} setUser={setUser} />
        </Route>

        <Redirect to="/not-found" />
      </Switch>
    </Fragment>
  );
}

export default App;
