import React, { useState, useEffect } from "react";
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
  Square,
  TrendingUp,
  MapPin,
  HardHat,
  Receipt,
  CalendarCheck,
  Hexagon,
  BrickWall,
  ReceiptText,
  Grid2x2Check,
} from "lucide-react";

const DisplayReckoner = () => {
  const [reckonerData, setReckonerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [poGroups, setPoGroups] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // Site info state
  const [siteInfo, setSiteInfo] = useState(null);
  const [loadingSite, setLoadingSite] = useState(false);

  // Navigation hook
  const navigate = useNavigate();

  useEffect(() => {
    fetchReckonerData();
  }, []);

  useEffect(() => {
    if (filteredData.length > 0) {
      groupDataByPoNumber();
    }
  }, [filteredData]);

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
    setTotalPages(poGroupsArray.length);
    setCurrentPage(1); // Reset to first page when data changes

    // Fetch site info for the first PO group when data is initially loaded
    if (poGroupsArray.length > 0 && poGroupsArray[0][0]) {
      fetchSiteInfo(poGroupsArray[0][0].po_number);
    }
  };

  const fetchSiteInfo = async (poNumber) => {
    try {
      setLoadingSite(true);
      const res = await axios.get(
        `http://localhost:5000/reckoner/sites/${poNumber}`
      );
      if (res.data.success) {
        setSiteInfo(res.data.data); // Assuming data includes site_id and site_name
      } else {
        setSiteInfo(null);
      }
    } catch (error) {
      console.error("Error fetching site info:", error);
      setSiteInfo(null);
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
      setFilteredData(data);
    } catch (error) {
      console.log(error);
      showAlert("error", "Failed to fetch reckoner data");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Fetch site info for the previous PO group
      if (poGroups[currentPage - 2] && poGroups[currentPage - 2][0]) {
        fetchSiteInfo(poGroups[currentPage - 2][0].po_number);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Fetch site info for the next PO group
      if (poGroups[currentPage] && poGroups[currentPage][0]) {
        fetchSiteInfo(poGroups[currentPage][0].po_number);
      }
    }
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
      console.log(error);
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
        className={`flex items-center px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${color}`}
      >
        {icon}
        {status}
      </div>
    );
  };

  const handleReportRedirect = (reportTypeId) => {
    if (siteInfo?.site_id && currentPoGroup[0]?.po_number) {
      navigate(`/worksheets/${siteInfo.site_id}/${reportTypeId}`);
    } else {
      showAlert("error", "Site information not available");
    }
  };

  const currentPoGroup = poGroups[currentPage - 1] || [];

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg border border-gray-200">
      {alert.message && (
        <div
          className={`mb-4 p-3 rounded-lg shadow-sm ${
            alert.type === "error"
              ? "bg-red-50 text-red-800 border-l-4 border-red-500"
              : alert.type === "success"
              ? "bg-green-50 text-green-800 border-l-4 border-green-500"
              : "bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500"
          }`}
        >
          <div className="flex items-center">
            {alert.type === "error" ? (
              <AlertCircle className="w-5 h-5 mr-2" />
            ) : alert.type === "success" ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {alert.message}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        {/* Site information display */}
        {siteInfo && !loadingSite && (
          <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow border border-gray-200 w-full sm:w-auto">
            <MapPin className="w-5 h-5 text-indigo-600 mr-2" />
            <div className="flex-1">
              <div className="font-medium text-gray-800 text-sm sm:text-base">
                {siteInfo.site_name}
              </div>
              <div className="text-xs text-gray-500">
                PO: {currentPoGroup[0]?.po_number || 'N/A'}
              </div>
            </div>
          </div>
        )}

        {loadingSite && (
          <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow border border-gray-200 w-full sm:w-auto">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span className="text-sm text-gray-600">Loading site...</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Prev
          </button>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Report buttons container */}
      {(siteInfo || loadingSite) && (
        <div className="flex flex-col sm:flex-row justify-center gap-2 mb-4">
          <button
            onClick={() => handleReportRedirect(1)}
            disabled={loadingSite || !siteInfo?.site_id}
            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
              loadingSite || !siteInfo?.site_id
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            VIEW SITE PROGRESS REPORT
          </button>
          <button
            onClick={() => handleReportRedirect(2)}
            disabled={loadingSite || !siteInfo?.site_id}
            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
              loadingSite || !siteInfo?.site_id
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            VIEW MATERIAL DISPATCH REPORT 
          </button>
          <button
            onClick={() => handleReportRedirect(3)}
            disabled={loadingSite || !siteInfo?.site_id}
            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
              loadingSite || !siteInfo?.site_id
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            VIEW Material Usage Report
          </button>
        </div>
      )}

      {/* Pagination info */}
      {totalPages > 0 && (
        <div className="mb-4 text-center">
          <div className="inline-block bg-indigo-100 text-indigo-800 text-xs sm:text-sm px-3 py-1 rounded-full font-medium">
            Showing {currentPage} of {totalPages} PO groups
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-600 to-indigo-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    PO Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    PO Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Completion
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Billing
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPoGroup.map((r) => (
                  <tr key={r.rec_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {r.po_number}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {r.item_id}
                      </div>
                      <div className="text-xs text-gray-500">
                        {r.category_name} / {r.subcategory_name}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="flex items-center text-sm text-gray-900">
                        <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-indigo-600" />
                        <span className="truncate">{r.work_descriptions}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <BrickWall className="flex-shrink-0 mr-1.5 h-4 w-4 text-indigo-600" />
                        Qty: {r.po_quantity} {r.uom}
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <IndianRupee className="flex-shrink-0 mr-1.5 h-4 w-4 text-indigo-600" />
                        Rate: {r.rate}
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <TrendingUp className="flex-shrink-0 mr-1.5 h-4 w-4 text-indigo-600" />
                        Value: {r.value}
                      </div>
                    </td>
                    <td className="px-4 py-3 space-y-1">
                      {editingId === r.rec_id ? (
                        <>
                          <input
                            type="text"
                            value={editingData.area_completed}
                            onChange={(e) =>
                              handleEditChange("area_completed", e.target.value)
                            }
                            className="w-full p-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Area Completed"
                          />
                          <input
                            type="text"
                            value={editingData.rate}
                            onChange={(e) =>
                              handleEditChange("rate", e.target.value)
                            }
                            className="w-full p-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Rate"
                          />
                          <input
                            type="text"
                            value={editingData.value}
                            onChange={(e) =>
                              handleEditChange("value", e.target.value)
                            }
                            className="w-full p-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Value"
                          />
                        </>
                      ) : (
                        <>
                          <div className="flex items-center text-sm text-gray-900">
                            <Hexagon className="flex-shrink-0 mr-1.5 h-4 w-4 text-indigo-600" />
                            Area: {r.area_completed}
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <Percent className="flex-shrink-0 mr-1.5 h-4 w-4 text-indigo-600" />
                            Rate: {r.completion_rate}
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <IndianRupee className="flex-shrink-0 mr-1.5 h-4 w-4 text-indigo-600" />
                            Value: {r.completion_value}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 space-y-1">
                      {editingId === r.rec_id ? (
                        <>
                          <input
                            type="text"
                            value={editingData.billed_area}
                            onChange={(e) =>
                              handleEditChange("billed_area", e.target.value)
                            }
                            className="w-full p-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Billed Area"
                          />
                          <input
                            type="text"
                            value={editingData.billed_value}
                            onChange={(e) =>
                              handleEditChange("billed_value", e.target.value)
                            }
                            className="w-full p-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Billed Value"
                          />
                          <input
                            type="text"
                            value={editingData.balance_area}
                            onChange={(e) =>
                              handleEditChange("balance_area", e.target.value)
                            }
                            className="w-full p-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Balance Area"
                          />
                          <input
                            type="text"
                            value={editingData.balance_value}
                            onChange={(e) =>
                              handleEditChange("balance_value", e.target.value)
                            }
                            className="w-full p-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Balance Value"
                          />
                        </>
                      ) : (
                        <>
                          <div className="flex items-center text-sm text-gray-900">
                            <ReceiptText className="flex-shrink-0 mr-1.5 h-4 w-4 text-indigo-600" />
                            Billed: {r.billed_area}
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <IndianRupee className="flex-shrink-0 mr-1.5 h-4 w-4 text-indigo-600" />
                            Value: {r.billed_value}
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <Grid2x2Check className="flex-shrink-0 mr-1.5 h-4 w-4 text-indigo-600" />
                            Balance: {r.balance_area}
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <IndianRupee className="flex-shrink-0 mr-1.5 h-4 w-4 text-indigo-600" />
                            Value: {r.balance_value}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 space-y-2">
                      {editingId === r.rec_id ? (
                        <>
                          <select
                            className="w-full p-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                            className="w-full p-1 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      {editingId === r.rec_id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSubmit(r.rec_id)}
                            disabled={submitting}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <Save className="-ml-0.5 mr-1 h-3 w-3" /> Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <X className="-ml-0.5 mr-1 h-3 w-3" /> Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(r)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Edit className="-ml-0.5 mr-1 h-3 w-3" /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default DisplayReckoner;