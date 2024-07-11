import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
	const isLoggedIn = useAuth().isLoggedIn;
	const logoutUser = useAuth().logoutUser;

	const logout = async () => {
		try {
			await logoutUser()
		} catch(err){			
			console.log('Error logging out:', err)
	}
}

	const authLinks = (
	  <ul>
	    <li>
	      <Link to="/dashboard">
	        <i className="fas fa-user" />{' '}
	      </Link>
	    </li>
	    <li onClick={logout}>
	     Logout
	    </li>
	  </ul>
	);

	const guestLinks = (
		<ul>
			<li>
				<Link to="/" formType='register'>Sign Up</Link>
			</li>
			<li>
				<Link to="/"  formType={'login'}>Login</Link>
			</li>
		</ul>

	);

	return isLoggedIn ? (
		<nav>{authLinks}</nav>

	) : (
		<nav>{guestLinks}</nav>
	);
};

export default Navbar;
