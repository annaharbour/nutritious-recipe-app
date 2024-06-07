import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const PrivateRoute = ({Component}) => {
    const { isLoggedIn, isLoading, userInfo } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isLoggedIn && userInfo ? <Component/> : <Navigate to="/login" />;
};

export default PrivateRoute;
