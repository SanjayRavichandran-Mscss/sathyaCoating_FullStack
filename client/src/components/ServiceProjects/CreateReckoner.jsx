// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Plus } from "lucide-react";

// const getRandomColor = (index) => {
//   const colors = [
//     "bg-blue-50 border-blue-200",
//     "bg-green-50 border-green-200",
//     "bg-yellow-50 border-yellow-200",
//     "bg-purple-50 border-purple-200",
//     "bg-pink-50 border-pink-200",
//     "bg-indigo-50 border-indigo-200",
//     "bg-teal-50 border-teal-200",
//     "bg-orange-50 border-orange-200",
//     "bg-cyan-50 border-cyan-200",
//     "bg-amber-50 border-amber-200",
//   ];
//   return colors[index % colors.length];
// };

// const initialFormData = {
//   poNumber: "",
//   siteId: "",
//   categories: [
//     {
//       categoryName: "",
//       categoryId: "",
//       subcategories: [
//         {
//           subcategoryName: "",
//           subcategoryId: "",
//           items: [
//             {
//               itemNo: "",
//               descId: "",
//               descName: "",
//               poQuantity: "",
//               unitOfMeasure: "",
//               rate: "",
//               value: "",
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// const CreateReckoner = ({ onShowCompanyModal, onShowProjectModal, selectedCompany, onCompanySelect, companies }) => {
//   const [formData, setFormData] = useState(initialFormData);
//   const [projects, setProjects] = useState([]);
//   const [sites, setSites] = useState([]);
//   const [selectedCompanyId, setSelectedCompanyId] = useState(selectedCompany || "");
//   const [selectedProject, setSelectedProject] = useState("");
//   const [selectedSite, setSelectedSite] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [workItems, setWorkItems] = useState([]);
//   const [loading, setLoading] = useState({
//     companies: false,
//     projects: false,
//     sites: false,
//     categories: false,
//     subcategories: false,
//     workItems: false,
//     submitting: false,
//     processing: false,
//   });

//   useEffect(() => {
//     setSelectedCompanyId(selectedCompany || "");
//   }, [selectedCompany]);

//   useEffect(() => {
//     if (selectedCompanyId) {
//       const fetchProjects = async () => {
//         try {
//           setLoading((prev) => ({ ...prev, projects: true }));
//           const response = await axios.get(`http://192.168.253.187:5000/reckoner/projects/${selectedCompanyId}`);
//           setProjects(response.data.data || []);
//           setSelectedProject("");
//           setSites([]);
//           setSelectedSite("");
//           setFormData((prev) => ({ ...prev, poNumber: "", siteId: "" }));
//         } catch (err) {
//           Swal.fire({
//             position: "top-end",
//             icon: "error",
//             title: "Failed to load projects",
//             text: err.response?.data?.message || "Please try again later",
//             showConfirmButton: false,
//             timer: 3000,
//             toast: true,
//             background: "#fef2f2",
//             iconColor: "#ef4444",
//           });
//         } finally {
//           setLoading((prev) => ({ ...prev, projects: false }));
//         }
//       };
//       fetchProjects();
//     } else {
//       setProjects([]);
//       setSelectedProject("");
//       setSites([]);
//       setSelectedSite("");
//       setFormData((prev) => ({ ...prev, poNumber: "", siteId: "" }));
//     }
//   }, [selectedCompanyId]);

//   useEffect(() => {
//     if (selectedProject) {
//       const fetchSites = async () => {
//         try {
//           setLoading((prev) => ({ ...prev, sites: true }));
//           const response = await axios.get(`http://192.168.253.187:5000/reckoner/sites-by-project/${selectedProject}`);
//           setSites(response.data.data || []);
//           setSelectedSite("");
//           setFormData((prev) => ({ ...prev, poNumber: "", siteId: "" }));
//         } catch (err) {
//           Swal.fire({
//             position: "top-end",
//             icon: "error",
//             title: "Failed to load sites",
//             text: err.response?.data?.message || "Please try again later",
//             showConfirmButton: false,
//             timer: 3000,
//             toast: true,
//             background: "#fef2f2",
//             iconColor: "#ef4444",
//           });
//         } finally {
//           setLoading((prev) => ({ ...prev, sites: false }));
//         }
//       };
//       fetchSites();
//     } else {
//       setSites([]);
//       setSelectedSite("");
//       setFormData((prev) => ({ ...prev, poNumber: "", siteId: "" }));
//     }
//   }, [selectedProject]);

//   useEffect(() => {
//     if (selectedSite) {
//       const selectedSiteData = sites.find((site) => site.site_id === selectedSite);
//       if (selectedSiteData) {
//         setFormData((prev) => ({
//           ...prev,
//           poNumber: selectedSiteData.po_number || "",
//           siteId: selectedSiteData.site_id || "",
//         }));
//       }
//     }
//   }, [selectedSite, sites]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading((prev) => ({ ...prev, categories: true }));
//         const categoriesRes = await axios.get("http://192.168.253.187:5000/reckoner/categories");
//         setCategories(categoriesRes.data.data || []);

//         setLoading((prev) => ({ ...prev, subcategories: true }));
//         const subcategoriesRes = await axios.get("http://192.168.253.187:5000/reckoner/subcategories");
//         setSubcategories(subcategoriesRes.data.data || []);

//         setLoading((prev) => ({ ...prev, workItems: true }));
//         const workItemsRes = await axios.get("http://192.168.253.187:5000/reckoner/work-items");
//         setWorkItems(workItemsRes.data.data || []);
//       } catch (err) {
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Failed to load data",
//           text: err.response?.data?.message || "Please try again later",
//           showConfirmButton: false,
//           timer: 3000,
//           toast: true,
//           background: "#fef2f2",
//           iconColor: "#ef4444",
//         });
//       } finally {
//         setLoading((prev) => ({
//           ...prev,
//           categories: false,
//           subcategories: false,
//           workItems: false,
//         }));
//       }
//     };
//     fetchData();
//   }, []);

