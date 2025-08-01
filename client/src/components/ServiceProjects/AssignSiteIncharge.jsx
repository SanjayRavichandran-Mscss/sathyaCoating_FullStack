import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PlusCircle, OctagonMinus, Loader2, CheckCircle } from "lucide-react";
import AddEmployee from "./AddEmployee";

const AssignSiteIncharge = () => {
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employeesByDesignation, setEmployeesByDesignation] = useState({});
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [rows, setRows] = useState([
    {
      from_date: "",
      to_date: "",
      designation_id: "",
      emp_id: "",
    },
  ]);
  const [loading, setLoading] = useState({
    projects: false,
    sites: false,
    designations: false,
    employees: false,
    submitting: false,
    addingEmployee: false,
  });
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  // Fetch designations
  const fetchDesignations = async () => {
    try {
      setLoading((prev) => ({ ...prev, designations: true }));
      const response = await axios.get("http://localhost:5000/material/designations");
      setDesignations(response.data.data || []);
    } catch (error) {
      console.error("Error fetching designations:", error);
      setError("Failed to load designations. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, designations: false }));
    }
  };

  // Fetch employees for a specific designation_id
  const fetchEmployees = async (designation_id) => {
    if (!designation_id || employeesByDesignation[designation_id]) {
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, employees: true }));
      const response = await axios.get("http://localhost:5000/material/employees", {
        params: { designation_id },
      });
      setEmployeesByDesignation((prev) => ({
        ...prev,
        [designation_id]: response.data.data || [],
      }));
      if (response.data.data.length === 0) {
        setError(`No employees found for the selected designation. Please add an employee or select another designation.`);
      }
    } catch (error) {
      console.error(`Error fetching employees for designation_id ${designation_id}:`, error);
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, employees: false }));
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchDesignations();
  }, []);

  // Handle project selection
  const handleProjectChange = async (e) => {
    const pd_id = e.target.value;
    setSelectedProject(pd_id);
    setSelectedSite("");
    setRows([{ from_date: "", to_date: "", designation_id: "", emp_id: "" }]);
    setError(null);
    if (pd_id) {
      await fetchSites(pd_id);
    } else {
      setSites([]);
    }
  };

  // Handle site selection
  const handleSiteChange = (e) => {
    setSelectedSite(e.target.value);
    setRows([{ from_date: "", to_date: "", designation_id: "", emp_id: "" }]);
    setError(null);
  };

  // Handle input changes for table rows
  const handleInputChange = async (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [name]: value };

    if (name === "designation_id" && value !== rows[index].designation_id) {
      updatedRows[index].emp_id = "";
      if (value) {
        await fetchEmployees(value);
      }
    }

    setRows(updatedRows);
    setError(null);
  };

  // Add new row for current project/site
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        from_date: "",
        to_date: "",
        designation_id: "",
        emp_id: "",
      },
    ]);
    setError(null);
  };

  // Remove row
  const handleRemoveRow = (index) => {
    if (rows.length <= 1) {
      setError("At least one incharge assignment is required.");
      return;
    }
    setRows(rows.filter((_, i) => i !== index));
    setError(null);
  };

  // Submit assignments
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, submitting: true }));
      setError(null);

      if (!selectedProject) {
        setError("Please select a project.");
        return;
      }
      if (!selectedSite) {
        setError("Please select a site.");
        return;
      }

      const validationErrors = [];
      rows.forEach((row, index) => {
        if (!row.from_date) validationErrors.push(`Row ${index + 1}: From Date is required`);
        if (!row.to_date) validationErrors.push(`Row ${index + 1}: To Date is required`);
        if (row.from_date && row.to_date && new Date(row.to_date) < new Date(row.from_date)) {
          validationErrors.push(`Row ${index + 1}: To Date must be after From Date`);
        }
        if (!row.designation_id) validationErrors.push(`Row ${index + 1}: Designation is required`);
        if (!row.emp_id) validationErrors.push(`Row ${index + 1}: Incharge Name is required`);
      });

      if (validationErrors.length > 0) {
        setError(validationErrors.join("<br />"));
        return;
      }

      const payload = rows.map((row) => ({
        from_date: row.from_date,
        to_date: row.to_date,
        pd_id: selectedProject,
        site_id: selectedSite,
        emp_id: row.emp_id,
      }));

      await axios.post("http://localhost:5000/material/assign-incharge", payload);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Incharges Assigned Successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });

      setRows([{ from_date: "", to_date: "", designation_id: "", emp_id: "" }]);
      setSelectedProject("");
      setSelectedSite("");
      setSites([]);
    } catch (error) {
      console.error("Error submitting assignments:", error);
      setError(error.response?.data?.message || "Failed to assign incharges. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Handle saving new employee
  const handleSaveEmployee = (newEmployeeData, designation) => {
    const { emp_id, full_name, designation_id } = newEmployeeData;
    setEmployeesByDesignation((prev) => ({
      ...prev,
      [designation_id]: [...(prev[designation_id] || []), { emp_id, full_name }],
    }));

    setDesignations((prev) => {
      if (!prev.some((d) => d.id === designation_id)) {
        return [...prev, { id: designation_id, designation }];
      }
      return prev;
    });

    setShowEditModal(false);
    setLoading((prev) => ({ ...prev, addingEmployee: false }));
  };

  // Filter employees based on selected designation_id
  const getFilteredEmployees = (designation_id) => {
    return employeesByDesignation[designation_id] || [];
  };

  // Check if form fields should be enabled
  const isFormEnabled = selectedProject && selectedSite;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <p className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Assign Site Incharge
          </p>
         
        </div>

        {loading.projects || loading.designations ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              <p className="text-gray-600">Loading resources...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 pt-6">
              {error && (
                <div
                  className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm"
                  dangerouslySetInnerHTML={{ __html: error }}
                />
              )}
            </div>

            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Select Project</label>
                <div className="relative">
                  <select
                    value={selectedProject}
                    onChange={handleProjectChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all"
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map((project) => (
                      <option key={project.pd_id} value={project.pd_id}>
                        {project.project_name || "N/A"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Select Site</label>
                <div className="relative">
                  <select
                    value={selectedSite}
                    onChange={handleSiteChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all disabled:bg-gray-50"
                    required
                    disabled={!selectedProject || loading.sites}
                  >
                    <option value="">Select Site</option>
                    {sites.map((siteInfo) => (
                      <option key={siteInfo.site_id} value={siteInfo.site_id}>
                        {`${siteInfo.site_name || "N/A"} (PO: ${siteInfo.po_number || "N/A"})`}
                      </option>
                    ))}
                  </select>
                  {loading.sites && selectedProject && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 animate-spin" />
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Incharge
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="date"
                          name="from_date"
                          value={row.from_date}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
                          required
                          disabled={!isFormEnabled}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="date"
                          name="to_date"
                          value={row.to_date}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
                          required
                          disabled={!isFormEnabled}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <select
                          name="designation_id"
                          value={row.designation_id}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
                          required
                          disabled={!isFormEnabled}
                        >
                          <option value="">Select</option>
                          {designations.map((des) => (
                            <option key={des.id} value={des.id}>
                              {des.designation || "N/A"}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <select
                            name="emp_id"
                            value={row.emp_id}
                            onChange={(e) => handleInputChange(index, e)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
                            required
                            disabled={!isFormEnabled || !row.designation_id || loading.employees}
                          >
                            <option value="">Select</option>
                            {getFilteredEmployees(row.designation_id).length === 0 && row.designation_id ? (
                              <option value="" disabled>
                                No employees found
                              </option>
                            ) : (
                              getFilteredEmployees(row.designation_id).map((employee) => (
                                <option key={employee.emp_id} value={employee.emp_id}>
                                  {employee.full_name || "N/A"}
                                </option>
                              ))
                            )}
                          </select>
                          {loading.employees && row.designation_id && (
                            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                          )}
                          <button
                            type="button"
                            onClick={() => setShowEditModal(true)}
                            className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            title="Add new employee"
                          >
                            <PlusCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          disabled={rows.length <= 1 || !isFormEnabled}
                          className={`p-1.5 rounded-md transition ${
                            rows.length <= 1 || !isFormEnabled
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                          title={rows.length <= 1 ? "At least one row is required" : "Remove this entry"}
                        >
                          <OctagonMinus className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={handleAddRow}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors"
                disabled={!isFormEnabled}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Entry
              </button>
              <button
                type="submit"
                disabled={loading.submitting || !isFormEnabled}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 transition-colors"
              >
                {loading.submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Assign Incharges
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Add Employee Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full transform transition-all duration-300">
              <AddEmployee
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleSaveEmployee}
                isAddingEmployee={loading.addingEmployee}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignSiteIncharge;



















