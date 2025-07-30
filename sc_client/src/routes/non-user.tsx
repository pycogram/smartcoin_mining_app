import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const NonUserRoutes: React.FC = () => {
  const userID = localStorage.getItem("user_id");
  const isAuthenticated = userID && typeof userID === "string" && userID.length === 24;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default NonUserRoutes;
