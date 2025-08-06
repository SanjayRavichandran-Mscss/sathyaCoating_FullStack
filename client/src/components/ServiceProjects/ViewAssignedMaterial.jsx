// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Loader2, Package, FileText, X } from "lucide-react";
// import Swal from "sweetalert2";

// const ViewAssignedMaterial = () => {
//   const [projects, setProjects] = useState([]);
//   const [sites, setSites] = useState([]);
//   const [selectedProject, setSelectedProject] = useState("");
//   const [selectedSite, setSelectedSite] = useState("");
//   const [assignedMaterials, setAssignedMaterials] = useState([]);
//   const [loading, setLoading] = useState({
//     projects: false,
//     sites: false,
//     materials: false,
//     submitting: false,
//   });
//   const [error, setError] = useState(null);
//   const [dispatchData, setDispatchData] = useState({
//     dc_no: "",
//     dispatch_date: "",
//     order_no: "",
//     vendor_code: "",
//   });
//   const [calculatedQuantities, setCalculatedQuantities] = useState({});
//   const [remarks, setRemarks] = useState({});

//   // Fetch projects
//   const fetchProjects = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, projects: true }));
//       const response = await axios.get("http://localhost:5000/material/projects");
//       setProjects(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       setError("Failed to load projects. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, projects: false }));
//     }
//   };

//   // Fetch sites based on selected project
//   const fetchSites = async (pd_id) => {
//     try {
//       setLoading((prev) => ({ ...prev, sites: true }));
//       const response = await axios.get(`http://localhost:5000/material/sites/${pd_id}`);
//       setSites(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching sites:", error);
//       setError("Failed to load sites. Please try again.");
//       setSites([]);
//     } finally {
//       setLoading((prev) => ({ ...prev, sites: false }));
//     }
//   };

//   // Fetch assigned materials for selected project and site
//   const fetchAssignedMaterials = async () => {
//     if (!selectedProject || !selectedSite) return;
//     try {
//       setLoading((prev) => ({ ...prev, materials: true }));
//       setError(null);
//       const response = await axios.get("http://localhost:5000/material/assignments-with-dispatch", {
//         params: { pd_id: selectedProject, site_id: selectedSite },
//       });
//       const materials = response.data.data || [];
//       setAssignedMaterials(materials);

//       // Calculate quantities based on ratio distribution
//       const newQuantities = {};
//       const newRemarks = {};
//       materials.forEach((assignment) => {
//         const totalRatio =
//           (assignment.comp_ratio_a || 0) +
//           (assignment.comp_ratio_b || 0) +
//           (assignment.comp_ratio_c || 0);
//         newQuantities[assignment.id] = {
//           comp_a_qty:
//             totalRatio && assignment.comp_ratio_a !== null
//               ? Math.round((assignment.comp_ratio_a / totalRatio) * assignment.quantity)
//               : null,
//           comp_b_qty:
//             totalRatio && assignment.comp_ratio_b !== null
//               ? Math.round((assignment.comp_ratio_b / totalRatio) * assignment.quantity)
//               : null,
//           comp_c_qty:
//             totalRatio && assignment.comp_ratio_c !== null
//               ? Math.round((assignment.comp_ratio_c / totalRatio) * assignment.quantity)
//               : null,
//         };
//         newRemarks[assignment.id] = {
//           comp_a_remarks: "",
//           comp_b_remarks: "",
//           comp_c_remarks: "",
//         };
//       });
//       setCalculatedQuantities(newQuantities);
//       setRemarks(newRemarks);
//     } catch (error) {
//       console.error("Error fetching material assignments:", error);
//       setError(
//         error.response?.data?.message ||
//         error.response?.data?.sqlMessage ||
//         "Failed to load material assignments. Please try again."
//       );
//     } finally {
//       setLoading((prev) => ({ ...prev, materials: false }));
//     }
//   };

//   // Handle project selection
//   const handleProjectChange = async (e) => {
//     const pd_id = e.target.value;
//     setSelectedProject(pd_id);
//     setSelectedSite("");
//     setSites([]);
//     setAssignedMaterials([]);
//     setCalculatedQuantities({});
//     setRemarks({});
//     setDispatchData({ dc_no: "", dispatch_date: "", order_no: "", vendor_code: "" });
//     setError(null);
//     if (pd_id) {
//       await fetchSites(pd_id);
//     }
//   };

//   // Handle site selection
//   const handleSiteChange = (e) => {
//     setSelectedSite(e.target.value);
//     setAssignedMaterials([]);
//     setCalculatedQuantities({});
//     setRemarks({});
//     setDispatchData({ dc_no: "", dispatch_date: "", order_no: "", vendor_code: "" });
//     setError(null);
//   };

//   // Handle dispatch form input changes
//   const handleDispatchChange = (field, value) => {
//     setDispatchData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // Handle calculated quantities input changes
//   const handleQuantityChange = (assignmentId, field, value) => {
//     setCalculatedQuantities((prev) => ({
//       ...prev,
//       [assignmentId]: {
//         ...prev[assignmentId],
//         [field]: value ? parseInt(value) : null,
//       },
//     }));
//   };

//   // Handle remarks input changes
//   const handleRemarksChange = (assignmentId, field, value) => {
//     setRemarks((prev) => ({
//       ...prev,
//       [assignmentId]: {
//         ...prev[assignmentId],
//         [field]: value,
//       },
//     }));
//   };

//   // Validate dispatch data before submission
//   const validateDispatch = () => {
//     if (!dispatchData.dc_no || !dispatchData.dispatch_date || !dispatchData.order_no || !dispatchData.vendor_code) {
//       setError("Please fill all dispatch fields: DC No, Dispatch Date, Order No, and Vendor Code.");
//       return false;
//     }

//     // Check if all required remarks are filled
//     for (const assignment of assignedMaterials) {
//       const assignmentId = assignment.id;
//       const quantities = calculatedQuantities[assignmentId];
//       const assignmentRemarks = remarks[assignmentId];

//       if (quantities?.comp_a_qty !== null && !assignmentRemarks?.comp_a_remarks) {
//         setError(`Please enter remarks for Component A in material: ${assignment.item_name}`);
//         return false;
//       }
//       if (quantities?.comp_b_qty !== null && !assignmentRemarks?.comp_b_remarks) {
//         setError(`Please enter remarks for Component B in material: ${assignment.item_name}`);
//         return false;
//       }
//       if (quantities?.comp_c_qty !== null && !assignmentRemarks?.comp_c_remarks) {
//         setError(`Please enter remarks for Component C in material: ${assignment.item_name}`);
//         return false;
//       }
//     }

//     return true;
//   };

//   // Handle dispatch form submission
//   const handleDispatchSubmit = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, submitting: true }));
//       setError(null);

//       if (!validateDispatch()) {
//         return;
//       }

//       const payload = assignedMaterials.map((assignment) => ({
//         material_assign_id: assignment.id,
//         dc_no: parseInt(dispatchData.dc_no),
//         dispatch_date: dispatchData.dispatch_date,
//         order_no: dispatchData.order_no,
//         vendor_code: dispatchData.vendor_code,
//         comp_a_qty: calculatedQuantities[assignment.id]?.comp_a_qty || null,
//         comp_b_qty: calculatedQuantities[assignment.id]?.comp_b_qty || null,
//         comp_c_qty: calculatedQuantities[assignment.id]?.comp_c_qty || null,
//         comp_a_remarks: calculatedQuantities[assignment.id]?.comp_a_qty !== null ? remarks[assignment.id]?.comp_a_remarks || null : null,
//         comp_b_remarks: calculatedQuantities[assignment.id]?.comp_b_qty !== null ? remarks[assignment.id]?.comp_b_remarks || null : null,
//         comp_c_remarks: calculatedQuantities[assignment.id]?.comp_c_qty !== null ? remarks[assignment.id]?.comp_c_remarks || null : null,
//       }));

//       const response = await axios.post("http://localhost:5000/material/add-dispatch", payload);

//       // Show success toast
//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Materials dispatched successfully!",
//         showConfirmButton: false,
//         timer: 2000,
//         toast: true,
//         background: "#ecfdf5",
//         iconColor: "#10b981",
//       });

//       setError(null);
//       setDispatchData({ dc_no: "", dispatch_date: "", order_no: "", vendor_code: "" });
//       setCalculatedQuantities({});
//       setRemarks({});
//       await fetchAssignedMaterials();
//     } catch (error) {
//       console.error("Error dispatching materials:", error);
//       if (error.response?.data?.status === "already_dispatched") {
//         const conflicts = error.response.data.conflicts.map(
//           (conflict) => `Material: ${conflict.item_name} (ID: ${conflict.material_assign_id})`
//         ).join(", ");
//         setError(`Cannot dispatch the following materials as they have already been dispatched: ${conflicts}`);
//       } else {
//         setError(error.response?.data?.message || "Failed to dispatch materials. Please try again.");
//       }
//     } finally {
//       setLoading((prev) => ({ ...prev, submitting: false }));
//     }
//   };

//   // Helper function to format ratio string
//   const getRatioString = (assignment) => {
//     const ratios = [];
//     if (assignment.comp_ratio_a !== null) ratios.push(assignment.comp_ratio_a);
//     if (assignment.comp_ratio_b !== null) ratios.push(assignment.comp_ratio_b);
//     if (assignment.comp_ratio_c !== null) ratios.push(assignment.comp_ratio_c);
//     return ratios.length > 0 ? `(${ratios.join(":")})` : "";
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   useEffect(() => {
//     if (selectedProject && selectedSite) {
//       fetchAssignedMaterials();
//     }
//   }, [selectedProject, selectedSite]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
//             <Package className="h-8 w-8 text-teal-600" aria-hidden="true" />
//             Material Dispatch
//           </h2>
//           <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
//             Seamlessly dispatch materials to your project sites with ease
//           </p>
//         </div>

//         {/* Project and Site Selection */}
//         <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-lg">
//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-700">Select Project</label>
//             <select
//               value={selectedProject}
//               onChange={handleProjectChange}
//               className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
//               disabled={loading.projects}
//             >
//               <option value="">Select Project</option>
//               {projects.map((project) => (
//                 <option key={project.pd_id} value={project.pd_id}>
//                   {project.project_name || "Unknown Project"}
//                 </option>
//               ))}
//             </select>
//             {loading.projects && (
//               <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
//             )}
//           </div>
//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-700">Select Site</label>
//             <select
//               value={selectedSite}
//               onChange={handleSiteChange}
//               className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200 disabled:bg-gray-50"
//               disabled={!selectedProject || loading.sites}
//             >
//               <option value="">Select Site</option>
//               {sites.map((site) => (
//                 <option key={site.site_id} value={site.site_id}>
//                   {`${site.site_name || "Unknown Site"} (PO: ${site.po_number || "N/A"})`}
//                 </option>
//               ))}
//             </select>
//             {loading.sites && selectedProject && (
//               <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
//             )}
//           </div>
//         </div>

//         {/* Dispatch Form */}
//         {selectedProject && selectedSite && (
//           <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispatch Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-xs font-medium text-gray-600" htmlFor="dc_no">
//                   DC No
//                 </label>
//                 <input
//                   type="number"
//                   id="dc_no"
//                   placeholder="Enter DC No"
//                   value={dispatchData.dc_no}
//                   onChange={(e) => handleDispatchChange("dc_no", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
//                   aria-required="true"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-600" htmlFor="dispatch_date">
//                   Dispatch Date
//                 </label>
//                 <input
//                   type="date"
//                   id="dispatch_date"
//                   value={dispatchData.dispatch_date}
//                   onChange={(e) => handleDispatchChange("dispatch_date", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
//                   aria-required="true"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-600" htmlFor="order_no">
//                   Order No
//                 </label>
//                 <input
//                   type="text"
//                   id="order_no"
//                   placeholder="Enter Order No"
//                   value={dispatchData.order_no}
//                   onChange={(e) => handleDispatchChange("order_no", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
//                   aria-required="true"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-600" htmlFor="vendor_code">
//                   Vendor Code
//                 </label>
//                 <input
//                   type="text"
//                   id="vendor_code"
//                   placeholder="Enter Vendor Code"
//                   value={dispatchData.vendor_code}
//                   onChange={(e) => handleDispatchChange("vendor_code", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
//                   aria-required="true"
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error Alert */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md flex items-center justify-between transition-all duration-300">
//             <div className="flex items-center gap-2">
//               <FileText className="h-5 w-5 text-red-500" aria-hidden="true" />
//               <span>{error}</span>
//             </div>
//             <button
//               onClick={() => setError(null)}
//               className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
//               aria-label="Close error message"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//         )}

//         {/* Loading State */}
//         {loading.materials ? (
//           <div className="flex justify-center items-center py-16">
//             <div className="flex flex-col items-center space-y-4">
//               <Loader2 className="h-12 w-12 text-teal-600 animate-spin" aria-hidden="true" />
//               <p className="text-gray-600 text-lg font-medium">Loading material assignments...</p>
//             </div>
//           </div>
//         ) : !selectedProject || !selectedSite ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
//             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
//             <p className="text-gray-600 text-lg font-medium">Please select a project and site.</p>
//           </div>
//         ) : assignedMaterials.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
//             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
//             <p className="text-gray-600 text-lg font-medium">No material assignments found for this project and site.</p>
//             <p className="text-gray-500 mt-2">Assign materials to this project and site to see them listed here.</p>
//           </div>
//         ) : (
//           <>
//             {/* Desktop Table View */}
//             <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         #
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         Material Details
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         Quantity & UOM
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         Component Quantities
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         Remarks
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {assignedMaterials.map((assignment, index) => (
//                       <tr
//                         key={assignment.id}
//                         className="hover:bg-teal-50 transition-colors duration-200"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <div className="space-y-1">
//                             <p className="font-medium">
//                               {assignment.item_name || "N/A"} {getRatioString(assignment)}
//                             </p>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <div className="space-y-1">
//                             <span className="inline-flex items-center px-2.5 py-0.5 text-md font-bold">
//                               {assignment.quantity || "N/A"} | {assignment.uom_name || "N/A"}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <div className="space-y-3">
//                             {assignment.comp_ratio_a !== null && (
//                               <div className="grid grid-cols-12 gap-2 items-center">
//                                 <label className="col-span-3 text-sm font-medium text-gray-700 mr-1.5">
//                                   Comp A:
//                                 </label>
//                                 <div className="col-span-9">
//                                   <input
//                                     type="number"
//                                     value={calculatedQuantities[assignment.id]?.comp_a_qty ?? ""}
//                                     onChange={(e) => handleQuantityChange(assignment.id, "comp_a_qty", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Qty"
//                                   />
//                                 </div>
//                               </div>
//                             )}
//                             {assignment.comp_ratio_b !== null && (
//                               <div className="grid grid-cols-12 gap-2 items-center">
//                                 <label className="col-span-3 text-sm font-medium text-gray-700 mr-1.5">
//                                   Comp B:
//                                 </label>
//                                 <div className="col-span-9">
//                                   <input
//                                     type="number"
//                                     value={calculatedQuantities[assignment.id]?.comp_b_qty ?? ""}
//                                     onChange={(e) => handleQuantityChange(assignment.id, "comp_b_qty", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Qty"
//                                   />
//                                 </div>
//                               </div>
//                             )}
//                             {assignment.comp_ratio_c !== null && (
//                               <div className="grid grid-cols-12 gap-2 items-center">
//                                 <label className="col-span-3 text-sm font-medium text-gray-700 mr-1.5">
//                                   Comp C:
//                                 </label>
//                                 <div className="col-span-9">
//                                   <input
//                                     type="number"
//                                     value={calculatedQuantities[assignment.id]?.comp_c_qty ?? ""}
//                                     onChange={(e) => handleQuantityChange(assignment.id, "comp_c_qty", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Qty"
//                                   />
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <div className="space-y-3">
//                             {assignment.comp_ratio_a !== null && (
//                               <div className="grid grid-cols-12 gap-2 items-center">
//                                 {/* <label className="col-span-3 text-sm font-medium text-gray-700">
//                                   Comp A:
//                                 </label> */}
//                                 <div className="col-span-9">
//                                   <input
//                                     type="text"
//                                     value={remarks[assignment.id]?.comp_a_remarks ?? ""}
//                                     onChange={(e) => handleRemarksChange(assignment.id, "comp_a_remarks", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Remarks for Component A"
//                                     required={calculatedQuantities[assignment.id]?.comp_a_qty !== null}
//                                   />
//                                 </div>
//                               </div>
//                             )}
//                             {assignment.comp_ratio_b !== null && (
//                               <div className="grid grid-cols-12 gap-2 items-center">
//                                 {/* <label className="col-span-3 text-sm font-medium text-gray-700">
//                                   Comp B:
//                                 </label> */}
//                                 <div className="col-span-9">
//                                   <input
//                                     type="text"
//                                     value={remarks[assignment.id]?.comp_b_remarks ?? ""}
//                                     onChange={(e) => handleRemarksChange(assignment.id, "comp_b_remarks", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Remarks for Component B"
//                                     required={calculatedQuantities[assignment.id]?.comp_b_qty !== null}
//                                   />
//                                 </div>
//                               </div>
//                             )}
//                             {assignment.comp_ratio_c !== null && (
//                               <div className="grid grid-cols-12 gap-2 items-center">
//                                 {/* <label className="col-span-3 text-sm font-medium text-gray-700">
//                                   Comp C:
//                                 </label> */}
//                                 <div className="col-span-9">
//                                   <input
//                                     type="text"
//                                     value={remarks[assignment.id]?.comp_c_remarks ?? ""}
//                                     onChange={(e) => handleRemarksChange(assignment.id, "comp_c_remarks", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Remarks for Component C"
//                                     required={calculatedQuantities[assignment.id]?.comp_c_qty !== null}
//                                   />
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="p-4 flex justify-end">
//                 <button
//                   onClick={handleDispatchSubmit}
//                   className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
//                   disabled={loading.submitting}
//                 >
//                   {loading.submitting ? (
//                     <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
//                   ) : (
//                     "Dispatch Materials"
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Mobile Card View */}
//             <div className="md:hidden space-y-6">
//               {assignedMaterials.map((assignment, index) => (
//                 <div
//                   key={assignment.id}
//                   className="bg-white rounded-xl shadow-lg p-5 border border-gray-100"
//                 >
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Material Details</p>
//                       <p className="text-sm text-gray-600">
//                         {assignment.item_name || "N/A"} {getRatioString(assignment)}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Quantity & UOM</p>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
//                         {assignment.quantity || "N/A"} {assignment.uom_name || "N/A"}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Component Quantities</p>
//                       <div className="space-y-3">
//                         {assignment.comp_ratio_a !== null && (
//                           <div className="space-y-1">
//                             <label className="text-xs font-medium text-gray-700">Component A</label>
//                             <input
//                               type="number"
//                               value={calculatedQuantities[assignment.id]?.comp_a_qty ?? ""}
//                               onChange={(e) => handleQuantityChange(assignment.id, "comp_a_qty", e.target.value)}
//                               className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                               placeholder="Qty"
//                             />
//                           </div>
//                         )}
//                         {assignment.comp_ratio_b !== null && (
//                           <div className="space-y-1">
//                             <label className="text-xs font-medium text-gray-700">Component B</label>
//                             <input
//                               type="number"
//                               value={calculatedQuantities[assignment.id]?.comp_b_qty ?? ""}
//                               onChange={(e) => handleQuantityChange(assignment.id, "comp_b_qty", e.target.value)}
//                               className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                               placeholder="Qty"
//                             />
//                           </div>
//                         )}
//                         {assignment.comp_ratio_c !== null && (
//                           <div className="space-y-1">
//                             <label className="text-xs font-medium text-gray-700">Component C</label>
//                             <input
//                               type="number"
//                               value={calculatedQuantities[assignment.id]?.comp_c_qty ?? ""}
//                               onChange={(e) => handleQuantityChange(assignment.id, "comp_c_qty", e.target.value)}
//                               className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                               placeholder="Qty"
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Remarks</p>
//                       <div className="space-y-3">
//                         {assignment.comp_ratio_a !== null && (
//                           <div className="space-y-1">
//                             <label className="text-xs font-medium text-gray-700">Component A</label>
//                             <input
//                               type="text"
//                               value={remarks[assignment.id]?.comp_a_remarks ?? ""}
//                               onChange={(e) => handleRemarksChange(assignment.id, "comp_a_remarks", e.target.value)}
//                               className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                               placeholder="Remarks for Component A"
//                               required={calculatedQuantities[assignment.id]?.comp_a_qty !== null}
//                             />
//                           </div>
//                         )}
//                         {assignment.comp_ratio_b !== null && (
//                           <div className="space-y-1">
//                             <label className="text-xs font-medium text-gray-700">Component B</label>
//                             <input
//                               type="text"
//                               value={remarks[assignment.id]?.comp_b_remarks ?? ""}
//                               onChange={(e) => handleRemarksChange(assignment.id, "comp_b_remarks", e.target.value)}
//                               className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                               placeholder="Remarks for Component B"
//                               required={calculatedQuantities[assignment.id]?.comp_b_qty !== null}
//                             />
//                           </div>
//                         )}
//                         {assignment.comp_ratio_c !== null && (
//                           <div className="space-y-1">
//                             <label className="text-xs font-medium text-gray-700">Component C</label>
//                             <input
//                               type="text"
//                               value={remarks[assignment.id]?.comp_c_remarks ?? ""}
//                               onChange={(e) => handleRemarksChange(assignment.id, "comp_c_remarks", e.target.value)}
//                               className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                               placeholder="Remarks for Component C"
//                               required={calculatedQuantities[assignment.id]?.comp_c_qty !== null}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <div className="p-4 flex justify-end">
//                 <button
//                   onClick={handleDispatchSubmit}
//                   className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
//                   disabled={loading.submitting}
//                 >
//                   {loading.submitting ? (
//                     <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
//                   ) : (
//                     "Dispatch Materials"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewAssignedMaterial;






import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Package, FileText, X, Truck } from "lucide-react";
import Swal from "sweetalert2";

const ViewAssignedMaterial = () => {
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [assignedMaterials, setAssignedMaterials] = useState([]);
  const [loading, setLoading] = useState({
    projects: false,
    sites: false,
    materials: false,
    transportTypes: false,
    providers: false,
    vehicles: false,
    drivers: false,
    submitting: false,
  });
  const [error, setError] = useState(null);
  const [dispatchData, setDispatchData] = useState({
    dc_no: "",
    dispatch_date: "",
    order_no: "",
    vendor_code: "",
  });
  const [transportData, setTransportData] = useState({
    transport_type_id: "",
    provider_id: "",
    vehicle_id: "",
    driver_id: "",
    destination: "",
    booking_expense: "",
    travel_expense: "",
  });
  const [transportTypes, setTransportTypes] = useState([]);
  const [providers, setProviders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [calculatedQuantities, setCalculatedQuantities] = useState({});
  const [remarks, setRemarks] = useState({});
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading((prev) => ({ ...prev, projects: true }));
      const response = await axios.get("http://localhost:5000/material/projects");
      setProjects(response.data.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  };

  // Fetch sites based on selected project
  const fetchSites = async (pd_id) => {
    try {
      setLoading((prev) => ({ ...prev, sites: true }));
      const response = await axios.get(`http://localhost:5000/material/sites/${pd_id}`);
      setSites(response.data.data || []);
    } catch (error) {
      console.error("Error fetching sites:", error);
      setError("Failed to load sites. Please try again.");
      setSites([]);
    } finally {
      setLoading((prev) => ({ ...prev, sites: false }));
    }
  };

  // Fetch transport types
  const fetchTransportTypes = async () => {
    try {
      setLoading((prev) => ({ ...prev, transportTypes: true }));
      const response = await axios.get("http://localhost:5000/material/transport-types");
      setTransportTypes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching transport types:", error);
      setError("Failed to load transport types. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, transportTypes: false }));
    }
  };

  // Fetch providers based on transport type
  const fetchProviders = async (transport_type_id) => {
    try {
      setLoading((prev) => ({ ...prev, providers: true }));
      const response = await axios.get("http://localhost:5000/material/providers", {
        params: { transport_type_id },
      });
      setProviders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
      setError("Failed to load providers. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, providers: false }));
    }
  };

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      setLoading((prev) => ({ ...prev, vehicles: true }));
      const response = await axios.get("http://localhost:5000/material/vehicles");
      setVehicles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Failed to load vehicles. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, vehicles: false }));
    }
  };

  // Fetch drivers
  const fetchDrivers = async () => {
    try {
      setLoading((prev) => ({ ...prev, drivers: true }));
      const response = await axios.get("http://localhost:5000/material/drivers");
      setDrivers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setError("Failed to load drivers. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, drivers: false }));
    }
  };

  // Fetch assigned materials for selected project and site
  const fetchAssignedMaterials = async () => {
    if (!selectedProject || !selectedSite) return;
    try {
      setLoading((prev) => ({ ...prev, materials: true }));
      setError(null);
      const response = await axios.get("http://localhost:5000/material/assignments-with-dispatch", {
        params: { pd_id: selectedProject, site_id: selectedSite },
      });
      const materials = response.data.data || [];
      setAssignedMaterials(materials);

      // Calculate quantities based on ratio distribution
      const newQuantities = {};
      const newRemarks = {};
      materials.forEach((assignment) => {
        const totalRatio =
          (assignment.comp_ratio_a || 0) +
          (assignment.comp_ratio_b || 0) +
          (assignment.comp_ratio_c || 0);
        newQuantities[assignment.id] = {
          comp_a_qty:
            totalRatio && assignment.comp_ratio_a !== null
              ? Math.round((assignment.comp_ratio_a / totalRatio) * assignment.quantity)
              : null,
          comp_b_qty:
            totalRatio && assignment.comp_ratio_b !== null
              ? Math.round((assignment.comp_ratio_b / totalRatio) * assignment.quantity)
              : null,
          comp_c_qty:
            totalRatio && assignment.comp_ratio_c !== null
              ? Math.round((assignment.comp_ratio_c / totalRatio) * assignment.quantity)
              : null,
        };
        newRemarks[assignment.id] = {
          comp_a_remarks: "",
          comp_b_remarks: "",
          comp_c_remarks: "",
        };
      });
      setCalculatedQuantities(newQuantities);
      setRemarks(newRemarks);
    } catch (error) {
      console.error("Error fetching material assignments:", error);
      setError(
        error.response?.data?.message ||
        error.response?.data?.sqlMessage ||
        "Failed to load material assignments. Please try again."
      );
    } finally {
      setLoading((prev) => ({ ...prev, materials: false }));
    }
  };

  // Handle project selection
  const handleProjectChange = async (e) => {
    const pd_id = e.target.value;
    setSelectedProject(pd_id);
    setSelectedSite("");
    setSites([]);
    setAssignedMaterials([]);
    setCalculatedQuantities({});
    setRemarks({});
    setDispatchData({ dc_no: "", dispatch_date: "", order_no: "", vendor_code: "" });
    setTransportData({
      transport_type_id: "",
      provider_id: "",
      vehicle_id: "",
      driver_id: "",
      destination: "",
      booking_expense: "",
      travel_expense: "",
    });
    setError(null);
    setIsTransportModalOpen(false);
    if (pd_id) {
      await fetchSites(pd_id);
    }
  };

  // Handle site selection
  const handleSiteChange = (e) => {
    setSelectedSite(e.target.value);
    setAssignedMaterials([]);
    setCalculatedQuantities({});
    setRemarks({});
    setDispatchData({ dc_no: "", dispatch_date: "", order_no: "", vendor_code: "" });
    setTransportData({
      transport_type_id: "",
      provider_id: "",
      vehicle_id: "",
      driver_id: "",
      destination: "",
      booking_expense: "",
      travel_expense: "",
    });
    setError(null);
    setIsTransportModalOpen(false);
  };

  // Handle dispatch form input changes
  const handleDispatchChange = (field, value) => {
    setDispatchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle transport form input changes
  const handleTransportChange = (field, value) => {
    setTransportData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle calculated quantities input changes
  const handleQuantityChange = (assignmentId, field, value) => {
    setCalculatedQuantities((prev) => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [field]: value ? parseInt(value) : null,
      },
    }));
  };

  // Handle remarks input changes
  const handleRemarksChange = (assignmentId, field, value) => {
    setRemarks((prev) => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [field]: value,
      },
    }));
  };

  // Validate dispatch and remarks for enabling Assign Transport button
  const isAssignTransportEnabled = () => {
    // Validate dispatch fields
    if (!dispatchData.dc_no || !dispatchData.dispatch_date || !dispatchData.order_no || !dispatchData.vendor_code) {
      return false;
    }

    // Validate remarks for non-null component quantities
    for (const assignment of assignedMaterials) {
      const assignmentId = assignment.id;
      const quantities = calculatedQuantities[assignmentId];
      const assignmentRemarks = remarks[assignmentId];

      if (quantities?.comp_a_qty !== null && !assignmentRemarks?.comp_a_remarks) {
        return false;
      }
      if (quantities?.comp_b_qty !== null && !assignmentRemarks?.comp_b_remarks) {
        return false;
      }
      if (quantities?.comp_c_qty !== null && !assignmentRemarks?.comp_c_remarks) {
        return false;
      }
    }

    return true;
  };

  // Handle dispatch form submission
  const handleDispatchSubmit = async () => {
    try {
      setLoading((prev) => ({ ...prev, submitting: true }));
      setError(null);

      // Validate transport fields
      if (
        !transportData.transport_type_id ||
        !transportData.provider_id ||
        !transportData.vehicle_id ||
        !transportData.driver_id ||
        !transportData.destination ||
        !transportData.travel_expense
      ) {
        setError("Please fill all transport fields: Transport Type, Provider, Vehicle, Driver, Destination, and Travel Expense.");
        return;
      }

      // Prepare dispatch payload
      const dispatchPayload = assignedMaterials.map((assignment) => ({
        material_assign_id: assignment.id,
        dc_no: parseInt(dispatchData.dc_no),
        dispatch_date: dispatchData.dispatch_date,
        order_no: dispatchData.order_no,
        vendor_code: dispatchData.vendor_code,
        comp_a_qty: calculatedQuantities[assignment.id]?.comp_a_qty || null,
        comp_b_qty: calculatedQuantities[assignment.id]?.comp_b_qty || null,
        comp_c_qty: calculatedQuantities[assignment.id]?.comp_c_qty || null,
        comp_a_remarks: calculatedQuantities[assignment.id]?.comp_a_qty !== null ? remarks[assignment.id]?.comp_a_remarks || null : null,
        comp_b_remarks: calculatedQuantities[assignment.id]?.comp_b_qty !== null ? remarks[assignment.id]?.comp_b_remarks || null : null,
        comp_c_remarks: calculatedQuantities[assignment.id]?.comp_c_qty !== null ? remarks[assignment.id]?.comp_c_remarks || null : null,
      }));

      // Prepare transport payload
      const transportPayload = {
        provider_id: parseInt(transportData.provider_id),
        destination: transportData.destination,
        vehicle_id: parseInt(transportData.vehicle_id),
        driver_id: parseInt(transportData.driver_id),
        booking_expense: transportData.booking_expense ? parseFloat(transportData.booking_expense) : null,
        travel_expense: parseFloat(transportData.travel_expense),
      };

      // Combine payloads
      const payload = {
        assignments: dispatchPayload,
        transport: transportPayload,
      };

      // Submit combined payload
      const response = await axios.post("http://localhost:5000/material/add-dispatch", payload);

      if (response.data.status === "already_dispatched") {
        const conflicts = response.data.conflicts
          .map((conflict) => `Material: ${conflict.item_name} (ID: ${conflict.material_assign_id})`)
          .join(", ");
        setError(`Cannot dispatch the following materials as they have already been dispatched: ${conflicts}`);
        return;
      }

      // Show success toast
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Materials dispatched and transport details saved successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });

      // Reset form and close modal
      setDispatchData({ dc_no: "", dispatch_date: "", order_no: "", vendor_code: "" });
      setTransportData({
        transport_type_id: "",
        provider_id: "",
        vehicle_id: "",
        driver_id: "",
        destination: "",
        booking_expense: "",
        travel_expense: "",
      });
      setCalculatedQuantities({});
      setRemarks({});
      setIsTransportModalOpen(false);
      await fetchAssignedMaterials();
    } catch (error) {
      console.error("Error dispatching materials or saving transport:", error);
      setError(
        error.response?.data?.message ||
        error.response?.data?.sqlMessage ||
        "Failed to dispatch materials or save transport details. Please try again."
      );
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Helper function to format ratio string
  const getRatioString = (assignment) => {
    const ratios = [];
    if (assignment.comp_ratio_a !== null) ratios.push(assignment.comp_ratio_a);
    if (assignment.comp_ratio_b !== null) ratios.push(assignment.comp_ratio_b);
    if (assignment.comp_ratio_c !== null) ratios.push(assignment.comp_ratio_c);
    return ratios.length > 0 ? `(${ratios.join(":")})` : "";
  };

  // Effect hooks
  useEffect(() => {
    fetchProjects();
    fetchTransportTypes();
    fetchVehicles();
    fetchDrivers();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchSites(selectedProject);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject && selectedSite) {
      fetchAssignedMaterials();
    }
  }, [selectedProject, selectedSite]);

  useEffect(() => {
    if (transportData.transport_type_id) {
      fetchProviders(transportData.transport_type_id);
    } else {
      setProviders([]);
      setTransportData((prev) => ({ ...prev, provider_id: "" }));
    }
  }, [transportData.transport_type_id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
            <Package className="h-8 w-8 text-teal-600" aria-hidden="true" />
            Material Dispatch
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Dispatch non-dispatched materials to your project sites
          </p>
        </div>

        {/* Project and Site Selection */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-lg">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Select Project</label>
            <select
              value={selectedProject}
              onChange={handleProjectChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
              disabled={loading.projects}
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.pd_id} value={project.pd_id}>
                  {project.project_name || "Unknown Project"}
                </option>
              ))}
            </select>
            {loading.projects && (
              <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
            )}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Select Site</label>
            <select
              value={selectedSite}
              onChange={handleSiteChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200 disabled:bg-gray-50"
              disabled={!selectedProject || loading.sites}
            >
              <option value="">Select Site</option>
              {sites.map((site) => (
                <option key={site.site_id} value={site.site_id}>
                  {`${site.site_name || "Unknown Site"} (PO: ${site.po_number || "N/A"})`}
                </option>
              ))}
            </select>
            {loading.sites && selectedProject && (
              <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
            )}
          </div>
        </div>

        {/* Dispatch Details */}
        {selectedProject && selectedSite && (
          <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispatch Details</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-medium text-gray-600" htmlFor="dc_no">
                  DC No
                </label>
                <input
                  type="number"
                  id="dc_no"
                  placeholder="Enter DC No"
                  value={dispatchData.dc_no}
                  onChange={(e) => handleDispatchChange("dc_no", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
                  aria-required="true"
                />
              </div>
              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-medium text-gray-600" htmlFor="dispatch_date">
                  Dispatch Date
                </label>
                <input
                  type="date"
                  id="dispatch_date"
                  value={dispatchData.dispatch_date}
                  onChange={(e) => handleDispatchChange("dispatch_date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
                  aria-required="true"
                />
              </div>
              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-medium text-gray-600" htmlFor="order_no">
                  Order No
                </label>
                <input
                  type="text"
                  id="order_no"
                  placeholder="Enter Order No"
                  value={dispatchData.order_no}
                  onChange={(e) => handleDispatchChange("order_no", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
                  aria-required="true"
                />
              </div>
              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-medium text-gray-600" htmlFor="vendor_code">
                  Vendor Code
                </label>
                <input
                  type="text"
                  id="vendor_code"
                  placeholder="Enter Vendor Code"
                  value={dispatchData.vendor_code}
                  onChange={(e) => handleDispatchChange("vendor_code", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
                  aria-required="true"
                />
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-500" aria-hidden="true" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
              aria-label="Close error message"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading.materials ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-teal-600 animate-spin" aria-hidden="true" />
              <p className="text-gray-600 text-lg font-medium">Loading material assignments...</p>
            </div>
          </div>
        ) : !selectedProject || !selectedSite ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600 text-lg font-medium">Please select a project and site.</p>
          </div>
        ) : assignedMaterials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600 text-lg font-medium">No non-dispatched material assignments found for this project and site.</p>
            <p className="text-gray-500 mt-2">Assign materials to this project and site to dispatch them.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        Material Details
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        Quantity & UOM
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        Component Quantities
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignedMaterials.map((assignment, index) => (
                      <tr
                        key={assignment.id}
                        className="hover:bg-teal-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {assignment.item_name || "N/A"} {getRatioString(assignment)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="space-y-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 text-md font-bold">
                              {assignment.quantity || "N/A"} | {assignment.uom_name || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="space-y-3">
                            {assignment.comp_ratio_a !== null && (
                              <div className="grid grid-cols-12 gap-2 items-center">
                                <label className="col-span-3 text-sm font-medium text-gray-700 mr-1.5">
                                  Comp A:
                                </label>
                                <div className="col-span-9">
                                  <input
                                    type="number"
                                    value={calculatedQuantities[assignment.id]?.comp_a_qty ?? ""}
                                    onChange={(e) => handleQuantityChange(assignment.id, "comp_a_qty", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Qty"
                                  />
                                </div>
                              </div>
                            )}
                            {assignment.comp_ratio_b !== null && (
                              <div className="grid grid-cols-12 gap-2 items-center">
                                <label className="col-span-3 text-sm font-medium text-gray-700 mr-1.5">
                                  Comp B:
                                </label>
                                <div className="col-span-9">
                                  <input
                                    type="number"
                                    value={calculatedQuantities[assignment.id]?.comp_b_qty ?? ""}
                                    onChange={(e) => handleQuantityChange(assignment.id, "comp_b_qty", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Qty"
                                  />
                                </div>
                              </div>
                            )}
                            {assignment.comp_ratio_c !== null && (
                              <div className="grid grid-cols-12 gap-2 items-center">
                                <label className="col-span-3 text-sm font-medium text-gray-700 mr-1.5">
                                  Comp C:
                                </label>
                                <div className="col-span-9">
                                  <input
                                    type="number"
                                    value={calculatedQuantities[assignment.id]?.comp_c_qty ?? ""}
                                    onChange={(e) => handleQuantityChange(assignment.id, "comp_c_qty", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Qty"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="space-y-3">
                            {assignment.comp_ratio_a !== null && (
                              <div className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-9">
                                  <input
                                    type="text"
                                    value={remarks[assignment.id]?.comp_a_remarks ?? ""}
                                    onChange={(e) => handleRemarksChange(assignment.id, "comp_a_remarks", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Remarks for Component A"
                                    required={calculatedQuantities[assignment.id]?.comp_a_qty !== null}
                                  />
                                </div>
                              </div>
                            )}
                            {assignment.comp_ratio_b !== null && (
                              <div className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-9">
                                  <input
                                    type="text"
                                    value={remarks[assignment.id]?.comp_b_remarks ?? ""}
                                    onChange={(e) => handleRemarksChange(assignment.id, "comp_b_remarks", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Remarks for Component B"
                                    required={calculatedQuantities[assignment.id]?.comp_b_qty !== null}
                                  />
                                </div>
                              </div>
                            )}
                            {assignment.comp_ratio_c !== null && (
                              <div className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-9">
                                  <input
                                    type="text"
                                    value={remarks[assignment.id]?.comp_c_remarks ?? ""}
                                    onChange={(e) => handleRemarksChange(assignment.id, "comp_c_remarks", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Remarks for Component C"
                                    required={calculatedQuantities[assignment.id]?.comp_c_qty !== null}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => setIsTransportModalOpen(true)}
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isAssignTransportEnabled()
                      ? "bg-teal-600 hover:bg-teal-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isAssignTransportEnabled()}
                >
                  <Truck className="h-4 w-4 inline-block mr-2" />
                  Assign Transport
                </button>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-6 mb-6">
              {assignedMaterials.map((assignment, index) => (
                <div
                  key={assignment.id}
                  className="bg-white rounded-xl shadow-lg p-5 border border-gray-100"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Material Details</p>
                      <p className="text-sm text-gray-600">
                        {assignment.item_name || "N/A"} {getRatioString(assignment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Quantity & UOM</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {assignment.quantity || "N/A"} {assignment.uom_name || "N/A"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Component Quantities</p>
                      <div className="space-y-3">
                        {assignment.comp_ratio_a !== null && (
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Component A</label>
                            <input
                              type="number"
                              value={calculatedQuantities[assignment.id]?.comp_a_qty ?? ""}
                              onChange={(e) => handleQuantityChange(assignment.id, "comp_a_qty", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                              placeholder="Qty"
                            />
                          </div>
                        )}
                        {assignment.comp_ratio_b !== null && (
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Component B</label>
                            <input
                              type="number"
                              value={calculatedQuantities[assignment.id]?.comp_b_qty ?? ""}
                              onChange={(e) => handleQuantityChange(assignment.id, "comp_b_qty", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                              placeholder="Qty"
                            />
                          </div>
                        )}
                        {assignment.comp_ratio_c !== null && (
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Component C</label>
                            <input
                              type="number"
                              value={calculatedQuantities[assignment.id]?.comp_c_qty ?? ""}
                              onChange={(e) => handleQuantityChange(assignment.id, "comp_c_qty", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                              placeholder="Qty"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Remarks</p>
                      <div className="space-y-3">
                        {assignment.comp_ratio_a !== null && (
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Component A</label>
                            <input
                              type="text"
                              value={remarks[assignment.id]?.comp_a_remarks ?? ""}
                              onChange={(e) => handleRemarksChange(assignment.id, "comp_a_remarks", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                              placeholder="Remarks for Component A"
                              required={calculatedQuantities[assignment.id]?.comp_a_qty !== null}
                            />
                          </div>
                        )}
                        {assignment.comp_ratio_b !== null && (
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Component B</label>
                            <input
                              type="text"
                              value={remarks[assignment.id]?.comp_b_remarks ?? ""}
                              onChange={(e) => handleRemarksChange(assignment.id, "comp_b_remarks", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                              placeholder="Remarks for Component B"
                              required={calculatedQuantities[assignment.id]?.comp_b_qty !== null}
                            />
                          </div>
                        )}
                        {assignment.comp_ratio_c !== null && (
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Component C</label>
                            <input
                              type="text"
                              value={remarks[assignment.id]?.comp_c_remarks ?? ""}
                              onChange={(e) => handleRemarksChange(assignment.id, "comp_c_remarks", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                              placeholder="Remarks for Component C"
                              required={calculatedQuantities[assignment.id]?.comp_c_qty !== null}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => setIsTransportModalOpen(true)}
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isAssignTransportEnabled()
                      ? "bg-teal-600 hover:bg-teal-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isAssignTransportEnabled()}
                >
                  <Truck className="h-4 w-4 inline-block mr-2" />
                  Assign Transport
                </button>
              </div>
            </div>

            {/* Transport Modal */}
            {isTransportModalOpen && (
              <div
                className=" backdrop-blur-xl fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 "
                onClick={() => setIsTransportModalOpen(false)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl lg:max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsTransportModalOpen(false)}
                    className="absolute right-0 transform -translate-x-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full"
                    aria-label="Close transport modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Assign Transport Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600" htmlFor="transport_type_id">
                        Transport Type
                      </label>
                      <select
                        id="transport_type_id"
                        value={transportData.transport_type_id}
                        onChange={(e) => handleTransportChange("transport_type_id", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
                        aria-required="true"
                      >
                        <option value="">Select Transport Type</option>
                        {transportTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.type}
                          </option>
                        ))}
                      </select>
                      {loading.transportTypes && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600" htmlFor="provider_id">
                        Provider
                      </label>
                      <select
                        id="provider_id"
                        value={transportData.provider_id}
                        onChange={(e) => handleTransportChange("provider_id", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
                        disabled={!transportData.transport_type_id}
                        aria-required="true"
                      >
                        <option value="">Select Provider</option>
                        {providers.map((provider) => (
                          <option key={provider.id} value={provider.id}>
                            {provider.provider_name}
                          </option>
                        ))}
                      </select>
                      {loading.providers && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600" htmlFor="vehicle_id">
                        Vehicle
                      </label>
                      <select
                        id="vehicle_id"
                        value={transportData.vehicle_id}
                        onChange={(e) => handleTransportChange("vehicle_id", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
                        aria-required="true"
                      >
                        <option value="">Select Vehicle</option>
                        {vehicles.map((vehicle) => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.vehicle_name} ({vehicle.vehicle_number})
                          </option>
                        ))}
                      </select>
                      {loading.vehicles && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600" htmlFor="driver_id">
                        Driver
                      </label>
                      <select
                        id="driver_id"
                        value={transportData.driver_id}
                        onChange={(e) => handleTransportChange("driver_id", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
                        aria-required="true"
                      >
                        <option value="">Select Driver</option>
                        {drivers.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.driver_name}
                          </option>
                        ))}
                      </select>
                      {loading.drivers && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600" htmlFor="destination">
                        Destination
                      </label>
                      <input
                        type="text"
                        id="destination"
                        placeholder="Enter Destination"
                        value={transportData.destination}
                        onChange={(e) => handleTransportChange("destination", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600" htmlFor="booking_expense">
                        Booking Expense
                      </label>
                      <input
                        type="number"
                        id="booking_expense"
                        placeholder="Enter Booking Expense"
                        value={transportData.booking_expense}
                        onChange={(e) => handleTransportChange("booking_expense", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600" htmlFor="travel_expense">
                        Travel Expense
                      </label>
                      <input
                        type="number"
                        id="travel_expense"
                        placeholder="Enter Travel Expense"
                        value={transportData.travel_expense}
                        onChange={(e) => handleTransportChange("travel_expense", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
                        aria-required="true"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleDispatchSubmit}
                      className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-base font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      disabled={loading.submitting}
                    >
                      {loading.submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                          Dispatching...
                        </>
                      ) : (
                        <>
                          <Truck className="h-5 w-5 inline-block mr-2" />
                          Dispatch Material
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAssignedMaterial;