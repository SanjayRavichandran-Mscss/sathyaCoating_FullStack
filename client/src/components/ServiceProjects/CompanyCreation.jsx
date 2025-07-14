import { useState } from "react";
import axios from "axios";
import { X, Building2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const CompanyCreation = ({ onCompanyCreated, onClose }) => {
  const [formData, setFormData] = useState({
    company_name: "",
    address: "",
    spoc_name: "",
    spoc_contact_no: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post("http://localhost:5000/project/create-company", formData);
      setFormData({ company_name: "", address: "", spoc_name: "", spoc_contact_no: "" });
      onCompanyCreated();
    } catch (error) {
      console.error("Error creating company:", error);
      const errorMsg = error.response?.data?.error || "Failed to create company. Please try again.";
      setError(errorMsg);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all duration-500">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <Building2 className="text-indigo-600" size={28} />
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Company</h3>
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
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
          <input
            type="text"
            name="company_name"
            placeholder="Enter company name"
            value={formData.company_name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            placeholder="Enter address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">SPOC Name</label>
          <input
            type="text"
            name="spoc_name"
            placeholder="Enter SPOC name"
            value={formData.spoc_name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">SPOC Contact Number</label>
          <input
            type="text"
            name="spoc_contact_no"
            placeholder="Enter SPOC contact number"
            value={formData.spoc_contact_no}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
            aria-required="true"
          />
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
            aria-label="Create Company"
          >
            {loading && <Loader2 className="animate-spin w-5 h-5" />}
            <span>{loading ? "Creating..." : "Create Company"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyCreation;