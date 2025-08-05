// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Edit,
//   Save,
//   X,
//   CheckCircle,
//   AlertCircle,
//   FileText,
//   IndianRupee,
//   Percent,
//   TrendingUp,
//   MapPin,
//   HardHat,
//   Receipt,
//   CalendarCheck,
//   Hexagon,
//   BrickWall,
//   ReceiptText,
//   Grid2x2Check,
//   Search,
//   ChevronDown,
//   UserPlus,
// } from "lucide-react";
// import AssignSiteIncharge from "./AssignSiteIncharge";
// import ViewAssignedIncharges from "./ViewAssignedIncharges";

// const DisplayReckoner = () => {
//   const [reckonerData, setReckonerData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState(null);
//   const [editingData, setEditingData] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [alert, setAlert] = useState({ type: "", message: "" });
//   const [poGroups, setPoGroups] = useState([]);
//   const [siteInfo, setSiteInfo] = useState(null);
//   const [loadingSite, setLoadingSite] = useState(false);
//   const [siteOptions, setSiteOptions] = useState([]);
//   const [selectedSite, setSelectedSite] = useState("");
//   const [selectedSiteDetails, setSelectedSiteDetails] = useState({
//     po_number: "",
//     site_name: "",
//     site_id: "",
//   });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loadingSites, setLoadingSites] = useState(true);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [showAssignIncharge, setShowAssignIncharge] = useState(false);
//   const dropdownRef = useRef(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchSites();
//     fetchReckonerData();
//   }, [selectedSite]);

//   useEffect(() => {
//     if (reckonerData.length > 0 && selectedSite) {
//       const filtered = reckonerData.filter((item) => item.po_number === selectedSite);
//       setFilteredData(filtered);
//       groupDataByPoNumber();
//     } else {
//       setFilteredData(reckonerData);
//       groupDataByPoNumber();
//     }
//   }, [reckonerData, selectedSite]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const fetchSites = async () => {
//     try {
//       setLoadingSites(true);
//       const res = await axios.get("http://localhost:5000/reckoner/sites");
//       if (res.data.success) {
//         const options = res.data.data.map((site) => ({
//           po_number: site.po_number,
//           site_name: site.site_name,
//           site_id: site.site_id,
//           label: `${site.site_name} (PO: ${site.po_number})`,
//         }));
//         setSiteOptions(options);
//         if (options.length > 0 && !selectedSite) {
//           setSelectedSite(options[0].po_number);
//           setSelectedSiteDetails({
//             po_number: options[0].po_number,
//             site_name: options[0].site_name,
//             site_id: options[0].site_id,
//           });
//           fetchSiteInfo(options[0].po_number);
//         }
//       } else {
//         showAlert("error", "Failed to fetch site options");
//       }
//     } catch (error) {
//       console.error("Error fetching sites:", error);
//       showAlert("error", "Failed to fetch site options");
//     } finally {
//       setLoadingSites(false);
//     }
//   };

//   const groupDataByPoNumber = () => {
//     const groups = {};
//     filteredData.forEach((item) => {
//       if (!groups[item.po_number]) {
//         groups[item.po_number] = [];
//       }
//       groups[item.po_number].push(item);
//     });

//     const poGroupsArray = Object.values(groups);
//     setPoGroups(poGroupsArray);
//   };

//   const fetchSiteInfo = async (poNumber) => {
//     try {
//       setLoadingSite(true);
//       const res = await axios.get(
//         `http://localhost:5000/reckoner/sites/${poNumber}`
//       );
//       if (res.data.success) {
//         setSiteInfo(res.data.data);
//         setSelectedSiteDetails({
//           po_number: poNumber,
//           site_name: res.data.data.site_name,
//           site_id: res.data.data.site_id,
//         });
//       } else {
//         const fallbackSite = siteOptions.find(
//           (option) => option.po_number === poNumber
//         );
//         setSiteInfo(
//           fallbackSite
//             ? {
//                 site_name: fallbackSite.site_name,
//                 site_id: fallbackSite.site_id,
//               }
//             : null
//         );
//         setSelectedSiteDetails({
//           po_number: poNumber,
//           site_name: fallbackSite?.site_name || "",
//           site_id: fallbackSite?.site_id || "",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching site info:", error);
//       const fallbackSite = siteOptions.find(
//         (option) => option.po_number === poNumber
//       );
//       setSiteInfo(
//         fallbackSite
//           ? {
//               site_name: fallbackSite.site_name,
//               site_id: fallbackSite.site_id,
//             }
//           : null
//       );
//       setSelectedSiteDetails({
//         po_number: poNumber,
//         site_name: fallbackSite?.site_name || "",
//         site_id: fallbackSite?.site_id || "",
//       });
//     } finally {
//       setLoadingSite(false);
//     }
//   };

//   const showAlert = (type, message) => {
//     setAlert({ type, message });
//     setTimeout(() => setAlert({ type: "", message: "" }), 3000);
//   };

//   const fetchReckonerData = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("http://localhost:5000/reckoner/reckoner/");
//       const data = res.data.success ? res.data.data : [];
//       setReckonerData(data);
//       if (selectedSite) {
//         setFilteredData(data.filter((item) => item.po_number === selectedSite));
//       } else {
//         setFilteredData(data);
//       }
//     } catch (error) {
//       console.error(error);
//       showAlert("error", "Failed to fetch reckoner data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSiteSelect = (poNumber) => {
//     setSelectedSite(poNumber);
//     const selected = siteOptions.find((option) => option.po_number === poNumber);
//     setSelectedSiteDetails({
//       po_number: poNumber,
//       site_name: selected?.site_name || "",
//       site_id: selected?.site_id || "",
//     });
//     fetchSiteInfo(poNumber);
//     setDropdownOpen(false);
//     setSearchQuery("");
//   };

//   const handleSearchChange = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);
//   };

//   const handleEdit = (record) => {
//     setEditingId(record.rec_id);
//     setEditingData({
//       area_completed: record.area_completed,
//       rate: record.completion_rate,
//       value: record.completion_value,
//       billed_area: record.billed_area,
//       billed_value: record.billed_value,
//       balance_area: record.balance_area,
//       balance_value: record.balance_value,
//       work_status: record.work_status,
//       billing_status: record.billing_status,
//     });
//   };

//   const handleEditChange = (field, value) => {
//     setEditingData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditingData({});
//   };

//   const handleSubmit = async (rec_id) => {
//     try {
//       setSubmitting(true);
//       await axios.patch(
//         `http://localhost:5000/reckoner/completion_status/${rec_id}`,
//         editingData
//       );
//       showAlert("success", "Data updated successfully");
//       await fetchReckonerData();
//       setEditingId(null);
//     } catch (error) {
//       console.error(error);
//       showAlert("error", "Failed to update data");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const renderStatusTag = (status) => {
//     const icon =
//       status === "Completed" ? (
//         <CalendarCheck className="w-4 h-4 text-green-600 mr-1" />
//       ) : status === "In Progress" ? (
//         <HardHat className="w-4 h-4 text-blue-600 mr-1" />
//       ) : (
//         <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
//       );

//     const color =
//       status === "Completed"
//         ? "bg-green-100 text-green-800"
//         : status === "In Progress"
//         ? "bg-blue-100 text-blue-800"
//         : "bg-orange-100 text-orange-800";

//     return (
//       <div
//         className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}
//       >
//         {icon}
//         {status}
//       </div>
//     );
//   };

//   const handleReportRedirect = (reportTypeId) => {
//     if (siteInfo?.site_id && selectedSite) {
//       navigate(`/worksheets/${siteInfo.site_id}/${reportTypeId}`);
//     } else {
//       showAlert("error", "Site information not available");
//     }
//   };

//   const toggleAssignIncharge = () => {
//     setShowAssignIncharge((prev) => !prev);
//   };

//   const currentPoGroup =
//     poGroups.find((group) => group[0]?.po_number === selectedSite) || [];

//   const filteredSiteOptions = siteOptions.filter(
//     (option) =>
//       option.site_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       option.po_number.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
//       {/* Alert Notification */}
//       {alert.message && (
//         <div
//           className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-transform duration-300 transform ${
//             alert.type === "error"
//               ? "bg-red-50 text-red-800 border-l-4 border-red-500"
//               : "bg-green-50 text-green-800 border-l-4 border-green-500"
//           }`}
//         >
//           <div className="flex items-center">
//             {alert.type === "error" ? (
//               <AlertCircle className="w-5 h-5 mr-2" />
//             ) : (
//               <CheckCircle className="w-5 h-5 mr-2" />
//             )}
//             <span className="text-sm font-medium">{alert.message}</span>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-6 sm:mb-8">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
//             Project Reckoner
//           </h1>
//           <p className="mt-2 text-sm sm:text-base text-gray-600">
//             Track and manage your project progress seamlessly
//           </p>
//         </div>

//         {/* Site Selection Dropdown and Assign Incharge Button */}
//         <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end gap-4" ref={dropdownRef}>
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Site
//             </label>
//             <div className="relative max-w-md">
//               {dropdownOpen ? (
//                 <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//                   <div className="flex items-center px-3 py-2 border-b border-gray-200">
//                     <Search className="h-5 w-5 text-gray-400" />
//                     <input
//                       type="text"
//                       autoFocus
//                       value={searchQuery}
//                       onChange={handleSearchChange}
//                       placeholder="Search sites or PO numbers..."
//                       className="flex-1 py-2 px-3 text-sm focus:outline-none bg-transparent"
//                     />
//                     <button
//                       onClick={() => setDropdownOpen(false)}
//                       className="ml-2 text-gray-500 hover:text-gray-700"
//                     >
//                       <X className="h-5 w-5" />
//                     </button>
//                   </div>
//                   <div className="max-h-60 overflow-y-auto">
//                     {loadingSites ? (
//                       <div className="px-4 py-3 text-gray-500 text-sm flex items-center">
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
//                         Loading sites...
//                       </div>
//                     ) : filteredSiteOptions.length === 0 ? (
//                       <div className="px-4 py-3 text-gray-500 text-sm">
//                         No matching sites found
//                       </div>
//                     ) : (
//                       filteredSiteOptions.map((option) => (
//                         <div
//                           key={option.po_number}
//                           onClick={() => handleSiteSelect(option.po_number)}
//                           className={`px-4 py-3 text-sm cursor-pointer hover:bg-indigo-50 transition-colors ${
//                             selectedSite === option.po_number
//                               ? "bg-indigo-100 text-indigo-800"
//                               : "text-gray-700"
//                           }`}
//                         >
//                           <div className="font-medium">{option.site_name}</div>
//                           <div className="text-xs text-gray-500">
//                             PO: {option.po_number}
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => setDropdownOpen(true)}
//                   className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-left hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
//                 >
//                   <div>
//                     {selectedSite ? (
//                       <>
//                         <div className="font-medium text-gray-900 text-sm sm:text-base">
//                           {
//                             siteOptions.find((opt) => opt.po_number === selectedSite)
//                               ?.site_name
//                           }
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           PO: {selectedSite}
//                         </div>
//                       </>
//                     ) : (
//                       <span className="text-gray-500 text-sm sm:text-base">
//                         Select a site...
//                       </span>
//                     )}
//                   </div>
//                   <ChevronDown className="h-5 w-5 text-gray-400" />
//                 </button>
//               )}
//             </div>
//           </div>
//           <button
//             onClick={toggleAssignIncharge}
//             className="px-4 py-3 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all flex items-center text-sm sm:text-base font-medium"
//           >
//             <UserPlus className="h-5 w-5 mr-2" />
//             {showAssignIncharge ? "Hide Assign Incharge" : "Assign Site Incharge"}
//           </button>
//         </div>

//         {/* Assign Site Incharge and View Incharges Components */}
//         <div className="mb-6 sm:mb-8">
//           {showAssignIncharge && <AssignSiteIncharge selectedSite={selectedSiteDetails} />}
//           <ViewAssignedIncharges selectedSite={selectedSiteDetails} />
//         </div>

//         {/* Report Buttons */}
//         {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
//           {[
//             {
//               label: "Site Progress",
//               icon: FileText,
//               color: "from-teal-500 to-teal-600",
//               reportId: 1,
//             },
//             {
//               label: "Material Dispatch",
//               icon: Receipt,
//               color: "from-purple-500 to-purple-600",
//               reportId: 2,
//             },
//             {
//               label: "Material Usage",
//               icon: BrickWall,
//               color: "from-orange-500 to-orange-600",
//               reportId: 3,
//             },
//           ].map((button) => (
//             <button
//               key={button.label}
//               onClick={() => handleReportRedirect(button.reportId)}
//               disabled={loadingSite || !siteInfo?.site_id}
//               className={`flex items-center justify-center px-4 py-3 rounded-xl shadow-md text-white bg-gradient-to-r ${button.color} hover:opacity-90 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base font-medium`}
//             >
//               <button.icon className="mr-2 h-5 w-5" />
//               {button.label}
//             </button>
//           ))}
//         </div> */}

//         {/* Data Table */}
//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
//           </div>
//         ) : currentPoGroup.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 text-center text-gray-500">
//             No reckoner data found for the selected site.
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-md border border-gray-200">
//             {/* Mobile View: Card Layout */}
//             <div className="md:hidden divide-y divide-gray-200">
//               {currentPoGroup.map((r) => (
//                 <div key={r.rec_id} className="p-4 space-y-4">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <div className="font-medium text-gray-900">
//                         {r.item_id}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {r.category_name} / {r.subcategory_name}
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       {editingId === r.rec_id ? (
//                         <>
//                           <button
//                             onClick={() => handleSubmit(r.rec_id)}
//                             disabled={submitting}
//                             className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
//                           >
//                             <Save className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={handleCancelEdit}
//                             className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                           >
//                             <X className="h-4 w-4" />
//                           </button>
//                         </>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit(r)}
//                           className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-900 flex items-center">
//                     <FileText className="mr-2 h-4 w-4 text-indigo-600" />
//                     <span className="truncate">{r.work_descriptions}</span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <div className="font-medium text-gray-700">PO Details</div>
//                       <div>Qty: {r.po_quantity} {r.uom}</div>
//                       <div>Rate: {r.rate}</div>
//                       <div>Value: {r.value}</div>
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-700">Completion</div>
//                       {editingId === r.rec_id ? (
//                         <>
//                           <input
//                             type="text"
//                             value={editingData.area_completed}
//                             onChange={(e) =>
//                               handleEditChange("area_completed", e.target.value)
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm"
//                             placeholder="Area"
//                           />
//                           <input
//                             type="text"
//                             value={editingData.rate}
//                             onChange={(e) =>
//                               handleEditChange("rate", e.target.value)
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm mt-2"
//                             placeholder="Rate"
//                           />
//                           <input
//                             type="text"
//                             value={editingData.value}
//                             onChange={(e) =>
//                               handleEditChange("value", e.target.value)
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm mt-2"
//                             placeholder="Value"
//                           />
//                         </>
//                       ) : (
//                         <>
//                           <div>Area: {r.area_completed}</div>
//                           <div>Rate: {r.completion_rate}</div>
//                           <div>Value: {r.completion_value}</div>
//                         </>
//                       )}
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-700">Billing</div>
//                       {editingId === r.rec_id ? (
//                         <>
//                           <input
//                             type="text"
//                             value={editingData.billed_area}
//                             onChange={(e) =>
//                               handleEditChange("billed_area", e.target.value)
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm"
//                             placeholder="Billed"
//                           />
//                           <input
//                             type="text"
//                             value={editingData.billed_value}
//                             onChange={(e) =>
//                               handleEditChange("billed_value", e.target.value)
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm mt-2"
//                             placeholder="Value"
//                           />
//                           <input
//                             type="text"
//                             value={editingData.balance_area}
//                             onChange={(e) =>
//                               handleEditChange("balance_area", e.target.value)
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm mt-2"
//                             placeholder="Balance"
//                           />
//                         </>
//                       ) : (
//                         <>
//                           <div>Billed: {r.billed_area}</div>
//                           <div>Value: {r.billed_value}</div>
//                           <div>
//                             Balance: {r.balance_area}
//                             {r.balance_value && (
//                               <span className="text-gray-400">
//                                 {" "}
//                                 (₹{r.balance_value})
//                               </span>
//                             )}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-700">Status</div>
//                       {editingId === r.rec_id ? (
//                         <>
//                           <select
//                             className="w-full p-1 border border-gray-300 rounded text-sm"
//                             value={editingData.work_status}
//                             onChange={(e) =>
//                               handleEditChange("work_status", e.target.value)
//                             }
//                           >
//                             <option value="In Progress">In Progress</option>
//                             <option value="Completed">Completed</option>
//                             <option value="Pending">Pending</option>
//                           </select>
//                           <select
//                             className="w-full p-1 border border-gray-300 rounded text-sm mt-2"
//                             value={editingData.billing_status}
//                             onChange={(e) =>
//                               handleEditChange("billing_status", e.target.value)
//                             }
//                           >
//                             <option value="Billed">Billed</option>
//                             <option value="Not Billed">Not Billed</option>
//                             <option value="Partially Billed">
//                               Partially Billed
//                             </option>
//                           </select>
//                         </>
//                       ) : (
//                         <div className="space-y-2">
//                           {renderStatusTag(r.work_status)}
//                           {renderStatusTag(r.billing_status)}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Desktop View: Table Layout */}
//             <div className="hidden md:block overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-indigo-600 to-indigo-700">
//                     <th
//                       className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
//                       rowSpan={2}
//                     >
//                       Item
//                     </th>
//                     <th
//                       className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
//                       rowSpan={2}
//                     >
//                       Description
//                     </th>
//                     <th
//                       className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
//                       colSpan={3}
//                     >
//                       PO Details
//                     </th>
//                     <th
//                       className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
//                       colSpan={3}
//                     >
//                       Completion
//                     </th>
//                     <th
//                       className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
//                       colSpan={3}
//                     >
//                       Billing
//                     </th>
//                     <th
//                       className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
//                       rowSpan={2}
//                     >
//                       Status
//                     </th>
//                     <th
//                       className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
//                       rowSpan={2}
//                     >
//                       Action
//                     </th>
//                   </tr>
//                   <tr className="bg-indigo-500">
//                     <th className="px-2 py-2 text-center text-xs font-semibold text-white">
//                       Qty
//                     </th>
//                     <th className="px-2 py-2 text-center text-xs font-semibold text-white">
//                       Rate
//                     </th>
//                     <th className="px-2 py-2 text-center text-xs font-semibold text-white">
//                       Value
//                     </th>
//                     <th className="px-2 py-2 text-center text-xs font-semibold text-white">
//                       Area
//                     </th>
//                     <th className="px-2 py-2 text-center text-xs font-semibold text-white">
//                       Rate
//                     </th>
//                     <th className="px-2 py-2 text-center text-xs font-semibold text-white">
//                       Value
//                     </th>
//                     <th className="px-2 py-2 text-center text-xs font-semibold text-white">
//                       Billed
//                     </th>
//                     <th className="px-2 py-2 text-center text-xs font-semibold text-white">
//                       Value
//                     </th>
//                     <th className="px-2 py-2 text-center text-xs font-semibold text-white">
//                       Balance
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {currentPoGroup.map((r) => (
//                     <tr
//                       key={r.rec_id}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-4 py-4 text-sm font-medium text-gray-900">
//                         <div>{r.item_id}</div>
//                         <div className="text-xs text-gray-500">
//                           {r.category_name} / {r.subcategory_name}
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 max-w-xs text-sm text-gray-900">
//                         <div className="flex items-center">
//                           <FileText className="mr-2 h-4 w-4 text-indigo-600" />
//                           <span className="truncate">{r.work_descriptions}</span>
//                         </div>
//                       </td>
//                       <td className="px-2 py-4 text-center text-sm">
//                         {r.po_quantity} {r.uom}
//                       </td>
//                       <td className="px-2 py-4 text-center text-sm">{r.rate}</td>
//                       <td className="px-2 py-4 text-center text-sm">{r.value}</td>
//                       {editingId === r.rec_id ? (
//                         <>
//                           <td className="px-2 py-4 text-center">
//                             <input
//                               type="text"
//                               value={editingData.area_completed}
//                               onChange={(e) =>
//                                 handleEditChange("area_completed", e.target.value)
//                               }
//                               className="w-20 p-1 border border-gray-300 rounded text-sm text-center"
//                               placeholder="Area"
//                             />
//                           </td>
//                           <td className="px-2 py-4 text-center">
//                             <input
//                               type="text"
//                               value={editingData.rate}
//                               onChange={(e) =>
//                                 handleEditChange("rate", e.target.value)
//                               }
//                               className="w-16 p-1 border border-gray-300 rounded text-sm text-center"
//                               placeholder="Rate"
//                             />
//                           </td>
//                           <td className="px-2 py-4 text-center">
//                             <input
//                               type="text"
//                               value={editingData.value}
//                               onChange={(e) =>
//                                 handleEditChange("value", e.target.value)
//                               }
//                               className="w-20 p-1 border border-gray-300 rounded text-sm text-center"
//                               placeholder="Value"
//                             />
//                           </td>
//                         </>
//                       ) : (
//                         <>
//                           <td className="px-2 py-4 text-center text-sm">
//                             {r.area_completed}
//                           </td>
//                           <td className="px-2 py-4 text-center text-sm">
//                             {r.completion_rate}
//                           </td>
//                           <td className="px-2 py-4 text-center text-sm">
//                             {r.completion_value}
//                           </td>
//                         </>
//                       )}
//                       {editingId === r.rec_id ? (
//                         <>
//                           <td className="px-2 py-4 text-center">
//                             <input
//                               type="text"
//                               value={editingData.billed_area}
//                               onChange={(e) =>
//                                 handleEditChange("billed_area", e.target.value)
//                               }
//                               className="w-20 p-1 border border-gray-300 rounded text-sm text-center"
//                               placeholder="Billed"
//                             />
//                           </td>
//                           <td className="px-2 py-4 text-center">
//                             <input
//                               type="text"
//                               value={editingData.billed_value}
//                               onChange={(e) =>
//                                 handleEditChange("billed_value", e.target.value)
//                               }
//                               className="w-20 p-1 border border-gray-300 rounded text-sm text-center"
//                               placeholder="Value"
//                             />
//                           </td>
//                           <td className="px-2 py-4 text-center">
//                             <input
//                               type="text"
//                               value={editingData.balance_area}
//                               onChange={(e) =>
//                                 handleEditChange("balance_area", e.target.value)
//                               }
//                               className="w-20 p-1 border border-gray-300 rounded text-sm text-center"
//                               placeholder="Balance"
//                             />
//                           </td>
//                         </>
//                       ) : (
//                         <>
//                           <td className="px-2 py-4 text-center text-sm">
//                             {r.billed_area}
//                           </td>
//                           <td className="px-2 py-4 text-center text-sm">
//                             {r.billed_value}
//                           </td>
//                           <td className="px-2 py-4 text-center text-sm">
//                             <div>{r.balance_area}</div>
//                             <div className="text-xs text-gray-400">
//                               {r.balance_value ? `₹${r.balance_value}` : ""}
//                             </div>
//                           </td>
//                         </>
//                       )}
//                       <td className="px-4 py-4 text-center text-sm space-y-2">
//                         {editingId === r.rec_id ? (
//                           <>
//                             <select
//                               className="w-full p-1 border border-gray-300 rounded text-sm"
//                               value={editingData.work_status}
//                               onChange={(e) =>
//                                 handleEditChange("work_status", e.target.value)
//                               }
//                             >
//                               <option value="In Progress">In Progress</option>
//                               <option value="Completed">Completed</option>
//                               <option value="Pending">Pending</option>
//                             </select>
//                             <select
//                               className="w-full p-1 border border-gray-300 rounded text-sm mt-2"
//                               value={editingData.billing_status}
//                               onChange={(e) =>
//                                 handleEditChange("billing_status", e.target.value)
//                               }
//                             >
//                               <option value="Billed">Billed</option>
//                               <option value="Not Billed">Not Billed</option>
//                               <option value="Partially Billed">
//                                 Partially Billed
//                               </option>
//                             </select>
//                           </>
//                         ) : (
//                           <>
//                             {renderStatusTag(r.work_status)}
//                             {renderStatusTag(r.billing_status)}
//                           </>
//                         )}
//                       </td>
//                       <td className="px-4 py-4 text-right text-sm">
//                         {editingId === r.rec_id ? (
//                           <div className="flex gap-2 justify-end">
//                             <button
//                               onClick={() => handleSubmit(r.rec_id)}
//                               disabled={submitting}
//                               className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
//                             >
//                               <Save className="mr-1 h-4 w-4" /> Save
//                             </button>
//                             <button
//                               onClick={handleCancelEdit}
//                               className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700"
//                             >
//                               <X className="mr-1 h-4 w-4" /> Cancel
//                             </button>
//                           </div>
//                         ) : (
//                           <button
//                             onClick={() => handleEdit(r)}
//                             className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
//                           >
//                             <Edit className="mr-1 h-4 w-4" /> Edit
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DisplayReckoner;


















import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  IndianRupee,
  Percent,
  TrendingUp,
  MapPin,
  HardHat,
  Receipt,
  CalendarCheck,
  Hexagon,
  BrickWall,
  ReceiptText,
  Grid2x2Check,
  Search,
  ChevronDown,
  UserPlus,
  Package,
  Truck,
} from "lucide-react";
import AssignSiteIncharge from "./AssignSiteIncharge";
import ViewAssignedIncharges from "./ViewAssignedIncharges";
import MaterialPlanning from "./AssignMaterial";
import MaterialDispatch from "./ViewAssignedMaterial";

const DisplayReckoner = () => {
  const [reckonerData, setReckonerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [poGroups, setPoGroups] = useState([]);
  const [siteInfo, setSiteInfo] = useState(null);
  const [loadingSite, setLoadingSite] = useState(false);
  const [siteOptions, setSiteOptions] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedSiteDetails, setSelectedSiteDetails] = useState({
    po_number: "",
    site_name: "",
    site_id: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingSites, setLoadingSites] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAssignIncharge, setShowAssignIncharge] = useState(false);
  const [showMaterialPlanning, setShowMaterialPlanning] = useState(false);
  const [showMaterialDispatch, setShowMaterialDispatch] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSites();
    fetchReckonerData();
  }, [selectedSite]);

  useEffect(() => {
    if (reckonerData.length > 0 && selectedSite) {
      const filtered = reckonerData.filter((item) => item.po_number === selectedSite);
      setFilteredData(filtered);
      groupDataByPoNumber();
    } else {
      setFilteredData(reckonerData);
      groupDataByPoNumber();
    }
  }, [reckonerData, selectedSite]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSites = async () => {
    try {
      setLoadingSites(true);
      const res = await axios.get("http://localhost:5000/reckoner/sites");
      if (res.data.success) {
        const options = res.data.data.map((site) => ({
          po_number: site.po_number,
          site_name: site.site_name,
          site_id: site.site_id,
          label: `${site.site_name} (PO: ${site.po_number})`,
        }));
        setSiteOptions(options);
        if (options.length > 0 && !selectedSite) {
          setSelectedSite(options[0].po_number);
          setSelectedSiteDetails({
            po_number: options[0].po_number,
            site_name: options[0].site_name,
            site_id: options[0].site_id,
          });
          fetchSiteInfo(options[0].po_number);
        }
      } else {
        showAlert("error", "Failed to fetch site options");
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
      showAlert("error", "Failed to fetch site options");
    } finally {
      setLoadingSites(false);
    }
  };

  const groupDataByPoNumber = () => {
    const groups = {};
    filteredData.forEach((item) => {
      if (!groups[item.po_number]) {
        groups[item.po_number] = [];
      }
      groups[item.po_number].push(item);
    });

    const poGroupsArray = Object.values(groups);
    setPoGroups(poGroupsArray);
  };

  const fetchSiteInfo = async (poNumber) => {
    try {
      setLoadingSite(true);
      const res = await axios.get(
        `http://localhost:5000/reckoner/sites/${poNumber}`
      );
      if (res.data.success) {
        setSiteInfo(res.data.data);
        setSelectedSiteDetails({
          po_number: poNumber,
          site_name: res.data.data.site_name,
          site_id: res.data.data.site_id,
        });
      } else {
        const fallbackSite = siteOptions.find(
          (option) => option.po_number === poNumber
        );
        setSiteInfo(
          fallbackSite
            ? {
                site_name: fallbackSite.site_name,
                site_id: fallbackSite.site_id,
              }
            : null
        );
        setSelectedSiteDetails({
          po_number: poNumber,
          site_name: fallbackSite?.site_name || "",
          site_id: fallbackSite?.site_id || "",
        });
      }
    } catch (error) {
      console.error("Error fetching site info:", error);
      const fallbackSite = siteOptions.find(
        (option) => option.po_number === poNumber
      );
      setSiteInfo(
        fallbackSite
          ? {
              site_name: fallbackSite.site_name,
              site_id: fallbackSite.site_id,
            }
          : null
      );
      setSelectedSiteDetails({
        po_number: poNumber,
        site_name: fallbackSite?.site_name || "",
        site_id: fallbackSite?.site_id || "",
      });
    } finally {
      setLoadingSite(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  const fetchReckonerData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/reckoner/reckoner/");
      const data = res.data.success ? res.data.data : [];
      setReckonerData(data);
      if (selectedSite) {
        setFilteredData(data.filter((item) => item.po_number === selectedSite));
      } else {
        setFilteredData(data);
      }
    } catch (error) {
      console.error(error);
      showAlert("error", "Failed to fetch reckoner data");
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSelect = (poNumber) => {
    setSelectedSite(poNumber);
    const selected = siteOptions.find((option) => option.po_number === poNumber);
    setSelectedSiteDetails({
      po_number: poNumber,
      site_name: selected?.site_name || "",
      site_id: selected?.site_id || "",
    });
    fetchSiteInfo(poNumber);
    setDropdownOpen(false);
    setSearchQuery("");
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleEdit = (record) => {
    setEditingId(record.rec_id);
    setEditingData({
      area_completed: record.area_completed,
      rate: record.completion_rate,
      value: record.completion_value,
      billed_area: record.billed_area,
      billed_value: record.billed_value,
      balance_area: record.balance_area,
      balance_value: record.balance_value,
      work_status: record.work_status,
      billing_status: record.billing_status,
    });
  };

  const handleEditChange = (field, value) => {
    setEditingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleSubmit = async (rec_id) => {
    try {
      setSubmitting(true);
      await axios.patch(
        `http://localhost:5000/reckoner/completion_status/${rec_id}`,
        editingData
      );
      showAlert("success", "Data updated successfully");
      await fetchReckonerData();
      setEditingId(null);
    } catch (error) {
      console.error(error);
      showAlert("error", "Failed to update data");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusTag = (status) => {
    const icon =
      status === "Completed" ? (
        <CalendarCheck className="w-4 h-4 text-green-600 mr-1" />
      ) : status === "In Progress" ? (
        <HardHat className="w-4 h-4 text-blue-600 mr-1" />
      ) : (
        <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
      );

    const color =
      status === "Completed"
        ? "bg-green-100 text-green-800"
        : status === "In Progress"
        ? "bg-blue-100 text-blue-800"
        : "bg-orange-100 text-orange-800";

    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}
      >
        {icon}
        {status}
      </div>
    );
  };

  const handleReportRedirect = (reportTypeId) => {
    if (siteInfo?.site_id && selectedSite) {
      navigate(`/worksheets/${siteInfo.site_id}/${reportTypeId}`);
    } else {
      showAlert("error", "Site information not available");
    }
  };

  const toggleAssignIncharge = () => {
    setShowAssignIncharge((prev) => !prev);
  };

  const toggleMaterialPlanning = () => {
    setShowMaterialPlanning((prev) => !prev);
  };

  const toggleMaterialDispatch = () => {
    setShowMaterialDispatch((prev) => !prev);
  };

  const currentPoGroup =
    poGroups.find((group) => group[0]?.po_number === selectedSite) || [];

  const filteredSiteOptions = siteOptions.filter(
    (option) =>
      option.site_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.po_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      {/* Alert Notification */}
      {alert.message && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-transform duration-300 transform ${
            alert.type === "error"
              ? "bg-red-50 text-red-800 border-l-4 border-red-500"
              : "bg-green-50 text-green-800 border-l-4 border-green-500"
          }`}
        >
          <div className="flex items-center">
            {alert.type === "error" ? (
              <AlertCircle className="w-5 h-5 mr-2" />
            ) : (
              <CheckCircle className="w-5 h-5 mr-2" />
            )}
            <span className="text-sm font-medium">{alert.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Project Reckoner
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Track and manage your project progress seamlessly
          </p>
        </div>

        {/* Site Selection Dropdown and Action Buttons */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end gap-4" ref={dropdownRef}>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Site
            </label>
            <div className="relative max-w-md">
              {dropdownOpen ? (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="flex items-center px-3 py-2 border-b border-gray-200">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search sites or PO numbers..."
                      className="flex-1 py-2 px-3 text-sm focus:outline-none bg-transparent"
                    />
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {loadingSites ? (
                      <div className="px-4 py-3 text-gray-500 text-sm flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                        Loading sites...
                      </div>
                    ) : filteredSiteOptions.length === 0 ? (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        No matching sites found
                      </div>
                    ) : (
                      filteredSiteOptions.map((option) => (
                        <div
                          key={option.po_number}
                          onClick={() => handleSiteSelect(option.po_number)}
                          className={`px-4 py-3 text-sm cursor-pointer hover:bg-indigo-50 transition-colors ${
                            selectedSite === option.po_number
                              ? "bg-indigo-100 text-indigo-800"
                              : "text-gray-700"
                          }`}
                        >
                          <div className="font-medium">{option.site_name}</div>
                          <div className="text-xs text-gray-500">
                            PO: {option.po_number}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setDropdownOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-left hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                >
                  <div>
                    {selectedSite ? (
                      <>
                        <div className="font-medium text-gray-900 text-sm sm:text-base">
                          {
                            siteOptions.find((opt) => opt.po_number === selectedSite)
                              ?.site_name
                          }
                        </div>
                        <div className="text-xs text-gray-500">
                          PO: {selectedSite}
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-500 text-sm sm:text-base">
                        Select a site...
                      </span>
                    )}
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={toggleAssignIncharge}
              className="px-4 py-3 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all flex items-center text-sm sm:text-base font-medium"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              {showAssignIncharge ? "Hide Assign Incharge" : "Assign Site Incharge"}
            </button>
            <button
              onClick={toggleMaterialPlanning}
              className="px-4 py-3 bg-purple-600 text-white rounded-xl shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all flex items-center text-sm sm:text-base font-medium"
            >
              <Package className="h-5 w-5 mr-2" />
              {showMaterialPlanning ? "Hide Material Planning" : "Material Planning"}
            </button>
            <button
              onClick={toggleMaterialDispatch}
              className="px-4 py-3 bg-teal-600 text-white rounded-xl shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all flex items-center text-sm sm:text-base font-medium"
            >
              <Truck className="h-5 w-5 mr-2" />
              {showMaterialDispatch ? "Hide Material Dispatch" : "Material Dispatch"}
            </button>
          </div>
        </div>

        {/* Action Components */}
        <div className="mb-6 sm:mb-8">
          {showAssignIncharge && <AssignSiteIncharge selectedSite={selectedSiteDetails} />}
          {showMaterialPlanning && <MaterialPlanning selectedSite={selectedSiteDetails} />}
          {showMaterialDispatch && <MaterialDispatch selectedSite={selectedSiteDetails} />}
          <ViewAssignedIncharges selectedSite={selectedSiteDetails} />
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : currentPoGroup.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 text-center text-gray-500">
            No reckoner data found for the selected site.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            {/* Mobile View: Card Layout */}
            <div className="md:hidden divide-y divide-gray-200">
              {currentPoGroup.map((r) => (
                <div key={r.rec_id} className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        {r.item_id}
                      </div>
                      <div className="text-xs text-gray-500">
                        {r.category_name} / {r.subcategory_name}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {editingId === r.rec_id ? (
                        <>
                          <button
                            onClick={() => handleSubmit(r.rec_id)}
                            disabled={submitting}
                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(r)}
                          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-indigo-600" />
                    <span className="truncate">{r.work_descriptions}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700">PO Details</div>
                      <div>Qty: {r.po_quantity} {r.uom}</div>
                      <div>Rate: {r.rate}</div>
                      <div>Value: {r.value}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Completion</div>
                      {editingId === r.rec_id ? (
                        <>
                          <input
                            type="text"
                            value={editingData.area_completed}
                            onChange={(e) =>
                              handleEditChange("area_completed", e.target.value)
                            }
                            className="w-full p-1 border border-gray-300 rounded text-sm"
                            placeholder="Area"
                          />
                          <input
                            type="text"
                            value={editingData.rate}
                            onChange={(e) =>
                              handleEditChange("rate", e.target.value)
                            }
                            className="w-full p-1 border border-gray-300 rounded text-sm mt-2"
                            placeholder="Rate"
                          />
                          <input
                            type="text"
                            value={editingData.value}
                            onChange={(e) =>
                              handleEditChange("value", e.target.value)
                            }
                            className="w-full p-1 border border-gray-300 rounded text-sm mt-2"
                            placeholder="Value"
                          />
                        </>
                      ) : (
                        <>
                          <div>Area: {r.area_completed}</div>
                          <div>Rate: {r.completion_rate}</div>
                          <div>Value: {r.completion_value}</div>
                        </>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Billing</div>
                      {editingId === r.rec_id ? (
                        <>
                          <input
                            type="text"
                            value={editingData.billed_area}
                            onChange={(e) =>
                              handleEditChange("billed_area", e.target.value)
                            }
                            className="w-full p-1 border border-gray-300 rounded text-sm"
                            placeholder="Billed"
                          />
                          <input
                            type="text"
                            value={editingData.billed_value}
                            onChange={(e) =>
                              handleEditChange("billed_value", e.target.value)
                            }
                            className="w-full p-1 border border-gray-300 rounded text-sm mt-2"
                            placeholder="Value"
                          />
                          <input
                            type="text"
                            value={editingData.balance_area}
                            onChange={(e) =>
                              handleEditChange("balance_area", e.target.value)
                            }
                            className="w-full p-1 border border-gray-300 rounded text-sm mt-2"
                            placeholder="Balance"
                          />
                        </>
                      ) : (
                        <>
                          <div>Billed: {r.billed_area}</div>
                          <div>Value: {r.billed_value}</div>
                          <div>
                            Balance: {r.balance_area}
                            {r.balance_value && (
                              <span className="text-gray-400">
                                {" "}
                                (₹{r.balance_value})
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Status</div>
                      {editingId === r.rec_id ? (
                        <>
                          <select
                            className="w-full p-1 border border-gray-300 rounded text-sm"
                            value={editingData.work_status}
                            onChange={(e) =>
                              handleEditChange("work_status", e.target.value)
                            }
                          >
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                          </select>
                          <select
                            className="w-full p-1 border border-gray-300 rounded text-sm mt-2"
                            value={editingData.billing_status}
                            onChange={(e) =>
                              handleEditChange("billing_status", e.target.value)
                            }
                          >
                            <option value="Billed">Billed</option>
                            <option value="Not Billed">Not Billed</option>
                            <option value="Partially Billed">
                              Partially Billed
                            </option>
                          </select>
                        </>
                      ) : (
                        <div className="space-y-2">
                          {renderStatusTag(r.work_status)}
                          {renderStatusTag(r.billing_status)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table Layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-indigo-700">
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      rowSpan={2}
                    >
                      Item
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      rowSpan={2}
                    >
                      Description
                    </th>
                    <th
                      className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                      colSpan={3}
                    >
                      PO Details
                    </th>
                    <th
                      className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                      colSpan={3}
                    >
                      Completion
                    </th>
                    <th
                      className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                      colSpan={3}
                    >
                      Billing
                    </th>
                    <th
                      className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                      rowSpan={2}
                    >
                      Status
                    </th>
                    <th
                      className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                      rowSpan={2}
                    >
                      Action
                    </th>
                  </tr>
                  <tr className="bg-indigo-500">
                    <th className="px-2 py-2 text-center text-xs font-semibold text-white">
                      Qty
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-semibold text-white">
                      Rate
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-semibold text-white">
                      Value
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-semibold text-white">
                      Area
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-semibold text-white">
                      Rate
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-semibold text-white">
                      Value
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-semibold text-white">
                      Billed
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-semibold text-white">
                      Value
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-semibold text-white">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPoGroup.map((r) => (
                    <tr
                      key={r.rec_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        <div>{r.item_id}</div>
                        <div className="text-xs text-gray-500">
                          {r.category_name} / {r.subcategory_name}
                        </div>
                      </td>
                      <td className="px-4 py-4 max-w-xs text-sm text-gray-900">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-indigo-600" />
                          <span className="truncate">{r.work_descriptions}</span>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-center text-sm">
                        {r.po_quantity} {r.uom}
                      </td>
                      <td className="px-2 py-4 text-center text-sm">{r.rate}</td>
                      <td className="px-2 py-4 text-center text-sm">{r.value}</td>
                      {editingId === r.rec_id ? (
                        <>
                          <td className="px-2 py-4 text-center">
                            <input
                              type="text"
                              value={editingData.area_completed}
                              onChange={(e) =>
                                handleEditChange("area_completed", e.target.value)
                              }
                              className="w-20 p-1 border border-gray-300 rounded text-sm text-center"
                              placeholder="Area"
                            />
                          </td>
                          <td className="px-2 py-4 text-center">
                            <input
                              type="text"
                              value={editingData.rate}
                              onChange={(e) =>
                                handleEditChange("rate", e.target.value)
                              }
                              className="w-16 p-1 border border-gray-300 rounded text-sm text-center"
                              placeholder="Rate"
                            />
                          </td>
                          <td className="px-2 py-4 text-center">
                            <input
                              type="text"
                              value={editingData.value}
                              onChange={(e) =>
                                handleEditChange("value", e.target.value)
                              }
                              className="w-20 p-1 border border-gray-300 rounded text-sm text-center"
                              placeholder="Value"
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-2 py-4 text-center text-sm">
                            {r.area_completed}
                          </td>
                          <td className="px-2 py-4 text-center text-sm">
                            {r.completion_rate}
                          </td>
                          <td className="px-2 py-4 text-center text-sm">
                            {r.completion_value}
                          </td>
                        </>
                      )}
                      {editingId === r.rec_id ? (
                        <>
                          <td className="px-2 py-4 text-center">
                            <input
                              type="text"
                              value={editingData.billed_area}
                              onChange={(e) =>
                                handleEditChange("billed_area", e.target.value)
                              }
                              className="w-20 p-1 border border-gray-300 rounded text-sm text-center"
                              placeholder="Billed"
                            />
                          </td>
                          <td className="px-2 py-4 text-center">
                            <input
                              type="text"
                              value={editingData.billed_value}
                              onChange={(e) =>
                                handleEditChange("billed_value", e.target.value)
                              }
                              className="w-20 p-1 border border-gray-300 rounded text-sm text-center"
                              placeholder="Value"
                            />
                          </td>
                          <td className="px-2 py-4 text-center">
                            <input
                              type="text"
                              value={editingData.balance_area}
                              onChange={(e) =>
                                handleEditChange("balance_area", e.target.value)
                              }
                              className="w-20 p-1 border border-gray-300 rounded text-sm text-center"
                              placeholder="Balance"
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-2 py-4 text-center text-sm">
                            {r.billed_area}
                          </td>
                          <td className="px-2 py-4 text-center text-sm">
                            {r.billed_value}
                          </td>
                          <td className="px-2 py-4 text-center text-sm">
                            <div>{r.balance_area}</div>
                            <div className="text-xs text-gray-400">
                              {r.balance_value ? `₹${r.balance_value}` : ""}
                            </div>
                          </td>
                        </>
                      )}
                      <td className="px-4 py-4 text-center text-sm space-y-2">
                        {editingId === r.rec_id ? (
                          <>
                            <select
                              className="w-full p-1 border border-gray-300 rounded text-sm"
                              value={editingData.work_status}
                              onChange={(e) =>
                                handleEditChange("work_status", e.target.value)
                              }
                            >
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Pending">Pending</option>
                            </select>
                            <select
                              className="w-full p-1 border border-gray-300 rounded text-sm mt-2"
                              value={editingData.billing_status}
                              onChange={(e) =>
                                handleEditChange("billing_status", e.target.value)
                              }
                            >
                              <option value="Billed">Billed</option>
                              <option value="Not Billed">Not Billed</option>
                              <option value="Partially Billed">
                                Partially Billed
                              </option>
                            </select>
                          </>
                        ) : (
                          <>
                            {renderStatusTag(r.work_status)}
                            {renderStatusTag(r.billing_status)}
                          </>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right text-sm">
                        {editingId === r.rec_id ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleSubmit(r.rec_id)}
                              disabled={submitting}
                              className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                            >
                              <Save className="mr-1 h-4 w-4" /> Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700"
                            >
                              <X className="mr-1 h-4 w-4" /> Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(r)}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            <Edit className="mr-1 h-4 w-4" /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayReckoner;