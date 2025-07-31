// below code is card view of expense details

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { X, PlusCircle, Eye, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
// import { format } from "date-fns";

// const ExpenseEntry = () => {
//   const [projects, setProjects] = useState([]);
//   const [sites, setSites] = useState([]); 
//   const [pettyCashRecords, setPettyCashRecords] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [details, setDetails] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [formData, setFormData] = useState({
//     pd_id: "",
//     site_id: "",
//   });
//   const [expenseForm, setExpenseForm] = useState({
//     petty_cash_id: null,
//     project_name: "",
//     site_name: "",
//     assign_date: "",
//     expense_category_id: "",
//     expense_detail_id: "",
//     amount: "",
//     total_amount: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
//   const [isViewExpensesModalOpen, setIsViewExpensesModalOpen] = useState(false);
//   const [showAmountWarning, setShowAmountWarning] = useState(false);
//   const [remainingAmount, setRemainingAmount] = useState(0);

//   // Fetch projects on component mount
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get("http://localhost:5000/material/projects");
//         setProjects(Array.isArray(response.data.data) ? response.data.data : []);
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//         setError("Failed to load projects. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, []);

//   // Fetch sites when pd_id changes
//   useEffect(() => {
//     if (formData.pd_id) {
//       const fetchSites = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.get(`http://localhost:5000/material/sites/${formData.pd_id}`);
//           setSites(Array.isArray(response.data.data) ? response.data.data : []);
//         } catch (error) {
//           console.error("Error fetching sites:", error);
//           setError("Failed to load sites. Please try again.");
//           setSites([]);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchSites();
//     } else {
//       setSites([]);
//       setPettyCashRecords([]);
//     }
//   }, [formData.pd_id]);

//   // Fetch petty cash records when site_id changes
//   useEffect(() => {
//     if (formData.site_id) {
//       const fetchPettyCash = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.post(
//             "http://localhost:5000/expense/fetch-petty-cash-by-site",
//             { site_id: formData.site_id },
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//             }
//           );
//           const records = Array.isArray(response.data.data)
//             ? response.data.data.map((record) => ({
//                 ...record,
//                 amount: parseFloat(record.amount),
//                 total_expenses: parseFloat(record.total_expenses) || 0,
//                 assign_date: record.assign_date.split('T')[0],
//               }))
//             : [];
//           setPettyCashRecords(records);
//         } catch (error) {
//           console.error("Error fetching petty cash:", error);
//           setError("Failed to load petty cash records. Please try again.");
//           setPettyCashRecords([]);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchPettyCash();
//     } else {
//       setPettyCashRecords([]);
//     }
//   }, [formData.site_id]);

//   // Fetch categories on component mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/expense/categories");
//         setCategories(Array.isArray(response.data.data) ? response.data.data : []);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setError("Failed to load expense categories. Please try again.");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch details when expense_category_id changes
//   useEffect(() => {
//     if (expenseForm.expense_category_id) {
//       const fetchDetails = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.post(
//             "http://localhost:5000/expense/fetch-details",
//             { exp_category_id: parseInt(expenseForm.expense_category_id) },
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//             }
//           );
//           setDetails(Array.isArray(response.data.data) ? response.data.data : []);
//         } catch (error) {
//           console.error("Error fetching details:", error);
//           setError("Failed to load expense details. Please try again.");
//           setDetails([]);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchDetails();
//     } else {
//       setDetails([]);
//     }
//   }, [expenseForm.expense_category_id]);

//   // Check amount validation
//   useEffect(() => {
//     if (expenseForm.amount) {
//       const enteredAmount = parseFloat(expenseForm.amount);
//       const remaining = expenseForm.total_amount - enteredAmount;
//       setRemainingAmount(remaining);
//       setShowAmountWarning(remaining < 0);
//     } else {
//       setShowAmountWarning(false);
//     }
//   }, [expenseForm.amount, expenseForm.total_amount]);

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "pd_id" ? { site_id: "" } : {}),
//     }));
//   };

//   // Handle expense form input changes
//   const handleExpenseInputChange = (e) => {
//     const { name, value } = e.target;
//     setExpenseForm((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "expense_category_id" ? { expense_detail_id: "" } : {}),
//     }));
//   };

//   // Open expense modal
//   const openExpenseModal = (record) => {
//     setExpenseForm({
//       petty_cash_id: record.id,
//       project_name: record.project_name,
//       site_name: record.site_name,
//       assign_date: record.assign_date,
//       expense_category_id: "",
//       expense_detail_id: "",
//       amount: "",
//       total_amount: record.amount,
//     });
//     setIsExpenseModalOpen(true);
//     setShowAmountWarning(false);
//   };

//   // Open view expenses modal
//   const openViewExpensesModal = async (record) => {
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         "http://localhost:5000/expense/fetch-expenses-by-petty-cash",
//         { petty_cash_id: record.id },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setExpenses(Array.isArray(response.data.data) ? response.data.data : []);
//       setExpenseForm((prev) => ({
//         ...prev,
//         petty_cash_id: record.id,
//         project_name: record.project_name,
//         site_name: record.site_name,
//         assign_date: record.assign_date,
//       }));
//       setIsViewExpensesModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching expenses:", error);
//       setError("Failed to load expenses. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle expense form submission
//   const handleExpenseSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const { petty_cash_id, expense_category_id, expense_detail_id, amount } = expenseForm;

//       if (!expense_category_id || !expense_detail_id || !amount) {
//         throw new Error("All fields are required");
//       }
//       const parsedAmount = parseFloat(amount);
//       if (isNaN(parsedAmount) || parsedAmount <= 0) {
//         throw new Error("Amount must be a positive number");
//       }

//       const response = await axios.post(
//         "http://localhost:5000/expense/add-siteincharge-expense",
//         {
//           petty_cash_id,
//           expense_category_id: parseInt(expense_category_id),
//           expense_detail_id: parseInt(expense_detail_id),
//           amount: parsedAmount,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       // Refresh petty cash records to update total_expenses
//       const refreshResponse = await axios.post(
//         "http://localhost:5000/expense/fetch-petty-cash-by-site",
//         { site_id: formData.site_id },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       const records = Array.isArray(refreshResponse.data.data)
//         ? refreshResponse.data.data.map((record) => ({
//             ...record,
//             amount: parseFloat(record.amount),
//             total_expenses: parseFloat(record.total_expenses) || 0,
//             assign_date: record.assign_date.split('T')[0],
//           }))
//         : [];
//       setPettyCashRecords(records);

