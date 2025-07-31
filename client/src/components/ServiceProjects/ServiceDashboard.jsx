// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import ServiceMenu from "./ServiceMenu";
// import ViewCompanies from "./ViewCompanies";
// import ViewProjects from "./ViewProjects";
// import CreateReckoner from "./CreateReckoner";
// import DisplayReckoner from "./DisplayReckoner";
// import CompanyCreation from "./CompanyCreation";
// import ProjectCreation from "./ProjectCreation";
// import MaterialDispatch from "./MaterialDispatch";
// import ViewMaterialDispatch from "./ViewMaterialDispatch";
// import DispatchMaster from "./DispatchMaster";
// import EmployeeDetails from "./EmployeeDetails"; // Added EmployeeDetails import
// import Swal from "sweetalert2";

// const ServiceDashboard = () => {
//   const location = useLocation();
//   const [activeView, setActiveView] = useState("createReckoner");
//   const [companies, setCompanies] = useState([]);
//   const [selectedCompanyId, setSelectedCompanyId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showCompanyModal, setShowCompanyModal] = useState(false);
//   const [showProjectModal, setShowProjectModal] = useState(false);

//   const fetchCompanies = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:5000/project/companies");
//       setCompanies(response.data || []);
//     } catch (error) {
//       console.error("Error fetching companies:", error);
//       setError("Failed to load companies. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCompanies();
//   }, []);

//   useEffect(() => {
//     if (location.state?.view) {
//       setActiveView(location.state.view);
//       if (location.state.companyId) {
//         setSelectedCompanyId(location.state.companyId);
//       }
//     }
//   }, [location.state]);

//   const handleMenuSelect = (view) => {
//     setActiveView(view);
//     if (
//       view === "createReckoner" ||
//       view === "displayReckoner" ||
//       view === "materialDispatch" ||
//       view === "viewMaterialDispatch" ||
//       view === "dispatchMaster" ||
//       view === "employeeDetails" // Clear companyId for employeeDetails
//     ) {
//       setSelectedCompanyId("");
//     }
//   };

//   const handleCompanySelect = (companyId) => {
//     setSelectedCompanyId(companyId);
//   };

//   const handleCompanyCreated = () => {
//     fetchCompanies();
//     setShowCompanyModal(false);
//     Swal.fire({
//       position: "top-end",
//       icon: "success",
//       title: "Company created successfully!",
//       showConfirmButton: false,
//       timer: 2000,
//       toast: true,
//       background: "#ecfdf5",
//       iconColor: "#10b981",
//     });
//   };

//   const handleProjectCreated = () => {
//     fetchCompanies();
//     setShowProjectModal(false);
//     Swal.fire({
//       position: "top-end",
//       icon: "success",
//       title: "Project created successfully!",
//       showConfirmButton: false,
//       timer: 2000,
//       toast: true,
//       background: "#ecfdf5",
//       iconColor: "#10b981",
//     });
//   };

//   const renderActiveView = () => {
//     if (loading) {
//       return (
//         <div className="flex justify-center items-center h-full min-h-[50vh]">
//           <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-indigo-600"></div>
//         </div>
//       );
//     }

//     if (error) {
//       return (
//         <div className="p-4 sm:p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm sm:text-base animate-pulse">
//           {error}
//         </div>
//       );
//     }

//     switch (activeView) {
//       case "viewCompanies":
//         return <ViewCompanies onUpdate={fetchCompanies} />;
//       case "viewProjects":
//         return <ViewProjects companyId={selectedCompanyId} />;
//       case "displayReckoner":
//         return <DisplayReckoner />;
//       case "materialDispatch":
//         return <MaterialDispatch />;
//       case "viewMaterialDispatch":
//         return <ViewMaterialDispatch />;
//       case "dispatchMaster":
//         return <DispatchMaster />;
//       case "employeeDetails":
//         return <EmployeeDetails />; // Render EmployeeDetails
//       case "createReckoner":
//         return (
//           <CreateReckoner
//             onShowCompanyModal={() => setShowCompanyModal(true)}
//             onShowProjectModal={() => setShowProjectModal(true)}
//             selectedCompany={selectedCompanyId}
//             onCompanySelect={handleCompanySelect}
//             companies={companies}
//           />
//         );
//       default:
//         return <CreateReckoner />;
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
//       <ServiceMenu onMenuSelect={handleMenuSelect} activeMenu={activeView} />

//       <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto">
//         <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 max-w-full mx-auto border border-gray-200">
//           {renderActiveView()}
//         </div>
//       </div>

//       {showCompanyModal && (
//         <div
//           className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-0 animate-fade-in"
//           onClick={() => setShowCompanyModal(false)}
//           role="dialog"
//           aria-modal="true"
//           aria-label="Create Company Modal"
//         >
//           <div
//             className="w-full max-w-[90%] sm:max-w-md md:max-w-lg transform transition-all duration-300 animate-slide-in-up bg-white rounded-xl shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <CompanyCreation onCompanyCreated={handleCompanyCreated} onClose={() => setShowCompanyModal(false)} />
//           </div>
//         </div>
//       )}

