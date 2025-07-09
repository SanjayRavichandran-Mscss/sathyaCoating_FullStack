// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import Swal from "sweetalert2";

// // Helper function to generate random pastel colors
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
//               itemDescription: "",
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

// const CreateReckoner = () => {
//   const { site_id } = useParams();

//   // State for site details
//   const [siteDetails, setSiteDetails] = useState({
//     site_id: "",
//     site_name: "",
//     po_number: "",
//   });

//   // State for form data
//   const [formData, setFormData] = useState(initialFormData);

//   // State for dropdown options
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [workItems, setWorkItems] = useState([]);

//   // State for loading
//   const [loading, setLoading] = useState({
//     site: false,
//     categories: false,
//     subcategories: false,
//     workItems: false,
//     submitting: false,
//     processing: false,
//   });

//   // Fetch site details, categories, subcategories, and work items
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch site details
//         setLoading((prev) => ({ ...prev, site: true }));
//         const siteResponse = await axios.get(
//           `http://localhost:5000/reckoner/sites-by-id/${site_id}`
//         );
//         const siteData = siteResponse.data.data || {};
//         setSiteDetails({
//           site_id: siteData.site_id || site_id,
//           site_name: siteData.site_name || "Unknown Site",
//           po_number: siteData.po_number || "N/A",
//         });
//         setFormData((prev) => ({ ...prev, poNumber: siteData.po_number || "" }));

//         // Fetch categories
//         setLoading((prev) => ({ ...prev, categories: true }));
//         const categoriesRes = await axios.get(
//           "http://localhost:5000/reckoner/categories"
//         );
//         setCategories(categoriesRes.data.data || []);

//         // Fetch subcategories
//         setLoading((prev) => ({ ...prev, subcategories: true }));
//         const subcategoriesRes = await axios.get(
//           "http://localhost:5000/reckoner/subcategories"
//         );
//         setSubcategories(subcategoriesRes.data.data || []);

//         // Fetch work items
//         setLoading((prev) => ({ ...prev, workItems: true }));
//         const workItemsRes = await axios.get(
//           "http://localhost:5000/reckoner/work-items"
//         );
//         setWorkItems(workItemsRes.data.data || []);

//       } catch (err) {
//         Swal.fire({
//           position: 'top-end',
//           icon: 'error',
//           title: 'Failed to load data',
//           text: err.response?.data?.message || "Please try again later",
//           showConfirmButton: false,
//           timer: 3000,
//           toast: true,
//           background: '#fef2f2',
//           iconColor: '#ef4444'
//         });
//       } finally {
//         setLoading((prev) => ({
//           ...prev,
//           site: false,
//           categories: false,
//           subcategories: false,
//           workItems: false,
//         }));
//       }
//     };
//     fetchData();
//   }, [site_id]);

//   // Handle category selection
//   const handleCategoryChange = (categoryIndex, e) => {
//     const categoryName = e.target.value;
//     const selectedCategory = categories.find(
//       (cat) => cat.category_name === categoryName
//     );

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
//                 itemDescription: "",
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

//   // Handle subcategory selection
//   const handleSubcategoryNameChange = (categoryIndex, subcatIndex, name) => {
//     const selectedSubcat = subcategories.find(
//       (sc) => sc.subcategory_name === name
//     );

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
//             itemDescription: "",
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

//   // Handle item description selection
//   const handleItemDescriptionChange = (
//     categoryIndex,
//     subcatIndex,
//     itemIndex,
//     value
//   ) => {
//     const selectedItem = workItems.find((item) => item.item_description === value);

//     setFormData((prev) => {
//       const newCategories = [...prev.categories];
//       const newSubcategories = [...newCategories[categoryIndex].subcategories];
//       const newItems = [...newSubcategories[subcatIndex].items];
//       newItems[itemIndex] = {
//         ...newItems[itemIndex],
//         itemDescription: value,
//         unitOfMeasure: selectedItem?.unit_of_measure || "",
//       };
//       newSubcategories[subcatIndex].items = newItems;
//       newCategories[categoryIndex].subcategories = newSubcategories;
//       return { ...prev, categories: newCategories };
//     });
//   };