//   const handleCompanyChange = (e) => {
//     const newCompanyId = e.target.value;
//     setSelectedCompanyId(newCompanyId);
//     if (onCompanySelect) {
//       onCompanySelect(newCompanyId);
//     }
//   };

//   const handleCategoryChange = (categoryIndex, e) => {
//     const categoryName = e.target.value;
//     const selectedCategory = categories.find((cat) => cat.category_name === categoryName);

//     setFormData((prev) => {
//       const newCategories = [...prev.categories];
//       newCategories[categoryIndex] = {
//         ...newCategories[categoryIndex],
//         categoryName,
//         categoryId: selectedCategory?.category_id || "",
//         subcategories: [
//           {
//             subcategoryName: "",
//             subcategoryId: "",
//             items: [
//               {
//                 itemNo: "",
//                 descId: "",
//                 descName: "",
//                 poQuantity: "",
//                 unitOfMeasure: "",
//                 rate: "",
//                 value: "",
//               },
//             ],
//           },
//         ],
//       };
//       return { ...prev, categories: newCategories };
//     });
//   };

//   const handleSubcategoryNameChange = (categoryIndex, subcatIndex, name) => {
//     const selectedSubcat = subcategories.find((sc) => sc.subcategory_name === name);

//     setFormData((prev) => {
//       const newCategories = [...prev.categories];
//       const newSubcategories = [...newCategories[categoryIndex].subcategories];
//       newSubcategories[subcatIndex] = {
//         ...newSubcategories[subcatIndex],
//         subcategoryName: name,
//         subcategoryId: selectedSubcat?.subcategory_id || "",
//         items: [
//           {
//             itemNo: "",
//             descId: "",
//             descName: "",
//             poQuantity: "",
//             unitOfMeasure: "",
//             rate: "",
//             value: "",
//           },
//         ],
//       };
//       newCategories[categoryIndex].subcategories = newSubcategories;
//       return { ...prev, categories: newCategories };
//     });
//   };

//   const handleItemDescriptionChange = (categoryIndex, subcatIndex, itemIndex, value) => {
//     const selectedItem = workItems.find((item) => item.desc_name === value);

//     setFormData((prev) => {
//       const newCategories = [...prev.categories];
//       const newSubcategories = [...newCategories[categoryIndex].subcategories];
//       const newItems = [...newSubcategories[subcatIndex].items];
//       newItems[itemIndex] = {
//         ...newItems[itemIndex],
//         descName: value,
//         descId: selectedItem?.desc_id || "",
//         unitOfMeasure: selectedItem?.unit_of_measure || "",
//       };
//       newSubcategories[subcatIndex].items = newItems;
//       newCategories[categoryIndex].subcategories = newSubcategories;
//       return { ...prev, categories: newCategories };
//     });
//   };

//   const handleItemChange = (categoryIndex, subcatIndex, itemIndex, e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => {
//       const newCategories = [...prev.categories];
//       const newSubcategories = [...newCategories[categoryIndex].subcategories];
//       const newItems = [...newSubcategories[subcatIndex].items];

//       newItems[itemIndex] = {
//         ...newItems[itemIndex],
//         [name]: value,
//       };

//       if (name === "poQuantity" || name === "rate") {
//         const quantity = name === "poQuantity" ? value : newItems[itemIndex].poQuantity;
//         const rate = name === "rate" ? value : newItems[itemIndex].rate;
//         newItems[itemIndex].value = (parseFloat(quantity || 0) * parseFloat(rate || 0)).toFixed(2);
//       }

//       newSubcategories[subcatIndex].items = newItems;
//       newCategories[categoryIndex].subcategories = newSubcategories;
//       return { ...prev, categories: newCategories };
//     });
//   };

//   const addCategory = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setFormData((prev) => ({
//       ...prev,
//       categories: [
//         ...prev.categories,
//         {
//           categoryName: "",
//           categoryId: "",
//           subcategories: [
//             {
//               subcategoryName: "",
//               subcategoryId: "",
//               items: [
//                 {
//                   itemNo: "",
//                   descId: "",
//                   descName: "",
//                   poQuantity: "",
//                   unitOfMeasure: "",
//                   rate: "",
//                   value: "",
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     }));
//   };

//   const removeCategory = (index) => {
//     if (formData.categories.length > 1) {
//       setFormData((prev) => ({
//         ...prev,
//         categories: prev.categories.filter((_, i) => i !== index),
//       }));
//     }
//   };

//   const addSubcategory = (categoryIndex, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setFormData((prev) => {
//       const newCategories = [...prev.categories];
//       newCategories[categoryIndex].subcategories = [
//         ...newCategories[categoryIndex].subcategories,
//         {
//           subcategoryName: "",
//           subcategoryId: "",
//           items: [
//             {
//               itemNo: "",
//               descId: "",
//               descName: "",
//               poQuantity: "",
//               unitOfMeasure: "",
//               rate: "",
//               value: "",
//             },
//           ],
//         },
//       ];
//       return { ...prev, categories: newCategories };
//     });
//   };

//   const removeSubcategory = (categoryIndex, subcatIndex) => {
//     if (formData.categories[categoryIndex].subcategories.length > 1) {
//       setFormData((prev) => {
//         const newCategories = [...prev.categories];
//         newCategories[categoryIndex].subcategories = newCategories[categoryIndex].subcategories.filter(
//           (_, i) => i !== subcatIndex
//         );
//         return { ...prev, categories: newCategories };
//       });
//     }
//   };

