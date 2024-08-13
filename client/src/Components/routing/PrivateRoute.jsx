import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const PrivateRoute = ({ Component, showToast, ...rest }) => {
	const { isLoggedIn, isLoading } = useAuth();

	if (isLoading) {
		return <i className="fa fa-spinner spinner"></i>
		;
	}

	if (!isLoggedIn) {
		return <Navigate to="/" />;
	}

	return <Component showToast={showToast} {...rest} />;
};

export default PrivateRoute;