//   // Handle item field changes
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

//       // Auto-calculate value if poQuantity or rate changes
//       if (name === "poQuantity" || name === "rate") {
//         const quantity =
//           name === "poQuantity" ? value : newItems[itemIndex].poQuantity;
//         const rate = name === "rate" ? value : newItems[itemIndex].rate;
//         newItems[itemIndex].value = (
//           parseFloat(quantity || 0) * parseFloat(rate || 0)
//         ).toFixed(2);
//       }

//       newSubcategories[subcatIndex].items = newItems;
//       newCategories[categoryIndex].subcategories = newSubcategories;
//       return { ...prev, categories: newCategories };
//     });
//   };

//   // Add new category
//   const addCategory = (e) => {
//     e.preventDefault(); // Prevent default behavior
//     e.stopPropagation(); // Stop event bubbling
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
//                   itemDescription: "",
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

//   // Remove category
//   const removeCategory = (index) => {
//     if (formData.categories.length > 1) {
//       setFormData((prev) => ({
//         ...prev,
//         categories: prev.categories.filter((_, i) => i !== index),
//       }));
//     }
//   };

//   // Add new subcategory
//   const addSubcategory = (categoryIndex, e) => {
//     e.preventDefault(); // Prevent default behavior
//     e.stopPropagation(); // Stop event bubbling
//     setFormData((prev) => {
//       const newCategories = [...prev.categories];
//       newCategories[categoryIndex].subcategories = [
//         ...newCategories[categoryIndex].subcategories,
//         {
//           subcategoryName: "",
//           subcategoryId: "",
//           items: [{
//             itemNo: "",
//             itemDescription: "",
//             poQuantity: "",
//             unitOfMeasure: "",
//             rate: "",
//             value: ""
//           }]
//         }
//       ];
//       return { ...prev, categories: newCategories };
//     });
//   };

//   // Remove subcategory
//   const removeSubcategory = (categoryIndex, subcatIndex) => {
//     if (formData.categories[categoryIndex].subcategories.length > 1) {
//       setFormData((prev) => {
//         const newCategories = [...prev.categories];
//         newCategories[categoryIndex].subcategories = newCategories[
//           categoryIndex
//         ].subcategories.filter((_, i) => i !== subcatIndex);
//         return { ...prev, categories: newCategories };
//       });
//     }
//   };

//   // Add new item row
//   const addItemRow = (categoryIndex, subcatIndex, e) => {
//     e.preventDefault(); // Prevent default behavior
//     e.stopPropagation(); // Stop event bubbling
//     setFormData((prev) => {
//       const newCategories = [...prev.categories];
//       const newSubcategories = [...newCategories[categoryIndex].subcategories];
//       newSubcategories[subcatIndex].items = [
//         ...newSubcategories[subcatIndex].items,
//         {
//           itemNo: "",
//           itemDescription: "",
//           poQuantity: "",
//           unitOfMeasure: "",
//           rate: "",
//           value: ""
//         }
//       ];
//       newCategories[categoryIndex].subcategories = newSubcategories;
//       return { ...prev, categories: newCategories };
//     });
//   };

//   // Remove item row
//   const removeItemRow = (categoryIndex, subcatIndex, itemIndex) => {
//     if (
//       formData.categories[categoryIndex].subcategories[subcatIndex].items
//         .length > 1
//     ) {
//       setFormData((prev) => {
//         const newCategories = [...prev.categories];
//         const newSubcategories = [...newCategories[categoryIndex].subcategories];
//         newSubcategories[subcatIndex].items = newSubcategories[
//           subcatIndex
//         ].items.filter((_, i) => i !== itemIndex);
//         newCategories[categoryIndex].subcategories = newSubcategories;
//         return { ...prev, categories: newCategories };
//       });
//     }
//   };

