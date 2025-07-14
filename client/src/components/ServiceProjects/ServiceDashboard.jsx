// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Building2 } from "lucide-react";
// import CompanyCreation from "./CompanyCreation";
// import ViewCompanies from "./ViewCompanies";
// import ProjectCreation from "./ProjectCreation";
// import ViewProjects from "./ViewProjects";

// const ServiceDashboard = () => {
//   const [activeView, setActiveView] = useState("createCompany");
//   const [companies, setCompanies] = useState([]);
//   const [selectedCompanyId, setSelectedCompanyId] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchCompanies = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:5000/project/companies");
//       setCompanies(response.data || []);
//       if (response.data.length > 0 && !selectedCompanyId) {
//         setSelectedCompanyId(response.data[0].company_id);
//       }
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

//   const handleCompanyCreated = (companyId) => {
//     setSelectedCompanyId(companyId);
//     setActiveView("createProject");
//     fetchCompanies(); // Refresh company list
//   };

//   const handleProjectCreated = (companyId) => {
//     setSelectedCompanyId(companyId);
//     setActiveView("viewProjects");
//   };

//   const handleViewChange = (view, companyId = selectedCompanyId) => {
//     setActiveView(view);
//     setSelectedCompanyId(companyId);
//   };

//   const renderActiveView = () => {
//     switch (activeView) {
//       case "createCompany":
//         return <CompanyCreation onCompanyCreated={handleCompanyCreated} />;
//       case "createProject":
//         return selectedCompanyId ? (
//           <ProjectCreation
//             companyId={selectedCompanyId}
//             onClose={() => handleViewChange("createCompany")}
//             onProjectCreated={() => handleProjectCreated(selectedCompanyId)}
//           />
//         ) : (
//           <div className="text-center text-gray-600 text-lg">
//             Please select a company to create a project.
//           </div>
//         );
//       case "viewProjects":
//         return selectedCompanyId ? (
//           <ViewProjects companyId={selectedCompanyId} />
//         ) : (
//           <div className="text-center text-gray-600 text-lg">
//             Please select a company to view projects.
//           </div>
//         );
//       default:
//         return <CompanyCreation onCompanyCreated={handleCompanyCreated} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex p-4 sm:p-6 md:p-8">
//       <div className="flex flex-col md:flex-row w-full max-w-7xl gap-6">
//         {/* Sidebar */}
//         <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">Service Dashboard</h2>
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-lg font-medium text-gray-700">Companies</h3>
//             <button
//               onClick={() => handleViewChange("createCompany")}
//               className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               aria-label="Create New Company"
//               title="Create New Company"
//             >
//               <Building2 size={20} />
//             </button>
//           </div>
//           {loading ? (
//             <div className="flex justify-center items-center h-32">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
//             </div>
//           ) : error ? (
//             <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm animate-fade-in">
//               {error}
//             </div>
//           ) : (
//             <ViewCompanies
//               onCreateProject={(companyId) => handleViewChange("createProject", companyId)}
//               onViewProjects={(companyId) => handleViewChange("viewProjects", companyId)}
//               onUpdate={fetchCompanies}
//             />
//           )}
//         </div>
//         {/* Main Content */}
//         <div className="w-full md:w-2/3 bg-white rounded-xl shadow-lg p-6">
//           {renderActiveView()}
//         </div>
//       </div>
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
      setCompanies(response.data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to load companies. Please try again.");
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
    if (view === "createReckoner" || view === "displayReckoner") {
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
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-lg animate-fade-in">
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
      case "createReckoner":
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
    <div className="min-h-screen flex bg-gradient-to-br from-gray-100 to-indigo-100">
      <ServiceMenu onMenuSelect={handleMenuSelect} activeMenu={activeView} />

      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto transition-all duration-300">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-7xl mx-auto border border-gray-200/50 backdrop-blur-md bg-opacity-95">
          {renderActiveView()}
        </div>
      </div>

      {showCompanyModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setShowCompanyModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Create Company Modal"
        >
          <div
            className="w-full max-w-md sm:max-w-lg transform transition-all duration-500 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <CompanyCreation onCompanyCreated={handleCompanyCreated} />
          </div>
        </div>
      )}

      {showProjectModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setShowProjectModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Create Project Modal"
        >
          <div
            className="w-full max-w-md sm:max-w-lg transform transition-all duration-500 animate-slide-in-right"
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