import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServiceDashboard from "../../ServiceProjects/ServiceDashboard";

const AdminDashboard = () => {
  const { encodedUserId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        toast.error("Please log in to access this page.");
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/auth/verify-token", { token });
        setUser(response.data);
      } catch (error) {
        console.error("Token verification failed:", error);
        handleLogout();
        toast.error("Invalid or expired token. Please log in again.");
      }
    };

    verifyToken();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("encodedUserId");
      localStorage.removeItem("loginTime");
      toast.success("Logged out successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="w-full bg-white shadow-md">
        <div className="flex justify-between items-center px-4 py-4 sm:px-6 border-b border-gray-200">
         <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
  Welcome,{" "}
  <span className="capitalize text-blue-700">
    {user.user_name}
  </span>
  {" "}
  <span className="text-gray-600 text-sm font-normal">
    ({user.user_email})
  </span>
</h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition duration-200"
          >
            Logout
          </button>
        </div>

        <div className="px-4 sm:px-6 py-6">
          <ServiceDashboard />
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
