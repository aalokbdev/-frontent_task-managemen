import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './navbar.css';
import { useAuth } from '../../context/AuthContext';



const Navbar = () => {
 const { logout } = useAuth();
  const navigate = useNavigate();
  // const handleLogout = () => {
  //   Cookies.set("token", null);
  //   navigate("/");
  // }
  return (
    <nav className="navbar">
      <h1 className="navbar-logo">TaskManager</h1>
      <ul className="navbar-links">
        <li><Link to="/">Login</Link></li>
        <li><Link to="/signup">Signup</Link></li>
        <li onClick={logout}>Logout</li>
      </ul>
    </nav>
  )
};

export default Navbar;