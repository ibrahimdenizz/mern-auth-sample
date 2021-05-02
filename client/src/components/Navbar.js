import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Homepage
        </NavLink>

        <div className="collapse navbar-collapse" id="navbarNav">
          {user ? (
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link active" to="/user">
                  {user.name}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/logout">
                  Logout
                </NavLink>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link active" to="/login">
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/register">
                  Register
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
