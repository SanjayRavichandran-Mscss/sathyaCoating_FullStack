// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const ViewMaterialDispatch = () => {
//   const [materialData, setMaterialData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchMaterialAssignments = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get("http://localhost:5000/material/material-assignments");
//         setMaterialData(response.data.data || []);
//       } catch (error) {
//         console.error("Error fetching material assignments:", error);
//         setError("Failed to load material assignments. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMaterialAssignments();
//   }, []);

//   // Group data by project_name and site_name
//   const groupedData = materialData.reduce((acc, item) => {
//     const projectKey = item.project_name;
//     const siteKey = item.site_name;

//     if (!acc[projectKey]) {
//       acc[projectKey] = {};
//     }
//     if (!acc[projectKey][siteKey]) {
//       acc[projectKey][siteKey] = [];
//     }
//     acc[projectKey][siteKey].push(item);
//     return acc;
//   }, {});

//   // Filter data based on search term
//   const filteredData = Object.keys(groupedData).reduce((acc, project) => {
//     const sites = groupedData[project];
//     const filteredSites = Object.keys(sites).reduce((siteAcc, site) => {
//       const filteredItems = sites[site].filter(
//         (item) =>
//           item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.dc_no.toString().includes(searchTerm) ||
//           item.assign_date.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       if (filteredItems.length > 0) {
//         siteAcc[site] = filteredItems;
//       }
//       return siteAcc;
//     }, {});
//     if (Object.keys(filteredSites).length > 0) {
//       acc[project] = filteredSites;
//     }
//     return acc;
//   }, {});

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-full min-h-[50vh]">
//         <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 sm:p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm sm:text-base animate-pulse">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Material Dispatch Details</h2>
//         <input
//           type="text"
//           placeholder="Search by item name, DC number, or date..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="p-2 border border-gray-300 rounded-lg w-full max-w-xs sm:max-w-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         />
//       </div>

//       {Object.keys(filteredData).length === 0 ? (
//         <div className="text-center text-gray-600">No material assignments found.</div>
//       ) : (
//         Object.keys(filteredData).map((project) => (
//           <div key={project} className="mb-8">
//             <h3 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-4">{project}</h3>
//             {Object.keys(filteredData[project]).map((site) => (
//               <div key={site} className="mb-6">
//                 <h4 className="text-base sm:text-lg font-medium text-gray-700 mb-3">{site}</h4>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
//                     <thead>
//                       <tr className="bg-indigo-50 text-left text-xs sm:text-sm text-gray-700">
//                         <th className="p-3 sm:p-4 border-b">Assign Date</th>
//                         <th className="p-3 sm:p-4 border-b">DC Number</th>
//                         <th className="p-3 sm:p-4 border-b">PO Number</th>
//                         <th className="p-3 sm:p-4 border-b">Item Name</th>
//                         <th className="p-3 sm:p-4 border-b">UOM</th>
//                         <th className="p-3 sm:p-4 border-b">Quantity</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredData[project][site].map((item, index) => (
//                         <tr
//                           key={index}
//                           className="text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="p-3 sm:p-4 border-b">
//                             {new Date(item.assign_date).toLocaleDateString()}
//                           </td>
//                           <td className="p-3 sm:p-4 border-b">{item.dc_no}</td>
//                           <td className="p-3 sm:p-4 border-b">{item.po_number}</td>
//                           <td className="p-3 sm:p-4 border-b">{item.item_name}</td>
//                           <td className="p-3 sm:p-4 border-b">{item.uom}</td>
//                           <td className="p-3 sm:p-4 border-b">{item.qty}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default ViewMaterialDispatch;














import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewMaterialDispatch = () => {
  const [materialData, setMaterialData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMaterialAssignments = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/material/material-assignments");
        setMaterialData(response.data.data || []);
      } catch (error) {
        console.error("Error fetching material assignments:", error);
        setError("Failed to load material assignments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialAssignments();
  }, []);

  // Group data by project_name and site_name
  const groupedData = materialData.reduce((acc, item) => {
    const projectKey = item.project_name;
    const siteKey = item.site_name;

    if (!acc[projectKey]) {
      acc[projectKey] = {};
    }
    if (!acc[projectKey][siteKey]) {
      acc[projectKey][siteKey] = { items: [], po_numbers: new Set() };
    }
    acc[projectKey][siteKey].items.push(item);
    acc[projectKey][siteKey].po_numbers.add(item.po_number);
    return acc;
  }, {});

  // Filter data based on search term
  const filteredData = Object.keys(groupedData).reduce((acc, project) => {
    const sites = groupedData[project];
    const filteredSites = Object.keys(sites).reduce((siteAcc, site) => {
      const filteredItems = sites[site].items.filter(
        (item) =>
          item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.dc_no.toString().includes(searchTerm) ||
          item.assign_date.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredItems.length > 0) {
        siteAcc[site] = {
          items: filteredItems,
          po_numbers: sites[site].po_numbers,
        };
      }
      return siteAcc;
    }, {});
    if (Object.keys(filteredSites).length > 0) {
      acc[project] = filteredSites;
    }
    return acc;
  }, {});

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Material Dispatch Details</h2>
        <input
          type="text"
          placeholder="Search by item name, DC number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full max-w-xs sm:max-w-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {Object.keys(filteredData).length === 0 ? (
        <div className="text-center text-gray-600">No material assignments found.</div>
      ) : (
        Object.keys(filteredData).map((project) => (
          <div key={project} className="mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-4">{project}</h3>
            {Object.keys(filteredData[project]).map((site) => (
              <div key={site} className="mb-6">
                <div className="flex items-center flex-wrap gap-2 mb-3">
                  <h4 className="text-base sm:text-lg font-medium text-gray-700">{site}</h4>
                  <span className="text-sm text-gray-500">
                    PO Number: {Array.from(filteredData[project][site].po_numbers).join(", ")}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-indigo-50 text-left text-xs sm:text-sm text-gray-700">
                        <th className="p-3 sm:p-4 border-b">Assign Date</th>
                        <th className="p-3 sm:p-4 border-b">DC Number</th>
                        <th className="p-3 sm:p-4 border-b">Material Name</th>
                        <th className="p-3 sm:p-4 border-b">UOM</th>
                        <th className="p-3 sm:p-4 border-b">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData[project][site].items.map((item, index) => (
                        <tr
                          key={index}
                          className="text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-3 sm:p-4 border-b">
                            {new Date(item.assign_date).toLocaleDateString()}
                          </td>
                          <td className="p-3 sm:p-4 border-b">{item.dc_no}</td>
                          <td className="p-3 sm:p-4 border-b">{item.item_name}</td>
                          <td className="p-3 sm:p-4 border-b">{item.uom}</td>
                          <td className="p-3 sm:p-4 border-b">{item.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ViewMaterialDispatch;