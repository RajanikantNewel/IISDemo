import React, { useState } from "react";
import sendBtn from "../images/sendBtn.png";
import TableHead from "./TableHead";
import axios from "axios";
import Table2Excel from 'table-to-excel';

const Table2 = ({ tableData, headings,userId,onRowClick ,setTableData,setDistributorNameInput,setSelectedFile,setFundNameInput,onFileDownload}) => {
    const [remarks, setRemarks] = useState("");
    const [file, setFile] = useState(null);


    const [selectedRows, setSelectedRows] = useState([]);

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
    const handleFileDownload = (filePath) => {
        // Call the onFileDownload function passed from the parent component
        onFileDownload(filePath);
    };


    const clearAllFields=()=>{
        document.getElementById("dist-name").value = "";
        document.getElementById("select-fund").value = "";
        document.getElementById("invoice-date").value = "";
        setSelectedFile(null);
        document.getElementById("amnt").value = "";
        document.getElementById("total").value = "";
        setDistributorNameInput("");
        setFundNameInput("");
    }

    // const handleRemarksChange = (event) => {
    //     setRemarks(event.target.value);
    // };

    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleRowClick = (rowData) => {
      
            // Pass the clicked row data to the parent component
            onRowClick(rowData);
        
    };

    const getMonth=(date)=>{

        const regex = /^[a-zA-Z]{3}$/;
        // Test if the string matches the regular expression
        if(regex.test(date)) return date;
            // Assuming invoiceDate is your DataTypes.DATE formatted date
        const invoiceDate =new Date(date); // Replace this with your actual date

        // Get the month index (0-based)
        const monthIndex = invoiceDate.getMonth();

        // Define an array of month names or abbreviations
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Get the month name or abbreviation using the month index
        const month = monthNames[monthIndex];

        return month;
    } 


    const handleSendToChecker = (rowData,index) => {
        console.log(rowData);
        // Making API call to update status
        // Replace 'your_api_url' with your actual API endpoint
        axios.post('http://localhost:1400/api/invoice/send-to-checker', {
            brokerageId: rowData.id,
            statusName: "Pending Approval",
            userId // Include status based on rowData.statusName
        })
        .then(response => {
            // Handle success response
            // console.log(res)
            const updatedTableData = [...tableData];
            updatedTableData[index].statusName = "Pending Approval";
            updatedTableData[index].showSendButton = false;
            setTableData(updatedTableData);
            clearAllFields();
    })
        .catch(error => {
            // Handle error response
            console.error("Failed to update status:", error);
        });
    };


    const handleDump = () => {
        if (selectedRows.length === 0) {
            alert("No rows selected to dump");
            return;
        }
        alert("Dumped to excel")
    
        const headerRow=["Distributor Name","Fund Name","Invoice Month","Gst Category","Tds Category","Fee Type","Brokerage Amount","Brokerage Calculation File","Invoice File"]
        const csv = [];
        csv.push(headerRow.join(","));
    
        selectedRows.forEach((rowData) => {
            const rowValues = [];
            rowValues.push(rowData.distributorName || "");
            rowValues.push(rowData.fundName || "");
            rowValues.push(rowData.invoiceMonth || "");
            rowValues.push(rowData.gstCategoryCode || rowData.gstCategory || "");
            rowValues.push(rowData.tdcCategoryCode || rowData.tdsCategory || "");
            rowValues.push(rowData.feeTypeCode || rowData.feeType || "");
            rowValues.push(rowData.totalAmount || "");
            rowValues.push(
                rowData.brokerageFileRow
                    ? rowData.brokerageFileRow.folderPath
                    : rowData.brokerageFile || ""
            );
            rowValues.push(
                rowData.invoiceFileRow
                    ? rowData.invoiceFileRow.folderPath
                    : rowData.invoiceFile || ""
            );
    
            csv.push(rowValues.join(","));
        });
    
        // Combine all rows into a single CSV string
        const csvContent = csv.join("\n");
    
        // Create a Blob containing the CSV data
        const blob = new Blob([csvContent], { type: "text/csv" });
    
        // Create a temporary link element to trigger the download
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "selected_table_data.csv";
    
        // Simulate a click on the link to trigger the download
        link.click();
    };
    
    
    

    return (
        <div className="distributor-master-table">
            {tableData.length > 0 && (
                <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: "20px" }}>
                        <span style={{ color: "#878787", fontWeight: "700" }}>Distributor List</span>
                        <span style={{ paddingRight: "10px", cursor: "pointer" }}>
                            <img style={{ height: "30px" }} src={sendBtn} alt="" id="dump" onClick={handleDump}/>
                        </span>
                    </div>
                    <table id="Mytable">
                        <TableHead headings={headings} onSelectAll={handleSelectAll}/>
                        <tbody>
                            {tableData.map((item,index) => (
                                <tr key={item.id} onClick={() => handleRowClick(item)}
                                style={{
                                    backgroundColor: 
                                        item.statusName === "Rejected" ? "#d47070" : 
                                        item.statusName === "Paid" ? "#65c99c" : ""
                                }}
                                >
                                    <td>{item.id}</td>
                                    <td><input type="checkbox"  onChange={() => toggleRowSelection(item)} checked={selectedRows.some((row) => row.id === item.id)}/></td>
                                    <td>{item.distributorName}</td>
                                    <td>{item.fundName}</td>
                                    <td>{item.invoiceMonth}</td>

                                    <td>{item.gstCategoryCode || item.gstCategory}</td>

                                    <td>{item.tdcCategoryCode || item.tdsCategory}</td>

                                    <td>{item.feeTypeCode || item.feeType}</td>

                                    <td>{ item.totalAmount}</td>

                                    <td style={{cursor:"pointer",color:"blue"}} onClick={()=>handleFileDownload(item.brokerageFileRow ? item.brokerageFileRow.folderPath : item.brokerageFile )}>{item.brokerageFileRow && item.brokerageFileRow.folderPath || item.brokerageFile ? <span>Download</span>  : ""}</td>
                                    {/* {userId && <td><input type="file" onChange={handleFileUpload} /></td>} */}

                                    <td style={{cursor:"pointer",color:"blue"}} onClick={()=>handleFileDownload(item.invoiceFileRow ? item.invoiceFileRow.folderPath : item.invoiceFile )}>{item.invoiceFileRow && item.invoiceFileRow.folderPath || item.invoiceFile ? <span>Download</span>  : ""}</td>
                                    
                                    <td>{item.statusName}</td>

                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default Table2;
