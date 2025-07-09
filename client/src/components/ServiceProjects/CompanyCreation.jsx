// import { useState } from "react";
// import axios from "axios";
// import { Loader2 } from "lucide-react";
// import Swal from "sweetalert2";

// const CompanyCreation = ({ onSubmit }) => {
//   const [formData, setFormData] = useState({
//     company_name: "",
//     address: "",
//     spoc_name: "",
//     spoc_contact_no: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/project/create-company",
//         formData
//       );
//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: `Company ${formData.company_name} created successfully! Company ID: ${response.data.company_id}`,
//         confirmButtonColor: "#2563eb",
//       });
//       setFormData({
//         company_name: "",
//         address: "",
//         spoc_name: "",
//         spoc_contact_no: "",
//       });
//       if (onSubmit) {
//         onSubmit(); // Notify parent component to refresh company list
//       }
//     } catch (error) {
//       console.error("Error creating company:", error);
//       setError(error.response?.data?.error || "Failed to create company. Please try again.");
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.response?.data?.error || "Failed to create company. Please try again.",
//         confirmButtonColor: "#2563eb",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 transform transition-all duration-300 animate-fade-in">
//       <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
//         Create New Company
//       </h3>
//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm animate-fade-in">
//           {error}
//         </div>
//       )}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Company Name
//           </label>
//           <input
//             type="text"
//             name="company_name"
//             placeholder="Enter company name"
//             value={formData.company_name}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
//             aria-required="true"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Address
//           </label>
//           <input
//             type="text"
//             name="address"
//             placeholder="Enter address"
//             value={formData.address}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
//             aria-required="true"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             SPOC Name
//           </label>
//           <input
//             type="text"
//             name="spoc_name"
//             placeholder="Enter SPOC name"
//             value={formData.spoc_name}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
//             aria-required="true"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             SPOC Contact No
//           </label>
//           <input
//             type="tel"
//             name="spoc_contact_no"
//             placeholder="Enter SPOC contact number"
//             value={formData.spoc_contact_no}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
//             aria-required="true"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={loading}
//           aria-label="Create Company"
//         >
//           {loading && <Loader2 className="animate-spin w-5 h-5" />}
//           <span>{loading ? "Creating..." : "Create Company"}</span>
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CompanyCreation;





import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const CompanyCreation = ({ onCompanyCreated }) => {
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
      const response = await axios.post(
        "http://localhost:5000/project/create-company",
        formData
      );
      setFormData({
        company_name: "",
        address: "",
        spoc_name: "",
        spoc_contact_no: "",
      });
      if (onCompanyCreated) {
        onCompanyCreated(response.data.company_id); // Pass company_id to parent
      }
    } catch (error) {
      console.error("Error creating company:", error);
      setError(error.response?.data?.error || "Failed to create company. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to create company. Please try again.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 transform transition-all duration-300 animate-fade-in">
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Create New Company
      </h3>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm animate-fade-in">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            name="company_name"
            placeholder="Enter company name"
            value={formData.company_name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="Enter address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SPOC Name
          </label>
          <input
            type="text"
            name="spoc_name"
            placeholder="Enter SPOC name"
            value={formData.spoc_name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SPOC Contact No
          </label>
          <input
            type="tel"
            name="spoc_contact_no"
            placeholder="Enter SPOC contact number"
            value={formData.spoc_contact_no}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm hover:shadow-md"
            aria-required="true"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
          aria-label="Create Company"
        >
          {loading && <Loader2 className="animate-spin w-5 h-5" />}
          <span>{loading ? "Creating..." : "Create Company"}</span>
        </button>
      </form>
    </div>
  );
};

export default CompanyCreation;