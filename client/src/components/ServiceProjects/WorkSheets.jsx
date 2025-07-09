// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   Paper,
//   Typography,
//   Box,
//   CircularProgress,
//   Alert,
//   IconButton,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Snackbar
// } from '@mui/material';
// import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';

// const ResizableGrid = () => {
//   const { site_id, report_type_id } = useParams();
//   const [worksheetData, setWorksheetData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingCell, setEditingCell] = useState({ rowIndex: null, colId: null });
//   const [editValue, setEditValue] = useState('');
//   const [columnWidths, setColumnWidths] = useState({});
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const tableRef = useRef(null);
//   const resizingRef = useRef({ isResizing: false, columnId: null, startX: 0, startWidth: 0 });

//   // Track modified data
//   const [modifiedData, setModifiedData] = useState({});

//   // Fixed height values for consistent sizing
//   const TABLE_HEIGHT = 500;
//   const ROW_HEIGHT = 36;
//   const HEADER_HEIGHT = 36;

//   useEffect(() => {
//     const fetchWorksheetData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `http://localhost:5000/sheet/worksheet/${site_id}/${report_type_id}`
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log('Fetched worksheetData:', data);
//         setWorksheetData(data);
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching worksheet data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWorksheetData();
//   }, [site_id, report_type_id]);

//   const formatValue = (value, column) => {
//     if (value === null || value === undefined) return '';
//     if (column.includes('date') || column.includes('Date')) {
//       const date = new Date(value);
//       return date.toLocaleDateString('en-US', {
//         month: '2-digit',
//         day: '2-digit',
//         year: 'numeric',
//       }).replace(/\//g, '-');
//     }
//     return value;
//   };

//   const handleEditClick = (rowIndex, colId, value) => {
//     setEditingCell({ rowIndex, colId });
//     setEditValue(value != null ? value.toString() : '');
//   };

//   const handleSaveCell = (categoryIndex, subcategoryIndex, tableDataIndex) => {
//     if (editingCell.rowIndex === null || !editingCell.colId) return;

//     const newValue = editValue === '' ? null : parseFloat(editValue);
//     if (isNaN(newValue) && editValue !== '') {
//       setSnackbar({ open: true, message: 'Please enter a valid number', severity: 'error' });
//       return;
//     }

//     setWorksheetData((prevData) => {
//       if (!prevData?.data?.categories?.[categoryIndex]?.subcategories?.[subcategoryIndex]) {
//         console.error('Invalid data structure or indices');
//         return prevData;
//       }

//       const newData = JSON.parse(JSON.stringify(prevData));
//       const subcategory = newData.data.categories[categoryIndex].subcategories[subcategoryIndex];
//       const tableData = tableDataIndex === 'table_data' ? subcategory.table_data : subcategory.table_data[tableDataIndex];

//       if (!tableData?.data) {
//         console.error('Table data is missing');
//         return prevData;
//       }

//       const updatedRows = [...tableData.data];
//       const rowId = updatedRows[editingCell.rowIndex].report_id;
//       const columnName = editingCell.colId;
//       const columns = tableData.columns;

//       // Update the modified data state
//       setModifiedData(prev => {
//         const categoryName = newData.data.categories[categoryIndex].category_name;
//         const existingUpdates = prev[categoryName] || {};
//         const existingRowUpdates = existingUpdates[rowId] || {};

//         // Calculate the third column value if editing the first or second column
//         let calculatedThirdValue = null;
//         if (columns.length >= 3 && (columnName === columns[0] || columnName === columns[1])) {
//           const firstColValue = columnName === columns[0] ? newValue : parseFloat(updatedRows[editingCell.rowIndex][columns[0]]) || 0;
//           const secondColValue = columnName === columns[1] ? newValue : parseFloat(updatedRows[editingCell.rowIndex][columns[1]]) || 0;
//           calculatedThirdValue = (firstColValue * secondColValue).toFixed(2);
//         }

//         // Update modifiedData with the edited value and calculated third column value (if applicable)
//         const updatedRowUpdates = {
//           ...existingRowUpdates,
//           [columnName]: newValue
//         };
//         if (calculatedThirdValue !== null) {
//           updatedRowUpdates[columns[2]] = parseFloat(calculatedThirdValue);
//         }