//       {showProjectModal && (
//         <div
//           className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-0 animate-fade-in"
//           onClick={() => setShowProjectModal(false)}
//           role="dialog"
//           aria-modal="true"
//           aria-label="Create Project Modal"
//         >
//           <div
//             className="w-full max-w-[90%] sm:max-w-md md:max-w-lg transform transition-all duration-300 animate-slide-in-up bg-white rounded-xl shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <ProjectCreation
//               companyId={selectedCompanyId}
//               onProjectCreated={handleProjectCreated}
//               onClose={() => setShowProjectModal(false)}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ServiceDashboard;












import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ServiceMenu from "./ServiceMenu";
import ViewCompanies from "./ViewCompanies";
import ViewProjects from "./ViewProjects";
import CreateReckoner from "./CreateReckoner";
import DisplayReckoner from "./DisplayReckoner";
import CompanyCreation from "./CompanyCreation";
import ProjectCreation from "./ProjectCreation";
import MaterialDispatch from "./MaterialDispatch";
import ViewMaterialDispatch from "./ViewMaterialDispatch";
import DispatchMaster from "./DispatchMaster";
import EmployeeDetails from "./EmployeeDetails";
import ExpenseDetails from "./ExpenseDetails";
import Swal from "sweetalert2";

const ServiceDashboard = () => {
  const location = useLocation();
  const [activeView, setActiveView] = useState("createReckoner");
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/project/companies");
      // Ensure response.data is an array
      setCompanies(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to load companies. Please try again.");
      setCompanies([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (location.state?.view) {
      setActiveView(location.state.view);
      if (location.state.companyId) {
        setSelectedCompanyId(location.state.companyId);
      }
    }
  }, [location.state]);

  const handleMenuSelect = (view) => {
    setActiveView(view);
    if (
      view === "createReckoner" ||
      view === "displayReckoner" ||
      view === "materialDispatch" ||
      view === "viewMaterialDispatch" ||
      view === "dispatchMaster" ||
      view === "employeeDetails" ||
      view === "expenseDetails"
    ) {
      setSelectedCompanyId("");
    }
  };

  const handleCompanySelect = (companyId) => {
    setSelectedCompanyId(companyId);
  };

  const handleCompanyCreated = () => {
    fetchCompanies();
    setShowCompanyModal(false);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Company created successfully!",
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      background: "#ecfdf5",
      iconColor: "#10b981",
    });
  };

  const handleProjectCreated = () => {
    fetchCompanies();
    setShowProjectModal(false);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Project created successfully!",
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      background: "#ecfdf5",
      iconColor: "#10b981",
    });
  };

  const renderActiveView = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 sm:p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm sm:text-base animate-pulse">
          {error}
        </div>
      );
    }

    switch (activeView) {
      case "viewCompanies":
        return <ViewCompanies onUpdate={fetchCompanies} />;
      case "viewProjects":
        return <ViewProjects companyId={selectedCompanyId} />;
      case "displayReckoner":
        return <DisplayReckoner />;
      case "materialDispatch":
        return <MaterialDispatch />;
      case "viewMaterialDispatch":
        return <ViewMaterialDispatch />;
      case "dispatchMaster":
        return <DispatchMaster />;
      case "employeeDetails":
        return <EmployeeDetails />;
      case "expenseDetails":
        return <ExpenseDetails />;
      case "createReckoner":
        return (
          <CreateReckoner
            onShowCompanyModal={() => setShowCompanyModal(true)}
            onShowProjectModal={() => setShowProjectModal(true)}
            selectedCompany={selectedCompanyId}
            onCompanySelect={handleCompanySelect}
            companies={companies} // Always an array due to fetchCompanies
          />
        );
      default:
        return (
          <CreateReckoner
            onShowCompanyModal={() => setShowCompanyModal(true)}
            onShowProjectModal={() => setShowProjectModal(true)}
            selectedCompany={selectedCompanyId}
            onCompanySelect={handleCompanySelect}
            companies={companies}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <ServiceMenu onMenuSelect={handleMenuSelect} activeMenu={activeView} />

      <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 max-w-full mx-auto border border-gray-200">
          {renderActiveView()}
        </div>
      </div>

      {showCompanyModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-0 animate-fade-in"
          onClick={() => setShowCompanyModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Create Company Modal"
        >
          <div
            className="w-full max-w-[90%] sm:max-w-md md:max-w-lg transform transition-all duration-300 animate-slide-in-up bg-white rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CompanyCreation onCompanyCreated={handleCompanyCreated} onClose={() => setShowCompanyModal(false)} />
          </div>
        </div>
      )}

      {showProjectModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-0 animate-fade-in"
          onClick={() => setShowProjectModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Create Project Modal"
        >
          <div
            className="w-full max-w-[90%] sm:max-w-md md:max-w-lg transform transition-all duration-300 animate-slide-in-up bg-white rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ProjectCreation
              companyId={selectedCompanyId}
              onProjectCreated={handleProjectCreated}
              onClose={() => setShowProjectModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDashboard;