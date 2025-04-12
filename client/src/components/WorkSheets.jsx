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
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const ResizableGrid = () => {
  const { site_id, report_type_id } = useParams();
  const [worksheetData, setWorksheetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCell, setEditingCell] = useState({ rowIndex: null, colId: null });
  const [editValue, setEditValue] = useState('');
  const [columnWidths, setColumnWidths] = useState({});
  const tableRef = useRef(null);
  const resizingRef = useRef({ isResizing: false, columnId: null, startX: 0, startWidth: 0 });

  // Fixed height values for consistent sizing
  const TABLE_HEIGHT = 500;
  const ROW_HEIGHT = 36;
  const HEADER_HEIGHT = 36;

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

  const handleSave = (categoryIndex, subcategoryIndex, tableDataIndex) => {
    if (editingCell.rowIndex === null || !editingCell.colId) return;

    const newValue = editValue === '' ? '' : parseFloat(editValue);
    if (isNaN(newValue) && editValue !== '') {
      alert('Please enter a valid number');
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
      updatedRows[editingCell.rowIndex] = {
        ...updatedRows[editingCell.rowIndex],
        [editingCell.colId]: newValue,
      };
      tableData.data = updatedRows;
      return newData;
    });

    setEditingCell({ rowIndex: null, colId: null });
    setEditValue('');
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
      [resizingRef.current.columnId]: Math.max(80, newWidth),
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
    const emptyRowsNeeded = Math.max(0, 10 - rowCount); // Adjust 10 to your desired minimum rows

    return (
      <Paper
        className="rounded-sm shadow-[0_0_0_1px_#d9d9d9] overflow-hidden"
        style={{ 
          height: TABLE_HEIGHT,
          minWidth: '500px', 
          marginRight: '16px',
          display: 'flex',
          flexDirection: 'column'
        }}
        ref={tableRef}
      >
        <Typography
          variant="subtitle2"
          className="bg-[#4472C4] text-white text-[11px] font-bold text-center p-[2px_4px]"
          style={{ height: HEADER_HEIGHT, flexShrink: 0 }}
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
                  console.log(columnIndex);
                  
                  const headerText = column
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  const width = columnWidths[column] || 150;

                  return (
                    <TableCell
                      key={column}
                      style={{
                        width: width,
                        backgroundColor: '#E9EBF5',
                        padding: '4px 8px',
                        position: 'relative',
                        height: HEADER_HEIGHT,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
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
                  <TableRow key={rowIndex} style={{ height: ROW_HEIGHT }}>
                    {columns.map((column, columnIndex) => {
                      const value = formatValue(calculatedRow[column], column);
                      const width = columnWidths[column] || 150;
                      const showEditIcon = shouldShowEditIcon(column, columnIndex, isReportTable);

                      return (
                        <TableCell
                          key={`${rowIndex}-${column}`}
                          style={{
                            width: width,
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            position: 'relative',
                            height: ROW_HEIGHT,
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
                                handleSave(categoryIndex, subcategoryIndex, tableDataIndex)
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter')
                                  handleSave(categoryIndex, subcategoryIndex, tableDataIndex);
                                if (e.key === 'Escape')
                                  setEditingCell({ rowIndex: null, colId: null });
                              }}
                              size="small"
                              variant="standard"
                              InputProps={{ 
                                style: { 
                                  fontSize: '0.75rem',
                                  height: ROW_HEIGHT - 8, // Adjust for padding
                                } 
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                height: ROW_HEIGHT - 8, // Adjust for padding
                              }}
                            >
                              <span>{value}</span>
                              {showEditIcon && (
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleEditClick(rowIndex, column, calculatedRow[column])
                                  }
                                  style={{ padding: '2px', marginLeft: '4px' }}
                                >
                                  <EditIcon fontSize="inherit" />
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
                <TableRow key={`empty-${emptyRowIndex}`} style={{ height: ROW_HEIGHT }}>
                  {columns.map((column) => (
                    <TableCell 
                      key={`empty-${emptyRowIndex}-${column}`}
                      style={{ height: ROW_HEIGHT }}
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

  const { categories, report_type_name } = worksheetData.data;

  return (
    <Box className="w-full overflow-auto p-2 bg-white min-h-[400px]">
      <Typography className="text-[11px] font-bold mb-1 text-black p-[2px_6px] bg-[#f2f2f2] inline-block">
        {site_id} - {report_type_name || report_type_id}
      </Typography>

      <Box 
        className="flex gap-4 overflow-x-auto items-start p-1" 
        style={{ 
          minHeight: `${TABLE_HEIGHT}px`,
          alignItems: 'stretch' // Ensures all tables stretch to same height
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
    </Box>
  );
};

export default ResizableGrid;