//         return {
//           ...prev,
//           [categoryName]: {
//             ...existingUpdates,
//             [rowId]: updatedRowUpdates
//           }
//         };
//       });

//       // Update the row with the edited value
//       updatedRows[editingCell.rowIndex] = {
//         ...updatedRows[editingCell.rowIndex],
//         [editingCell.colId]: newValue,
//       };

//       // Update the third column if editing the first or second column
//       if (columns.length >= 3 && (columnName === columns[0] || columnName === columns[1])) {
//         const firstColValue = columnName === columns[0] ? newValue : parseFloat(updatedRows[editingCell.rowIndex][columns[0]]) || 0;
//         const secondColValue = columnName === columns[1] ? newValue : parseFloat(updatedRows[editingCell.rowIndex][columns[1]]) || 0;
//         updatedRows[editingCell.rowIndex][columns[2]] = (firstColValue * secondColValue).toFixed(2);
//       }

//       tableData.data = updatedRows;
//       return newData;
//     });

//     setEditingCell({ rowIndex: null, colId: null });
//     setEditValue('');
//   };

//   const handleSaveAll = async () => {
//     if (Object.keys(modifiedData).length === 0) {
//       setSnackbar({ open: true, message: 'No changes to save', severity: 'info' });
//       return;
//     }

//     try {
//       setLoading(true);

//       // Prepare the updates array for the API
//       const updates = [];

//       for (const [categoryName, rowUpdates] of Object.entries(modifiedData)) {
//         for (const [reportId, columnUpdates] of Object.entries(rowUpdates)) {
//           // Convert values to strings as per your API example
//           const stringValues = {};
//           for (const [colName, value] of Object.entries(columnUpdates)) {
//             stringValues[colName] = value !== null ? value.toString() : null;
//           }

//           updates.push({
//             report_id: parseInt(reportId),
//             report_type_id: parseInt(report_type_id),
//             category_name: categoryName,
//             values: stringValues
//           });
//         }
//       }

//       const response = await fetch('http://localhost:5000/sheet/worksheet/update', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           site_id,
//           updates
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('Save result:', result);

//       if (result.success) {
//         setSnackbar({ open: true, message: 'Data saved successfully', severity: 'success' });
//         setModifiedData({}); // Clear modified data after successful save
//       } else {
//         throw new Error(result.message || 'Failed to save data');
//       }
//     } catch (error) {
//       console.error('Error saving data:', error);
//       setSnackbar({ open: true, message: error.message || 'Failed to save data', severity: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMouseDown = (e, columnId, currentWidth) => {
//     resizingRef.current = {
//       isResizing: true,
//       columnId,
//       startX: e.clientX,
//       startWidth: currentWidth,
//     };
//     document.body.style.cursor = 'col-resize';
//     document.addEventListener('mousemove', handleMouseMove);
//     document.addEventListener('mouseup', handleMouseUp);
//   };

//   const handleMouseMove = (e) => {
//     if (!resizingRef.current.isResizing) return;

//     const deltaX = e.clientX - resizingRef.current.startX;
//     const newWidth = resizingRef.current.startWidth + deltaX;

//     setColumnWidths((prev) => ({
//       ...prev,
//       [resizingRef.current.columnId]: Math.max(80, newWidth),
//     }));
//   };

//   const handleMouseUp = () => {
//     resizingRef.current.isResizing = false;
//     document.body.style.cursor = '';
//     document.removeEventListener('mousemove', handleMouseMove);
//     document.removeEventListener('mouseup', handleMouseUp);
//   };

//   const shouldShowEditIcon = (column, columnIndex, isReportTable) => {
//     if (isReportTable) return false;
//     if (columnIndex === 2) return false;
//     return true;
//   };

//   const calculateThirdColumnValue = (row, columns) => {
//     if (columns.length < 3) return row[columns[2]] || '';
//     const firstColValue = parseFloat(row[columns[0]]) || 0;
//     const secondColValue = parseFloat(row[columns[1]]) || 0;
//     return (firstColValue * secondColValue).toFixed(2);
//   };

//   const renderTable = (
//     data,
//     columns,
//     title,
//     isReportTable,
//     categoryIndex,
//     subcategoryIndex,
//     tableDataIndex
//   ) => {
//     // Calculate the number of rows to determine if we need to add empty rows for consistent height
//     const rowCount = data.length;
//     const emptyRowsNeeded = Math.max(0, 10 - rowCount);

//     return (
//       <Paper
//         className="rounded-sm shadow-[0_0_0_1px_#d9d9d9] overflow-hidden"
//         style={{ 
//           height: TABLE_HEIGHT,
//           minWidth: '500px', 
//           marginRight: '16px',
//           display: 'flex',
//           flexDirection: 'column'
//         }}
//         ref={tableRef}
//       >
//         <Typography
//           variant="subtitle2"
//           className="bg-[#4472C4] text-white text-[11px] font-bold text-center p-[2px_4px]"
//           style={{ height: HEADER_HEIGHT, flexShrink: 0 }}
//         >
//           {title}
//         </Typography>
//         <TableContainer style={{ flex: 1, overflow: 'auto' }}>
//           <Table 
//             size="small" 
//             stickyHeader
//             style={{ tableLayout: 'fixed' }}
//           >
//             <TableHead>
//               <TableRow style={{ height: HEADER_HEIGHT }}>
//                 {columns.map((column, columnIndex) => {
//                   console.log(columnIndex);
                  
//                   const headerText = column
//                     .split('_')
//                     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//                     .join(' ');
//                   const width = columnWidths[column] || 150;

//                   return (
//                     <TableCell
//                       key={column}
//                       style={{
//                         width: width,
//                         backgroundColor: '#E9EBF5',
//                         padding: '4px 8px',
//                         position: 'relative',
//                         height: HEADER_HEIGHT,
//                       }}
//                     >
//                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <span style={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
//                           {headerText}
//                         </span>
//                         <div
//                           style={{
//                             position: 'absolute',
//                             right: 0,
//                             top: 0,
//                             bottom: 0,
//                             width: '4px',
//                             cursor: 'col-resize',
//                             backgroundColor: '#4472C4',
//                             opacity: 0,
//                             transition: 'opacity 0.2s',
//                           }}
//                           onMouseDown={(e) => handleMouseDown(e, column, width)}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.opacity = 1;
//                           }}
//                           onMouseLeave={(e) => {
//                             if (!resizingRef.current.isResizing) {
//                               e.currentTarget.style.opacity = 0;
//                             }
//                           }}
//                         />
//                       </div>
//                     </TableCell>
//                   );
//                 })}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {data.map((row, rowIndex) => {
//                 const calculatedRow = { ...row };
//                 if (columns.length >= 3) {
//                   calculatedRow[columns[2]] = calculateThirdColumnValue(row, columns);
//                 }

//                 return (
//                   <TableRow key={rowIndex} style={{ height: ROW_HEIGHT }}>
//                     {columns.map((column, columnIndex) => {
//                       const value = formatValue(calculatedRow[column], column);
//                       const width = columnWidths[column] || 150;
//                       const showEditIcon = shouldShowEditIcon(column, columnIndex, isReportTable);

//                       return (
//                         <TableCell
//                           key={`${rowIndex}-${column}`}
//                           style={{
//                             width: width,
//                             padding: '4px 8px',
//                             fontSize: '0.75rem',
//                             position: 'relative',
//                             height: ROW_HEIGHT,
//                           }}
//                         >
//                           {editingCell.rowIndex === rowIndex && editingCell.colId === column ? (
//                             <TextField
//                               autoFocus
//                               fullWidth
//                               value={editValue}
//                               onChange={(e) => {
//                                 const regex = /^[0-9]*\.?[0-9]*$/;
//                                 if (regex.test(e.target.value) || e.target.value === '') {
//                                   setEditValue(e.target.value);
//                                 }
//                               }}
//                               onBlur={() =>
//                                 handleSaveCell(categoryIndex, subcategoryIndex, tableDataIndex)
//                               }
//                               onKeyDown={(e) => {
//                                 if (e.key === 'Enter')
//                                   handleSaveCell(categoryIndex, subcategoryIndex, tableDataIndex);
//                                 if (e.key === 'Escape')
//                                   setEditingCell({ rowIndex: null, colId: null });
//                               }}
//                               size="small"
//                               variant="standard"
//                               InputProps={{ 
//                                 style: { 
//                                   fontSize: '0.75rem',
//                                   height: ROW_HEIGHT - 8,
//                                 } 
//                               }}
//                             />
//                           ) : (
//                             <div
//                               style={{
//                                 display: 'flex',
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                                 height: ROW_HEIGHT - 8,
//                               }}
//                             >
//                               <span>{value}</span>
//                               {showEditIcon && (
//                                 <IconButton
//                                   size="small"
//                                   onClick={() =>
//                                     handleEditClick(rowIndex, column, calculatedRow[column])
//                                   }
//                                   style={{ padding: '2px', marginLeft: '4px' }}
//                                 >
//                                   <EditIcon fontSize="inherit" />
//                                 </IconButton>
//                               )}
//                             </div>
//                           )}
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 );
//               })}
              
