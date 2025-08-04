// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import ServiceDashboard from "../../ServiceProjects/ServiceDashboard";

// const AdminDashboard = () => {
//   const { encodedUserId } = useParams();
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const verifyToken = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/");
//         toast.error("Please log in to access this page.");
//         return;
//       }

//       try {
//         const response = await axios.post("http://localhost:5000/auth/verify-token", { token });
//         setUser(response.data);
//       } catch (error) {
//         console.error("Token verification failed:", error);
//         handleLogout();
//         toast.error("Invalid or expired token. Please log in again.");
//       }
//     };

//     verifyToken();
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await axios.post("http://localhost:5000/auth/logout");
//       localStorage.removeItem("token");
//       localStorage.removeItem("encodedUserId");
//       localStorage.removeItem("loginTime");
//       toast.success("Logged out successfully!");
//       setTimeout(() => {
//         navigate("/");
//       }, 2000);
//     } catch (error) {
//       console.error("Logout error:", error);
//       toast.error("Failed to log out");
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 font-sans">
//       <div className="w-full bg-white shadow-md">
//         <div className="flex justify-between items-center px-4 py-4 sm:px-6 border-b border-gray-200">
//          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
//   Welcome,{" "}
//   <span className="capitalize text-blue-700">
//     {user.user_name}
//   </span>
//   {" "}
//   <span className="text-gray-600 text-sm font-normal">
//     ({user.user_email})
//   </span>
// </h1>

//           <button
//             onClick={handleLogout}
//             className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition duration-200"
//           >
//             Logout
//           </button>
//         </div>

//         <div className="px-4 sm:px-6 py-6">
//           <ServiceDashboard />
//         </div>

//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           closeOnClick
//           pauseOnHover
//           draggable
//         />
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;



import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServiceDashboard from "../../ServiceProjects/ServiceDashboard";
import ServiceMenu from "../../ServiceProjects/ServiceMenu";
import ViewCompanyProjectSite from "../../ServiceProjects/ViewCompanyProjectSite";
import { User, X } from "lucide-react";

const AdminDashboard = () => {
  const { encodedUserId } = useParams();
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("createReckoner");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [headerHeight, setHeaderHeight] = useState(0);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const headerRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        // Use getBoundingClientRect to ensure accurate height including margins
        const height = headerRef.current.getBoundingClientRect().height;
        setHeaderHeight(height);
      }
    };

    // Initial height calculation with a slight delay to ensure DOM is fully rendered
    const initialTimeout = setTimeout(updateHeaderHeight, 100);

    // Use ResizeObserver to monitor header height changes
    const observer = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    // Update on window resize
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      clearTimeout(initialTimeout);
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

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

  const handleMenuSelect = (menuId) => {
    setActiveMenu(menuId);
    if (
      menuId === "createReckoner" ||
      menuId === "displayReckoner" ||
      menuId === "materialDispatch" ||
      menuId === "viewMaterialDispatch" ||
      menuId === "dispatchMaster" ||
      menuId === "employeeDetails" ||
      menuId === "expenseDetails" ||
      menuId === "viewCompanyProjectSite"
    ) {
      setSelectedCompanyId("");
    }
  };

  const handleCompanySelect = (companyId) => {
    setSelectedCompanyId(companyId);
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
      <div
        ref={headerRef}
        className="w-full bg-white shadow-md fixed top-0 left-0 z-50"
      >
        <div className="relative flex items-start justify-between px-4 py-4 sm:px-6 border-b border-gray-200">
          <div className="flex-1">
            <ServiceMenu
              onMenuSelect={handleMenuSelect}
              activeMenu={activeMenu}
            />
          </div>
          <div ref={profileRef} className="absolute top-4 right-4">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="User Profile"
            >
              <User size={20} />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl p-4 z-50 animate-slide-in-down">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-200 transition-all duration-200 focus:outline-none"
                    aria-label="Close Profile"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 capitalize">Name: {user.user_name}</p>
                <p className="text-sm text-gray-600">Email: {user.user_email}</p>
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="px-4 sm:px-6 py-6"
        style={{ paddingTop: `${headerHeight}px`, minHeight: "100vh" }}
      >
        {activeMenu === "viewCompanyProjectSite" ? (
          <ViewCompanyProjectSite />
        ) : (
          <ServiceDashboard
            activeMenu={activeMenu}
            onCompanySelect={handleCompanySelect}
            selectedCompanyId={selectedCompanyId}
          />
        )}
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
  );
};

export default AdminDashboard;