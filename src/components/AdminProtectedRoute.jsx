import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = ({ allowedRole, userRole }) => {
  return allowedRole.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to="/not-authorized" />
  );
};

export default AdminProtectedRoute;