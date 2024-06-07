import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
const Dashboard = () => {
	const userInfo = useAuth().userInfo;

	return (
		<section className="container">
			<h1 className="large text-primary">Dashboard</h1>
			<h1>
				<Link to='/profile'><i className="fas fa-user"></i></Link>
				Hello, {userInfo.name}
			</h1>
		</section>
	);
};

export default Dashboard;
