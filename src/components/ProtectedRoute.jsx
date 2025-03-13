import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, userRole }) => {
  return allowedRoles.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to="/not-authorized" />
  );
};

export default ProtectedRoute;
