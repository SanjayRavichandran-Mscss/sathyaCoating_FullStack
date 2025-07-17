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
} from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingSites, setLoadingSites] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSites();
    fetchReckonerData();
  }, []);

  useEffect(() => {
    if (filteredData.length > 0 && siteOptions.length > 0) {
      groupDataByPoNumber();
    }
  }, [filteredData, siteOptions]);

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
        if (options.length > 0) {
          setSelectedSite(options[0].po_number);
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
      console.error(error);
      showAlert("error", "Failed to fetch reckoner data");
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSelect = (poNumber) => {
    setSelectedSite(poNumber);
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
        <CalendarCheck className="w-4 h-4 text-green-600 mr-2" />
      ) : status === "In Progress" ? (
        <HardHat className="w-4 h-4 text-blue-600 mr-2" />
      ) : (
        <AlertCircle className="w-4 h-4 text-orange-500 mr-2" />
      );

    const color =
      status === "Completed"
        ? "bg-green-100 text-green-800"
        : status === "In Progress"
        ? "bg-blue-100 text-blue-800"
        : "bg-orange-100 text-orange-800";

    return (
      <div
        className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}
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

  const currentPoGroup = poGroups.find(
    (group) => group[0]?.po_number === selectedSite
  ) || [];

  const filteredSiteOptions = siteOptions.filter(
    (option) =>
      option.site_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.po_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {alert.message && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            alert.type === "error"
              ? "bg-red-100 text-red-800 border-l-4 border-red-500"
              : "bg-green-100 text-green-800 border-l-4 border-green-500"
          }`}
        >
          <div className="flex items-center">
            {alert.type === "error" ? (
              <AlertCircle className="w-5 h-5 mr-2" />
            ) : (
              <CheckCircle className="w-5 h-5 mr-2" />
            )}
            <span className="text-sm">{alert.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Project Reckoner
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and track project progress with ease
          </p>
        </div>

        {/* Improved Site Selection Dropdown */}
        <div className="mb-8" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Site
          </label>
          <div className="relative max-w-md">
            {dropdownOpen ? (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center px-3 py-2 border-b border-gray-200">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search sites..."
                    className="flex-1 py-2 px-3 text-sm focus:outline-none"
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
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-left hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <div>
                  {selectedSite ? (
                    <>
                      <div className="font-medium text-gray-900">
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
                    <span className="text-gray-500">Select a site...</span>
                  )}
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Report Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Site Progress",
              icon: FileText,
              color: "from-teal-500 to-teal-600",
              reportId: 1,
            },
            {
              label: "Material Dispatch",
              icon: Receipt,
              color: "from-purple-500 to-purple-600",
              reportId: 2,
            },
            {
              label: "Material Usage",
              icon: BrickWall,
              color: "from-orange-500 to-orange-600",
              reportId: 3,
            },
          ].map((button) => (
            <button
              key={button.label}
              onClick={() => handleReportRedirect(button.reportId)}
              disabled={loadingSite || !siteInfo?.site_id}
              className={`flex items-center justify-center px-4 py-3 rounded-lg shadow-md text-white bg-gradient-to-r ${button.color} hover:opacity-90 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200`}
            >
              <button.icon className="mr-2 h-5 w-5" />
              <span className="text-sm font-medium">{button.label}</span>
            </button>
          ))}
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-600 to-indigo-800">
                <tr>
                  {[
                    // "PO Number",
                    "Item",
                    "Description",
                    "PO Details",
                    "Completion",
                    "Billing",
                    "Status",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPoGroup.map((r) => (
                  <tr key={r.rec_id} className="hover:bg-gray-50 transition-colors">
                    {/* <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {r.po_number}
                    </td> */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{r.item_id}</div>
                      <div className="text-xs text-gray-500">
                        {r.category_name} / {r.subcategory_name}
                      </div>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <div className="flex items-center text-sm text-gray-900">
                        <FileText className="flex-shrink-0 mr-2 h-4 w-4 text-indigo-600" />
                        <span className="truncate">{r.work_descriptions}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-900">
                        <BrickWall className="flex-shrink-0 mr-2 h-4 w-4 text-indigo-600" />
                        Qty: {r.po_quantity} {r.uom}
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <IndianRupee className="flex-shrink-0 mr-2 h-4 w-4 text-indigo-600" />
                        Rate: {r.rate}
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <TrendingUp className="flex-shrink-0 mr-2 h-4 w-4 text-indigo-600" />
                        Value: {r.value}
                      </div>
                    </td>
                    <td className="px-4 py-4 space-y-2">
                      {editingId === r.rec_id ? (
                        <>
                          {[
                            { field: "area_completed", placeholder: "Area Completed" },
                            { field: "rate", placeholder: "Rate" },
                            { field: "value", placeholder: "Value" },
                          ].map(({ field, placeholder }) => (
                            <input
                              key={field}
                              type="text"
                              value={editingData[field]}
                              onChange={(e) => handleEditChange(field, e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder={placeholder}
                            />
                          ))}
                        </>
                      ) : (
                        <>
                          <div className="flex items-center text-sm text-gray-900">
                            <Hexagon className="flex-shrink-0 mr-2 h-4 w-4 text-indigo-600" />
                            Area: {r.area_completed}
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <Percent className="flex-shrink-0 mr-2 h-4 w-4 text-indigo-600" />
                            Rate: {r.completion_rate}
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <IndianRupee className="flex-shrink-0 mr-2 h-4 w-4 text-indigo-600" />
                            Value: {r.completion_value}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-4 space-y-2">
                      {editingId === r.rec_id ? (
                        <>
                          {[
                            { field: "billed_area", placeholder: "Billed Area" },
                            { field: "billed_value", placeholder: "Billed Value" },
                            { field: "balance_area", placeholder: "Balance Area" },
                            { field: "balance_value", placeholder: "Balance Value" },
                          ].map(({ field, placeholder }) => (
                            <input
                              key={field}
                              type="text"
                              value={editingData[field]}
                              onChange={(e) => handleEditChange(field, e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder={placeholder}
                            />
                          ))}
                        </>
                      ) : (
                        <>
                          <div className="flex items-center text-sm text-gray-900">
                            <ReceiptText className="flex-shrink-0 mr-2 h-4 w-4 text-indigo-600" />
                            Billed: {r.billed_area}
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <IndianRupee className="flex-shrink-0 mr-2 h-4 w-4 text-indigo-600" />
                            Value: {r.billed_value}
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <Grid2x2Check className="flex-shrink-0 mr-2 h-4 w-4 text-indigo-600" />
                            Balance: {r.balance_area}
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <IndianRupee className="flex-shrink-0 mr-2 h-4 w-4 text-indigo-600" />
                            Value: {r.balance_value}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-4 space-y-2">
                      {editingId === r.rec_id ? (
                        <>
                          <select
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={editingData.work_status}
                            onChange={(e) => handleEditChange("work_status", e.target.value)}
                          >
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                          </select>
                          <select
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={editingData.billing_status}
                            onChange={(e) => handleEditChange("billing_status", e.target.value)}
                          >
                            <option value="Billed">Billed</option>
                            <option value="Not Billed">Not Billed</option>
                            <option value="Partially Billed">Partially Billed</option>
                          </select>
                        </>
                      ) : (
                        <>
                          {renderStatusTag(r.work_status)}
                          {renderStatusTag(r.billing_status)}
                        </>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingId === r.rec_id ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleSubmit(r.rec_id)}
                            disabled={submitting}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                          >
                            <Save className="mr-2 h-4 w-4" /> Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <X className="mr-2 h-4 w-4" /> Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(r)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayReckoner;