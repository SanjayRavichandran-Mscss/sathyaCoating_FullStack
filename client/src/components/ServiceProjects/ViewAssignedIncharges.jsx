import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Filter } from "lucide-react";

const ViewAssignedIncharges = () => {
  const [incharges, setIncharges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    projectName: "",
    siteName: "",
    inchargeName: "",
  });

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Fetch assigned incharges
  const fetchAssignedIncharges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/material/assigned-incharges");
      console.log("Fetched incharges:", response.data.data); // Debug log
      setIncharges(response.data.data || []);
    } catch (error) {
      console.error("Error fetching incharges:", error);
      setError(error.response?.data?.message || "Failed to fetch assigned incharge details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedIncharges();
  }, []);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Filter incharges based on filter inputs with null checks
  const filteredIncharges = incharges.filter((incharge) => {
    const projectName = incharge.project_name || "";
    const siteName = incharge.site_name || "";
    const fullName = incharge.full_name || "";
    return (
      projectName.toLowerCase().includes(filters.projectName.toLowerCase()) &&
      siteName.toLowerCase().includes(filters.siteName.toLowerCase()) &&
      fullName.toLowerCase().includes(filters.inchargeName.toLowerCase())
    );
  });

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Assigned Incharge Details
            </h2>
            <p className="text-gray-600">View details of assigned site incharges</p>
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
            title="Toggle Filters"
          >
            <Filter className="h-6 w-6" />
          </button>
        </div>

        {/* Filter Section */}
        {filterOpen && (
          <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Incharges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={filters.projectName}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={filters.siteName}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter site name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incharge Name
                </label>
                <input
                  type="text"
                  name="inchargeName"
                  value={filters.inchargeName}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter incharge name"
                />
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
              <p className="text-gray-600">Loading incharge details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        ) : filteredIncharges.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No assigned incharges found.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Site Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Incharge Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Working Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIncharges.map((incharge, index) => (
                    <tr
                      key={incharge.id}
                      className={`transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-50`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {incharge.project_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <p className="font-semibold text-indigo-700">{incharge.site_name || "N/A"}</p>
                          <p className="text-xs text-indigo-600">PO: {incharge.po_number || "N/A"}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="font-semibold text-gray-800">{incharge.full_name || "N/A"}</p>
                          <p className="text-xs text-gray-600">Designation: {incharge.designation || "N/A"}</p>
                          <p className="text-xs text-gray-600">Mobile: {incharge.mobile || "N/A"}</p>
                          <p className="text-xs text-gray-600">Status: {incharge.status || "N/A"}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-xs text-green-700">
                            From: {formatDate(incharge.from_date)}
                          </p>
                          <p className="text-xs text-green-700">
                            To: {formatDate(incharge.to_date)}
                          </p>
                        </div>
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

export default ViewAssignedIncharges;