//       setIsExpenseModalOpen(false);
//       setExpenseForm({
//         petty_cash_id: null,
//         project_name: "",
//         site_name: "",
//         assign_date: "",
//         expense_category_id: "",
//         expense_detail_id: "",
//         amount: "",
//         total_amount: 0,
//       });
      
//       Swal.fire({
//         title: "Success!",
//         text: "Expense entry added successfully!",
//         icon: "success",
//         confirmButtonColor: "#4f46e5",
//       });
//     } catch (error) {
//       console.error("Error adding expense:", error);
//       Swal.fire({
//         title: "Error!",
//         text: error.response?.data?.message || "Failed to add expense",
//         icon: "error",
//         confirmButtonColor: "#4f46e5",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Close expense modal
//   const closeExpenseModal = () => {
//     setIsExpenseModalOpen(false);
//     setExpenseForm({
//       petty_cash_id: null,
//       project_name: "",
//       site_name: "",
//       assign_date: "",
//       expense_category_id: "",
//       expense_detail_id: "",
//       amount: "",
//       total_amount: 0,
//     });
//     setError(null);
//     setShowAmountWarning(false);
//   };

//   // Close view expenses modal
//   const closeViewExpensesModal = () => {
//     setIsViewExpensesModalOpen(false);
//     setExpenses([]);
//     setExpenseForm((prev) => ({
//       ...prev,
//       petty_cash_id: null,
//       project_name: "",
//       site_name: "",
//       assign_date: "",
//     }));
//     setError(null);
//   };

//   // Close modal when clicking outside
//   const handleOutsideClick = (e) => {
//     if (e.target === e.currentTarget) {
//       if (isExpenseModalOpen) closeExpenseModal();
//       if (isViewExpensesModalOpen) closeViewExpensesModal();
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold text-gray-800">Expense Entry</h2>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm">
//           {error}
//         </div>
//       )}

//       {loading && (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//         </div>
//       )}

//       {/* Project and Site Selection */}
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
//         <h3 className="text-lg font-medium text-gray-800 mb-4">Select Project and Site</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="pd_id" className="block text-sm font-medium text-gray-700 mb-1">
//               Project
//             </label>
//             <select
//               id="pd_id"
//               name="pd_id"
//               value={formData.pd_id}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//               disabled={loading}
//             >
//               <option value="">Select a project</option>
//               {projects.map((project) => (
//                 <option key={project.pd_id} value={project.pd_id}>
//                   {project.project_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="site_id" className="block text-sm font-medium text-gray-700 mb-1">
//               Site
//             </label>
//             <select
//               id="site_id"
//               name="site_id"
//               value={formData.site_id}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//               disabled={loading || !formData.pd_id}
//             >
//               <option value="">Select a site</option>
//               {sites.map((site) => (
//                 <option key={site.site_id} value={site.site_id}>
//                   {site.site_name} {site.po_number ? `(PO: ${site.po_number})` : ''}
//                 </option>
//               ))}
//             </select>
//             {formData.site_id && (
//               <p className="mt-1 text-xs text-gray-600 font-medium">
//                 PO: {sites.find((site) => site.site_id === formData.site_id)?.po_number || "N/A"}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Petty Cash Records Table */}
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//         <div className="p-6">
//           <h3 className="text-lg font-medium text-gray-800 mb-4">Petty Cash Allocations</h3>
//           {pettyCashRecords.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Amount (₹)
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {pettyCashRecords.map((record) => {
//                     const isExpenseDisabled = record.total_expenses >= record.amount;
//                     const hasExpenses = record.total_expenses > 0;
//                     return (
//                       <tr
//                         key={record.id}
//                         className="hover:bg-gray-50 transition-colors duration-150"
//                       >
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
//                           {record.assign_date}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
//                           ₹{isNaN(record.amount) ? "0.00" : record.amount.toFixed(2)}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => openExpenseModal(record)}
//                               className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
//                                 isExpenseDisabled
//                                   ? "bg-gray-200 text-gray-600 cursor-not-allowed"
//                                   : "bg-blue-600 text-white hover:bg-blue-700"
//                               }`}
//                               disabled={isExpenseDisabled}
//                             >
//                               <PlusCircle className="h-4 w-4 mr-1" />
//                               Expense
//                             </button>
//                             <button
//                               onClick={() => openViewExpensesModal(record)}
//                               className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
//                                 hasExpenses
//                                   ? "bg-indigo-600 text-white hover:bg-indigo-700"
//                                   : "bg-gray-200 text-gray-600 cursor-not-allowed"
//                               }`}
//                               disabled={!hasExpenses}
//                             >
//                               <Eye className="h-4 w-4 mr-1" />
//                               View
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="bg-gray-50 rounded-lg p-4 text-center">
//               <p className="text-gray-600 text-sm">
//                 {formData.site_id
//                   ? "No petty cash allocations found for this site."
//                   : "Please select a site to view petty cash allocations."}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Enter Expense Modal */}
//       {isExpenseModalOpen && (
//         <div 
//           className="fixed inset-0 bg-black/30 z-50 flex items-center justify-end"
//           onClick={handleOutsideClick}
//         >
//           <div className={`bg-white h-full w-full max-w-md transform transition-transform duration-300 ease-in-out ${
//             isExpenseModalOpen ? 'translate-x-0' : 'translate-x-full'
//           } shadow-xl overflow-y-auto`}>
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-xl font-semibold text-gray-800">Enter Expense</h3>
//                 <button
//                   onClick={closeExpenseModal}
//                   className="p-1 rounded-full hover:bg-gray-100 transition-colors"
//                 >
//                   <X className="h-5 w-5 text-gray-500" />
//                 </button>
//               </div>

//               {/* Amount Warning */}
//               {showAmountWarning && (
//                 <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded flex items-start">
//                   <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-yellow-800">Warning</p>
//                     <p className="text-xs text-yellow-700">
//                       You are exceeding the allocated amount by ₹{Math.abs(remainingAmount).toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
//                 <p className="text-sm font-medium text-indigo-800">Total Allocated Amount</p>
//                 <p className="text-2xl font-bold text-indigo-900">
//                   ₹{expenseForm.total_amount.toFixed(2)}
//                 </p>
//               </div>

//               <form onSubmit={handleExpenseSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <p className="text-xs font-medium text-gray-500 mb-1">Project</p>
//                     <p className="text-sm font-medium text-gray-800">
//                       {expenseForm.project_name || "N/A"}
//                     </p>
//                   </div>
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <p className="text-xs font-medium text-gray-500 mb-1">Site</p>
//                     <p className="text-sm font-medium text-gray-800">
//                       {expenseForm.site_name || "N/A"}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <p className="text-xs font-medium text-gray-500 mb-1">Date</p>
//                   <p className="text-sm font-medium text-gray-800">
//                     {expenseForm.assign_date}
//                   </p>
//                 </div>

//                 <div>
//                   <label htmlFor="expense_category_id" className="block text-sm font-medium text-gray-700 mb-1">
//                     Expense Category
//                   </label>
//                   <div className="relative">
//                     <select
//                       id="expense_category_id"
//                       name="expense_category_id"
//                       value={expenseForm.expense_category_id}
//                       onChange={handleExpenseInputChange}
//                       className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none"
//                       disabled={loading}
//                     >
//                       <option value="">Select a category</option>
//                       {categories.map((category) => (
//                         <option key={category.id} value={category.id}>
//                           {category.exp_category}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                       <ChevronDown className="h-4 w-4 text-gray-400" />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="expense_detail_id" className="block text-sm font-medium text-gray-700 mb-1">
//                     Expense Detail
//                   </label>
//                   <div className="relative">
//                     <select
//                       id="expense_detail_id"
//                       name="expense_detail_id"
//                       value={expenseForm.expense_detail_id}
//                       onChange={handleExpenseInputChange}
//                       className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none"
//                       disabled={loading || !expenseForm.expense_category_id}
//                     >
//                       <option value="">Select a detail</option>
//                       {details.map((detail) => (
//                         <option key={detail.id} value={detail.id}>
//                           {detail.details}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                       <ChevronDown className="h-4 w-4 text-gray-400" />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
//                     Amount (₹)
//                   </label>
//                   <div className="relative rounded-md shadow-sm">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <span className="text-gray-500 sm:text-sm">₹</span>
//                     </div>
//                     <input
//                       type="text"
//                       inputMode="decimal"
//                       id="amount"
//                       name="amount"
//                       value={expenseForm.amount}
//                       onChange={handleExpenseInputChange}
//                       className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                       placeholder="0.00"
//                       disabled={loading}
//                     />
//                   </div>
//                 </div>

//                 <div className="pt-4 flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={closeExpenseModal}
//                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <span className="flex items-center justify-center">
//                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Processing...
//                       </span>
//                     ) : (
//                       "Add Expense"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Expenses Modal */}
//       {isViewExpensesModalOpen && (
//         <div 
//           className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//           onClick={handleOutsideClick}
//         >
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">Expense Details</h3>
//                   <p className="text-sm text-gray-600">
//                     {expenseForm.site_name} • {expenseForm.assign_date}
//                   </p>
//                 </div>
//                 <button
//                   onClick={closeViewExpensesModal}
//                   className="p-1 rounded-full hover:bg-gray-100 transition-colors"
//                 >
//                   <X className="h-5 w-5 text-gray-500" />
//                 </button>
//               </div>
//             </div>

//             <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
//               {expenses.length > 0 ? (
//                 <div className="divide-y divide-gray-200">
//                   {expenses.map((expense) => (
//                     <div key={expense.id} className="p-4 hover:bg-gray-50 transition-colors">
//                       <div className="flex justify-between">
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">{expense.exp_category || "N/A"}</p>
//                           <p className="text-xs text-gray-500 mt-1">{expense.details || "N/A"}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-sm font-medium text-gray-900">
//                             ₹{parseFloat(expense.amount).toFixed(2)}
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             {format(new Date(expense.amount_created_at), "dd MMM yyyy, hh:mm a")}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="p-8 text-center">
//                   <p className="text-gray-500">No expenses recorded for this allocation.</p>
//                 </div>
//               )}
//             </div>

//             <div className="p-4 border-t border-gray-200 bg-gray-50">
//               <button
//                 onClick={closeViewExpensesModal}
//                 className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExpenseEntry;





















// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************
// **********************************************

// below code is table view




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { X, PlusCircle, AlertTriangle, ChevronDown } from "lucide-react";
// import { format, parseISO } from "date-fns";

// const ExpenseEntry = () => {
//   const [projects, setProjects] = useState([]);
//   const [sites, setSites] = useState([]); 
//   const [pettyCashRecords, setPettyCashRecords] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [details, setDetails] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [formData, setFormData] = useState({
//     pd_id: "",
//     site_id: "",
//   });
//   const [expenseForm, setExpenseForm] = useState({
//     petty_cash_id: null,
//     project_name: "",
//     site_name: "",
//     assign_date: "",
//     expense_category_id: "",
//     expense_detail_id: "",
//     amount: "",
//     total_amount: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
//   const [showAmountWarning, setShowAmountWarning] = useState(false);
//   const [remainingAmount, setRemainingAmount] = useState(0);
//   const [expandedRows, setExpandedRows] = useState({});

//   // Helper function to properly handle date display
//   const formatDisplayDate = (dateString) => {
//     if (!dateString) return "";
    
//     try {
//       // Parse the date string from the database
//       const date = parseISO(dateString);
//       // Format it to YYYY-MM-DD without timezone conversion
//       return format(date, "yyyy-MM-dd");
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return dateString; // fallback to original string if parsing fails
//     }
//   };

//   // Toggle row expansion
//   const toggleRow = (id) => {
//     setExpandedRows(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   };

//   // Fetch projects on component mount
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get("http://localhost:5000/material/projects");
//         setProjects(Array.isArray(response.data.data) ? response.data.data : []);
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//         setError("Failed to load projects. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, []);

//   // Fetch sites when pd_id changes
//   useEffect(() => {
//     if (formData.pd_id) {
//       const fetchSites = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.get(`http://localhost:5000/material/sites/${formData.pd_id}`);
//           setSites(Array.isArray(response.data.data) ? response.data.data : []);
//         } catch (error) {
//           console.error("Error fetching sites:", error);
//           setError("Failed to load sites. Please try again.");
//           setSites([]);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchSites();
//     } else {
//       setSites([]);
//       setPettyCashRecords([]);
//     }
//   }, [formData.pd_id]);

//   // Fetch petty cash records when site_id changes
//   useEffect(() => {
//     if (formData.site_id) {
//       const fetchPettyCash = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.post(
//             "http://localhost:5000/expense/fetch-petty-cash-by-site",
//             { site_id: formData.site_id },
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//             }
//           );
//           const records = Array.isArray(response.data.data)
//             ? response.data.data.map((record) => ({
//                 ...record,
//                 amount: parseFloat(record.amount),
//                 total_expenses: parseFloat(record.total_expenses) || 0,
//                 assign_date: formatDisplayDate(record.assign_date),
//               }))
//             : [];
//           setPettyCashRecords(records);
          
//           // Fetch expenses for each record
//           const expensesPromises = records.map(record => 
//             axios.post(
//               "http://localhost:5000/expense/fetch-expenses-by-petty-cash",
//               { petty_cash_id: record.id },
//               {
//                 headers: {
//                   Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//               }
//             )
//           );
          
//           const expensesResponses = await Promise.all(expensesPromises);
//           const allExpenses = expensesResponses.map(res => 
//             Array.isArray(res.data.data) ? res.data.data : []
//           );
          
//           // Create a map of petty cash ID to expenses
//           const expensesMap = {};
//           records.forEach((record, index) => {
//             expensesMap[record.id] = allExpenses[index];
//           });
//           setExpenses(expensesMap);
          
//         } catch (error) {
//           console.error("Error fetching petty cash:", error);
//           setError("Failed to load petty cash records. Please try again.");
//           setPettyCashRecords([]);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchPettyCash();
//     } else {
//       setPettyCashRecords([]);
//     }
//   }, [formData.site_id]);

//   // Fetch categories on component mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/expense/categories");
//         setCategories(Array.isArray(response.data.data) ? response.data.data : []);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setError("Failed to load expense categories. Please try again.");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch details when expense_category_id changes
//   useEffect(() => {
//     if (expenseForm.expense_category_id) {
//       const fetchDetails = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.post(
//             "http://localhost:5000/expense/fetch-details",
//             { exp_category_id: parseInt(expenseForm.expense_category_id) },
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//             }
//           );
//           setDetails(Array.isArray(response.data.data) ? response.data.data : []);
//         } catch (error) {
//           console.error("Error fetching details:", error);
//           setError("Failed to load expense details. Please try again.");
//           setDetails([]);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchDetails();
//     } else {
//       setDetails([]);
//     }
//   }, [expenseForm.expense_category_id]);

//   // Check amount validation
//   useEffect(() => {
//     if (expenseForm.amount) {
//       const enteredAmount = parseFloat(expenseForm.amount);
//       const remaining = expenseForm.total_amount - enteredAmount;
//       setRemainingAmount(remaining);
//       setShowAmountWarning(remaining < 0);
//     } else {
//       setShowAmountWarning(false);
//     }
//   }, [expenseForm.amount, expenseForm.total_amount]);

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "pd_id" ? { site_id: "" } : {}),
//     }));
//   };

//   // Handle expense form input changes
//   const handleExpenseInputChange = (e) => {
//     const { name, value } = e.target;
//     setExpenseForm((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "expense_category_id" ? { expense_detail_id: "" } : {}),
//     }));
//   };

//   // Open expense modal
//   const openExpenseModal = (record) => {
//     setExpenseForm({
//       petty_cash_id: record.id,
//       project_name: record.project_name,
//       site_name: record.site_name,
//       assign_date: formatDisplayDate(record.assign_date),
//       expense_category_id: "",
//       expense_detail_id: "",
//       amount: "",
//       total_amount: record.amount,
//     });
//     setIsExpenseModalOpen(true);
//     setShowAmountWarning(false);
//   };

//   // Handle expense form submission
//   const handleExpenseSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const { petty_cash_id, expense_category_id, expense_detail_id, amount } = expenseForm;

//       if (!expense_category_id || !expense_detail_id || !amount) {
//         throw new Error("All fields are required");
//       }
//       const parsedAmount = parseFloat(amount);
//       if (isNaN(parsedAmount) || parsedAmount <= 0) {
//         throw new Error("Amount must be a positive number");
//       }

//       const response = await axios.post(
//         "http://localhost:5000/expense/add-siteincharge-expense",
//         {
//           petty_cash_id,
//           expense_category_id: parseInt(expense_category_id),
//           expense_detail_id: parseInt(expense_detail_id),
//           amount: parsedAmount,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       // Refresh petty cash records to update total_expenses
//       const refreshResponse = await axios.post(
//         "http://localhost:5000/expense/fetch-petty-cash-by-site",
//         { site_id: formData.site_id },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       const records = Array.isArray(refreshResponse.data.data)
//         ? refreshResponse.data.data.map((record) => ({
//             ...record,
//             amount: parseFloat(record.amount),
//             total_expenses: parseFloat(record.total_expenses) || 0,
//             assign_date: formatDisplayDate(record.assign_date),
//           }))
//         : [];
//       setPettyCashRecords(records);

//       // Refresh expenses for the updated record
//       const expensesResponse = await axios.post(
//         "http://localhost:5000/expense/fetch-expenses-by-petty-cash",
//         { petty_cash_id },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setExpenses(prev => ({
//         ...prev,
//         [petty_cash_id]: Array.isArray(expensesResponse.data.data) ? expensesResponse.data.data : []
//       }));

//       setIsExpenseModalOpen(false);
//       setExpenseForm({
//         petty_cash_id: null,
//         project_name: "",
//         site_name: "",
//         assign_date: "",
//         expense_category_id: "",
//         expense_detail_id: "",
//         amount: "",
//         total_amount: 0,
//       });
      
//       Swal.fire({
//         title: "Success!",
//         text: "Expense entry added successfully!",
//         icon: "success",
//         confirmButtonColor: "#4f46e5",
//       });
//     } catch (error) {
//       console.error("Error adding expense:", error);
//       Swal.fire({
//         title: "Error!",
//         text: error.response?.data?.message || "Failed to add expense",
//         icon: "error",
//         confirmButtonColor: "#4f46e5",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Close expense modal
//   const closeExpenseModal = () => {
//     setIsExpenseModalOpen(false);
//     setExpenseForm({
//       petty_cash_id: null,
//       project_name: "",
//       site_name: "",
//       assign_date: "",
//       expense_category_id: "",
//       expense_detail_id: "",
//       amount: "",
//       total_amount: 0,
//     });
//     setError(null);
//     setShowAmountWarning(false);
//   };

//   // Close modal when clicking outside
//   const handleOutsideClick = (e) => {
//     if (e.target === e.currentTarget) {
//       closeExpenseModal();
//     }
//   };

//   // Calculate remaining amount for a record
//   const calculateRemainingAmount = (record) => {
//     return record.amount - (record.total_expenses || 0);
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold text-gray-800">Expense Entry</h2>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm">
//           {error}
//         </div>
//       )}

//       {loading && (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//         </div>
//       )}

//       {/* Project and Site Selection */}
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
//         <h3 className="text-lg font-medium text-gray-800 mb-4">Select Project and Site</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="pd_id" className="block text-sm font-medium text-gray-700 mb-1">
//               Project
//             </label>
//             <select
//               id="pd_id"
//               name="pd_id"
//               value={formData.pd_id}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//               disabled={loading}
//             >
//               <option value="">Select a project</option>
//               {projects.map((project) => (
//                 <option key={project.pd_id} value={project.pd_id}>
//                   {project.project_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="site_id" className="block text-sm font-medium text-gray-700 mb-1">
//               Site
//             </label>
//             <select
//               id="site_id"
//               name="site_id"
//               value={formData.site_id}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//               disabled={loading || !formData.pd_id}
//             >
//               <option value="">Select a site</option>
//               {sites.map((site) => (
//                 <option key={site.site_id} value={site.site_id}>
//                   {site.site_name} {site.po_number ? `(PO: ${site.po_number})` : ''}
//                 </option>
//               ))}
//             </select>
//             {formData.site_id && (
//               <p className="mt-1 text-xs text-gray-600 font-medium">
//                 PO: {sites.find((site) => site.site_id === formData.site_id)?.po_number || "N/A"}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Petty Cash Records Table */}
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//         <div className="p-6">
//           <h3 className="text-lg font-medium text-gray-800 mb-4">Petty Cash Allocations</h3>
//           {pettyCashRecords.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Allocated Amount (₹)
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Expensed Amount (₹)
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Remaining Amount (₹)
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {pettyCashRecords.map((record) => {
//                     const isExpenseDisabled = record.total_expenses >= record.amount;
//                     const hasExpenses = expenses[record.id] && expenses[record.id].length > 0;
//                     const isExpanded = expandedRows[record.id];
                    
//                     return (
//                       <React.Fragment key={record.id}>
//                         <tr className="hover:bg-gray-50 transition-colors duration-150">
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
//                             {record.assign_date}
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
//                             ₹{record.amount.toFixed(2)}
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
//                             ₹{(record.total_expenses || 0).toFixed(2)}
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
//                             <span className={`px-2 py-1 rounded-full text-xs ${
//                               calculateRemainingAmount(record) <= 0 
//                                 ? 'bg-red-100 text-red-800' 
//                                 : 'bg-green-100 text-green-800'
//                             }`}>
//                               ₹{calculateRemainingAmount(record).toFixed(2)}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm">
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => openExpenseModal(record)}
//                                 className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
//                                   isExpenseDisabled
//                                     ? "bg-gray-200 text-gray-600 cursor-not-allowed"
//                                     : "bg-blue-600 text-white hover:bg-blue-700"
//                                 }`}
//                                 disabled={isExpenseDisabled}
//                               >
//                                 <PlusCircle className="h-4 w-4 mr-1" />
//                                 Expense
//                               </button>
//                               {hasExpenses && (
//                                 <button
//                                   onClick={() => toggleRow(record.id)}
//                                   className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
//                                 >
//                                   {isExpanded ? 'Hide Details' : 'Show Details'}
//                                 </button>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
                        
//                         {isExpanded && hasExpenses && (
//                           <tr>
//                             <td colSpan="5" className="px-4 py-2 bg-gray-50">
//                               <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                   <thead className="bg-gray-100">
//                                     <tr>
//                                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Category
//                                       </th>
//                                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Details
//                                       </th>
//                                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Amount (₹)
//                                       </th>
//                                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Date
//                                       </th>
//                                     </tr>
//                                   </thead>
//                                   <tbody className="bg-white divide-y divide-gray-200">
//                                     {expenses[record.id].map((expense) => (
//                                       <tr key={expense.id} className="hover:bg-gray-50">
//                                         <td className="px-4 py-2 text-sm text-gray-700">
//                                           {expense.exp_category || "N/A"}
//                                         </td>
//                                         <td className="px-4 py-2 text-sm text-gray-700">
//                                           {expense.details || "N/A"}
//                                         </td>
//                                         <td className="px-4 py-2 text-sm text-gray-700">
//                                           ₹{parseFloat(expense.amount).toFixed(2)}
//                                         </td>
//                                         <td className="px-4 py-2 text-sm text-gray-700">
//                                           {format(parseISO(expense.amount_created_at), "dd MMM yyyy, hh:mm a")}
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </tbody>
//                                 </table>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="bg-gray-50 rounded-lg p-4 text-center">
//               <p className="text-gray-600 text-sm">
//                 {formData.site_id
//                   ? "No petty cash allocations found for this site."
//                   : "Please select a site to view petty cash allocations."}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Enter Expense Modal */}
//       {isExpenseModalOpen && (
//         <div 
//           className="fixed inset-0 bg-black/30 z-50 flex items-center justify-end"
//           onClick={handleOutsideClick}
//         >
//           <div className={`bg-white h-full w-full max-w-md transform transition-transform duration-300 ease-in-out ${
//             isExpenseModalOpen ? 'translate-x-0' : 'translate-x-full'
//           } shadow-xl overflow-y-auto`}>
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-xl font-semibold text-gray-800">Enter Expense</h3>
//                 <button
//                   onClick={closeExpenseModal}
//                   className="p-1 rounded-full hover:bg-gray-100 transition-colors"
//                 >
//                   <X className="h-5 w-5 text-gray-500" />
//                 </button>
//               </div>

//               {/* Amount Warning */}
//               {showAmountWarning && (
//                 <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded flex items-start">
//                   <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-yellow-800">Warning</p>
//                     <p className="text-xs text-yellow-700">
//                       You are exceeding the allocated amount by ₹{Math.abs(remainingAmount).toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
//                 <p className="text-sm font-medium text-indigo-800">Total Allocated Amount</p>
//                 <p className="text-2xl font-bold text-indigo-900">
//                   ₹{expenseForm.total_amount.toFixed(2)}
//                 </p>
//               </div>

//               <form onSubmit={handleExpenseSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <p className="text-xs font-medium text-gray-500 mb-1">Project</p>
//                     <p className="text-sm font-medium text-gray-800">
//                       {expenseForm.project_name || "N/A"}
//                     </p>
//                   </div>
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <p className="text-xs font-medium text-gray-500 mb-1">Site</p>
//                     <p className="text-sm font-medium text-gray-800">
//                       {expenseForm.site_name || "N/A"}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <p className="text-xs font-medium text-gray-500 mb-1">Date</p>
//                   <p className="text-sm font-medium text-gray-800">
//                     {expenseForm.assign_date}
//                   </p>
//                 </div>

//                 <div>
//                   <label htmlFor="expense_category_id" className="block text-sm font-medium text-gray-700 mb-1">
//                     Expense Category
//                   </label>
//                   <div className="relative">
//                     <select
//                       id="expense_category_id"
//                       name="expense_category_id"
//                       value={expenseForm.expense_category_id}
//                       onChange={handleExpenseInputChange}
//                       className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none"
//                       disabled={loading}
//                     >
//                       <option value="">Select a category</option>
//                       {categories.map((category) => (
//                         <option key={category.id} value={category.id}>
//                           {category.exp_category}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                       <ChevronDown className="h-4 w-4 text-gray-400" />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="expense_detail_id" className="block text-sm font-medium text-gray-700 mb-1">
//                     Expense Detail
//                   </label>
//                   <div className="relative">
//                     <select
//                       id="expense_detail_id"
//                       name="expense_detail_id"
//                       value={expenseForm.expense_detail_id}
//                       onChange={handleExpenseInputChange}
//                       className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none"
//                       disabled={loading || !expenseForm.expense_category_id}
//                     >
//                       <option value="">Select a detail</option>
//                       {details.map((detail) => (
//                         <option key={detail.id} value={detail.id}>
//                           {detail.details}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                       <ChevronDown className="h-4 w-4 text-gray-400" />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
//                     Amount (₹)
//                   </label>
//                   <div className="relative rounded-md shadow-sm">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <span className="text-gray-500 sm:text-sm">₹</span>
//                     </div>
//                     <input
//                       type="text"
//                       inputMode="decimal"
//                       id="amount"
//                       name="amount"
//                       value={expenseForm.amount}
//                       onChange={handleExpenseInputChange}
//                       className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                       placeholder="0.00"
//                       disabled={loading}
//                     />
//                   </div>
//                 </div>

//                 <div className="pt-4 flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={closeExpenseModal}
//                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <span className="flex items-center justify-center">
//                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Processing...
//                       </span>
//                     ) : (
//                       "Add Expense"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExpenseEntry;



// ***************************************
// ***************************************
// ***************************************
// ***************************************
// ***************************************
// ***************************************
// ***************************************
// ***************************************
// ***************************************
// ***************************************
// ***************************************
// ***************************************
// ***************************************
// ***************************************
// ***************************************
// ***************************************





import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { X, PlusCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { format, parseISO } from "date-fns";

const ExpenseEntry = () => {
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [pettyCashRecords, setPettyCashRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [details, setDetails] = useState([]);
  const [expenses, setExpenses] = useState({});
  const [formData, setFormData] = useState({
    pd_id: "",
    site_id: "",
  });
  const [expenseForm, setExpenseForm] = useState({
    petty_cash_id: null,
    project_name: "",
    site_name: "",
    assign_date: "",
    expense_category_id: "",
    expense_detail_id: "",
    amount: "",
    total_amount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [showAmountWarning, setShowAmountWarning] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [expandedRecords, setExpandedRecords] = useState({}); // State for toggling expense details on mobile

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = parseISO(dateString);
      return format(date, "yyyy-MM-dd");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/material/projects");
        setProjects(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (formData.pd_id) {
      const fetchSites = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:5000/material/sites/${formData.pd_id}`);
          setSites(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
          console.error("Error fetching sites:", error);
          setError("Failed to load sites. Please try again.");
          setSites([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSites();
    } else {
      setSites([]);
      setPettyCashRecords([]);
    }
  }, [formData.pd_id]);

  useEffect(() => {
    if (formData.site_id) {
      const fetchPettyCash = async () => {
        try {
          setLoading(true);
          const response = await axios.post(
            "http://localhost:5000/expense/fetch-petty-cash-by-site",
            { site_id: formData.site_id },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const records = Array.isArray(response.data.data)
            ? response.data.data.map((record) => ({
                ...record,
                amount: parseFloat(record.amount),
                previous_remaining_amount: parseFloat(record.previous_remaining_amount) || 0,
                total_expenses: parseFloat(record.total_expenses) || 0,
                assign_date: formatDisplayDate(record.assign_date),
              }))
            : [];
          setPettyCashRecords(records);

          const expensesPromises = records.map((record) =>
            axios.post(
              "http://localhost:5000/expense/fetch-expenses-by-petty-cash",
              { petty_cash_id: record.id },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
          );

          const expensesResponses = await Promise.all(expensesPromises);
          const allExpenses = expensesResponses.map((res) =>
            Array.isArray(res.data.data) ? res.data.data : []
          );

          const expensesMap = {};
          records.forEach((record, index) => {
            expensesMap[record.id] = allExpenses[index];
          });
          setExpenses(expensesMap);
        } catch (error) {
          console.error("Error fetching petty cash:", error);
          setError("Failed to load petty cash records. Please try again.");
          setPettyCashRecords([]);
        } finally {
          setLoading(false);
        }
      };
      fetchPettyCash();
    } else {
      setPettyCashRecords([]);
    }
  }, [formData.site_id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/expense/categories");
        setCategories(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load expense categories. Please try again.");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (expenseForm.expense_category_id) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          const response = await axios.post(
            "http://localhost:5000/expense/fetch-details",
            { exp_category_id: parseInt(expenseForm.expense_category_id) },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setDetails(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
          console.error("Error fetching details:", error);
          setError("Failed to load expense details. Please try again.");
          setDetails([]);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    } else {
      setDetails([]);
    }
  }, [expenseForm.expense_category_id]);

  useEffect(() => {
    if (expenseForm.amount) {
      const enteredAmount = parseFloat(expenseForm.amount);
      const remaining = expenseForm.total_amount - enteredAmount;
      setRemainingAmount(remaining);
      setShowAmountWarning(remaining < 0);
    } else {
      setShowAmountWarning(false);
    }
  }, [expenseForm.amount, expenseForm.total_amount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "pd_id" ? { site_id: "" } : {}),
    }));
  };

  const handleExpenseInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "expense_category_id" ? { expense_detail_id: "" } : {}),
    }));
  };

  const openExpenseModal = (record) => {
    setExpenseForm({
      petty_cash_id: record.id,
      project_name: record.project_name,
      site_name: record.site_name,
      assign_date: formatDisplayDate(record.assign_date),
      expense_category_id: "",
      expense_detail_id: "",
      amount: "",
      total_amount: record.amount,
    });
    setIsExpenseModalOpen(true);
    setShowAmountWarning(false);
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { petty_cash_id, expense_category_id, expense_detail_id, amount } = expenseForm;

      if (!expense_category_id || !expense_detail_id || !amount) {
        throw new Error("All fields are required");
      }
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Amount must be a positive number");
      }

      const response = await axios.post(
        "http://localhost:5000/expense/add-siteincharge-expense",
        {
          petty_cash_id,
          expense_category_id: parseInt(expense_category_id),
          expense_detail_id: parseInt(expense_detail_id),
          amount: parsedAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const refreshResponse = await axios.post(
        "http://localhost:5000/expense/fetch-petty-cash-by-site",
        { site_id: formData.site_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const records = Array.isArray(refreshResponse.data.data)
        ? refreshResponse.data.data.map((record) => ({
            ...record,
            amount: parseFloat(record.amount),
            previous_remaining_amount: parseFloat(record.previous_remaining_amount) || 0,
            total_expenses: parseFloat(record.total_expenses) || 0,
            assign_date: formatDisplayDate(record.assign_date),
          }))
        : [];
      setPettyCashRecords(records);

      const expensesResponse = await axios.post(
        "http://localhost:5000/expense/fetch-expenses-by-petty-cash",
        { petty_cash_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setExpenses((prev) => ({
        ...prev,
        [petty_cash_id]: Array.isArray(expensesResponse.data.data) ? expensesResponse.data.data : [],
      }));

      setIsExpenseModalOpen(false);
      setExpenseForm({
        petty_cash_id: null,
        project_name: "",
        site_name: "",
        assign_date: "",
        expense_category_id: "",
        expense_detail_id: "",
        amount: "",
        total_amount: 0,
      });

      Swal.fire({
        title: "Success!",
        text: "Expense entry added successfully!",
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to add expense",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setExpenseForm({
      petty_cash_id: null,
      project_name: "",
      site_name: "",
      assign_date: "",
      expense_category_id: "",
      expense_detail_id: "",
      amount: "",
      total_amount: 0,
    });
    setError(null);
    setShowAmountWarning(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      closeExpenseModal();
    }
  };

  const calculateRemainingAmount = (record) => {
    return record.amount - (record.total_expenses || 0);
  };

  const calculateTotalAmount = (record) => {
    return (record.amount - record.previous_remaining_amount) + record.previous_remaining_amount;
  };

  const toggleRecordExpansion = (recordId) => {
    setExpandedRecords((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }));
  };

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <PlusCircle className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          Expense Entry
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md flex items-center gap-2 transition-all duration-300">
          <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
          <span className="text-sm">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
            aria-label="Close error message"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Project and Site</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pd_id" className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            <select
              id="pd_id"
              name="pd_id"
              value={formData.pd_id}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-all duration-200 hover:border-indigo-300"
              disabled={loading}
              aria-required="true"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.pd_id} value={project.pd_id}>
                  {project.project_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="site_id" className="block text-sm font-medium text-gray-700 mb-1">
              Site
            </label>
            <select
              id="site_id"
              name="site_id"
              value={formData.site_id}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-all duration-200 hover:border-indigo-300"
              disabled={loading || !formData.pd_id}
              aria-required="true"
            >
              <option value="">Select a site</option>
              {sites.map((site) => (
                <option key={site.site_id} value={site.site_id}>
                  {site.site_name} {site.po_number ? `(PO: ${site.po_number})` : ""}
                </option>
              ))}
            </select>
            {formData.site_id && (
              <p className="mt-1 text-xs text-gray-600 font-medium">
                PO: {sites.find((site) => site.site_id === formData.site_id)?.po_number || "N/A"}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Petty Cash Allocations & Expenses</h3>
          {pettyCashRecords.length > 0 ? (
            <>
              {/* Mobile View: Card-based Layout */}
              <div className="sm:hidden space-y-4">
                {pettyCashRecords.map((record) => {
                  const isExpenseDisabled = record.total_expenses >= record.amount;
                  const recordExpenses = expenses[record.id] || [];
                  const isExpanded = expandedRecords[record.id];

                  return (
                    <div
                      key={record.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm transition-all duration-200"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              Date: {record.assign_date}
                            </p>
                            <p className="text-xs text-gray-600">
                              Allocated: ₹{(record.amount - record.previous_remaining_amount).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-600">
                              Prev. Remaining: ₹{record.previous_remaining_amount.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleRecordExpansion(record.id)}
                            className="p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label={isExpanded ? "Collapse expenses" : "Expand expenses"}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full">
                            Total: ₹{calculateTotalAmount(record).toFixed(2)}
                          </div>
                          <div className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                            Expensed: ₹{(record.total_expenses || 0).toFixed(2)}
                          </div>
                          <div
                            className={`col-span-2 text-xs font-medium px-2 py-1 rounded-full ${
                              calculateRemainingAmount(record) <= 0
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            Remaining: ₹{calculateRemainingAmount(record).toFixed(2)}
                          </div>
                        </div>
                        <button
                          onClick={() => openExpenseModal(record)}
                          className={`w-full flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            isExpenseDisabled
                              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                          disabled={isExpenseDisabled}
                          aria-label="Add expense"
                        >
                          <PlusCircle className="h-5 w-5 mr-2" aria-hidden="true" />
                          Add Expense
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="mt-4 border-t border-gray-200 pt-3">
                          {recordExpenses.length > 0 ? (
                            recordExpenses.map((expense) => (
                              <div
                                key={`${record.id}-${expense.id}`}
                                className="bg-white p-3 rounded-lg border border-gray-100 mb-2 shadow-sm"
                              >
                                <p className="text-xs font-medium text-gray-700">
                                  Category: {expense.exp_category || "N/A"}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Detail: {expense.details || "N/A"}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Amount: ₹{parseFloat(expense.amount).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Date: {format(parseISO(expense.amount_created_at), "dd MMM yyyy, hh:mm a")}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500 italic text-center">
                              No expenses recorded
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop View: Original Table Layout */}
              <div className="hidden sm:block max-w-full overflow-x-hidden">
                <table className="w-full border-collapse">
                  <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white sticky top-0 z-10">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider">Allocation Details</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider">Total Amount (₹)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider">Expensed (₹)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider">Remaining (₹)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider">Details</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider">Amount (₹)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider">Expense Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pettyCashRecords.map((record) => {
                      const isExpenseDisabled = record.total_expenses >= record.amount;
                      const recordExpenses = expenses[record.id] || [];

                      if (recordExpenses.length === 0) {
                        return (
                          <tr 
                            key={record.id} 
                            className="hover:bg-indigo-50 transition-colors duration-200"
                          >
                            <td className="px-4 py-3 text-xs text-gray-700 break-words border-r border-gray-200">
                              {record.assign_date}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-700 break-words border-r border-gray-200">
                              <div className="space-y-1">
                                <span className="inline-block px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs">
                                  Allocated: ₹{(record.amount - record.previous_remaining_amount).toFixed(2)}
                                </span>
                                <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                                  Prev. Remaining: ₹{record.previous_remaining_amount.toFixed(2)}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-700 break-words border-r border-gray-200">
                              <span className="inline-block px-2 py-1 rounded-full bg-teal-100 text-teal-800 text-xs">
                                ₹{calculateTotalAmount(record).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-700 break-words border-r border-gray-200">
                              ₹{(record.total_expenses || 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-xs font-medium break-words border-r border-gray-200">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  calculateRemainingAmount(record) <= 0
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                ₹{calculateRemainingAmount(record).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500 italic break-words border-r border-gray-200">
                              No expenses
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500 italic break-words border-r border-gray-200">
                              -
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500 italic break-words border-r border-gray-200">
                              -
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500 italic break-words border-r border-gray-200">
                              -
                            </td>
                            <td className="px-4 py-3 text-xs break-words">
                              <button
                                onClick={() => openExpenseModal(record)}
                                className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                  isExpenseDisabled
                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                }`}
                                disabled={isExpenseDisabled}
                                aria-label="Add expense"
                              >
                                <PlusCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                                Add
                              </button>
                            </td>
                          </tr>
                        );
                      }

                      return recordExpenses.map((expense, index) => (
                        <tr 
                          key={`${record.id}-${expense.id}`} 
                          className={`hover:bg-indigo-50 transition-colors duration-200 ${index === 0 ? 'border-t-2 border-gray-300' : ''}`}
                        >
                          {index === 0 && (
                            <>
                              <td 
                                className="px-4 py-3 text-xs text-gray-700 break-words border-r border-gray-200 align-top"
                                rowSpan={recordExpenses.length}
                              >
                                {record.assign_date}
                              </td>
                              <td 
                                className="px-4 py-3 text-xs text-gray-700 break-words border-r border-gray-200 align-top"
                                rowSpan={recordExpenses.length}
                              >
                                <div className="space-y-1">
                                  <span className="inline-block px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs">
                                    Allocated: ₹{(record.amount - record.previous_remaining_amount).toFixed(2)}
                                  </span>
                                  <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                                    Prev. Remaining: ₹{record.previous_remaining_amount.toFixed(2)}
                                  </span>
                                </div>
                              </td>
                              <td 
                                className="px-4 py-3 text-xs text-gray-700 break-words border-r border-gray-200 align-top"
                                rowSpan={recordExpenses.length}
                              >
                                <span className="inline-block px-2 py-1 rounded-full bg-teal-100 text-teal-800 text-xs">
                                  ₹{calculateTotalAmount(record).toFixed(2)}
                                </span>
                              </td>
                              <td 
                                className="px-4 py-3 text-xs text-gray-700 break-words border-r border-gray-200 align-top"
                                rowSpan={recordExpenses.length}
                              >
                                ₹{(record.total_expenses || 0).toFixed(2)}
                              </td>
                              <td 
                                className="px-4 py-3 text-xs font-medium break-words border-r border-gray-200 align-top"
                                rowSpan={recordExpenses.length}
                              >
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                                    calculateRemainingAmount(record) <= 0
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  ₹{calculateRemainingAmount(record).toFixed(2)}
                                </span>
                              </td>
                            </>
                          )}
                          <td className="px-4 py-3 text-xs text-gray-700 break-words border-r border-gray-200">
                            {expense.exp_category || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-700 break-words border-r border-gray-200">
                            {expense.details || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-700 break-words border-r border-gray-200">
                            ₹{parseFloat(expense.amount).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-700 break-words border-r border-gray-200">
                            {format(parseISO(expense.amount_created_at), "dd MMM yyyy, hh:mm a")}
                          </td>
                          {index === 0 && (
                            <td 
                              className="px-4 py-3 text-xs break-words align-top"
                              rowSpan={recordExpenses.length}
                            >
                              <button
                                onClick={() => openExpenseModal(record)}
                                className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                  isExpenseDisabled
                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                }`}
                                disabled={isExpenseDisabled}
                                aria-label="Add expense"
                              >
                                <PlusCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                                Add
                              </button>
                            </td>
                          )}
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">
                {formData.site_id
                  ? "No petty cash allocations found for this site."
                  : "Please select a site to view petty cash allocations."}
              </p>
            </div>
          )}
        </div>
      </div>

      {isExpenseModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={handleOutsideClick}
        >
          <div
            className="bg-white w-full max-w-md sm:max-w-lg rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] border border-gray-100 transition-all duration-300 sm:w-auto"
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Add Expense</h3>
                <button
                  onClick={closeExpenseModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Close expense modal"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {showAmountWarning && (
                <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg flex items-start transition-all duration-300">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Warning</p>
                    <p className="text-xs text-yellow-700">
                      You are exceeding the allocated amount by ₹{Math.abs(remainingAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <p className="text-xs font-medium text-indigo-700 mb-1">Total Allocated Amount</p>
                <p className="text-2xl sm:text-3xl font-bold text-indigo-900">
                  ₹{expenseForm.total_amount.toFixed(2)}
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 mb-1">Project</p>
                    <p className="text-sm font-medium text-gray-800">
                      {expenseForm.project_name || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 mb-1">Site</p>
                    <p className="text-sm font-medium text-gray-800">
                      {expenseForm.site_name || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 mb-1">Date</p>
                    <p className="text-sm font-medium text-gray-800">{expenseForm.assign_date}</p>
                  </div>
                </div>

                <form onSubmit={handleExpenseSubmit} className="space-y-4 sm:space-y-6 pt-2">
                  <div>
                    <label
                      htmlFor="expense_category_id"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Expense Category
                    </label>
                    <div className="relative">
                      <select
                        id="expense_category_id"
                        name="expense_category_id"
                        value={expenseForm.expense_category_id}
                        onChange={handleExpenseInputChange}
                        className="w-full pl-3 pr-10 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white appearance-none transition-all duration-200 hover:border-indigo-300"
                        disabled={loading}
                        aria-required="true"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.exp_category}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="expense_detail_id"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Expense Detail
                    </label>
                    <div className="relative">
                      <select
                        id="expense_detail_id"
                        name="expense_detail_id"
                        value={expenseForm.expense_detail_id}
                        onChange={handleExpenseInputChange}
                        className="w-full pl-3 pr-10 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white appearance-none transition-all duration-200 hover:border-indigo-300"
                        disabled={loading || !expenseForm.expense_category_id}
                        aria-required="true"
                      >
                        <option value="">Select a detail</option>
                        {details.map((detail) => (
                          <option key={detail.id} value={detail.id}>
                            {detail.details}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (₹)
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">₹</span>
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        id="amount"
                        name="amount"
                        value={expenseForm.amount}
                        onChange={handleExpenseInputChange}
                        className="block w-full pl-7 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-all duration-200 hover:border-indigo-300"
                        placeholder="0.00"
                        disabled={loading}
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeExpenseModal}
                      className="px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                      aria-label="Cancel expense entry"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 sm:px-6 sm:py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
                      disabled={loading}
                      aria-label="Add expense"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Add Expense"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseEntry;















// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// ************************************************









