import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserRoutes: React.FC = () => {
  const userID = localStorage.getItem("user_id");
  const isAuthenticated = userID && typeof userID === "string" && userID.length === 24; 

  useEffect(() => {
    const forceLogin = localStorage.getItem("reload");

    if(forceLogin === "true") {
      localStorage.removeItem("reload"); 
      window.location.reload();
    }
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default UserRoutes;
