import React, { useState ,useEffect} from "react";
import sendBtn from "../../images/sendBtn.png";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import styles from "./Table.module.css"

const Table = ({ tableData,handleRowClick,setTableData}) => {

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
            "Id", "Distributor Name", "Distributor Email", "Distributor Mobile",
            "Contact Person Name", "Contact Email", "Contact Mobile Number",
            "Distributor ARN", "Distributor PAN", "Status"
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
            const contactNames = rowData.data.map(item => item.name || item.username || "").join(", ");
            const contactEmails = rowData.data.map(item => item.email || "").join(", ");
            const contactMobiles = rowData.data.map(item => item.mobile || item.mobile_no || "").join(", ");
            
            worksheet.addRow([
                rowData.id || "",
                rowData.distName || "",
                rowData.distEmail || "",
                rowData.distMobile || "",
                contactNames,
                contactEmails,
                contactMobiles,
                rowData.distARN || "",
                rowData.distPAN || "",
                rowData.isActive === 1 ? "Active" : "InActive"
            ]);
        });

        worksheet.columns = [
            { key: 'Id', width: 10 },
            { key: 'Distributor Name', width: 25 },
            { key: 'Distributor Email', width: 30 },
            { key: 'Distributor Mobile', width: 15 },
            { key: 'Contact Person Name', width: 30 },
            { key: 'Contact Email', width: 30 },
            { key: 'Contact Mobile Number', width: 20 },
            { key: 'Distributor ARN', width: 15 },
            { key: 'Distributor PAN', width: 15 },
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
        <div className={styles.distributorMasterTable} style={{padding:"5px"}}>
          {tableData.length > 0 && (
            <>
              <div className={styles.tableHeader}>
              <div className={styles.tableHeaderLeft}>
                <span className={styles.tableTitle}>Distributor List</span>
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
              <table >
                <thead>
                  <tr>
                    <th>Id</th>
                    <th><input type="checkbox" onChange={handleSelectAll}  /></th>
                    <th>Distributor Name</th>
                    <th>Distributor Email</th>
                    <th>Distributor Mobile</th>
                    <th>Contact Person Name</th>
                    <th>Contact Email </th>
                    <th>Contact Mobile Number</th>
                    <th>Distributor ARN</th>
                    <th>Distributor PAN</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((item) => (
                    <tr key={item.id} onClick={()=>onRowClick(item)}>
                      <td>{item.id}</td>
                      <td><input type="checkbox" onChange={() => toggleRowSelection(item)} checked={selectedRows.some((row) => row.id === item.id)} /></td>
                      <td>{item.distName}</td>
                      <td>{item.distEmail}</td>
                      <td>{item.distMobile}</td>
                      <td >
                        {item.data.map((k, index) => (
                          <div
                            key={index}
                            style={{
                              width: "100%",
                              borderBottom: index !== item.data.length - 1 ? "1px solid #ddd" : "none",
                              padding: "5px 0"
                            }}
                          >
                            {k.name || k.username}
                          </div>
                        ))}
                      </td>
                      <td style={{padding:"0px"}}>
                        {item.data.map((k, index) => (
                          <div
                            key={index}
                            style={{
                              width: "100%",
                              borderBottom: index !== item.data.length - 1 ? "1px solid #ddd" : "none",
                              padding: "5px 0"
                            }}
                          >
                            {k.email}
                          </div>
                        ))}
                      </td>
                      <td >
                        {item.data.map((k, index) => (
                          <div
                            key={index}
                            style={{
                              width: "100%",
                              borderBottom: index !== item.data.length - 1 ? "1px solid #ddd" : "none",
                              padding: "5px 0"
                            }}
                          >
                            {k.mobile || k.mobile_no}
                          </div>
                        ))}
                      </td>
                      <td>{item.distARN}</td>
                      <td>{item.distPAN}</td>
                      <td>{item.isActive===1? "Active" : "InActive"}</td>
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

export default Table;