//   const addItemRow = (categoryIndex, subcatIndex, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setFormData((prev) => {
//       const newCategories = [...prev.categories];
//       const newSubcategories = [...newCategories[categoryIndex].subcategories];
//       newSubcategories[subcatIndex].items = [
//         ...newSubcategories[subcatIndex].items,
//         {
//           itemNo: "",
//           descId: "",
//           descName: "",
//           poQuantity: "",
//           unitOfMeasure: "",
//           rate: "",
//           value: "",
//         },
//       ];
//       newCategories[categoryIndex].subcategories = newSubcategories;
//       return { ...prev, categories: newCategories };
//     });
//   };

//   const removeItemRow = (categoryIndex, subcatIndex, itemIndex) => {
//     if (formData.categories[categoryIndex].subcategories[subcatIndex].items.length > 1) {
//       setFormData((prev) => {
//         const newCategories = [...prev.categories];
//         const newSubcategories = [...newCategories[categoryIndex].subcategories];
//         newSubcategories[subcatIndex].items = newSubcategories[subcatIndex].items.filter(
//           (_, i) => i !== itemIndex
//         );
//         newCategories[categoryIndex].subcategories = newSubcategories;
//         return { ...prev, categories: newCategories };
//       });
//     }
//   };

//   const processSite = async (poNumber) => {
//     try {
//       setLoading((prev) => ({ ...prev, processing: true }));
//       await axios.get(`http://192.168.253.187:5000/sheet/process/${encodeURIComponent(poNumber)}`);
//       return true;
//     } catch (error) {
//       console.error("Error processing site:", error);
//       return false;
//     } finally {
//       setLoading((prev) => ({ ...prev, processing: false }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading((prev) => ({ ...prev, submitting: true }));

//       if (!formData.siteId) {
//         throw new Error("Please select a site.");
//       }
//       for (const category of formData.categories) {
//         if (!category.categoryId) {
//           throw new Error("All categories must be selected.");
//         }
//         for (const subcategory of category.subcategories) {
//           if (!subcategory.subcategoryId) {
//             throw new Error("All subcategories must be selected.");
//           }
//           for (const item of subcategory.items) {
//             if (
//               !item.itemNo ||
//               !item.descId ||
//               !item.descName ||
//               !item.poQuantity ||
//               !item.unitOfMeasure ||
//               !item.rate
//             ) {
//               throw new Error("All item fields must be filled.");
//             }
//           }
//         }
//       }

//       const submissionData = {
//         poNumber: formData.poNumber,
//         siteId: formData.siteId,
//         categories: formData.categories.map((category) => ({
//           categoryId: category.categoryId,
//           subcategories: category.subcategories.map((subcategory) => ({
//             subcategoryId: subcategory.subcategoryId,
//             items: subcategory.items.map((item) => ({
//               itemId: item.itemNo,
//               descId: item.descId,
//               poQuantity: item.poQuantity,
//               uom: item.unitOfMeasure,
//               rate: item.rate,
//               value: item.value,
//             })),
//           })),
//         })),
//       };

//       await axios.post("http://192.168.253.187:5000/reckoner/reckoner", submissionData);
//       await processSite(formData.poNumber);

//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Reckoner created successfully!",
//         showConfirmButton: false,
//         timer: 3000,
//         toast: true,
//         background: "#ecfdf5",
//         iconColor: "#10b981",
//       });

//       setFormData(initialFormData);
//       setSelectedCompanyId("");
//       setSelectedProject("");
//       setSelectedSite("");
//       if (onCompanySelect) {
//         onCompanySelect("");
//       }
//     } catch (err) {
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Submission failed",
//         text: err.message || err.response?.data?.message || "Please try again",
//         showConfirmButton: false,
//         timer: 3000,
//         toast: true,
//         background: "#fef2f2",
//         iconColor: "#ef4444",
//       });
//     } finally {
//       setLoading((prev) => ({ ...prev, submitting: false }));
//     }
//   };

//   const handlePlusClick = (type) => {
//     if (type === "company") {
//       onShowCompanyModal();
//     } else if (type === "site") {
//       if (selectedCompanyId) {
//         onShowProjectModal();
//       } else {
//         Swal.fire({
//           position: "top-end",
//           icon: "warning",
//           title: "Select a company first",
//           showConfirmButton: false,
//           timer: 2000,
//           toast: true,
//           background: "#fefce8",
//           iconColor: "#facc15",
//         });
//       }
//     }
//   };

//   return (
//     <div className="flex justify-center items-start min-h-screen bg-gray-50">
//       <div className="container max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/70 transform transition-all duration-500 animate-slide-in-right">
//         <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-200">
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Create Reckoner</h1>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div>
//               <div className="flex items-center justify-between mb-1">
//                 <label className="text-sm font-semibold text-gray-700">Select Company</label>
//                 <button
//                   onClick={() => handlePlusClick("company")}
//                   className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   aria-label="Create New Company"
//                   title="Create New Company"
//                 >
//                   <Plus size={20} />
//                 </button>
//               </div>
//               <select
//                 value={selectedCompanyId}
//                 onChange={handleCompanyChange}
//                 className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
//                 disabled={loading.companies}
//               >
//                 <option value="">Select Company</option>
//                 {companies.map((company) => (
//                   <option key={company.company_id} value={company.company_id}>
//                     {company.company_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <div className="flex items-center justify-between mb-1">
//                 <label className="text-sm font-semibold text-gray-700">Select Project</label>
//               </div>
//               <select
//                 value={selectedProject}
//                 onChange={(e) => setSelectedProject(e.target.value)}
//                 className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
//                 disabled={loading.projects || !selectedCompanyId}
//               >
//                 <option value="">Select Project</option>
//                 {projects.map((project) => (
//                   <option key={project.pd_id} value={project.pd_id}>
//                     {project.project_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <div className="flex items-center justify-between mb-1">
//                 <label className="text-sm font-semibold text-gray-700">Select Site</label>
//                 <button
//                   onClick={() => handlePlusClick("site")}
//                   className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   aria-label="Create New Site"
//                   title="Create New Site"
//                 >
//                   <Plus size={20} />
//                 </button>
//               </div>
//               <select
//                 value={selectedSite}
//                 onChange={(e) => setSelectedSite(e.target.value)}
//                 className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
//                 disabled={loading.sites || !selectedProject}
//               >
//                 <option value="">Select Site</option>
//                 {sites.map((site) => (
//                   <option key={site.site_id} value={site.site_id}>
//                     {site.site_name} (PO: {site.po_number})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <input type="hidden" name="poNumber" value={formData.poNumber} />
//           <input type="hidden" name="siteId" value={formData.siteId} />

//           <div className="space-y-6">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//               <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
//               <button
//                 type="button"
//                 onClick={addCategory}
//                 className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
//               >
//                 <svg
//                   className="w-4 h-4 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//                 Add Category
//               </button>
//             </div>

//             {formData.categories.map((category, categoryIndex) => (
//               <div
//                 key={categoryIndex}
//                 className={`border rounded-lg p-4 space-y-4 ${getRandomColor(categoryIndex)} border-2`}
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
//                     <select
//                       name="categoryName"
//                       value={category.categoryName}
//                       onChange={(e) => handleCategoryChange(categoryIndex, e)}
//                       className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
//                       required
//                       disabled={loading.categories}
//                     >
//                       <option value="">Select Category</option>
//                       {categories.map((cat) => (
//                         <option key={cat.category_id} value={cat.category_name}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="flex items-end justify-end">
//                     {formData.categories.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => removeCategory(categoryIndex)}
//                         className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
//                       >
//                         Remove Category
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {category.categoryName && (
//                   <div className="space-y-6 mt-4">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                       <h3 className="text-md font-semibold text-gray-700">Subcategories</h3>
//                       <button
//                         type="button"
//                         onClick={(e) => addSubcategory(categoryIndex, e)}
//                         className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
//                       >
//                         <svg
//                           className="w-4 h-4 mr-2"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                           />
//                         </svg>
//                         Add Subcategory
//                       </button>
//                     </div>

//                     {category.subcategories.map((subcategory, subcatIndex) => (
//                       <div
//                         key={subcatIndex}
//                         className={`border rounded-lg p-4 space-y-4 ${getRandomColor(subcatIndex + 1)} border-2`}
//                       >
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                               Subcategory Name
//                             </label>
//                             <select
//                               value={subcategory.subcategoryName}
//                               onChange={(e) =>
//                                 handleSubcategoryNameChange(categoryIndex, subcatIndex, e.target.value)
//                               }
//                               className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
//                               required
//                               disabled={loading.subcategories}
//                             >
//                               <option value="">Select Subcategory</option>
//                               {subcategories.map((subcat) => (
//                                 <option key={subcat.subcategory_id} value={subcat.subcategory_name}>
//                                   {subcat.subcategory_name}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                           <div className="flex items-end justify-end">
//                             {category.subcategories.length > 1 && (
//                               <button
//                                 type="button"
//                                 onClick={() => removeSubcategory(categoryIndex, subcatIndex)}
//                                 className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
//                               >
//                                 Remove Subcategory
//                               </button>
//                             )}
//                           </div>
//                         </div>

//                         {subcategory.subcategoryName && (
//                           <div className="mt-4">
//                             <h4 className="text-md font-semibold mb-3 text-gray-700">Items</h4>
//                             <div className="overflow-x-auto">
//                               <table className="min-w-full divide-y divide-gray-200">
//                                 <thead className={`${getRandomColor(subcatIndex + 2)}`}>
//                                   <tr>
//                                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                       Item No
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                       Description
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                       Qty
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                       UOM
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                       Rate
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                       Value
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                       Actions
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-gray-200">
//                                   {subcategory.items.map((item, itemIndex) => (
//                                     <tr
//                                       key={itemIndex}
//                                       className={itemIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                                     >
//                                       <td className="px-3 py-2 whitespace-nowrap">
//                                         <input
//                                           type="text"
//                                           name="itemNo"
//                                           value={item.itemNo}
//                                           onChange={(e) =>
//                                             handleItemChange(categoryIndex, subcatIndex, itemIndex, e)
//                                           }
//                                           className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
//                                           required
//                                           placeholder="Item No"
//                                         />
//                                       </td>
//                                       <td className="px-3 py-2 whitespace-nowrap">
//                                         <select
//                                           name="descName"
//                                           value={item.descName}
//                                           onChange={(e) =>
//                                             handleItemDescriptionChange(
//                                               categoryIndex,
//                                               subcatIndex,
//                                               itemIndex,
//                                               e.target.value
//                                             )
//                                           }
//                                           className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
//                                           required
//                                           disabled={loading.workItems}
//                                         >
//                                           <option value="">Select Description</option>
//                                           {workItems.map((item) => (
//                                             <option key={item.desc_id} value={item.desc_name}>
//                                               {item.desc_name}
//                                             </option>
//                                           ))}
//                                         </select>
//                                       </td>
//                                       <td className="px-3 py-2 whitespace-nowrap">
//                                         <input
//                                           type="number"
//                                           name="poQuantity"
//                                           value={item.poQuantity}
//                                           onChange={(e) =>
//                                             handleItemChange(categoryIndex, subcatIndex, itemIndex, e)
//                                           }
//                                           className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
//                                           required
//                                           min="0"
//                                           step="0.01"
//                                           placeholder="Qty"
//                                         />
//                                       </td>
//                                       <td className="px-3 py-2 whitespace-nowrap">
//                                         <input
//                                           type="text"
//                                           name="unitOfMeasure"
//                                           value={item.unitOfMeasure}
//                                           onChange={(e) =>
//                                             handleItemChange(categoryIndex, subcatIndex, itemIndex, e)
//                                           }
//                                           className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
//                                           required
//                                           placeholder="UOM"
//                                         />
//                                       </td>
//                                       <td className="px-3 py-2 whitespace-nowrap">
//                                         <input
//                                           type="number"
//                                           name="rate"
//                                           value={item.rate}
//                                           onChange={(e) =>
//                                             handleItemChange(categoryIndex, subcatIndex, itemIndex, e)
//                                           }
//                                           className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
//                                           required
//                                           min="0"
//                                           step="0.01"
//                                           placeholder="Rate"
//                                         />
//                                       </td>
//                                       <td className="px-3 py-2 whitespace-nowrap">
//                                         <input
//                                           type="text"
//                                           name="value"
//                                           value={item.value}
//                                           readOnly
//                                           className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-gray-100 text-sm"
//                                         />
//                                       </td>
//                                       <td className="px-3 py-2 whitespace-nowrap">
//                                         <button
//                                           type="button"
//                                           onClick={() => removeItemRow(categoryIndex, subcatIndex, itemIndex)}
//                                           className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
//                                           disabled={subcategory.items.length <= 1}
//                                         >
//                                           Remove
//                                         </button>
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </tbody>
//                               </table>
//                             </div>
//                             <div className="mt-3">
//                               <button
//                                 type="button"
//                                 onClick={(e) => addItemRow(categoryIndex, subcatIndex, e)}
//                                 className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
//                               >
//                                 <svg
//                                   className="w-4 h-4 mr-2"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                                   />
//                                 </svg>
//                                 Add Item
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="pt-4 flex justify-end">
//             <button
//               type="submit"
//               className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
//               disabled={loading.submitting || loading.processing}
//             >
//               {loading.submitting ? (
//                 <>
//                   <svg
//                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Submitting...
//                 </>
//               ) : loading.processing ? (
//                 <>
//                   <svg
//                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : (
//                 "Submit"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateReckoner;
























import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Plus } from "lucide-react";

const getRandomColor = (index) => {
  const colors = [
    "bg-blue-50 border-blue-200",
    "bg-green-50 border-green-200",
    "bg-yellow-50 border-yellow-200",
    "bg-purple-50 border-purple-200",
    "bg-pink-50 border-pink-200",
    "bg-indigo-50 border-indigo-200",
    "bg-teal-50 border-teal-200",
    "bg-orange-50 border-orange-200",
    "bg-cyan-50 border-cyan-200",
    "bg-amber-50 border-amber-200",
  ];
  return colors[index % colors.length];
};

const initialFormData = {
  poNumber: "",
  siteId: "",
  categories: [
    {
      categoryName: "",
      categoryId: "",
      subcategories: [
        {
          subcategoryName: "",
          subcategoryId: "",
          items: [
            {
              itemNo: "",
              descId: "",
              descName: "",
              poQuantity: "",
              unitOfMeasure: "",
              rate: "",
              value: "",
            },
          ],
        },
      ],
    },
  ],
};

const CreateReckoner = ({ onShowCompanyModal, onShowProjectModal, selectedCompany, onCompanySelect, companies }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(selectedCompany || "");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState({
    companies: false,
    projects: false,
    sites: false,
    categories: false,
    subcategories: false,
    workItems: false,
    submitting: false,
    processing: false,
  });

  useEffect(() => {
    setSelectedCompanyId(selectedCompany || "");
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedCompanyId) {
      const fetchProjects = async () => {
        try {
          setLoading((prev) => ({ ...prev, projects: true }));
          const response = await axios.get(`http://192.168.253.187:5000/reckoner/projects/${selectedCompanyId}`);
          setProjects(response.data.data || []);
          setSelectedProject("");
          setSites([]);
          setSelectedSite("");
          setFormData((prev) => ({ ...prev, poNumber: "", siteId: "" }));
        } catch (err) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Failed to load projects",
            text: err.response?.data?.message || "Please try again later",
            showConfirmButton: false,
            timer: 3000,
            toast: true,
            background: "#fef2f2",
            iconColor: "#ef4444",
          });
        } finally {
          setLoading((prev) => ({ ...prev, projects: false }));
        }
      };
      fetchProjects();
    } else {
      setProjects([]);
      setSelectedProject("");
      setSites([]);
      setSelectedSite("");
      setFormData((prev) => ({ ...prev, poNumber: "", siteId: "" }));
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    if (selectedProject) {
      const fetchSites = async () => {
        try {
          setLoading((prev) => ({ ...prev, sites: true }));
          const response = await axios.get(`http://192.168.253.187:5000/reckoner/sites-by-project/${selectedProject}`);
          setSites(response.data.data || []);
          setSelectedSite("");
          setFormData((prev) => ({ ...prev, poNumber: "", siteId: "" }));
        } catch (err) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Failed to load sites",
            text: err.response?.data?.message || "Please try again later",
            showConfirmButton: false,
            timer: 3000,
            toast: true,
            background: "#fef2f2",
            iconColor: "#ef4444",
          });
        } finally {
          setLoading((prev) => ({ ...prev, sites: false }));
        }
      };
      fetchSites();
    } else {
      setSites([]);
      setSelectedSite("");
      setFormData((prev) => ({ ...prev, poNumber: "", siteId: "" }));
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedSite) {
      const selectedSiteData = sites.find((site) => site.site_id === selectedSite);
      if (selectedSiteData) {
        setFormData((prev) => ({
          ...prev,
          poNumber: selectedSiteData.po_number || "",
          siteId: selectedSiteData.site_id || "",
        }));
      }
    }
  }, [selectedSite, sites]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading((prev) => ({ ...prev, categories: true }));
        const categoriesRes = await axios.get("http://192.168.253.187:5000/reckoner/categories");
        setCategories(categoriesRes.data.data || []);

        setLoading((prev) => ({ ...prev, subcategories: true }));
        const subcategoriesRes = await axios.get("http://192.168.253.187:5000/reckoner/subcategories");
        setSubcategories(subcategoriesRes.data.data || []);

        setLoading((prev) => ({ ...prev, workItems: true }));
        const workItemsRes = await axios.get("http://192.168.253.187:5000/reckoner/work-items");
        setWorkItems(workItemsRes.data.data || []);
      } catch (err) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Failed to load data",
          text: err.response?.data?.message || "Please try again later",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
          background: "#fef2f2",
          iconColor: "#ef4444",
        });
      } finally {
        setLoading((prev) => ({
          ...prev,
          categories: false,
          subcategories: false,
          workItems: false,
        }));
      }
    };
    fetchData();
  }, []);

  const handleCompanyChange = async (e) => {
    const value = e.target.value;
    if (value === "create_new_company") {
      onShowCompanyModal();
    } else {
      setSelectedCompanyId(value);
      if (onCompanySelect) {
        onCompanySelect(value);
      }
    }
  };

  const handleProjectChange = async (e) => {
    const value = e.target.value;
    if (value === "create_new_project") {
      if (!selectedCompanyId) {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "Select a company first",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
          background: "#fefce8",
          iconColor: "#facc15",
        });
        return;
      }
      Swal.fire({
        title: "Create New Project",
        input: "text",
        inputLabel: "Project Name",
        inputPlaceholder: "Enter project name",
        showCancelButton: true,
        confirmButtonText: "Create",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value) {
            return "Project name is required!";
          }
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.post("http://192.168.253.187:5000/project/create-project", {
              company_id: selectedCompanyId,
              project_name: result.value,
            });
            const newProject = { pd_id: response.data.project_id, project_name: result.value };
            setProjects((prev) => [...prev, newProject]);
            setSelectedProject(newProject.pd_id);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Project created successfully!",
              showConfirmButton: false,
              timer: 2000,
              toast: true,
              background: "#ecfdf5",
              iconColor: "#10b981",
            });
          } catch (err) {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Failed to create project",
              text: err.response?.data?.error || "Please try again",
              showConfirmButton: false,
              timer: 3000,
              toast: true,
              background: "#fef2f2",
              iconColor: "#ef4444",
            });
          }
        }
      });
    } else {
      setSelectedProject(value);
    }
  };

  const handleSiteChange = (e) => {
    const value = e.target.value;
    if (value === "create_new_site") {
      if (!selectedCompanyId) {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "Select a company first",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
          background: "#fefce8",
          iconColor: "#facc15",
        });
        return;
      }
      onShowProjectModal();
    } else {
      setSelectedSite(value);
    }
  };

  const handleCategoryChange = (categoryIndex, e) => {
    const categoryName = e.target.value;
    const selectedCategory = categories.find((cat) => cat.category_name === categoryName);

    setFormData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex] = {
        ...newCategories[categoryIndex],
        categoryName,
        categoryId: selectedCategory?.category_id || "",
        subcategories: [
          {
            subcategoryName: "",
            subcategoryId: "",
            items: [
              {
                itemNo: "",
                descId: "",
                descName: "",
                poQuantity: "",
                unitOfMeasure: "",
                rate: "",
                value: "",
              },
            ],
          },
        ],
      };
      return { ...prev, categories: newCategories };
    });
  };

  const handleSubcategoryNameChange = (categoryIndex, subcatIndex, name) => {
    const selectedSubcat = subcategories.find((sc) => sc.subcategory_name === name);

    setFormData((prev) => {
      const newCategories = [...prev.categories];
      const newSubcategories = [...newCategories[categoryIndex].subcategories];
      newSubcategories[subcatIndex] = {
        ...newSubcategories[subcatIndex],
        subcategoryName: name,
        subcategoryId: selectedSubcat?.subcategory_id || "",
        items: [
          {
            itemNo: "",
            descId: "",
            descName: "",
            poQuantity: "",
            unitOfMeasure: "",
            rate: "",
            value: "",
          },
        ],
      };
      newCategories[categoryIndex].subcategories = newSubcategories;
      return { ...prev, categories: newCategories };
    });
  };

  const handleItemDescriptionChange = (categoryIndex, subcatIndex, itemIndex, value) => {
    const selectedItem = workItems.find((item) => item.desc_name === value);

    setFormData((prev) => {
      const newCategories = [...prev.categories];
      const newSubcategories = [...newCategories[categoryIndex].subcategories];
      const newItems = [...newSubcategories[subcatIndex].items];
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        descName: value,
        descId: selectedItem?.desc_id || "",
        unitOfMeasure: selectedItem?.unit_of_measure || "",
      };
      newSubcategories[subcatIndex].items = newItems;
      newCategories[categoryIndex].subcategories = newSubcategories;
      return { ...prev, categories: newCategories };
    });
  };

  const handleItemChange = (categoryIndex, subcatIndex, itemIndex, e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newCategories = [...prev.categories];
      const newSubcategories = [...newCategories[categoryIndex].subcategories];
      const newItems = [...newSubcategories[subcatIndex].items];

      newItems[itemIndex] = {
        ...newItems[itemIndex],
        [name]: value,
      };

      if (name === "poQuantity" || name === "rate") {
        const quantity = name === "poQuantity" ? value : newItems[itemIndex].poQuantity;
        const rate = name === "rate" ? value : newItems[itemIndex].rate;
        newItems[itemIndex].value = (parseFloat(quantity || 0) * parseFloat(rate || 0)).toFixed(2);
      }

      newSubcategories[subcatIndex].items = newItems;
      newCategories[categoryIndex].subcategories = newSubcategories;
      return { ...prev, categories: newCategories };
    });
  };

  const addCategory = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          categoryName: "",
          categoryId: "",
          subcategories: [
            {
              subcategoryName: "",
              subcategoryId: "",
              items: [
                {
                  itemNo: "",
                  descId: "",
                  descName: "",
                  poQuantity: "",
                  unitOfMeasure: "",
                  rate: "",
                  value: "",
                },
              ],
            },
          ],
        },
      ],
    }));
  };

  const removeCategory = (index) => {
    if (formData.categories.length > 1) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((_, i) => i !== index),
      }));
    }
  };

  const addSubcategory = (categoryIndex, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex].subcategories = [
        ...newCategories[categoryIndex].subcategories,
        {
          subcategoryName: "",
          subcategoryId: "",
          items: [
            {
              itemNo: "",
              descId: "",
              descName: "",
              poQuantity: "",
              unitOfMeasure: "",
              rate: "",
              value: "",
            },
          ],
        },
      ];
      return { ...prev, categories: newCategories };
    });
  };

  const removeSubcategory = (categoryIndex, subcatIndex) => {
    if (formData.categories[categoryIndex].subcategories.length > 1) {
      setFormData((prev) => {
        const newCategories = [...prev.categories];
        newCategories[categoryIndex].subcategories = newCategories[categoryIndex].subcategories.filter(
          (_, i) => i !== subcatIndex
        );
        return { ...prev, categories: newCategories };
      });
    }
  };

  const addItemRow = (categoryIndex, subcatIndex, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData((prev) => {
      const newCategories = [...prev.categories];
      const newSubcategories = [...newCategories[categoryIndex].subcategories];
      newSubcategories[subcatIndex].items = [
        ...newSubcategories[subcatIndex].items,
        {
          itemNo: "",
          descId: "",
          descName: "",
          poQuantity: "",
          unitOfMeasure: "",
          rate: "",
          value: "",
        },
      ];
      newCategories[categoryIndex].subcategories = newSubcategories;
      return { ...prev, categories: newCategories };
    });
  };

  const removeItemRow = (categoryIndex, subcatIndex, itemIndex) => {
    if (formData.categories[categoryIndex].subcategories[subcatIndex].items.length > 1) {
      setFormData((prev) => {
        const newCategories = [...prev.categories];
        const newSubcategories = [...newCategories[categoryIndex].subcategories];
        newSubcategories[subcatIndex].items = newSubcategories[subcatIndex].items.filter(
          (_, i) => i !== itemIndex
        );
        newCategories[categoryIndex].subcategories = newSubcategories;
        return { ...prev, categories: newCategories };
      });
    }
  };

  const processSite = async (poNumber) => {
    try {
      setLoading((prev) => ({ ...prev, processing: true }));
      await axios.get(`http://192.168.253.187:5000/sheet/process/${encodeURIComponent(poNumber)}`);
      return true;
    } catch (error) {
      console.error("Error processing site:", error);
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, processing: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, submitting: true }));

      if (!formData.siteId) {
        throw new Error("Please select a site.");
      }
      for (const category of formData.categories) {
        if (!category.categoryId) {
          throw new Error("All categories must be selected.");
        }
        for (const subcategory of category.subcategories) {
          if (!subcategory.subcategoryId) {
            throw new Error("All subcategories must be selected.");
          }
          for (const item of subcategory.items) {
            if (
              !item.itemNo ||
              !item.descId ||
              !item.descName ||
              !item.poQuantity ||
              !item.unitOfMeasure ||
              !item.rate
            ) {
              throw new Error("All item fields must be filled.");
            }
          }
        }
      }

      const submissionData = {
        poNumber: formData.poNumber,
        siteId: formData.siteId,
        categories: formData.categories.map((category) => ({
          categoryId: category.categoryId,
          subcategories: category.subcategories.map((subcategory) => ({
            subcategoryId: subcategory.subcategoryId,
            items: subcategory.items.map((item) => ({
              itemId: item.itemNo,
              descId: item.descId,
              poQuantity: item.poQuantity,
              uom: item.unitOfMeasure,
              rate: item.rate,
              value: item.value,
            })),
          })),
        })),
      };

      await axios.post("http://192.168.253.187:5000/reckoner/reckoner", submissionData);
      await processSite(formData.poNumber);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Reckoner created successfully!",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });

      setFormData(initialFormData);
      setSelectedCompanyId("");
      setSelectedProject("");
      setSelectedSite("");
      if (onCompanySelect) {
        onCompanySelect("");
      }
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Submission failed",
        text: err.message || err.response?.data?.message || "Please try again",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#fef2f2",
        iconColor: "#ef4444",
      });
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50">
      <div className="container max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/70 transform transition-all duration-500 animate-slide-in-right">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-200">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Create Reckoner</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Select Company</label>
              <select
                value={selectedCompanyId}
                onChange={handleCompanyChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
                disabled={loading.companies}
              >
                <option value="">Select Company</option>
                <option value="create_new_company">Create New Company</option>
                {companies.map((company) => (
                  <option key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Select Project</label>
              <select
                value={selectedProject}
                onChange={handleProjectChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
                disabled={loading.projects || !selectedCompanyId}
              >
                <option value="">Select Project</option>
                <option value="create_new_project">Create New Project</option>
                {projects.map((project) => (
                  <option key={project.pd_id} value={project.pd_id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Select Site</label>
              <select
                value={selectedSite}
                onChange={handleSiteChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
                disabled={loading.sites || !selectedProject}
              >
                <option value="">Select Site</option>
                <option value="create_new_site">Create New Site</option>
                {sites.map((site) => (
                  <option key={site.site_id} value={site.site_id}>
                    {site.site_name} (PO: {site.po_number})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="poNumber" value={formData.poNumber} />
          <input type="hidden" name="siteId" value={formData.siteId} />

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
              <button
                type="button"
                onClick={addCategory}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </button>
            </div>

            {formData.categories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className={`border rounded-lg p-4 space-y-4 ${getRandomColor(categoryIndex)} border-2`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
                    <select
                      name="categoryName"
                      value={category.categoryName}
                      onChange={(e) => handleCategoryChange(categoryIndex, e)}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
                      required
                      disabled={loading.categories}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_name}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end justify-end">
                    {formData.categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCategory(categoryIndex)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                      >
                        Remove Category
                      </button>
                    )}
                  </div>
                </div>

                {category.categoryName && (
                  <div className="space-y-6 mt-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <h3 className="text-md font-semibold text-gray-700">Subcategories</h3>
                      <button
                        type="button"
                        onClick={(e) => addSubcategory(categoryIndex, e)}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Subcategory
                      </button>
                    </div>

                    {category.subcategories.map((subcategory, subcatIndex) => (
                      <div
                        key={subcatIndex}
                        className={`border rounded-lg p-4 space-y-4 ${getRandomColor(subcatIndex + 1)} border-2`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Subcategory Name
                            </label>
                            <select
                              value={subcategory.subcategoryName}
                              onChange={(e) =>
                                handleSubcategoryNameChange(categoryIndex, subcatIndex, e.target.value)
                              }
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
                              required
                              disabled={loading.subcategories}
                            >
                              <option value="">Select Subcategory</option>
                              {subcategories.map((subcat) => (
                                <option key={subcat.subcategory_id} value={subcat.subcategory_name}>
                                  {subcat.subcategory_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-end justify-end">
                            {category.subcategories.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSubcategory(categoryIndex, subcatIndex)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                              >
                                Remove Subcategory
                              </button>
                            )}
                          </div>
                        </div>

                        {subcategory.subcategoryName && (
                          <div className="mt-4">
                            <h4 className="text-md font-semibold mb-3 text-gray-700">Items</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className={`${getRandomColor(subcatIndex + 2)}`}>
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                      Item No
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                      Description
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                      Qty
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                      UOM
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                      Rate
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                      Value
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {subcategory.items.map((item, itemIndex) => (
                                    <tr
                                      key={itemIndex}
                                      className={itemIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                    >
                                      <td className="px-3 py-2 whitespace-nowrap">
                                        <input
                                          type="text"
                                          name="itemNo"
                                          value={item.itemNo}
                                          onChange={(e) =>
                                            handleItemChange(categoryIndex, subcatIndex, itemIndex, e)
                                          }
                                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
                                          required
                                          placeholder="Item No"
                                        />
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap">
                                        <select
                                          name="descName"
                                          value={item.descName}
                                          onChange={(e) =>
                                            handleItemDescriptionChange(
                                              categoryIndex,
                                              subcatIndex,
                                              itemIndex,
                                              e.target.value
                                            )
                                          }
                                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
                                          required
                                          disabled={loading.workItems}
                                        >
                                          <option value="">Select Description</option>
                                          {workItems.map((item) => (
                                            <option key={item.desc_id} value={item.desc_name}>
                                              {item.desc_name}
                                            </option>
                                          ))}
                                        </select>
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap">
                                        <input
                                          type="number"
                                          name="poQuantity"
                                          value={item.poQuantity}
                                          onChange={(e) =>
                                            handleItemChange(categoryIndex, subcatIndex, itemIndex, e)
                                          }
                                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
                                          required
                                          min="0"
                                          step="0.01"
                                          placeholder="Qty"
                                        />
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap">
                                        <input
                                          type="text"
                                          name="unitOfMeasure"
                                          value={item.unitOfMeasure}
                                          onChange={(e) =>
                                            handleItemChange(categoryIndex, subcatIndex, itemIndex, e)
                                          }
                                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
                                          required
                                          placeholder="UOM"
                                        />
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap">
                                        <input
                                          type="number"
                                          name="rate"
                                          value={item.rate}
                                          onChange={(e) =>
                                            handleItemChange(categoryIndex, subcatIndex, itemIndex, e)
                                          }
                                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
                                          required
                                          min="0"
                                          step="0.01"
                                          placeholder="Rate"
                                        />
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap">
                                        <input
                                          type="text"
                                          name="value"
                                          value={item.value}
                                          readOnly
                                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-gray-100 text-sm"
                                        />
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap">
                                        <button
                                          type="button"
                                          onClick={() => removeItemRow(categoryIndex, subcatIndex, itemIndex)}
                                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                                          disabled={subcategory.items.length <= 1}
                                        >
                                          Remove
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="mt-3">
                              <button
                                type="button"
                                onClick={(e) => addItemRow(categoryIndex, subcatIndex, e)}
                                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Item
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              disabled={loading.submitting || loading.processing}
            >
              {loading.submitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Submitting...
                </>
              ) : loading.processing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReckoner;