//               {/* Add empty rows to maintain consistent height */}
//               {Array.from({ length: emptyRowsNeeded }).map((_, emptyRowIndex) => (
//                 <TableRow key={`empty-${emptyRowIndex}`} style={{ height: ROW_HEIGHT }}>
//                   {columns.map((column) => (
//                     <TableCell 
//                       key={`empty-${emptyRowIndex}-${column}`}
//                       style={{ height: ROW_HEIGHT }}
//                     />
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     );
//   };

//   if (loading) {
//     return (
//       <Box className="flex justify-center items-center min-h-[100px]">
//         <CircularProgress size={20} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Alert severity="error" className="my-2 text-[0.8rem] p-[4px_8px]">
//         Error: {error}
//       </Alert>
//     );
//   }

//   if (!worksheetData || !worksheetData.success) {
//     return (
//       <Alert severity="info" className="my-2 text-[0.8rem] p-[4px_8px]">
//         No data available
//       </Alert>
//     );
//   }

//   const { categories, report_type_name, site_name, po_number } = worksheetData.data;

//   return (
//     <Box className="w-full overflow-auto p-2 bg-white min-h-[400px]">
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//         <Box
//           className="text-[11px] font-bold text-black p-[2px_6px] bg-[#f2f2f2] rounded-sm"
//           style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}
//         >
//           <Typography variant="subtitle2" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
//             Site: {site_name || site_id}
//           </Typography>
//           <Typography variant="subtitle2" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
//             PO Number: {po_number || 'N/A'}
//           </Typography>
//           <Typography variant="subtitle2" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
//             Report: {report_type_name || report_type_id}
//           </Typography>
//         </Box>
        
//         <Button
//           variant="contained"
//           color="primary"
//           size="small"
//           startIcon={<SaveIcon />}
//           onClick={handleSaveAll}
//           disabled={loading || Object.keys(modifiedData).length === 0}
//           style={{
//             backgroundColor: '#4472C4',
//             color: 'white',
//             textTransform: 'none',
//             fontSize: '0.75rem',
//             padding: '4px 12px',
//             minWidth: '80px'
//           }}
//         >
//           {loading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
//         </Button>
//       </Box>

//       <Box 
//         className="flex gap-4 overflow-x-auto items-start p-1" 
//         style={{ 
//           minHeight: `${TABLE_HEIGHT}px`,
//           alignItems: 'stretch'
//         }}
//       >
//         {categories[0]?.subcategories?.[0]?.table_data?.[report_type_name] && (
//           renderTable(
//             categories[0].subcategories[0].table_data[report_type_name],
//             ['report_id', 'date'],
//             report_type_name,
//             true,
//             0,
//             0,
//             report_type_name
//           )
//         )}

//         {categories.map((category, categoryIndex) =>
//           category.subcategories?.map((subcategory, subcategoryIndex) => {
//             if (subcategory.error) {
//               return (
//                 <Alert
//                   key={subcategory.subcategory_id}
//                   severity="error"
//                   className="mb-0 p-[4px_8px] text-[10px] min-w-[120px]"
//                   style={{ height: TABLE_HEIGHT, display: 'flex', alignItems: 'center' }}
//                 >
//                   {subcategory.error}
//                 </Alert>
//               );
//             }

//             const tableData = subcategory.table_data;