//   // Process site after submission
//   const processSite = async (poNumber) => {
//     try {
//       setLoading((prev) => ({ ...prev, processing: true }));
//       await axios.get(
//         `http://localhost:5000/sheet/process/${encodeURIComponent(poNumber)}`
//       );
//       return true;
//     } catch (error) {
//       console.error("Error processing site:", error);
//       return false;
//     } finally {
//       setLoading((prev) => ({ ...prev, processing: false }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading((prev) => ({ ...prev, submitting: true }));

//       // Validate form data
//       for (const category of formData.categories) {
//         if (!category.categoryId) {
//           throw new Error("All categories must be selected.");
//         }
//         for (const subcategory of category.subcategories) {
//           if (!subcategory.subcategoryId) {
//             throw new Error("All subcategories must be selected.");
//           }
//           for (const item of subcategory.items) {
//             if (!item.itemNo || !item.itemDescription || !item.poQuantity || !item.unitOfMeasure || !item.rate) {
//               throw new Error("All item fields must be filled.");
//             }
//           }
//         }
//       }

//       // Prepare submission data
//       const submissionData = {
//         poNumber: formData.poNumber,
//         categories: formData.categories.map((category) => ({
//           categoryId: category.categoryId,
//           subcategories: category.subcategories.map((subcategory) => ({
//             subcategoryId: subcategory.subcategoryId,
//             items: subcategory.items.map((item) => ({
//               itemId: item.itemNo,
//               poQuantity: item.poQuantity,
//               uom: item.unitOfMeasure,
//               rate: item.rate,
//               value: item.value,
//             })),
//           })),
//         })),
//       };

//       // Submit form data
//       await axios.post(
//         "http://localhost:5000/reckoner/reckoner",
//         submissionData
//       );

//       // Process site
//       await processSite(formData.poNumber);

//       // Show success notification
//       Swal.fire({
//         position: 'top-end',
//         icon: 'success',
//         title: 'Reckoner created successfully!',
//         showConfirmButton: false,
//         timer: 3000,
//         toast: true,
//         background: '#f0fdf4',
//         iconColor: '#10b981'
//       });

//       // Reset form
//       setFormData(initialFormData);

//     } catch (err) {
//       Swal.fire({
//         position: 'top-end',
//         icon: 'error',
//         title: 'Submission failed',
//         text: err.message || err.response?.data?.message || "Please try again",
//         showConfirmButton: false,
//         timer: 3000,
//         toast: true,
//         background: '#fef2f2',
//         iconColor: '#ef4444'
//       });
//     } finally {
//       setLoading((prev) => ({ ...prev, submitting: false }));
//     }
//   };

//   return (
//     <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
//       {/* Site Details Header */}
//       <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-200">
//         <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Create Reckoner</h1>
//         <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
//           <span className="font-medium">Site:</span>
//           <span className="bg-blue-100 text-blue-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">{siteDetails.site_name}</span>
//           <span className="font-medium">PO Number:</span>
//           <span className="bg-green-100 text-green-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">{siteDetails.po_number}</span>
//         </div>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
//         <input type="hidden" name="poNumber" value={formData.poNumber} />

//         {/* Categories Section */}
//         <div className="space-y-4 sm:space-y-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
//             <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Categories</h2>
//             <button
//               type="button"
//               onClick={addCategory}
//               className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium rounded-md shadow-sm transition-colors duration-150"
//             >
//               <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Add Category
//             </button>
//           </div>

//           {formData.categories.map((category, categoryIndex) => (
//             <div
//               key={categoryIndex}
//               className={`border rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 ${getRandomColor(
//                 categoryIndex
//               )} border-2`}
//             >
//               {/* Category Input */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//                 <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                     Category Name
//                   </label>
//                   <select
//                     name="categoryName"
//                     value={category.categoryName}
//                     onChange={(e) => handleCategoryChange(categoryIndex, e)}
//                     className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1.5 sm:p-2 border text-xs sm:text-sm"
//                     required
//                     disabled={loading.categories}
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map((cat) => (
//                       <option key={cat.category_id} value={cat.category_name}>
//                         {cat.category_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex items-end justify-end">
//                   {formData.categories.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeCategory(categoryIndex)}
//                       className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-150"
//                     >
//                       Remove Category
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Subcategories Section */}
//               {category.categoryName && (
//                 <div className="space-y-4 sm:space-y-6 mt-3 sm:mt-4">
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
//                     <h3 className="text-sm sm:text-md font-medium text-gray-700">
//                       Subcategories
//                     </h3>
//                     <button
//                       type="button"
//                       onClick={(e) => addSubcategory(categoryIndex, e)}
//                       className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors duration-150"
//                     >
//                       <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                       </svg>
//                       Add Subcategory
//                     </button>
//                   </div>

//                   {category.subcategories.map((subcategory, subcatIndex) => (
//                     <div
//                       key={subcatIndex}
//                       className={`border rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 ${getRandomColor(
//                         subcatIndex + 1
//                       )} border-2`}
//                     >
//                       {/* Subcategory Input */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//                         <div>
//                           <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                             Subcategory Name
//                           </label>
//                           <select
//                             value={subcategory.subcategoryName}
//                             onChange={(e) =>
//                               handleSubcategoryNameChange(
//                                 categoryIndex,
//                                 subcatIndex,
//                                 e.target.value
//                               )
//                             }
//                             className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1.5 sm:p-2 border text-xs sm:text-sm"
//                             required
//                             disabled={loading.subcategories}
//                           >
//                             <option value="">Select Subcategory</option>
//                             {subcategories.map((subcat) => (
//                               <option
//                                 key={subcat.subcategory_id}
//                                 value={subcat.subcategory_name}
//                               >
//                                 {subcat.subcategory_name}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div className="flex items-end justify-end">
//                           {category.subcategories.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 removeSubcategory(categoryIndex, subcatIndex)
//                               }
//                               className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-150"
//                             >
//                               Remove Subcategory
//                             </button>
//                           )}
//                         </div>
//                       </div>

//                       {/* Items Table */}
//                       {subcategory.subcategoryName && (
//                         <div className="mt-3 sm:mt-4">
//                           <h4 className="text-sm sm:text-md font-medium mb-2 sm:mb-3 text-gray-700">
//                             Items
//                           </h4>
//                           <div className="overflow-x-auto">
//                             <table className="min-w-full divide-y divide-gray-200">
//                               <thead className={`${getRandomColor(subcatIndex + 2)}`}>
//                                 <tr>
//                                   <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                     Item No
//                                   </th>
//                                   <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                     Description
//                                   </th>
//                                   <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                     Qty
//                                   </th>
//                                   <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                     UOM
//                                   </th>
//                                   <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                     Rate
//                                   </th>
//                                   <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                     Value
//                                   </th>
//                                   <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                     Actions
//                                   </th>
//                                 </tr>
//                               </thead>
//                               <tbody className="bg-white divide-y divide-gray-200">
//                                 {subcategory.items.map((item, itemIndex) => (
//                                   <tr
//                                     key={itemIndex}
//                                     className={
//                                       itemIndex % 2 === 0
//                                         ? "bg-white"
//                                         : "bg-gray-50"
//                                     }
//                                   >
//                                     <td className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">
//                                       <input
//                                         type="text"
//                                         name="itemNo"
//                                         value={item.itemNo}
//                                         onChange={(e) =>
//                                           handleItemChange(
//                                             categoryIndex,
//                                             subcatIndex,
//                                             itemIndex,
//                                             e
//                                           )
//                                         }
//                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border text-xs sm:text-sm"
//                                         required
//                                         placeholder="Item No"
//                                       />
//                                     </td>
//                                     <td className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">
//                                       <select
//                                         name="itemDescription"
//                                         value={item.itemDescription}
//                                         onChange={(e) =>
//                                           handleItemDescriptionChange(
//                                             categoryIndex,
//                                             subcatIndex,
//                                             itemIndex,
//                                             e.target.value
//                                           )
//                                         }
//                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border text-xs sm:text-sm"
//                                         required
//                                         disabled={loading.workItems}
//                                       >
//                                         <option value="">Select Item</option>
//                                         {workItems.map((item) => (
//                                           <option
//                                             key={item.item_id}
//                                             value={item.item_description}
//                                           >
//                                             {item.item_description}
//                                           </option>
//                                         ))}
//                                       </select>
//                                     </td>
//                                     <td className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">
//                                       <input
//                                         type="number"
//                                         name="poQuantity"
//                                         value={item.poQuantity}
//                                         onChange={(e) =>
//                                           handleItemChange(
//                                             categoryIndex,
//                                             subcatIndex,
//                                             itemIndex,
//                                             e
//                                           )
//                                         }
//                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border text-xs sm:text-sm"
//                                         required
//                                         min="0"
//                                         step="0.01"
//                                         placeholder="Qty"
//                                       />
//                                     </td>
//                                     <td className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">
//                                       <input
//                                         type="text"
//                                         name="unitOfMeasure"
//                                         value={item.unitOfMeasure}
//                                         onChange={(e) =>
//                                           handleItemChange(
//                                             categoryIndex,
//                                             subcatIndex,
//                                             itemIndex,
//                                             e
//                                           )
//                                         }
//                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border text-xs sm:text-sm"
//                                         required
//                                         placeholder="UOM"
//                                       />
//                                     </td>
//                                     <td className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">
//                                       <input
//                                         type="number"
//                                         name="rate"
//                                         value={item.rate}
//                                         onChange={(e) =>
//                                           handleItemChange(
//                                             categoryIndex,
//                                             subcatIndex,
//                                             itemIndex,
//                                             e
//                                           )
//                                         }
//                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border text-xs sm:text-sm"
//                                         required
//                                         min="0"
//                                         step="0.01"
//                                         placeholder="Rate"
//                                       />
//                                     </td>
//                                     <td className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">
//                                       <input
//                                         type="text"
//                                         name="value"
//                                         value={item.value}
//                                         readOnly
//                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border bg-gray-100 text-xs sm:text-sm"
//                                       />
//                                     </td>
//                                     <td className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">
//                                       <button
//                                         type="button"
//                                         onClick={() =>
//                                           removeItemRow(
//                                             categoryIndex,
//                                             subcatIndex,
//                                             itemIndex
//                                           )
//                                         }
//                                         className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-150 disabled:opacity-50"
//                                         disabled={subcategory.items.length <= 1}
//                                       >
//                                         Remove
//                                       </button>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                           <div className="mt-2 sm:mt-3">
//                             <button
//                               type="button"
//                               onClick={(e) => addItemRow(categoryIndex, subcatIndex, e)}
//                               className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors duration-150"
//                             >
//                               <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                               </svg>
//                               Add Item
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Submit Button */}
//         <div className="pt-3 sm:pt-4 flex justify-end">
//           <button
//             type="submit"
//             className="inline-flex justify-center py-1.5 px-4 sm:py-2 sm:px-6 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
//             disabled={loading.submitting || loading.processing}
//           >
//             {loading.submitting ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Submitting...
//               </>
//             ) : loading.processing ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Processing...
//               </>
//             ) : (
//               "Submit"
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateReckoner;













import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

// Helper function to generate random pastel colors
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

const CreateReckoner = () => {
  const { site_id } = useParams();

  // State for site details
  const [siteDetails, setSiteDetails] = useState({
    site_id: "",
    site_name: "",
    po_number: "",
  });

  // State for form data
  const [formData, setFormData] = useState(initialFormData);

  // State for dropdown options
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [workItems, setWorkItems] = useState([]);

  // State for loading
  const [loading, setLoading] = useState({
    site: false,
    categories: false,
    subcategories: false,
    workItems: false,
    submitting: false,
    processing: false,
  });

  // Fetch site details, categories, subcategories, and work descriptions
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch site details
        setLoading((prev) => ({ ...prev, site: true }));
        const siteResponse = await axios.get(
          `http://localhost:5000/reckoner/sites-by-id/${site_id}`
        );
        const siteData = siteResponse.data.data || {};
        setSiteDetails({
          site_id: siteData.site_id || site_id,
          site_name: siteData.site_name || "Unknown Site",
          po_number: siteData.po_number || "N/A",
        });
        setFormData((prev) => ({ ...prev, poNumber: siteData.po_number || "" }));

        // Fetch categories
        setLoading((prev) => ({ ...prev, categories: true }));
        const categoriesRes = await axios.get(
          "http://localhost:5000/reckoner/categories"
        );
        setCategories(categoriesRes.data.data || []);

        // Fetch subcategories
        setLoading((prev) => ({ ...prev, subcategories: true }));
        const subcategoriesRes = await axios.get(
          "http://localhost:5000/reckoner/subcategories"
        );
        setSubcategories(subcategoriesRes.data.data || []);

        // Fetch work descriptions
        setLoading((prev) => ({ ...prev, workItems: true }));
        const workItemsRes = await axios.get(
          "http://localhost:5000/reckoner/work-items"
        );
        setWorkItems(workItemsRes.data.data || []);

      } catch (err) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Failed to load data',
          text: err.response?.data?.message || "Please try again later",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
          background: '#fef2f2',
          iconColor: '#ef4444'
        });
      } finally {
        setLoading((prev) => ({
          ...prev,
          site: false,
          categories: false,
          subcategories: false,
          workItems: false,
        }));
      }
    };
    fetchData();
  }, [site_id]);

  // Handle category selection
  const handleCategoryChange = (categoryIndex, e) => {
    const categoryName = e.target.value;
    const selectedCategory = categories.find(
      (cat) => cat.category_name === categoryName
    );

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

  // Handle subcategory selection
  const handleSubcategoryNameChange = (categoryIndex, subcatIndex, name) => {
    const selectedSubcat = subcategories.find(
      (sc) => sc.subcategory_name === name
    );

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

  // Handle description selection
  const handleItemDescriptionChange = (
    categoryIndex,
    subcatIndex,
    itemIndex,
    value
  ) => {
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

  // Handle item field changes
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

      // Auto-calculate value if poQuantity or rate changes
      if (name === "poQuantity" || name === "rate") {
        const quantity =
          name === "poQuantity" ? value : newItems[itemIndex].poQuantity;
        const rate = name === "rate" ? value : newItems[itemIndex].rate;
        newItems[itemIndex].value = (
          parseFloat(quantity || 0) * parseFloat(rate || 0)
        ).toFixed(2);
      }

      newSubcategories[subcatIndex].items = newItems;
      newCategories[categoryIndex].subcategories = newSubcategories;
      return { ...prev, categories: newCategories };
    });
  };

  // Add new category
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

  // Remove category
  const removeCategory = (index) => {
    if (formData.categories.length > 1) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((_, i) => i !== index),
      }));
    }
  };

  // Add new subcategory
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
          items: [{
            itemNo: "",
            descId: "",
            descName: "",
            poQuantity: "",
            unitOfMeasure: "",
            rate: "",
            value: ""
          }]
        }
      ];
      return { ...prev, categories: newCategories };
    });
  };

  // Remove subcategory
  const removeSubcategory = (categoryIndex, subcatIndex) => {
    if (formData.categories[categoryIndex].subcategories.length > 1) {
      setFormData((prev) => {
        const newCategories = [...prev.categories];
        newCategories[categoryIndex].subcategories = newCategories[
          categoryIndex
        ].subcategories.filter((_, i) => i !== subcatIndex);
        return { ...prev, categories: newCategories };
      });
    }
  };

  // Add new item row
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
          value: ""
        }
      ];
      newCategories[categoryIndex].subcategories = newSubcategories;
      return { ...prev, categories: newCategories };
    });
  };

  // Remove item row
  const removeItemRow = (categoryIndex, subcatIndex, itemIndex) => {
    if (
      formData.categories[categoryIndex].subcategories[subcatIndex].items
        .length > 1
    ) {
      setFormData((prev) => {
        const newCategories = [...prev.categories];
        const newSubcategories = [...newCategories[categoryIndex].subcategories];
        newSubcategories[subcatIndex].items = newSubcategories[
          subcatIndex
        ].items.filter((_, i) => i !== itemIndex);
        newCategories[categoryIndex].subcategories = newSubcategories;
        return { ...prev, categories: newCategories };
      });
    }
  };

  // Process site after submission
  const processSite = async (poNumber) => {
    try {
      setLoading((prev) => ({ ...prev, processing: true }));
      await axios.get(
        `http://localhost:5000/sheet/process/${encodeURIComponent(poNumber)}`
      );
      return true;
    } catch (error) {
      console.error("Error processing site:", error);
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, processing: false }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, submitting: true }));

      // Validate form data
      for (const category of formData.categories) {
        if (!category.categoryId) {
          throw new Error("All categories must be selected.");
        }
        for (const subcategory of category.subcategories) {
          if (!subcategory.subcategoryId) {
            throw new Error("All subcategories must be selected.");
          }
          for (const item of subcategory.items) {
            if (!item.itemNo || !item.descId || !item.descName || !item.poQuantity || !item.unitOfMeasure || !item.rate) {
              throw new Error("All item fields must be filled.");
            }
          }
        }
      }

      // Prepare submission data
      const submissionData = {
        poNumber: formData.poNumber,
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

      // Submit form data
      await axios.post(
        "http://localhost:5000/reckoner/reckoner",
        submissionData
      );

      // Process site
      await processSite(formData.poNumber);

      // Show success notification
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Reckoner created successfully!',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: '#f0fdf4',
        iconColor: '#10b981'
      });

      // Reset form
      setFormData(initialFormData);

    } catch (err) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Submission failed',
        text: err.message || err.response?.data?.message || "Please try again",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: '#fef2f2',
        iconColor: '#ef4444'
      });
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Site Details Header */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-200">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Create Reckoner</h1>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
          <span className="font-medium">Site:</span>
          <span className="bg-blue-100 text-blue-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">{siteDetails.site_name}</span>
          <span className="font-medium">PO Number:</span>
          <span className="bg-green-100 text-green-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">{siteDetails.po_number}</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <input type="hidden" name="poNumber" value={formData.poNumber} />

        {/* Categories Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Categories</h2>
            <button
              type="button"
              onClick={addCategory}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium rounded-md shadow-sm transition-colors duration-150"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Category
            </button>
          </div>

          {formData.categories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className={`border rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 ${getRandomColor(
                categoryIndex
              )} border-2`}
            >
              {/* Category Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <select
                    name="categoryName"
                    value={category.categoryName}
                    onChange={(e) => handleCategoryChange(categoryIndex, e)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1.5 sm:p-2 border text-xs sm:text-sm"
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
                      className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-150"
                    >
                      Remove Category
                    </button>
                  )}
                </div>
              </div>

              {/* Subcategories Section */}
              {category.categoryName && (
                <div className="space-y-4 sm:space-y-6 mt-3 sm:mt-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                    <h3 className="text-sm sm:text-md font-medium text-gray-700">
                      Subcategories
                    </h3>
                    <button
                      type="button"
                      onClick={(e) => addSubcategory(categoryIndex, e)}
                      className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors duration-150"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Subcategory
                    </button>
                  </div>

                  {category.subcategories.map((subcategory, subcatIndex) => (
                    <div
                      key={subcatIndex}
                      className={`border rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 ${getRandomColor(
                        subcatIndex + 1
                      )} border-2`}
                    >
                      {/* Subcategory Input */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Subcategory Name
                          </label>
                          <select
                            value={subcategory.subcategoryName}
                            onChange={(e) =>
                              handleSubcategoryNameChange(
                                categoryIndex,
                                subcatIndex,
                                e.target.value
                              )
                            }
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1.5 sm:p-2 border text-xs sm:text-sm"
                            required
                            disabled={loading.subcategories}
                          >
                            <option value="">Select Subcategory</option>
                            {subcategories.map((subcat) => (
                              <option
                                key={subcat.subcategory_id}
                                value={subcat.subcategory_name}
                              >
                                {subcat.subcategory_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end justify-end">
                          {category.subcategories.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeSubcategory(categoryIndex, subcatIndex)
                              }
                              className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-150"
                            >
                              Remove Subcategory
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items Table */}
                      {subcategory.subcategoryName && (
                        <div className="mt-3 sm:mt-4">
                          <h4 className="text-sm sm:text-md font-medium mb-2 sm:mb-3 text-gray-700">
                            Items
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className={`${getRandomColor(subcatIndex + 2)}`}>
                                <tr>
                                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Item No
                                  </th>
                                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Description
                                  </th>
                                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Qty
                                  </th>
                                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    UOM
                                  </th>
                                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Rate
                                  </th>
                                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Value
                                  </th>
                                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {subcategory.items.map((item, itemIndex) => (
                                  <tr
                                    key={itemIndex}
                                    className={
                                      itemIndex % 2 === 0
                                        ? "bg-white"
                                        : "bg-gray-50"
                                    }
                                  >
                                    <td className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">
                                      <input
                                        type="text"
                                        name="itemNo"
                                        value={item.itemNo}
                                        onChange={(e) =>
                                          handleItemChange(
                                            categoryIndex,
                                            subcatIndex,
                                            itemIndex,
                                            e
                                          )
                                        }
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border text-xs sm:text-sm"
                                        required
                                        placeholder="Item No"
                                      />
                                    </td>
                                    <td className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">
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
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border text-xs sm:text-sm"
                                        required
                                        disabled={loading.workItems}
                                      >
                                        <option value="">Select Description</option>
                                        {workItems.map((item) => (
                                          <option
                                            key={item.desc_id}
                                            value={item.desc_name}
                                          >
                                            {item.desc_name}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">
                                      <input
                                        type="number"
                                        name="poQuantity"
                                        value={item.poQuantity}
                                        onChange={(e) =>
                                          handleItemChange(
                                            categoryIndex,
                                            subcatIndex,
                                            itemIndex,
                                            e
                                          )
                                        }
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border text-xs sm:text-sm"
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="Qty"
                                      />
                                    </td>
                                    <td className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">
                                      <input
                                        type="text"
                                        name="unitOfMeasure"
                                        value={item.unitOfMeasure}
                                        onChange={(e) =>
                                          handleItemChange(
                                            categoryIndex,
                                            subcatIndex,
                                            itemIndex,
                                            e
                                          )
                                        }
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border text-xs sm:text-sm"
                                        required
                                        placeholder="UOM"
                                      />
                                    </td>
                                    <td className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">
                                      <input
                                        type="number"
                                        name="rate"
                                        value={item.rate}
                                        onChange={(e) =>
                                          handleItemChange(
                                            categoryIndex,
                                            subcatIndex,
                                            itemIndex,
                                            e
                                          )
                                        }
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border text-xs sm:text-sm"
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="Rate"
                                      />
                                    </td>
                                    <td className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">
                                      <input
                                        type="text"
                                        name="value"
                                        value={item.value}
                                        readOnly
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border bg-gray-100 text-xs sm:text-sm"
                                      />
                                    </td>
                                    <td className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeItemRow(
                                            categoryIndex,
                                            subcatIndex,
                                            itemIndex
                                          )
                                        }
                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-150 disabled:opacity-50"
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
                          <div className="mt-2 sm:mt-3">
                            <button
                              type="button"
                              onClick={(e) => addItemRow(categoryIndex, subcatIndex, e)}
                              className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors duration-150"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
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

        {/* Submit Button */}
        <div className="pt-3 sm:pt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-1.5 px-4 sm:py-2 sm:px-6 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
            disabled={loading.submitting || loading.processing}
          >
            {loading.submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : loading.processing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
  );
};

export default CreateReckoner;