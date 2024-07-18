import React, { useState } from "react";
import sendBtn from "../../images/sendBtn.png";
import TableHead from "../TableHead";
import { useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import styles from "./Table.module.css"

const TableUser = ({ tableData,handleRowClick,setTableData}) => {

    const [selectedRows, setSelectedRows] = useState([]);

    const [distributorFilterValue, setDistributorFilterValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);


    const onRowClick=(item)=>{
        handleRowClick(item);
    }
  

    const toggleRowSelection = (rowData) => {
        const updatedTableData = tableData.map((row) => {
            if (row.id === rowData.id) {
                return {
                    ...row,
                    isSelected: !row.isSelected,
                };
            }
            return row;
         });
    
        setTableData(updatedTableData);
    
        const selectedIndex = selectedRows.findIndex((row) => row.id === rowData.id);
        if (selectedIndex === -1) {
            setSelectedRows([...selectedRows, { ...rowData, isSelected: true }]);
        } else {
            const updatedRows = [...selectedRows];
            updatedRows.splice(selectedIndex, 1);
            setSelectedRows(updatedRows);
        }
    };

    const handleSelectAll = (event) => {
        const updatedTableData = tableData.map((row) => ({
            ...row,
            isSelected: event.target.checked,
        }));
    
        setTableData(updatedTableData);
    
        if (event.target.checked) {
            const selectedRows = tableData.map((row) => ({
                ...row,
                isSelected: true,
            }));
            setSelectedRows(selectedRows);
        } else {
            setSelectedRows([]);
        }
    };



    const handleDump = async () => {
        if (selectedRows.length === 0) {
            alert("No rows selected to dump");
            return;
        }
        alert("Dumped to excel");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Selected Rows");

        // Add header row
        const headerRow=[
            "User Id", "User Name", "Email Id", "Mobile Number",
            "Role","Status"
        ];

         // Add header row
         const headerRowExcel=worksheet.addRow(headerRow);

         // Style the header row
         headerRowExcel.eachCell((cell, colNumber) => {
             cell.font = { bold: true }; // Make the text bold
             cell.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'FFFF00' }, // Yellow background color
     };
          });   

        // Add selected rows data
        selectedRows.forEach((rowData) => {
            worksheet.addRow([
                rowData.id || "",
                rowData.username || "",
                rowData.email || "",
                rowData.mobile_no || "",
                rowData.roleCode || "",
                rowData.isactive === 1 ? "Active" : "InActive"
            ]);
        });

        worksheet.columns = [
            { key: 'User Id', width: 10 },
            { key: 'User Name', width: 25 },
            { key: 'Email ID', width: 30 },
            { key: 'Mobile Number', width: 15 },
            { key: 'Role', width: 15 },
            { key: 'Status', width: 10 }
        ];
    
        worksheet.columns.forEach(column => {
            column.alignment = { wrapText: true };
        });
    
        // Adjust row heights based on content
        worksheet.eachRow((row, rowNumber) => {
            let maxHeight = 15; // default row height
            row.eachCell((cell) => {
                const lines = cell.value.toString().split('\n').length;
                if (lines > 1) {
                    maxHeight = Math.max(maxHeight, lines * 15);
                }
            });
            row.height = maxHeight;
        });

        

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        saveAs(blob, "selected_table_data.xlsx");
    };

    const filteredTableData = tableData.filter((row) => {
        // Convert filter value to lowercase for case-insensitive comparison
        const filterValueLower = distributorFilterValue.toLowerCase();
    
        // Special case for "Exceeding 2 days" filter
        if (filterValueLower === "exceeding 2 days") {
          return row.TAT === "red";
        }
    
        // Special case for "ALL" filter
        if (filterValueLower === "all") {
          return true;
        }
    
        // General case: Check if any column in the row contains the filter value
        return Object.values(row).some((value) => {
          if (value === null || value === undefined) {
            return false;
          } else if (typeof value === "string") {
            return value.toLowerCase().includes(filterValueLower);
          } else if (typeof value === "number") {
            return value.toString().includes(distributorFilterValue);
          } else if (typeof value === "boolean") {
            return value.toString().includes(distributorFilterValue);
          } else if (Array.isArray(value)) {
            return value.some((item) =>
              item.toString().toLowerCase().includes(filterValueLower)
            );
          } else {
            return false;
          }
        });
      });
    
  
      useEffect(() => {
        setCurrentPage(1);
      }, [distributorFilterValue]);
    
      const indexOfLastRow = currentPage * rowsPerPage;
      const indexOfFirstRow = indexOfLastRow - rowsPerPage;
      const currentRows = filteredTableData.slice(indexOfFirstRow, indexOfLastRow);
    
      const totalPages = Math.ceil(filteredTableData.length / rowsPerPage);
    
      const handleChangePage = (pageNumber) => {
        setCurrentPage(pageNumber);
      };
    
      const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1); // Reset to first page when changing rows per page
      };

    return (
        <div className={styles.distributorMasterTable}>
            {tableData.length > 0 && (
                <>
                    <div className={styles.tableHeader}>
                    <div className={styles.tableHeaderLeft}>
                        <span className={styles.tableTitle}>User List</span>
                        <div>
                <input
                  type="text"
                  placeholder="Search"
                  value={distributorFilterValue}
                  onChange={(e) => setDistributorFilterValue(e.target.value)}
                  className={styles.filterInput}
                />
              </div>
              </div>
                        <span className={styles.tableAction}>
                            <img className={styles.sendButton} src={sendBtn} alt="" onClick={handleDump} />
                        </span>
                    </div>
                    <div className={styles.tableContainer}>
                    {currentRows.length > 0 ? (
                    <table>
                        <thead>
                            <tr className="table-header-row">
                                <th>User ID</th>
                                <th><input type="checkbox" onChange={handleSelectAll} /></th>
                                <th>User Name</th>
                                <th>Email ID</th>
                                <th>Mobile Number</th>
                                <th>Role</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.map((item) => (
                                <tr key={item.id} onClick={() => onRowClick(item)} className="table-row">
                                    <td>{item.id}</td>
                                    <td><input type="checkbox" onChange={() => toggleRowSelection(item)} checked={selectedRows.some((row) => row.id === item.id)} /></td>
                                    <td>{item.username}</td>
                                    <td>{item.email}</td>
                                    <td>{item.mobile_no}</td>
                                    <td>{item.roleCode}</td>
                                    <td>{item.isactive === 1 ? "Active" : "InActive"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                      ) : (
                        <div className={styles.noDataFound}>No Data Found</div>
                      )}
                    </div>
                      <div className={styles.pagination}>
                        <span className={styles.rowsVisible}>
                          <select
                            value={rowsPerPage}
                            onChange={handleChangeRowsPerPage}
                            className={styles.rowsPerPageSelect}
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                          </select>
                          rows visible
                        </span>
                        <div>
                          <span>
                            <button
                              className={styles.pageButton}
                              onClick={() => handleChangePage(1)}
                              disabled={currentPage === 1}
                            >
                              &laquo;
                            </button>
                            <button
                              className={styles.pageButton}
                              onClick={() => handleChangePage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              &lsaquo;
                            </button>
                          </span>
                          {[...Array(totalPages)].map((_, index) => (
                            <button
                              key={index + 1}
                              className={`${styles.pageButton} ${
                                currentPage === index + 1 ? styles.currentPage : ""
                              }`}
                              onClick={() => handleChangePage(index + 1)}
                            >
                              {index + 1}
                            </button>
                          ))}
                          <span>
                            <button
                              className={styles.pageButton}
                              onClick={() => handleChangePage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              &rsaquo;
                            </button>
                            <button
                              className={styles.pageButton}
                              onClick={() => handleChangePage(totalPages)}
                              disabled={currentPage === totalPages}
                            >
                              &raquo;
                            </button>
                          </span>
                        </div>
                      </div>
                </>
            )}
        </div>
    );
    
};

export default TableUser;