//             if (!tableData?.columns?.length || !tableData?.data) {
//               return (
//                 <Alert
//                   key={subcategory.subcategory_id}
//                   severity="info"
//                   className="mb-0 p-[4px_8px] text-[10px] min-w-[120px]"
//                   style={{ height: TABLE_HEIGHT, display: 'flex', alignItems: 'center' }}
//                 >
//                   No data available
//                 </Alert>
//               );
//             }

//             return (
//               <React.Fragment key={subcategory.subcategory_id}>
//                 {renderTable(
//                   tableData.data || [],
//                   tableData.columns,
//                   category.category_name,
//                   false,
//                   categoryIndex,
//                   subcategoryIndex,
//                   'table_data'
//                 )}
//               </React.Fragment>
//             );
//           })
//         )}
//       </Box>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert 
//           severity={snackbar.severity} 
//           onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ResizableGrid;
















import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Snackbar
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';

const ResizableGrid = () => {
  const { site_id, report_type_id } = useParams();
  const [worksheetData, setWorksheetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCell, setEditingCell] = useState({ rowIndex: null, colId: null });
  const [editValue, setEditValue] = useState('');
  const [columnWidths, setColumnWidths] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const tableRef = useRef(null);
  const resizingRef = useRef({ isResizing: false, columnId: null, startX: 0, startWidth: 0 });

  // Track modified data
  const [modifiedData, setModifiedData] = useState({});

  // Adjusted height values for more compact Excel-like UI
  const TABLE_HEIGHT = 400;
  const ROW_HEIGHT = 28;
  const HEADER_HEIGHT = 32;
  const DEFAULT_COLUMN_WIDTH = 80; // Reduced from 100 to make columns narrower

  useEffect(() => {
    const fetchWorksheetData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/sheet/worksheet/${site_id}/${report_type_id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched worksheetData:', data);
        setWorksheetData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching worksheet data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorksheetData();
  }, [site_id, report_type_id]);

  const formatValue = (value, column) => {
    if (value === null || value === undefined) return '';
    if (column.includes('date') || column.includes('Date')) {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }).replace(/\//g, '-');
    }
    return value;
  };

  const handleEditClick = (rowIndex, colId, value) => {
    setEditingCell({ rowIndex, colId });
    setEditValue(value != null ? value.toString() : '');
  };

  const handleSaveCell = (categoryIndex, subcategoryIndex, tableDataIndex) => {
    if (editingCell.rowIndex === null || !editingCell.colId) return;

    const newValue = editValue === '' ? null : parseFloat(editValue);
    if (isNaN(newValue) && editValue !== '') {
      setSnackbar({ open: true, message: 'Please enter a valid number', severity: 'error' });
      return;
    }

    setWorksheetData((prevData) => {
      if (!prevData?.data?.categories?.[categoryIndex]?.subcategories?.[subcategoryIndex]) {
        console.error('Invalid data structure or indices');
        return prevData;
      }

      const newData = JSON.parse(JSON.stringify(prevData));
      const subcategory = newData.data.categories[categoryIndex].subcategories[subcategoryIndex];
      const tableData = tableDataIndex === 'table_data' ? subcategory.table_data : subcategory.table_data[tableDataIndex];

      if (!tableData?.data) {
        console.error('Table data is missing');
        return prevData;
      }

      const updatedRows = [...tableData.data];
      const rowId = updatedRows[editingCell.rowIndex].report_id;
      const columnName = editingCell.colId;
      const columns = tableData.columns;

      // Update the modified data state
      setModifiedData(prev => {
        const categoryName = newData.data.categories[categoryIndex].category_name;
        const existingUpdates = prev[categoryName] || {};
        const existingRowUpdates = existingUpdates[rowId] || {};

        // Calculate the third column value if editing the first or second column
        let calculatedThirdValue = null;
        if (columns.length >= 3 && (columnName === columns[0] || columnName === columns[1])) {
          const firstColValue = columnName === columns[0] ? newValue : parseFloat(updatedRows[editingCell.rowIndex][columns[0]]) || 0;
          const secondColValue = columnName === columns[1] ? newValue : parseFloat(updatedRows[editingCell.rowIndex][columns[1]]) || 0;
          calculatedThirdValue = (firstColValue * secondColValue).toFixed(2);
        }

        // Update modifiedData with the edited value and calculated third column value (if applicable)
        const updatedRowUpdates = {
          ...existingRowUpdates,
          [columnName]: newValue
        };
        if (calculatedThirdValue !== null) {
          updatedRowUpdates[columns[2]] = parseFloat(calculatedThirdValue);
        }

        return {
          ...prev,
          [categoryName]: {
            ...existingUpdates,
            [rowId]: updatedRowUpdates
          }
        };
      });

      // Update the row with the edited value
      updatedRows[editingCell.rowIndex] = {
        ...updatedRows[editingCell.rowIndex],
        [editingCell.colId]: newValue,
      };

      // Update the third column if editing the first or second column
      if (columns.length >= 3 && (columnName === columns[0] || columnName === columns[1])) {
        const firstColValue = columnName === columns[0] ? newValue : parseFloat(updatedRows[editingCell.rowIndex][columns[0]]) || 0;
        const secondColValue = columnName === columns[1] ? newValue : parseFloat(updatedRows[editingCell.rowIndex][columns[1]]) || 0;
        updatedRows[editingCell.rowIndex][columns[2]] = (firstColValue * secondColValue).toFixed(2);
      }

      tableData.data = updatedRows;
      return newData;
    });

    setEditingCell({ rowIndex: null, colId: null });
    setEditValue('');
  };

  const handleSaveAll = async () => {
    if (Object.keys(modifiedData).length === 0) {
      setSnackbar({ open: true, message: 'No changes to save', severity: 'info' });
      return;
    }

    try {
      setLoading(true);

      // Prepare the updates array for the API
      const updates = [];

      for (const [categoryName, rowUpdates] of Object.entries(modifiedData)) {
        for (const [reportId, columnUpdates] of Object.entries(rowUpdates)) {
          // Convert values to strings as per your API example
          const stringValues = {};
          for (const [colName, value] of Object.entries(columnUpdates)) {
            stringValues[colName] = value !== null ? value.toString() : null;
          }

          updates.push({
            report_id: parseInt(reportId),
            report_type_id: parseInt(report_type_id),
            category_name: categoryName,
            values: stringValues
          });
        }
      }

      const response = await fetch('http://localhost:5000/sheet/worksheet/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          site_id,
          updates
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Save result:', result);

      if (result.success) {
        setSnackbar({ open: true, message: 'Data saved successfully', severity: 'success' });
        setModifiedData({}); // Clear modified data after successful save
      } else {
        throw new Error(result.message || 'Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setSnackbar({ open: true, message: error.message || 'Failed to save data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e, columnId, currentWidth) => {
    resizingRef.current = {
      isResizing: true,
      columnId,
      startX: e.clientX,
      startWidth: currentWidth,
    };
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!resizingRef.current.isResizing) return;

    const deltaX = e.clientX - resizingRef.current.startX;
    const newWidth = resizingRef.current.startWidth + deltaX;

    setColumnWidths((prev) => ({
      ...prev,
      [resizingRef.current.columnId]: Math.max(40, newWidth), // Reduced minimum width from 60px to 40px
    }));
  };

  const handleMouseUp = () => {
    resizingRef.current.isResizing = false;
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const shouldShowEditIcon = (column, columnIndex, isReportTable) => {
    if (isReportTable) return false;
    if (columnIndex === 2) return false;
    return true;
  };

  const calculateThirdColumnValue = (row, columns) => {
    if (columns.length < 3) return row[columns[2]] || '';
    const firstColValue = parseFloat(row[columns[0]]) || 0;
    const secondColValue = parseFloat(row[columns[1]]) || 0;
    return (firstColValue * secondColValue).toFixed(2);
  };

  const renderTable = (
    data,
    columns,
    title,
    isReportTable,
    categoryIndex,
    subcategoryIndex,
    tableDataIndex
  ) => {
    // Calculate the number of rows to determine if we need to add empty rows for consistent height
    const rowCount = data.length;
    const emptyRowsNeeded = Math.max(0, 10 - rowCount);

    return (
      <Paper
        className="rounded-sm shadow-[0_0_0_1px_#d9d9d9] overflow-hidden"
        style={{ 
          height: TABLE_HEIGHT,
          minWidth: '200px', // Reduced from 300px to allow more compact tables
          marginRight: '4px', // Reduced from 8px to minimize gap between tables
          display: 'flex',
          flexDirection: 'column'
        }}
        ref={tableRef}
      >
        <Typography
          variant="subtitle2"
          className="bg-[#4472C4] text-white text-[11px] font-bold text-center p-[2px_4px]"
          style={{ 
            height: HEADER_HEIGHT, 
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {title}
        </Typography>
        <TableContainer style={{ flex: 1, overflow: 'auto' }}>
          <Table 
            size="small" 
            stickyHeader
            style={{ tableLayout: 'fixed' }}
          >
            <TableHead>
              <TableRow style={{ height: HEADER_HEIGHT }}>
                {columns.map((column, columnIndex) => {
                  const headerText = column
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  const width = columnWidths[column] || DEFAULT_COLUMN_WIDTH;

                  return (
                    <TableCell
                      key={column}
                      style={{
                        width: width,
                        backgroundColor: '#E9EBF5',
                        padding: '2px 2px', // Reduced padding from '2px 4px' for more compact cells
                        position: 'relative',
                        height: HEADER_HEIGHT,
                        borderRight: '1px solid #d9d9d9',
                        borderBottom: '1px solid #d9d9d9'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ 
                          fontWeight: 'bold', 
                          fontSize: '0.7rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {headerText}
                        </span>
                        <div
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: '4px',
                            cursor: 'col-resize',
                            backgroundColor: '#4472C4',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                          }}
                          onMouseDown={(e) => handleMouseDown(e, column, width)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = 1;
                          }}
                          onMouseLeave={(e) => {
                            if (!resizingRef.current.isResizing) {
                              e.currentTarget.style.opacity = 0;
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, rowIndex) => {
                const calculatedRow = { ...row };
                if (columns.length >= 3) {
                  calculatedRow[columns[2]] = calculateThirdColumnValue(row, columns);
                }

                return (
                  <TableRow 
                    key={rowIndex} 
                    style={{ 
                      height: ROW_HEIGHT,
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    {columns.map((column, columnIndex) => {
                      const value = formatValue(calculatedRow[column], column);
                      const width = columnWidths[column] || DEFAULT_COLUMN_WIDTH;
                      const showEditIcon = shouldShowEditIcon(column, columnIndex, isReportTable);

                      return (
                        <TableCell
                          key={`${rowIndex}-${column}`}
                          style={{
                            width: width,
                            padding: '2px 2px', // Reduced padding from '2px 4px' for more compact cells
                            fontSize: '0.7rem',
                            position: 'relative',
                            height: ROW_HEIGHT,
                            borderRight: '1px solid #e0e0e0',
                            borderBottom: '1px solid #e0e0e0',
                            backgroundColor: rowIndex % 2 === 0 ? '#FFFFFF' : '#F9F9F9'
                          }}
                        >
                          {editingCell.rowIndex === rowIndex && editingCell.colId === column ? (
                            <TextField
                              autoFocus
                              fullWidth
                              value={editValue}
                              onChange={(e) => {
                                const regex = /^[0-9]*\.?[0-9]*$/;
                                if (regex.test(e.target.value) || e.target.value === '') {
                                  setEditValue(e.target.value);
                                }
                              }}
                              onBlur={() =>
                                handleSaveCell(categoryIndex, subcategoryIndex, tableDataIndex)
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter')
                                  handleSaveCell(categoryIndex, subcategoryIndex, tableDataIndex);
                                if (e.key === 'Escape')
                                  setEditingCell({ rowIndex: null, colId: null });
                              }}
                              size="small"
                              variant="standard"
                              InputProps={{ 
                                style: { 
                                  fontSize: '0.7rem',
                                  height: ROW_HEIGHT - 4,
                                  padding: '0 2px' // Reduced padding for input field
                                },
                                disableUnderline: true
                              }}
                              style={{
                                width: '100%',
                                height: ROW_HEIGHT - 4
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                height: ROW_HEIGHT - 4,
                                width: '100%',
                                padding: '0 2px' // Reduced padding for cell content
                              }}
                            >
                              <span style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: 'calc(100% - 24px)'
                              }}>
                                {value}
                              </span>
                              {showEditIcon && (
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleEditClick(rowIndex, column, calculatedRow[column])
                                  }
                                  style={{ 
                                    padding: '2px', 
                                    marginLeft: '2px', // Reduced margin for edit icon
                                    width: '20px',
                                    height: '20px'
                                  }}
                                >
                                  <EditIcon fontSize="inherit" style={{ fontSize: '0.8rem' }} />
                                </IconButton>
                              )}
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              
              {/* Add empty rows to maintain consistent height */}
              {Array.from({ length: emptyRowsNeeded }).map((_, emptyRowIndex) => (
                <TableRow 
                  key={`empty-${emptyRowIndex}`} 
                  style={{ 
                    height: ROW_HEIGHT,
                    backgroundColor: (emptyRowIndex + data.length) % 2 === 0 ? '#FFFFFF' : '#F9F9F9'
                  }}
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={`empty-${emptyRowIndex}-${column}`}
                      style={{ 
                        height: ROW_HEIGHT,
                        borderRight: '1px solid #e0e0e0',
                        borderBottom: '1px solid #e0e0e0'
                      }}
                    />
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-[100px]">
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="my-2 text-[0.8rem] p-[4px_8px]">
        Error: {error}
      </Alert>
    );
  }

  if (!worksheetData || !worksheetData.success) {
    return (
      <Alert severity="info" className="my-2 text-[0.8rem] p-[4px_8px]">
        No data available
      </Alert>
    );
  }

  const { categories, report_type_name, site_name, po_number } = worksheetData.data;

  return (
    <Box className="w-full overflow-auto p-2 bg-white min-h-[400px]">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Box
          className="text-[11px] font-bold text-black p-[2px_6px] bg-[#f2f2f2] rounded-sm"
          style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}
        >
          <Typography variant="subtitle2" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
            Site: {site_name || site_id}
          </Typography>
          <Typography variant="subtitle2" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
            PO Number: {po_number || 'N/A'}
          </Typography>
          <Typography variant="subtitle2" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
            Report: {report_type_name || report_type_id}
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<SaveIcon />}
          onClick={handleSaveAll}
          disabled={loading || Object.keys(modifiedData).length === 0}
          style={{
            backgroundColor: '#4472C4',
            color: 'white',
            textTransform: 'none',
            fontSize: '0.75rem',
            padding: '4px 12px',
            minWidth: '80px',
            height: '32px'
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
        </Button>
      </Box>

      <Box 
        className="flex gap-1 overflow-x-auto items-start p-1" // Reduced gap from 2 to 1
        style={{ 
          minHeight: `${TABLE_HEIGHT}px`,
          alignItems: 'stretch'
        }}
      >
        {categories[0]?.subcategories?.[0]?.table_data?.[report_type_name] && (
          renderTable(
            categories[0].subcategories[0].table_data[report_type_name],
            ['report_id', 'date'],
            report_type_name,
            true,
            0,
            0,
            report_type_name
          )
        )}

        {categories.map((category, categoryIndex) =>
          category.subcategories?.map((subcategory, subcategoryIndex) => {
            if (subcategory.error) {
              return (
                <Alert
                  key={subcategory.subcategory_id}
                  severity="error"
                  className="mb-0 p-[4px_8px] text-[10px] min-w-[120px]"
                  style={{ height: TABLE_HEIGHT, display: 'flex', alignItems: 'center' }}
                >
                  {subcategory.error}
                </Alert>
              );
            }

            const tableData = subcategory.table_data;

            if (!tableData?.columns?.length || !tableData?.data) {
              return (
                <Alert
                  key={subcategory.subcategory_id}
                  severity="info"
                  className="mb-0 p-[4px_8px] text-[10px] min-w-[120px]"
                  style={{ height: TABLE_HEIGHT, display: 'flex', alignItems: 'center' }}
                >
                  No data available
                </Alert>
              );
            }

            return (
              <React.Fragment key={subcategory.subcategory_id}>
                {renderTable(
                  tableData.data || [],
                  tableData.columns,
                  category.category_name,
                  false,
                  categoryIndex,
                  subcategoryIndex,
                  'table_data'
                )}
              </React.Fragment>
            );
          })
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResizableGrid;