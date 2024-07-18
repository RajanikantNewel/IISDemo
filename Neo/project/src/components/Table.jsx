import React, { useState } from "react";
import sendBtn from "../images/sendBtn.png";
import TableHead from "./TableHead";
import { useEffect } from "react";

const Table = ({ tableData, headings, onRowClick, disabledRowIds,selectedRowId }) => {


    const [fileSystemSupported, setFileSystemSupported] = useState(false);

    const getMonth=(date)=>{
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

    useEffect(() => {
        // Check for File System API support (hypothetical)
        if (window.showDirectoryPicker) { // Replace with actual check
          setFileSystemSupported(true);
        }
      }, []);

      const downloadFileWithRetry = async (filePath, retries = 3, delayMs = 1000) => {
        if (!fileSystemSupported) {
            console.error("File System API not supported");
            return;
        }
    
        try {
            const fileName = filePath.split(/[\\/]/).pop(); // Extracting file name from file path
            const handle = await window.showDirectoryPicker(); // Hypothetical
            const file = await handle.getFileHandle(fileName); // Using extracted file name
            const fileStream = await file.createReadable();
            const reader = fileStream.getReader();
          
            // Simulate download (not ideal in production)
            const buffer = [];
            let chunk;
            do {
                chunk = await reader.read();
                if (chunk) {
                    buffer.push(chunk);
                }
            } while (chunk);
          
            const blob = new Blob(buffer, { type: file.type });
            const url = window.URL.createObjectURL(blob);
          
            // Create a temporary download link (recommended)
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName; // Using extracted file name
            link.click();
          
            // Cleanup
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
            if (retries > 0) {
                console.log(`Retrying download... (${retries} attempts left)`);
                // Retry download with one less retry attempt after a delay
                setTimeout(() => {
                    downloadFileWithRetry(filePath, retries - 1, delayMs);
                }, delayMs);
            }
        }
    };
    
    

  
    return (
        <div className="distributor-master-table">
            {tableData.length > 0 && (
                <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: "20px" }}>
                        <span style={{ color: "#878787", fontWeight: "700" }}>Distributor List</span>
                        <span style={{ paddingRight: "10px", cursor: "pointer" }}>
                            <img style={{ height: "30px" }} src={sendBtn} alt="" />
                        </span>
                    </div>
                    <table>
                        <TableHead headings={headings} />
                        <tbody>
                            {tableData.map((item) => (
                                <tr key={item.id} onClick={() => onRowClick(item.id, item.statusName)} className={disabledRowIds.includes(item.id) ? "disabled-row" : selectedRowId === item.id ? "selected-row" : ""}>
                                    <td><input type="checkbox" /></td>
                                    <td>{item.distributorName}</td>
                                    <td>{item.fundName}</td>
                                    <td>{getMonth(item.invoiceMonth)}</td>



                                    
                                    <td>
                                        {item.brokerageFile && (
                                             <button onClick={() => downloadFileWithRetry(item.brokerageFile)}>
                                             Download {item.brokerageFile.name}
                                           </button>
                                        
                                        )}
                                    </td>
                                    <td>{item.totalAmount}</td>
                                    
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

export default Table;
