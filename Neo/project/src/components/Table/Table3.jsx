import React, { useState } from "react";
import sendBtn from "../../images/sendBtn.png";
import TableHead from "../TableHead";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useEffect ,useRef} from "react";
import styles from "./Table.module.css"
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ListItemIcon } from "@mui/material";

const Table3 = ({
  tableData,
  headings,
  userId,
  onRowClick,
  setTableData,
  setDistributorNameInput,
  setSelectedFile,
  setFundNameInput,
  onFileDownload,
  curStatus
}) => {



  const tableRef = useRef(null);
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [distributorFilterValue, setDistributorFilterValue] = useState("");
  const [fundFilterValue, setFundFilterValue] = useState("");
  const [statusFilterValue, setStatusFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  useEffect(() => {
    if (curStatus || curStatus==="") {
      setDistributorFilterValue(curStatus);
      // tableRef.current.scrollIntoView({ behavior: "smooth" });
      // tableRef.current.scrollIntoView({ behavior: "auto" });
      // tableRef.current.focus();
    }
  }, [curStatus]);

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

    const selectedIndex = selectedRows.findIndex(
      (row) => row.id === rowData.id
    );
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

  const clearAllFields = () => {
    document.getElementById("dist-name").value = "";
    document.getElementById("select-fund").value = "";
    document.getElementById("invoice-date").value = "";
    setSelectedFile(null);
    document.getElementById("amnt").value = "";
    document.getElementById("total").value = "";
    setDistributorNameInput("");
    setFundNameInput("");
  };

  const handleFileDownload = (filePath) => {
    // Call the onFileDownload function passed from the parent component
    onFileDownload(filePath);
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleRowClick = (rowData) => {
    // Pass the clicked row data to the parent component
    onRowClick(rowData);
  };

  const handleDump = async () => {
    if (selectedRows.length === 0) {
      alert("No rows selected to dump");
      return;
    }
    alert("Dumped to excel");

    const headerRow = [
      "Id",
      "Distributor Name",
      "Fund Name",
      "Invoice Month",
      "Gst Category",
      "Tds Category",
      "Fee Type",
      "Brokerage Amount",
      "Brokerage Calculation File",
      "Invoice File",
      "Status",
    ];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Add header row
    // Add header row
    const headerRowExcel = worksheet.addRow(headerRow);

    // Style the header row
    headerRowExcel.eachCell((cell, colNumber) => {
      cell.font = { bold: true }; // Make the text bold
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" }, // Yellow background color
      };
    });

    // Add data rows
    selectedRows.forEach((rowData) => {
      const FeeTypes = rowData.feeTypeCode.map((item) => item || "").join(", ");

      const rowValues = [
        rowData.id || "",
        rowData.distributorName || "",
        rowData.fundName || "",
        rowData.invoiceMonth || "",
        rowData.gstCategoryCode || rowData.gstCategory || "",
        rowData.tdcCategoryCode || rowData.tdsCategory || "",
        FeeTypes || "",
        rowData.totalAmount || "",
        rowData.brokerageFileRow
          ? rowData.brokerageFileRow.folderPath
          : rowData.brokerageFile || "",
        rowData.invoiceFileRow
          ? rowData.invoiceFileRow.folderPath
          : rowData.invoiceFile || "",
        rowData.statusName || "",
      ];
      worksheet.addRow(rowValues);
    });

    worksheet.columns = [
      { key: "Id", width: 10 },
      { key: "Distributor Name", width: 25 },
      { key: "Fund Name", width: 30 },
      { key: "Invoice Month", width: 15 },
      { key: "GST Category", width: 10 },
      { key: "TDS Category", width: 10 },
      { key: "Fee Type", width: 20 },
      { key: "Brokerage Amount", width: 10 },
      { key: "Brokerage File", width: 30 },
      { key: "Invoice File", width: 30 },
      { key: "Status", width: 10 },
    ];

    worksheet.columns.forEach((column) => {
      column.alignment = { wrapText: true };
    });

    // Adjust row heights based on content
    worksheet.eachRow((row, rowNumber) => {
      let maxHeight = 15; // default row height
      row.eachCell((cell) => {
        const lines = cell.value.toString().split("\n").length;
        if (lines > 1) {
          maxHeight = Math.max(maxHeight, lines * 15);
        }
      });
      row.height = maxHeight;
    });

    // Create a Blob from the workbook and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "selected_table_data.xlsx";

    // Simulate a click on the link to trigger the download
    link.click();
  };

  // const filteredTableData = tableData.filter(
  //   (row) =>
  //     row.distributorName
  //       .toLowerCase()
  //       .includes(distributorFilterValue.toLowerCase()) &&
  //     row.fundName.toLowerCase().includes(fundFilterValue.toLowerCase())
  //     &&
  //     row.statusName.toLowerCase()
  //     .includes(statusFilterValue.toLowerCase())
  // );

  const filteredTableData = tableData.filter((row) => {
    // Convert filter value to lowercase for case-insensitive comparison
    const filterValueLower = distributorFilterValue.toLowerCase();

    // Special case for "Exceeding 2 days" filter
    if (filterValueLower === "exceeding 2 days" || filterValueLower === "exceeding 3 days") {
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
  }, [distributorFilterValue, fundFilterValue, statusFilterValue]);

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

  const iconStyles = {
    listItemIcon: {
      height:"35px",
      width:"35px !important",
      backgroundColor: '#66615b',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0px', // Adjust padding to make it look like a button
     
    },
    icon: {
      color: '#009ef7',
      cursor:"pointer",
     
    },
  };

  return (
    <div className={styles.distributorMasterTable} ref={tableRef}>
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
                {/* <input
                  type="text"
                  placeholder="Fund Name"
                  value={fundFilterValue}
                  onChange={(e) => setFundFilterValue(e.target.value)}
                  className={styles.filterInput}
                />
                <input
                  type="text"
                  placeholder="Status Name"
                  value={statusFilterValue}
                  onChange={(e) => setStatusFilterValue(e.target.value)}
                  className={styles.filterInput}
                /> */}
              </div>
            </div>
            <span className={styles.tableAction}>
              <img
                className={styles.sendButton}
                src={sendBtn}
                alt=""
                id="dump"
                onClick={handleDump}
                title="Dump to excel"
              />
            </span>
          </div>
          <div className={styles.tableContainer}>
          {currentRows.length > 0 ?

          <table>
        
            <TableHead headings={headings} onSelectAll={handleSelectAll} />
            <tbody>
              {currentRows.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className={`${styles.tableRow} ${
                    item.TAT === "red"
                      ? styles.rowRejected
                      : item.TAT === "green"
                      ? styles.green
                      : ""
                  }`}
                >
                  <td>{item.id}</td>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => toggleRowSelection(item)}
                      checked={selectedRows.some((row) => row.id === item.id)}
                    />
                  </td>
                  <td>{item.distributorName}</td>
                  <td>{item.fundName}</td>
                  <td>{item.invoiceMonth}</td>
                  <td>{item.gstCategoryCode}</td>
                  <td>{item.tdcCategoryCode}</td>
                  <td>{(item.feeTypeCode && item.feeTypeCode.join(", ")) || item.feeType.join(", ")}</td>
                  <td>{item.totalAmount}</td>
                  <td
                    className={styles.downloadLink}
                    onClick={() =>
                      handleFileDownload(
                        item.brokerageFileRow
                          ? item.brokerageFileRow.folderPath
                          : item.brokerageFile
                      )
                    }
                  >
                    {(item.brokerageFileRow && item.brokerageFileRow.folderPath) || item.brokerageFile ? (
                       <span><ListItemIcon>
                       <FileDownloadIcon style={iconStyles.icon}/>
                       </ListItemIcon></span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td
                    className={styles.downloadLink}
                    onClick={() =>
                      handleFileDownload(
                        item.invoiceFileRow
                          ? item.invoiceFileRow.folderPath
                          : item.invoiceFile
                      )
                    }
                  >
                    {(item.invoiceFileRow && item.invoiceFileRow.folderPath) || item.invoiceFile ? (
                       <span><ListItemIcon>
                       <FileDownloadIcon  style={iconStyles.icon}/>
                       </ListItemIcon></span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>{item.statusName}</td>
                  <td>{item.utrnumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
          :
          <div className={styles.noDataFound}>No Data Found</div>
            }
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

export default Table3;
