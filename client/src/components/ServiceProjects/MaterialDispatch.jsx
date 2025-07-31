import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PlusCircle, OctagonMinus, Loader2, CheckCircle } from "lucide-react";

const MaterialDispatch = () => {
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [rows, setRows] = useState([
    {
      assign_date: "",
      pd_id: "",
      site_id: "",
      item_id: "",
      uom_id: "",
      qty: "",
      dc_no: "",
    },
  ]);
  const [loading, setLoading] = useState({
    projects: false,
    materials: false,
    uoms: false,
    sites: false,
    submitting: false,
  });
  const [error, setError] = useState(null);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(prev => ({ ...prev, projects: true }));
      const response = await axios.get("http://localhost:5000/material/projects");
      setProjects(response.data.data || []);
    } catch (error) {
      console.log(error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, projects: false }));
    }
  };

  // Fetch sites based on selected project
  const fetchSites = async (pd_id) => {
    try {
      setLoading(prev => ({ ...prev, sites: true }));
      const response = await axios.get(`http://localhost:5000/material/sites/${pd_id}`);
      return response.data.data || [];
    } catch (error) {
      console.log(error);
      setError("Failed to load sites. Please try again.");
      return [];
    } finally {
      setLoading(prev => ({ ...prev, sites: false }));
    }
  };

  // Fetch materials
  const fetchMaterials = async () => {
    try {
      setLoading(prev => ({ ...prev, materials: true }));
      const response = await axios.get("http://localhost:5000/material/materials");
      setMaterials(response.data.data || []);
    } catch (error) {
      console.log(error);
      setError("Failed to load materials. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, materials: false }));
    }
  };

  // Fetch UOMs
  const fetchUoms = async () => {
    try {
      setLoading(prev => ({ ...prev, uoms: true }));
      const response = await axios.get("http://localhost:5000/material/uom");
      setUoms(response.data.data || []);
    } catch (error) {
      console.log(error);
      setError("Failed to load UOMs. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, uoms: false }));
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchMaterials();
    fetchUoms();
  }, []);

  // Handle input changes
  const handleInputChange = async (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [name]: value };

    if (name === "pd_id" && value) {
      const sites = await fetchSites(value);
      updatedRows[index].site_id = ""; // Reset site_id when project changes
      setSites(sites);
    } else if (name === "pd_id" && !value) {
      updatedRows[index].site_id = "";
      setSites([]);
    }

    setRows(updatedRows);
    setError(null);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        assign_date: "",
        pd_id: "",
        site_id: "",
        item_id: "",
        uom_id: "",
        qty: "",
        dc_no: "",
      },
    ]);
    setError(null);
  };

  const handleRemoveRow = (index) => {
    if (rows.length <= 1) {
      setError("At least one material entry is required.");
      return;
    }
    setRows(rows.filter((_, i) => i !== index));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      setError(null);

      // Validate all rows
      const validationErrors = [];
      
      rows.forEach((row, index) => {
        if (!row.assign_date) {
          validationErrors.push(`Row ${index + 1}: Assign Date is required`);
        }
        if (!row.pd_id) {
          validationErrors.push(`Row ${index + 1}: Project is required`);
        }
        if (!row.site_id) {
          validationErrors.push(`Row ${index + 1}: Site is required`);
        }
        if (!row.item_id) {
          validationErrors.push(`Row ${index + 1}: Material is required`);
        }
        if (!row.uom_id) {
          validationErrors.push(`Row ${index + 1}: UOM is required`);
        }
        if (row.qty === "" || row.qty === null) {
          validationErrors.push(`Row ${index + 1}: Quantity is required`);
        } else if (isNaN(row.qty)) {
          validationErrors.push(`Row ${index + 1}: Quantity must be a number`);
        } else if (parseFloat(row.qty) <= 0) {
          validationErrors.push(`Row ${index + 1}: Quantity must be greater than 0`);
        }
        if (!row.dc_no) {
          validationErrors.push(`Row ${index + 1}: DC Number is required`);
        } else if (isNaN(row.dc_no)) {
          validationErrors.push(`Row ${index + 1}: DC Number must be a number`);
        }
      });

      if (validationErrors.length > 0) {
        setError(validationErrors.join('<br />'));
        return;
      }

      // Ensure uom_id is sent as a number
      const formattedRows = rows.map(row => ({
        ...row,
        uom_id: parseInt(row.uom_id),
        qty: parseFloat(row.qty),
        dc_no: parseInt(row.dc_no),
      }));

      const response = await axios.post(
        "http://localhost:5000/material/dispatch-material",
        formattedRows
      );

      console.log(response);

      // Show success message
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Materials Assigned Successfully!",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'bg-white rounded-xl shadow-xl border border-green-100',
          title: 'text-green-800 font-semibold'
        }
      });

      // Reset form but keep one empty row
      setRows([
        {
          assign_date: "",
          pd_id: "",
          site_id: "",
          item_id: "",
          uom_id: "",
          qty: "",
          dc_no: "",
        },
      ]);
      setSites([]);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to assign materials. Please try again."
      );
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Material Dispatch Management
          </h2>
          <p className="text-gray-600">
            Assign materials to project sites with delivery details
          </p>
        </div>

        {loading.projects || loading.materials || loading.uoms ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
              <p className="text-gray-600">Loading resources...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Status Indicators */}
            <div className="px-6 pt-4">
              {error && (
                <div
                  className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm"
                  dangerouslySetInnerHTML={{ __html: error }}
                />
              )}
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assign Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Site
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      UOM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DC Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map((row, index) => (
                    <tr
                      key={index}
                      className={`transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="date"
                          name="assign_date"
                          value={row.assign_date}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          name="pd_id"
                          value={row.pd_id}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-[150px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="">Select Project</option>
                          {projects.map((project) => (
                            <option key={project.pd_id} value={project.pd_id}>
                              {project.project_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          name="site_id"
                          value={row.site_id}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-[150px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                          disabled={!row.pd_id || loading.sites}
                        >
                          <option value="">Select Site</option>
                          {sites.map((site) => (
                            <option key={site.site_id} value={site.site_id}>
                              {`${site.site_name} (PO: ${site.po_number})`}
                            </option>
                          ))}
                        </select>
                        {loading.sites && row.pd_id && (
                          <Loader2 className="h-4 w-4 text-indigo-600 animate-spin ml-2 inline" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          name="item_id"
                          value={row.item_id}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-[150px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="">Select Material</option>
                          {materials.map((material) => (
                            <option key={material.item_id} value={material.item_id}>
                              {material.item_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          name="uom_id"
                          value={row.uom_id}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-[100px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="">Select UOM</option>
                          {uoms.map((uom) => (
                            <option key={uom.uom_id} value={uom.uom_id}>
                              {uom.uom_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="qty"
                          value={row.qty}
                          onChange={(e) => handleInputChange(index, e)}
                          pattern="[0-9]*\.?[0-9]*"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="dc_no"
                          value={row.dc_no}
                          onChange={(e) => handleInputChange(index, e)}
                          pattern="[0-9]*"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          disabled={rows.length <= 1}
                          className={`p-2 rounded-full ${rows.length <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-50 hover:text-red-700'}`}
                          title={rows.length <= 1 ? "At least one row is required" : "Remove this entry"}
                        >
                          <OctagonMinus className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <button
                type="button"
                onClick={handleAddRow}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Material
              </button>
              <button
                type="submit"
                disabled={loading.submitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading.submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Dispatch Materials
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MaterialDispatch;