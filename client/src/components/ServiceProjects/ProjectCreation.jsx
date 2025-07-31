// import { useState, useEffect } from "react";
// import axios from "axios";
// import { X, FolderPlus, Loader2, Plus } from "lucide-react";
// import Swal from "sweetalert2";

// const ProjectCreation = ({ companyId, onClose, onProjectCreated }) => {
//   const [formData, setFormData] = useState({
//     project_name: "",
//     site_name: "",
//     po_number: "",
//     start_date: "",
//     end_date: "",
//     incharge_type: "",
//     location_id: "",
//     new_location_name: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [companyName, setCompanyName] = useState("");
//   const [siteIncharges, setSiteIncharges] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [isNewProject, setIsNewProject] = useState(false);
//   const [isNewLocation, setIsNewLocation] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchData = async () => {
//     try {
//       const [companyResponse, siteInchargesResponse, projectsResponse, locationsResponse] = await Promise.all([
//         axios.get(`http://localhost:5000/project/companies/${companyId}`),
//         axios.get("http://localhost:5000/project/site-incharges"),
//         axios.get(`http://localhost:5000/project/projects/${companyId}`),
//         axios.get(`http://localhost:5000/project/locations`),
//       ]);
//       setCompanyName(companyResponse.data.company_name || "Unknown Company");
//       setSiteIncharges(siteInchargesResponse.data || []);
//       setProjects(projectsResponse.data || []);
//       setLocations(locationsResponse.data || []);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError("Failed to load necessary data. Please try again later.");
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to fetch data. Please try again.",
//         confirmButtonColor: "#3b82f6",
//       });
//     }
//   };

//   useEffect(() => {
//     if (companyId) {
//       fetchData();
//     } else {
//       setError("No company selected. Please select a company first.");
//       Swal.fire({
//         icon: "warning",
//         title: "No Company Selected",
//         text: "Please select a company before creating a project.",
//         confirmButtonColor: "#3b82f6",
//       });
//       onClose();
//     }
//   }, [companyId, onClose]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const toggleNewProjectInput = () => {
//     setIsNewProject(!isNewProject);
//     setFormData({ ...formData, project_name: "" });
//   };

//   const toggleNewLocationInput = () => {
//     setIsNewLocation(!isNewLocation);
//     setFormData({ ...formData, location_id: "", new_location_name: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const projectData = {
//         ...formData,
//         company_id: companyId,
//         project_type: "service",
//       };
//       if (!isNewLocation) {
//         delete projectData.new_location_name;
//       } else {
//         delete projectData.location_id;
//       }
//       await axios.post("http://localhost:5000/project/create-project-site", projectData);
//       setFormData({
//         project_name: "",
//         site_name: "",
//         po_number: "",
//         start_date: "",
//         end_date: "",
//         incharge_type: "",
//         location_id: "",
//         new_location_name: "",
//       });
//       setIsNewProject(false);
//       setIsNewLocation(false);
//       await fetchData();
//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: `Project ${formData.project_name} and site created successfully for ${companyName}. Would you like to view the created projects?`,
//         showCancelButton: true,
//         confirmButtonColor: "#3b82f6",
//         cancelButtonColor: "#ef4444",
//         confirmButtonText: "View created projects",
//         cancelButtonText: "Stay here",
//       }).then((result) => {
//         if (result.isConfirmed && onProjectCreated) {
//           onProjectCreated(companyId);
//         } else {
//           onClose();
//         }
//       });
//     } catch (error) {
//       console.error("Error creating project:", error);
//       setError(error.response?.data?.error || "Failed to create project and site. Please try again.");
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.response?.data?.error || "Failed to create project and site. Please try again.",
//         confirmButtonColor: "#3b82f6",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 transform transition-all duration-500">
//       <div className="flex justify-between items-center mb-8">
//         <div className="flex items-center space-x-3">
//           <FolderPlus className="text-indigo-600" size={28} />
//           <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             Create Sites for {companyName || "Selected Company"}
//           </h3>
//         </div>
//         <button
//           onClick={onClose}
//           className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
//           aria-label="Close Modal"
//         >
//           <X size={24} className="text-gray-600" />
//         </button>
//       </div>
//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm animate-fade-in">
//           {error}
//         </div>
//       )}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
//             <div className="flex items-center space-x-3">
//               {isNewProject ? (
//                 <input
//                   type="text"
//                   name="project_name"
//                   placeholder="Enter new project name"
//                   value={formData.project_name}
//                   onChange={handleChange}
//                   required
//                   className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
//                   aria-required="true"
//                 />
//               ) : (
//                 <select
//                   name="project_name"
//                   value={formData.project_name}
//                   onChange={handleChange}
//                   required
//                   className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
//                   aria-required="true"
//                 >
//                   <option value="">Select Project</option>
//                   {projects.map((project) => (
//                     <option key={project.pd_id} value={project.project_name}>
//                       {project.project_name}
//                     </option>
//                   ))}
//                 </select>
//               )}
//               {/* <button
//                 type="button"
//                 onClick={toggleNewProjectInput}
//                 className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 aria-label={isNewProject ? "Select existing project" : "Add new project"}
//                 title={isNewProject ? "Select existing project" : "Add new project"}
//               >
//                 <Plus size="20" className="text-indigo-600" />
//               </button> */}
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
//             <div className="flex items-center space-x-3">
//               {isNewLocation ? (
//                 <input
//                   type="text"
//                   name="new_location_name"
//                   placeholder="Enter new location name"
//                   value={formData.new_location_name}
//                   onChange={handleChange}
//                   required
//                   className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
//                   aria-required="true"
//                 />
//               ) : (
//                 <select
//                   name="location_id"
//                   value={formData.location_id}
//                   onChange={handleChange}
//                   required
//                   className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
//                   aria-required="true"
//                 >
//                   <option value="">Select Location</option>
//                   {locations.map((location) => (
//                     <option key={location.location_id} value={location.location_id}>
//                       {location.location_name}
//                     </option>
//                   ))}
//                 </select>
//               )}
//               <button
//                 type="button"
//                 onClick={toggleNewLocationInput}
//                 className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 aria-label={isNewLocation ? "Select existing location" : "Add new location"}
//                 title={isNewLocation ? "Select existing location" : "Add new location"}
//               >
//                 <Plus size="20" className="text-indigo-600" />
//               </button>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Site Name</label>
//             <input
//               type="text"
//               name="site_name"
//               placeholder="Enter site name"
//               value={formData.site_name}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
//               aria-required="true"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">PO Number</label>
//             <input
//               type="text"
//               name="po_number"
//               placeholder="Enter PO number"
//               value={formData.po_number}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
//               aria-required="true"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
//             <input
//               type="date"
//               name="start_date"
//               value={formData.start_date}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 text-sm shadow-sm hover:shadow-md"
//               aria-required="true"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
//             <input
//               type="date"
//               name="end_date"
//               value={formData.end_date}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 text-sm shadow-sm hover:shadow-md"
//               aria-required="true"
//             />
//           </div>
//           <div className="md:col-span-2">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Incharge Type</label>
//             <select
//               name="incharge_type"
//               value={formData.incharge_type}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
//               aria-required="true"
//             >
//               <option value="">Select Incharge Type</option>
//               {siteIncharges.map((incharge) => (
//                 <option key={incharge.incharge_id} value={incharge.incharge_type}>
//                   {incharge.incharge_type}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//         <div className="flex justify-end space-x-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm shadow-sm"
//             aria-label="Cancel"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
//             disabled={loading}
//             aria-label="Create Project and Sites"
//           >
//             {loading && <Loader2 className="animate-spin w-5 h-5" />}
//             <span>{loading ? "Creating..." : "Create Project & Sites"}</span>
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProjectCreation;



import { useState, useEffect } from "react";
import axios from "axios";
import { X, FolderPlus, Loader2, Plus, Edit } from "lucide-react";
import Swal from "sweetalert2";

const ProjectCreation = ({ companyId, onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    project_name: "",
    site_name: "",
    po_number: "",
    start_date: "",
    end_date: "",
    incharge_type: "",
    location_id: "",
    new_location_name: "",
    reckoner_type_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [siteIncharges, setSiteIncharges] = useState([]);
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [reckonerTypes, setReckonerTypes] = useState([]);
  const [isNewProject, setIsNewProject] = useState(false);
  const [isNewLocation, setIsNewLocation] = useState(false);
  const [isCustomPoNumber, setIsCustomPoNumber] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [companyResponse, siteInchargesResponse, projectsResponse, locationsResponse, reckonerTypesResponse] = await Promise.all([
        axios.get(`http://localhost:5000/project/companies/${companyId}`),
        axios.get("http://localhost:5000/project/site-incharges"),
        axios.get(`http://localhost:5000/project/projects/${companyId}`),
        axios.get(`http://localhost:5000/project/locations`),
        axios.get(`http://localhost:5000/project/reckoner-types`),
      ]);
      setCompanyName(companyResponse.data.company_name || "Unknown Company");
      setSiteIncharges(siteInchargesResponse.data || []);
      setProjects(projectsResponse.data || []);
      setLocations(locationsResponse.data || []);
      setReckonerTypes(reckonerTypesResponse.data || []);
      console.log("Fetched reckoner types:", reckonerTypesResponse.data);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setError("Failed to load necessary data. Please try again later.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data. Please try again.",
        confirmButtonColor: "#3b82f6",
      });
    }
  };

  // Fetch next PO number when reckoner_type_id changes
  useEffect(() => {
    const fetchNextPoNumber = async () => {
      if (formData.reckoner_type_id === "1" || formData.reckoner_type_id === "3") {
        if (!isCustomPoNumber) {
          try {
            console.log(`Fetching PO number for reckoner_type_id: ${formData.reckoner_type_id}`);
            const response = await axios.get(`http://localhost:5000/project/next-po-number/${formData.reckoner_type_id}`);
            console.log("PO number response:", response.data);
            setFormData((prev) => ({ ...prev, po_number: response.data.po_number }));
          } catch (error) {
            console.error("Error fetching next PO number:", error.response?.data || error.message);
            const prefix = formData.reckoner_type_id === "1" ? "SA" : "NA";
            console.log(`Falling back to ${prefix}0000000001 due to error`);
            setFormData((prev) => ({ ...prev, po_number: `${prefix}0000000001` }));
            setError(`Failed to fetch next PO number for reckoner type ${formData.reckoner_type_id}. Using default ${prefix}0000000001.`);
          }
        }
      } else {
        setFormData((prev) => ({ ...prev, po_number: "" }));
      }
    };
    if (formData.reckoner_type_id) {
      fetchNextPoNumber();
    }
  }, [formData.reckoner_type_id, isCustomPoNumber]);

  useEffect(() => {
    if (companyId) {
      fetchData();
    } else {
      setError("No company selected. Please select a company first.");
      Swal.fire({
        icon: "warning",
        title: "No Company Selected",
        text: "Please select a company before creating a project.",
        confirmButtonColor: "#3b82f6",
      });
      onClose();
    }
  }, [companyId, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Form field changed: ${name} = ${value}`);
    setFormData({ ...formData, [name]: value });
  };

  const toggleNewProjectInput = () => {
    setIsNewProject(!isNewProject);
    setFormData({ ...formData, project_name: "" });
  };

  const toggleNewLocationInput = () => {
    setIsNewLocation(!isNewLocation);
    setFormData({ ...formData, location_id: "", new_location_name: "" });
  };

  const toggleCustomPoNumber = () => {
    setIsCustomPoNumber(!isCustomPoNumber);
    setFormData({ ...formData, po_number: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const projectData = {
        project_type: "service",
        company_id: companyId,
        project_name: formData.project_name,
        site_name: formData.site_name,
        po_number: formData.po_number,
        start_date: formData.start_date,
        end_date: formData.end_date,
        incharge_type: formData.incharge_type,
        location_id: isNewLocation ? undefined : formData.location_id,
        new_location_name: isNewLocation ? formData.new_location_name : undefined,
        reckoner_type_id: formData.reckoner_type_id,
      };

      console.log("Submitting project data:", projectData);

      if (!projectData.po_number) {
        throw new Error("PO Number is required");
      }
      if (!projectData.location_id && !projectData.new_location_name) {
        throw new Error("Either location_id or new_location_name is required");
      }

      const response = await axios.post("http://localhost:5000/project/create-project-site", projectData);
      console.log("Project creation response:", response.data);

      setFormData({
        project_name: "",
        site_name: "",
        po_number: "",
        start_date: "",
        end_date: "",
        incharge_type: "",
        location_id: "",
        new_location_name: "",
        reckoner_type_id: "",
      });
      setIsNewProject(false);
      setIsNewLocation(false);
      setIsCustomPoNumber(false);
      await fetchData();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Project ${formData.project_name} and site created successfully for ${companyName}. Would you like to view the created projects?`,
        showCancelButton: true,
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "View created projects",
        cancelButtonText: "Stay here",
      }).then((result) => {
        if (result.isConfirmed && onProjectCreated) {
          onProjectCreated(companyId);
        } else {
          onClose();
        }
      });
    } catch (error) {
      console.error("Error creating project:", error.response?.data || error.message);
      setError(error.response?.data?.error || error.message || "Failed to create project and site. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || error.message || "Failed to create project and site. Please try again.",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 transform transition-all duration-500">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <FolderPlus className="text-indigo-600" size={28} />
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create Sites for {companyName || "Selected Company"}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          aria-label="Close Modal"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm animate-fade-in">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reckoner Type</label>
            <select
              name="reckoner_type_id"
              value={formData.reckoner_type_id}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
              aria-required="true"
            >
              <option value="">Select Reckoner Type</option>
              {reckonerTypes.map((type) => (
                <option key={type.type_id} value={type.type_id}>
                  {type.type_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
            <div className="flex items-center space-x-3">
              {isNewProject ? (
                <input
                  type="text"
                  name="project_name"
                  placeholder="Enter new project name"
                  value={formData.project_name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
                  aria-required="true"
                />
              ) : (
                <select
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
                  aria-required="true"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.pd_id} value={project.project_name}>
                      {project.project_name}
                    </option>
                  ))}
                </select>
              )}
              {/* <button
                type="button"
                onClick={toggleNewProjectInput}
                className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={isNewProject ? "Select existing project" : "Add new project"}
                title={isNewProject ? "Select existing project" : "Add new project"}
              >
                <Plus size="20" className="text-indigo-600" />
              </button> */}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <div className="flex items-center space-x-3">
              {isNewLocation ? (
                <input
                  type="text"
                  name="new_location_name"
                  placeholder="Enter new location name"
                  value={formData.new_location_name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
                  aria-required="true"
                />
              ) : (
                <select
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
                  aria-required="true"
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location.location_id} value={location.location_id}>
                      {location.location_name}
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                onClick={toggleNewLocationInput}
                className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={isNewLocation ? "Select existing location" : "Add new location"}
                title={isNewLocation ? "Select existing location" : "Add new location"}
              >
                <Plus size="20" className="text-indigo-600" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Site Name</label>
            <input
              type="text"
              name="site_name"
              placeholder="Enter site name"
              value={formData.site_name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
              aria-required="true"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">PO Number</label>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                name="po_number"
                placeholder="Enter PO number"
                value={formData.po_number}
                onChange={handleChange}
                required
                disabled={formData.reckoner_type_id === "1" || formData.reckoner_type_id === "3" ? !isCustomPoNumber : false}
                className={`w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md ${
                  (formData.reckoner_type_id === "1" || formData.reckoner_type_id === "3") && !isCustomPoNumber ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-required="true"
              />
              {formData.reckoner_type_id === "1" || formData.reckoner_type_id === "3" ? (
                <button
                  type="button"
                  onClick={toggleCustomPoNumber}
                  className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={isCustomPoNumber ? "Use auto-generated PO number" : "Enter custom PO number"}
                  title={isCustomPoNumber ? "Use auto-generated PO number" : "Enter custom PO number"}
                >
                  <Edit size="20" className="text-indigo-600" />
                </button>
              ) : null}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 text-sm shadow-sm hover:shadow-md"
              aria-required="true"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 text-sm shadow-sm hover:shadow-md"
              aria-required="true"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Incharge Type</label>
            <select
              name="incharge_type"
              value={formData.incharge_type}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
              aria-required="true"
            >
              <option value="">Select Incharge Type</option>
              {siteIncharges.map((incharge) => (
                <option key={incharge.incharge_id} value={incharge.incharge_type}>
                  {incharge.incharge_type}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm shadow-sm"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            disabled={loading}
            aria-label="Create Project and Sites"
          >
            {loading && <Loader2 className="animate-spin w-5 h-5" />}
            <span>{loading ? "Creating..." : "Create Project & Sites"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectCreation;