// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Loader2, Package, Calendar, FileText } from "lucide-react";

// const ViewAssignedMaterial = () => {
//   const [assignedMaterials, setAssignedMaterials] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch assigned materials
//   const fetchAssignedMaterials = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get("http://localhost:5000/material/assigned-materials");
//       setAssignedMaterials(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching assigned materials:", error);
//       setError(error.response?.data?.message || "Failed to load assigned materials. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAssignedMaterials();
//   }, []);

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-teal-50 via-gray-50 to-blue-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
//             <Package className="h-8 w-8 text-teal-600" />
//             View Assigned Materials
//           </h2>
//           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//             Explore and review all materials assigned to your project sites with detailed insights
//           </p>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center py-16">
//             <div className="flex flex-col items-center space-y-4">
//               <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
//               <p className="text-gray-600 text-lg font-medium">Loading material assignments...</p>
//             </div>
//           </div>
//         ) : error ? (
//           <div className="mb-6 p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
//             <div className="flex items-center gap-2">
//               <FileText className="h-5 w-5 text-red-500" />
//               <span>{error}</span>
//             </div>
//           </div>
//         ) : assignedMaterials.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
//             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-600 text-lg font-medium">No material assignments found.</p>
//             <p className="text-gray-500 mt-2">Assign materials to projects to see them listed here.</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                       #
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider flex items-center gap-2">
//                       Project Name
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                       Site Details
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                       Material Details
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider flex items-center gap-2">
//                       <Calendar className="h-5 w-5" />
//                       Assigned At
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {assignedMaterials.map((assignment, index) => (
//                     <tr
//                       key={assignment.id}
//                       className="hover:bg-teal-50 transition-colors duration-200"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         {assignment.project_name || "N/A"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="space-y-1">
//                           <p className="font-medium">{assignment.site_name || "N/A"}</p>
//                           <p className="text-xs text-gray-500">PO: {assignment.po_number || "N/A"}</p>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="space-y-1">
//                           <p className="font-medium">{assignment.item_name || "N/A"}</p>
//                           <p className="text-xs text-gray-500">UOM: {assignment.uom_name || "N/A"}</p>
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-teal-100 text-teal-800">
//                             Qty: {assignment.quantity}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         {new Date(assignment.created_at).toLocaleString()}
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

// export default ViewAssignedMaterial;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Package, Calendar, Truck, Pencil, FileText, X } from "lucide-react";

const ViewAssignedMaterial = () => {
  const [assignedMaterials, setAssignedMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dispatchData, setDispatchData] = useState({});
  const [editingDispatch, setEditingDispatch] = useState(null);

  // Fetch assigned materials
  const fetchAssignedMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/material/assignments-with-dispatch");
      setAssignedMaterials(response.data.data || []);
    } catch (error) {
      console.error("Error fetching material assignments:", error);
      setError(
        error.response?.data?.message ||
        error.response?.data?.sqlMessage ||
        "Failed to load material assignments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle dispatch form input changes
  const handleDispatchChange = (assignmentId, field, value) => {
    setDispatchData((prev) => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [field]: value,
      },
    }));
  };

  // Handle dispatch form submission
  const handleDispatchSubmit = async (assignmentId) => {
    try {
      const data = dispatchData[assignmentId] || {};
      if (!data.dc_no || !data.dispatch_date || !data.dispatch_qty) {
        setError("Please fill all dispatch fields: DC No, Dispatch Date, and Dispatch Quantity.");
        return;
      }

      await axios.post("http://localhost:5000/material/add-dispatch", {
        material_assign_id: assignmentId,
        dc_no: parseInt(data.dc_no),
        dispatch_date: data.dispatch_date,
        dispatch_qty: parseFloat(data.dispatch_qty),
      });

      setError(null);
      setEditingDispatch(null);
      setDispatchData((prev) => ({
        ...prev,
        [assignmentId]: {},
      }));
      await fetchAssignedMaterials();
    } catch (error) {
      console.error("Error dispatching material:", error);
      setError(error.response?.data?.message || "Failed to dispatch material. Please try again.");
    }
  };

  useEffect(() => {
    fetchAssignedMaterials();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
            <Package className="h-8 w-8 text-teal-600" aria-hidden="true" />
            Material Assignments
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Efficiently manage and dispatch materials to your project sites
          </p>
        </div>

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
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-teal-600 animate-spin" aria-hidden="true" />
              <p className="text-gray-600 text-lg font-medium">Loading material assignments...</p>
            </div>
          </div>
        ) : assignedMaterials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600 text-lg font-medium">No material assignments found.</p>
            <p className="text-gray-500 mt-2">Assign materials to projects to see them listed here.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        Project Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        Site Details
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        Material Details
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" aria-hidden="true" />
                          Assigned At
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        <div className="flex items-center gap-2">
                          <Truck className="h-5 w-5" aria-hidden="true" />
                          Material Dispatch
                        </div>
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
                          {assignment.project_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="space-y-1">
                            <p className="font-medium">{assignment.site_name || "N/A"}</p>
                            <p className="text-xs text-gray-500">PO: {assignment.po_number || "N/A"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="space-y-1">
                            <p className="font-medium">{assignment.item_name || "N/A"}</p>
                            <p className="text-xs text-gray-500">UOM: {assignment.uom_name || "N/A"}</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                              Qty: {assignment.assign_qty || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-teal-600" aria-hidden="true" />
                            <span>
                              {assignment.created_at
                                ? new Date(assignment.created_at).toLocaleString("en-US", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })
                                : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {assignment.dispatch_dc_no ? (
                            <div className="space-y-2 bg-teal-50 p-3 rounded-lg">
                              <p className="font-medium text-teal-800 flex items-center gap-2">
                                <Truck className="h-4 w-4" aria-hidden="true" />
                                DC: {assignment.dispatch_dc_no}
                              </p>
                              <p className="text-xs text-gray-600">
                                Date:{" "}
                                {assignment.dispatch_date
                                  ? new Date(assignment.dispatch_date).toLocaleDateString("en-US", {
                                      dateStyle: "medium",
                                    })
                                  : "N/A"}
                              </p>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-200 text-teal-900">
                                Qty: {assignment.dispatch_qty}
                              </span>
                            </div>
                          ) : (
                            <div>
                              {editingDispatch === assignment.id ? (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-lg shadow-inner">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600" htmlFor={`dc_no_${assignment.id}`}>
                                      DC No
                                    </label>
                                    <input
                                      type="number"
                                      id={`dc_no_${assignment.id}`}
                                      placeholder="Enter DC No"
                                      value={dispatchData[assignment.id]?.dc_no || ""}
                                      onChange={(e) => handleDispatchChange(assignment.id, "dc_no", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                                      aria-required="true"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600" htmlFor={`dispatch_date_${assignment.id}`}>
                                      Dispatch Date
                                    </label>
                                    <input
                                      type="date"
                                      id={`dispatch_date_${assignment.id}`}
                                      value={dispatchData[assignment.id]?.dispatch_date || ""}
                                      onChange={(e) => handleDispatchChange(assignment.id, "dispatch_date", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                                      aria-required="true"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600" htmlFor={`dispatch_qty_${assignment.id}`}>
                                      Dispatch Quantity
                                    </label>
                                    <input
                                      type="number"
                                      id={`dispatch_qty_${assignment.id}`}
                                      step="0.01"
                                      placeholder="Enter Quantity"
                                      value={dispatchData[assignment.id]?.dispatch_qty || ""}
                                      onChange={(e) => handleDispatchChange(assignment.id, "dispatch_qty", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                                      aria-required="true"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleDispatchSubmit(assignment.id)}
                                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                      aria-label="Save dispatch details"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingDispatch(null)}
                                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                      aria-label="Cancel editing"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setEditingDispatch(assignment.id)}
                                  className="flex items-center gap-2 text-teal-600 hover:text-teal-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-md px-2 py-1"
                                  aria-label="Add dispatch details"
                                >
                                  <Pencil className="h-4 w-4" aria-hidden="true" />
                                  Add Dispatch
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-6">
              {assignedMaterials.map((assignment, index) => (
                <div
                  key={assignment.id}
                  className="bg-white rounded-lg shadow-md p-5 border border-gray-100"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Project</p>
                      <p className="text-sm text-gray-600">{assignment.project_name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Site Details</p>
                      <p className="text-sm text-gray-600">{assignment.site_name || "N/A"}</p>
                      <p className="text-xs text-gray-500">PO: {assignment.po_number || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Material Details</p>
                      <p className="text-sm text-gray-600">{assignment.item_name || "N/A"}</p>
                      <p className="text-xs text-gray-500">UOM: {assignment.uom_name || "N/A"}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mt-1">
                        Qty: {assignment.assign_qty || "N/A"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-teal-600" aria-hidden="true" />
                        Assigned At
                      </p>
                      <p className="text-sm text-gray-600">
                        {assignment.created_at
                          ? new Date(assignment.created_at).toLocaleString("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Truck className="h-4 w-4 text-teal-600" aria-hidden="true" />
                        Material Dispatch
                      </p>
                      {assignment.dispatch_dc_no ? (
                        <div className="space-y-2 bg-teal-50 p-3 rounded-lg">
                          <p className="text-sm text-teal-800 font-medium flex items-center gap-2">
                            <Truck className="h-4 w-4" aria-hidden="true" />
                            DC: {assignment.dispatch_dc_no}
                          </p>
                          <p className="text-xs text-gray-600">
                            Date:{" "}
                            {assignment.dispatch_date
                              ? new Date(assignment.dispatch_date).toLocaleDateString("en-US", {
                                  dateStyle: "medium",
                                })
                              : "N/A"}
                          </p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-200 text-teal-900">
                            Qty: {assignment.dispatch_qty}
                          </span>
                        </div>
                      ) : (
                        <div>
                          {editingDispatch === assignment.id ? (
                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg shadow-inner">
                              <div>
                                <label className="block text-xs font-medium text-gray-600" htmlFor={`dc_no_${assignment.id}`}>
                                  DC No
                                </label>
                                <input
                                  type="number"
                                  id={`dc_no_${assignment.id}`}
                                  placeholder="Enter DC No"
                                  value={dispatchData[assignment.id]?.dc_no || ""}
                                  onChange={(e) => handleDispatchChange(assignment.id, "dc_no", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                                  aria-required="true"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600" htmlFor={`dispatch_date_${assignment.id}`}>
                                  Dispatch Date
                                </label>
                                <input
                                  type="date"
                                  id={`dispatch_date_${assignment.id}`}
                                  value={dispatchData[assignment.id]?.dispatch_date || ""}
                                  onChange={(e) => handleDispatchChange(assignment.id, "dispatch_date", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                                  aria-required="true"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600" htmlFor={`dispatch_qty_${assignment.id}`}>
                                  Dispatch Quantity
                                </label>
                                <input
                                  type="number"
                                  id={`dispatch_qty_${assignment.id}`}
                                  step="0.01"
                                  placeholder="Enter Quantity"
                                  value={dispatchData[assignment.id]?.dispatch_qty || ""}
                                  onChange={(e) => handleDispatchChange(assignment.id, "dispatch_qty", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                                  aria-required="true"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDispatchSubmit(assignment.id)}
                                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                  aria-label="Save dispatch details"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingDispatch(null)}
                                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                  aria-label="Cancel editing"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingDispatch(assignment.id)}
                              className="flex items-center gap-2 text-teal-600 hover:text-teal-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-md px-2 py-1"
                              aria-label="Add dispatch details"
                            >
                              <Pencil className="h-4 w-4" aria-hidden="true" />
                              Add Dispatch
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAssignedMaterial;