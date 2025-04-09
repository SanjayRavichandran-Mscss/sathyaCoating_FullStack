// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

// // Helper function to generate random pastel colors
// const getRandomColor = (index) => {
//   const colors = [
//     "bg-blue-50 border-blue-100",
//     "bg-green-50 border-green-100",
//     "bg-yellow-50 border-yellow-100",
//     "bg-purple-50 border-purple-100",
//     "bg-pink-50 border-pink-100",
//     "bg-indigo-50 border-indigo-100",
//     "bg-teal-50 border-teal-100",
//     "bg-orange-50 border-orange-100",
//     "bg-cyan-50 border-cyan-100",
//     "bg-amber-50 border-amber-100",
//   ];
//   return colors[index % colors.length];
// };

// const CreateReckoner = () => {
//   const location = useLocation();
//   const { siteName, poNumber } = location.state || {};

//   // State for form data - now supports multiple categories
//   const [formData, setFormData] = useState({
//     poNumber: poNumber || "",
//     categories: [
//       {
//         categoryName: "",
//         categoryId: "",
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
//       },
//     ],
//   });

//   // State for dropdown options
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [workItems, setWorkItems] = useState([]);

//   // State for loading and errors
//   const [loading, setLoading] = useState({
//     categories: false,
//     subcategories: false,
//     workItems: false,
//   });
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // Fetch all data independently
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
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
//         setError("Failed to load data");
//         console.error("Error fetching data:", err);
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

//   // Handle category change
//   const handleCategoryChange = (categoryIndex, e) => {
//     const selectedCategory = categories.find(
//       (cat) => cat.category_name === e.target.value
//     );

//     setFormData((prev) => {
//       const newCategories = [...prev.categories];
//       newCategories[categoryIndex] = {
//         ...newCategories[categoryIndex],
//         categoryName: e.target.value,
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

//   // Handle subcategory name change
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

//       newCategories[categoryIndex] = {
//         ...newCategories[categoryIndex],
//         subcategories: newSubcategories,
//       };

//       return { ...prev, categories: newCategories };
//     });
//   };

//   // Add new category
//   const addCategory = () => {
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

//   // Add new subcategory to a specific category
//   const addSubcategory = (categoryIndex) => {
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
//               itemDescription: "",
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

//   // Remove subcategory from a specific category
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

//   // Handle item description change
//   const handleItemDescriptionChange = (
//     categoryIndex,
//     subcatIndex,
//     itemIndex,
//     value
//   ) => {
//     const selectedItem = workItems.find(
//       (item) => item.item_description === value
//     );

//     setFormData((prev) => {
//       const newCategories = [...prev.categories];
//       const newSubcategories = [...newCategories[categoryIndex].subcategories];
//       const newItems = [...newSubcategories[subcatIndex].items];

//       newItems[itemIndex] = {
//         ...newItems[itemIndex],
//         itemDescription: value,
//         itemNo: selectedItem?.item_id || "",
//         unitOfMeasure: selectedItem?.unit_of_measure || "",
//       };

//       newSubcategories[subcatIndex] = {
//         ...newSubcategories[subcatIndex],
//         items: newItems,
//       };

//       newCategories[categoryIndex] = {
//         ...newCategories[categoryIndex],
//         subcategories: newSubcategories,
//       };

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

//       // Auto-calculate value if quantity or rate changes
//       if (name === "poQuantity" || name === "rate") {
//         const quantity =
//           name === "poQuantity" ? value : newItems[itemIndex].poQuantity;
//         const rate = name === "rate" ? value : newItems[itemIndex].rate;
//         newItems[itemIndex].value = (
//           parseFloat(quantity || 0) * parseFloat(rate || 0)
//         ).toFixed(2);
//       }

//       newSubcategories[subcatIndex] = {
//         ...newSubcategories[subcatIndex],
//         items: newItems,
//       };

//       newCategories[categoryIndex] = {
//         ...newCategories[categoryIndex],
//         subcategories: newSubcategories,
//       };

//       return { ...prev, categories: newCategories };
//     });
//   };

//   // Add new item row to a specific subcategory
//   const addItemRow = (categoryIndex, subcatIndex) => {
//     setFormData((prev) => {
//       const newCategories = [...prev.categories];
//       const newSubcategories = [...newCategories[categoryIndex].subcategories];
//       const newItems = [...newSubcategories[subcatIndex].items];

//       newItems.push({
//         itemNo: "",
//         itemDescription: "",
//         poQuantity: "",
//         unitOfMeasure: "",
//         rate: "",
//         value: "",
//       });

//       newSubcategories[subcatIndex] = {
//         ...newSubcategories[subcatIndex],
//         items: newItems,
//       };

//       newCategories[categoryIndex] = {
//         ...newCategories[categoryIndex],
//         subcategories: newSubcategories,
//       };

//       return { ...prev, categories: newCategories };
//     });
//   };

//   // Remove item row from a specific subcategory
//   const removeItemRow = (categoryIndex, subcatIndex, itemIndex) => {
//     if (
//       formData.categories[categoryIndex].subcategories[subcatIndex].items
//         .length > 1
//     ) {
//       setFormData((prev) => {
//         const newCategories = [...prev.categories];
//         const newSubcategories = [
//           ...newCategories[categoryIndex].subcategories,
//         ];
//         newSubcategories[subcatIndex].items = newSubcategories[
//           subcatIndex
//         ].items.filter((_, i) => i !== itemIndex);
//         newCategories[categoryIndex] = {
//           ...newCategories[categoryIndex],
//           subcategories: newSubcategories,
//         };
//         return { ...prev, categories: newCategories };
//       });
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setError(null);
//       setSuccess(null);

//       // Prepare the data for submission
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

//       const response = await axios.post(
//         "http://localhost:5000/reckoner/reckoner",
//         submissionData
//       );
//       setSuccess("Reckoner data saved successfully!");
//       console.log("Form submitted successfully:", response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to submit form");
//       console.error("Error submitting form:", err);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           {success}
//         </div>
//       )}

//       {location.state && (
//         <div className="p-4 mb-4">
//           <div className="text-lg font-semibold text-blue-800">
//             {siteName}
//             <span className="text-gray-600">(PO: {poNumber})</span>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <input type="hidden" name="poNumber" value={formData.poNumber} />

//         {/* Categories Section */}
//         <div className="space-y-6">
//           <div className="flex justify-between items-center">
//             <h2 className="text-lg font-medium text-gray-700">Categories</h2>
//             <button
//               type="button"
//               onClick={addCategory}
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Add Category
//             </button>
//           </div>

//           {formData.categories.map((category, categoryIndex) => (
//             <div
//               key={categoryIndex}
//               className={`border rounded-lg p-4 space-y-4 ${getRandomColor(
//                 categoryIndex
//               )} border-2`}
//             >
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Category Name
//                   </label>
//                   <select
//                     name="categoryName"
//                     value={category.categoryName}
//                     onChange={(e) => handleCategoryChange(categoryIndex, e)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
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
//                   {loading.categories && (
//                     <p className="text-sm text-gray-500">
//                       Loading categories...
//                     </p>
//                   )}
//                 </div>
//                 <div className="flex items-end justify-end">
//                   {formData.categories.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeCategory(categoryIndex)}
//                       className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                     >
//                       Remove Category
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Subcategories Section */}
//               {category.categoryName && (
//                 <div className="space-y-6 mt-4">
//                   <div className="flex justify-between items-center">
//                     <h3 className="text-md font-medium text-gray-700">
//                       Subcategories
//                     </h3>
//                     <button
//                       type="button"
//                       onClick={() => addSubcategory(categoryIndex)}
//                       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     >
//                       Add Subcategory
//                     </button>
//                   </div>

//                   {category.subcategories.map((subcategory, subcatIndex) => (
//                     <div
//                       key={subcatIndex}
//                       className={`border rounded-lg p-4 space-y-4 ${getRandomColor(
//                         subcatIndex + 1
//                       )} border-2`}
//                     >
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">
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
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
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
//                           {loading.subcategories && (
//                             <p className="text-sm text-gray-500">
//                               Loading subcategories...
//                             </p>
//                           )}
//                         </div>
//                         <div className="flex items-end justify-end">
//                           {category.subcategories.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 removeSubcategory(categoryIndex, subcatIndex)
//                               }
//                               className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                             >
//                               Remove Subcategory
//                             </button>
//                           )}
//                         </div>
//                       </div>

//                       {/* Items Table */}
//                       {subcategory.subcategoryName && (
//                         <div className="mt-4">
//                           <h4 className="text-md font-medium mb-2 text-gray-700">
//                             Items
//                           </h4>
//                           <div className="overflow-x-auto">
//                             <table className="min-w-full divide-y divide-gray-200">
//                               <thead
//                                 className={`${getRandomColor(subcatIndex + 2)}`}
//                               >
//                                 <tr>
//                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                     Item No
//                                   </th>
//                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                     Item Description
//                                   </th>
//                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                     PO Quantity
//                                   </th>
//                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                     Unit of Measure
//                                   </th>
//                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                     Rate
//                                   </th>
//                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                     Value
//                                   </th>
//                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
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
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                       <input
//                                         type="text"
//                                         name="itemNo"
//                                         value={item.itemNo}
//                                         readOnly
//                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-gray-100"
//                                       />
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
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
//                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
//                                         required
//                                         disabled={loading.workItems}
//                                       >
//                                         <option value="">
//                                           Select Item Description
//                                         </option>
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
//                                     <td className="px-6 py-4 whitespace-nowrap">
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
//                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
//                                         required
//                                         min="0"
//                                         step="0.01"
//                                       />
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
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
//                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
//                                         required
//                                       />
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
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
//                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
//                                         required
//                                         min="0"
//                                         step="0.01"
//                                       />
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                       <input
//                                         type="text"
//                                         name="value"
//                                         value={item.value}
//                                         readOnly
//                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-gray-100"
//                                       />
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                       <button
//                                         type="button"
//                                         onClick={() =>
//                                           removeItemRow(
//                                             categoryIndex,
//                                             subcatIndex,
//                                             itemIndex
//                                           )
//                                         }
//                                         className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
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
//                           <div className="mt-2">
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 addItemRow(categoryIndex, subcatIndex)
//                               }
//                               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                             >
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
//         <div className="pt-4">
//           <button
//             type="submit"
//             className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateReckoner;



// create recmoner and worksheets by onclick(submit)

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

// Helper function to generate random pastel colors
const getRandomColor = (index) => {
  const colors = [
    "bg-blue-50 border-blue-100",
    "bg-green-50 border-green-100",
    "bg-yellow-50 border-yellow-100",
    "bg-purple-50 border-purple-100",
    "bg-pink-50 border-pink-100",
    "bg-indigo-50 border-indigo-100",
    "bg-teal-50 border-teal-100",
    "bg-orange-50 border-orange-100",
    "bg-cyan-50 border-cyan-100",
    "bg-amber-50 border-amber-100",
  ];
  return colors[index % colors.length];
};

const CreateReckoner = () => {
  const location = useLocation();
  const { siteName, poNumber } = location.state || {};

  // State for form data - now supports multiple categories
  const [formData, setFormData] = useState({
    poNumber: poNumber || "",
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
                itemDescription: "",
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
  });

  // State for dropdown options
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [workItems, setWorkItems] = useState([]);

  // State for loading and errors
  const [loading, setLoading] = useState({
    categories: false,
    subcategories: false,
    workItems: false,
    submitting: false,
    processing: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all data independently
  useEffect(() => {
    const fetchData = async () => {
      try {
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

        // Fetch work items
        setLoading((prev) => ({ ...prev, workItems: true }));
        const workItemsRes = await axios.get(
          "http://localhost:5000/reckoner/work-items"
        );
        setWorkItems(workItemsRes.data.data || []);
      } catch (err) {
        setError("Failed to load data");
        console.error("Error fetching data:", err);
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

  // Handle category change
  const handleCategoryChange = (categoryIndex, e) => {
    const selectedCategory = categories.find(
      (cat) => cat.category_name === e.target.value
    );

    setFormData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex] = {
        ...newCategories[categoryIndex],
        categoryName: e.target.value,
        categoryId: selectedCategory?.category_id || "",
        subcategories: [
          {
            subcategoryName: "",
            subcategoryId: "",
            items: [
              {
                itemNo: "",
                itemDescription: "",
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

  // Handle subcategory name change
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
            itemDescription: "",
            poQuantity: "",
            unitOfMeasure: "",
            rate: "",
            value: "",
          },
        ],
      };

      newCategories[categoryIndex] = {
        ...newCategories[categoryIndex],
        subcategories: newSubcategories,
      };

      return { ...prev, categories: newCategories };
    });
  };

  // Add new category
  const addCategory = () => {
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
                  itemDescription: "",
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

  // Add new subcategory to a specific category
  const addSubcategory = (categoryIndex) => {
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
              itemDescription: "",
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

  // Remove subcategory from a specific category
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

  // Handle item description change
  const handleItemDescriptionChange = (
    categoryIndex,
    subcatIndex,
    itemIndex,
    value
  ) => {
    const selectedItem = workItems.find(
      (item) => item.item_description === value
    );

    setFormData((prev) => {
      const newCategories = [...prev.categories];
      const newSubcategories = [...newCategories[categoryIndex].subcategories];
      const newItems = [...newSubcategories[subcatIndex].items];

      newItems[itemIndex] = {
        ...newItems[itemIndex],
        itemDescription: value,
        itemNo: selectedItem?.item_id || "",
        unitOfMeasure: selectedItem?.unit_of_measure || "",
      };

      newSubcategories[subcatIndex] = {
        ...newSubcategories[subcatIndex],
        items: newItems,
      };

      newCategories[categoryIndex] = {
        ...newCategories[categoryIndex],
        subcategories: newSubcategories,
      };

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

      // Auto-calculate value if quantity or rate changes
      if (name === "poQuantity" || name === "rate") {
        const quantity =
          name === "poQuantity" ? value : newItems[itemIndex].poQuantity;
        const rate = name === "rate" ? value : newItems[itemIndex].rate;
        newItems[itemIndex].value = (
          parseFloat(quantity || 0) * parseFloat(rate || 0)
        ).toFixed(2);
      }

      newSubcategories[subcatIndex] = {
        ...newSubcategories[subcatIndex],
        items: newItems,
      };

      newCategories[categoryIndex] = {
        ...newCategories[categoryIndex],
        subcategories: newSubcategories,
      };

      return { ...prev, categories: newCategories };
    });
  };

  // Add new item row to a specific subcategory
  const addItemRow = (categoryIndex, subcatIndex) => {
    setFormData((prev) => {
      const newCategories = [...prev.categories];
      const newSubcategories = [...newCategories[categoryIndex].subcategories];
      const newItems = [...newSubcategories[subcatIndex].items];

      newItems.push({
        itemNo: "",
        itemDescription: "",
        poQuantity: "",
        unitOfMeasure: "",
        rate: "",
        value: "",
      });

      newSubcategories[subcatIndex] = {
        ...newSubcategories[subcatIndex],
        items: newItems,
      };

      newCategories[categoryIndex] = {
        ...newCategories[categoryIndex],
        subcategories: newSubcategories,
      };

      return { ...prev, categories: newCategories };
    });
  };

  // Remove item row from a specific subcategory
  const removeItemRow = (categoryIndex, subcatIndex, itemIndex) => {
    if (
      formData.categories[categoryIndex].subcategories[subcatIndex].items
        .length > 1
    ) {
      setFormData((prev) => {
        const newCategories = [...prev.categories];
        const newSubcategories = [
          ...newCategories[categoryIndex].subcategories,
        ];
        newSubcategories[subcatIndex].items = newSubcategories[
          subcatIndex
        ].items.filter((_, i) => i !== itemIndex);
        newCategories[categoryIndex] = {
          ...newCategories[categoryIndex],
          subcategories: newSubcategories,
        };
        return { ...prev, categories: newCategories };
      });
    }
  };

  // Process site after successful form submission
  const processSite = async (poNumber) => {
    try {
      setLoading(prev => ({ ...prev, processing: true }));
      const response = await axios.get(
        `http://localhost:5000/sheet/process/${encodeURIComponent(poNumber)}`
      );
      console.log("Site processed successfully:", response.data);
      return true;
    } catch (error) {
      console.error("Error processing site:", error);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, processing: false }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      setLoading(prev => ({ ...prev, submitting: true }));

      // Prepare the data for submission
      const submissionData = {
        poNumber: formData.poNumber,
        categories: formData.categories.map((category) => ({
          categoryId: category.categoryId,
          subcategories: category.subcategories.map((subcategory) => ({
            subcategoryId: subcategory.subcategoryId,
            items: subcategory.items.map((item) => ({
              itemId: item.itemNo,
              poQuantity: item.poQuantity,
              uom: item.unitOfMeasure,
              rate: item.rate,
              value: item.value,
            })),
          })),
        })),
      };

      // Submit the form data
      const response = await axios.post(
        "http://localhost:5000/reckoner/reckoner",
        submissionData
      );
      
      // Only proceed to process site if form submission was successful
      if (response.data.success) {
        setSuccess("Reckoner data saved successfully! Processing site...");
        
        // Process the site with the PO number
        const processSuccess = await processSite(formData.poNumber);
        
        if (processSuccess) {
          setSuccess("Reckoner data saved and worksheets created successfully!");
        } else {
          setSuccess("Reckoner data saved but worksheets are not created");
        }
      } else {
        setSuccess("Reckoner data saved successfully!");
      }
      
      console.log("Form submitted successfully:", response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit form");
      console.error("Error submitting form:", err);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {location.state && (
        <div className="p-4 mb-4">
          <div className="text-lg font-semibold text-blue-800">
            {siteName}
            <span className="text-gray-600">(PO: {poNumber})</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="poNumber" value={formData.poNumber} />

        {/* Categories Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-700">Categories</h2>
            <button
              type="button"
              onClick={addCategory}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Category
            </button>
          </div>

          {formData.categories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className={`border rounded-lg p-4 space-y-4 ${getRandomColor(
                categoryIndex
              )} border-2`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category Name
                  </label>
                  <select
                    name="categoryName"
                    value={category.categoryName}
                    onChange={(e) => handleCategoryChange(categoryIndex, e)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
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
                  {loading.categories && (
                    <p className="text-sm text-gray-500">
                      Loading categories...
                    </p>
                  )}
                </div>
                <div className="flex items-end justify-end">
                  {formData.categories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCategory(categoryIndex)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remove Category
                    </button>
                  )}
                </div>
              </div>

              {/* Subcategories Section */}
              {category.categoryName && (
                <div className="space-y-6 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-medium text-gray-700">
                      Subcategories
                    </h3>
                    <button
                      type="button"
                      onClick={() => addSubcategory(categoryIndex)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Subcategory
                    </button>
                  </div>

                  {category.subcategories.map((subcategory, subcatIndex) => (
                    <div
                      key={subcatIndex}
                      className={`border rounded-lg p-4 space-y-4 ${getRandomColor(
                        subcatIndex + 1
                      )} border-2`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
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
                          {loading.subcategories && (
                            <p className="text-sm text-gray-500">
                              Loading subcategories...
                            </p>
                          )}
                        </div>
                        <div className="flex items-end justify-end">
                          {category.subcategories.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeSubcategory(categoryIndex, subcatIndex)
                              }
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Remove Subcategory
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items Table */}
                      {subcategory.subcategoryName && (
                        <div className="mt-4">
                          <h4 className="text-md font-medium mb-2 text-gray-700">
                            Items
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead
                                className={`${getRandomColor(subcatIndex + 2)}`}
                              >
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Item No
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Item Description
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    PO Quantity
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Unit of Measure
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Rate
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Value
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
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
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <input
                                        type="text"
                                        name="itemNo"
                                        value={item.itemNo}
                                        readOnly
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-gray-100"
                                      />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <select
                                        name="itemDescription"
                                        value={item.itemDescription}
                                        onChange={(e) =>
                                          handleItemDescriptionChange(
                                            categoryIndex,
                                            subcatIndex,
                                            itemIndex,
                                            e.target.value
                                          )
                                        }
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                        required
                                        disabled={loading.workItems}
                                      >
                                        <option value="">
                                          Select Item Description
                                        </option>
                                        {workItems.map((item) => (
                                          <option
                                            key={item.item_id}
                                            value={item.item_description}
                                          >
                                            {item.item_description}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
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
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                        required
                                        min="0"
                                        step="0.01"
                                      />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
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
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                        required
                                      />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
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
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                        required
                                        min="0"
                                        step="0.01"
                                      />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <input
                                        type="text"
                                        name="value"
                                        value={item.value}
                                        readOnly
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-gray-100"
                                      />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeItemRow(
                                            categoryIndex,
                                            subcatIndex,
                                            itemIndex
                                          )
                                        }
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
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
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                addItemRow(categoryIndex, subcatIndex)
                              }
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
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
        <div className="pt-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={loading.submitting || loading.processing}
          >
            {loading.submitting ? "Submitting..." : 
             loading.processing ? "Processing..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReckoner;