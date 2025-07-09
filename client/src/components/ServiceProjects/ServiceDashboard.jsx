// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Building2 } from "lucide-react";
// import Swal from "sweetalert2";
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
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to load companies. Please try again.",
//         confirmButtonColor: "#2563eb",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCompanies();
//   }, []);

//   const handleViewChange = (view, companyId = selectedCompanyId) => {
//     setActiveView(view);
//     setSelectedCompanyId(companyId);
//   };

//   const renderActiveView = () => {
//     switch (activeView) {
//       case "createCompany":
//         return <CompanyCreation onSubmit={fetchCompanies} />;
//       case "createProject":
//         return selectedCompanyId ? (
//           <ProjectCreation companyId={selectedCompanyId} onClose={() => handleViewChange("createCompany")} />
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
//         return <CompanyCreation onSubmit={fetchCompanies} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 |to-gray-100 flex p-4 sm:p-6 md:p-8">
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
import { Building2 } from "lucide-react";
import CompanyCreation from "./CompanyCreation";
import ViewCompanies from "./ViewCompanies";
import ProjectCreation from "./ProjectCreation";
import ViewProjects from "./ViewProjects";

const ServiceDashboard = () => {
  const [activeView, setActiveView] = useState("createCompany");
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/project/companies");
      setCompanies(response.data || []);
      if (response.data.length > 0 && !selectedCompanyId) {
        setSelectedCompanyId(response.data[0].company_id);
      }
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

  const handleCompanyCreated = (companyId) => {
    setSelectedCompanyId(companyId);
    setActiveView("createProject");
    fetchCompanies(); // Refresh company list
  };

  const handleProjectCreated = (companyId) => {
    setSelectedCompanyId(companyId);
    setActiveView("viewProjects");
  };

  const handleViewChange = (view, companyId = selectedCompanyId) => {
    setActiveView(view);
    setSelectedCompanyId(companyId);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "createCompany":
        return <CompanyCreation onCompanyCreated={handleCompanyCreated} />;
      case "createProject":
        return selectedCompanyId ? (
          <ProjectCreation
            companyId={selectedCompanyId}
            onClose={() => handleViewChange("createCompany")}
            onProjectCreated={() => handleProjectCreated(selectedCompanyId)}
          />
        ) : (
          <div className="text-center text-gray-600 text-lg">
            Please select a company to create a project.
          </div>
        );
      case "viewProjects":
        return selectedCompanyId ? (
          <ViewProjects companyId={selectedCompanyId} />
        ) : (
          <div className="text-center text-gray-600 text-lg">
            Please select a company to view projects.
          </div>
        );
      default:
        return <CompanyCreation onCompanyCreated={handleCompanyCreated} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex p-4 sm:p-6 md:p-8">
      <div className="flex flex-col md:flex-row w-full max-w-7xl gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Service Dashboard</h2>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-700">Companies</h3>
            <button
              onClick={() => handleViewChange("createCompany")}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Create New Company"
              title="Create New Company"
            >
              <Building2 size={20} />
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm animate-fade-in">
              {error}
            </div>
          ) : (
            <ViewCompanies
              onCreateProject={(companyId) => handleViewChange("createProject", companyId)}
              onViewProjects={(companyId) => handleViewChange("viewProjects", companyId)}
              onUpdate={fetchCompanies}
            />
          )}
        </div>
        {/* Main Content */}
        <div className="w-full md:w-2/3 bg-white rounded-xl shadow-lg p-6">
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
};

export default ServiceDashboard;