import { useState,useRef } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// import axios from "axios";
import NotFound from "./NotFound";


import Header from "../components/Header/Header";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import TableApprover from "../components/Table/TableApprover";
import Dashboard from "../components/Dashboard/Dashboard";
import Footer from "../components/Footer/Footer";
import FeeTypeDropdown from "../components/FeeTypeDropdown/FeeTypeDropdown";
import { useSidebarContext } from "../components/Sidebar/context/SidebarState";
import CheckerDashboard from "../components/Dashboard/ApproverDashboard";
import ApproverDashboard from "../components/Dashboard/ApproverDashboard";


const ApproverPage = () => {
  const {
    isMoreSidebar,
  
    setShowDashboard,
    showDashboard,
    sidebarText,
    
  } = useSidebarContext();

  const formContainerRef = useRef(null);
  const location = useLocation();
  const {
    userId = null,
    distId,
    userName: checkerName,
  } = location.state ? location.state : {};




  const [selectedFile, setSelectedFile] = useState(null);

  console.log(showDashboard,"1")


  const [curStatus, setCurStatus] = useState(null);

  const [TDSValue, setTdsValue] = useState("");
  const [GSTValue, setGstValue] = useState("");
  const [FEEValues, setFeeValues] = useState([]);
  const [distributorNameInput, setDistributorNameInput] = useState("");
  const [relatedDetails, setRelatedDetails] = useState([]);
  const [fundNameInput, setFundNameInput] = useState("");
  const [relatedFunds, setFundDetails] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [rowId, setRowId] = useState("");
  const [rowStatus, setRowStatus] = useState("");
  const [rowStatusId, setRowStatusId] = useState("");
  const [remarks, setRemarks] = useState("");

  const [month, setMonth] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  // const [showDashboard, setShowDashboard] = useState(true);
  const [feeTypes, setFeeTypes] = useState([]);

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  useEffect(() => {
    const fetchFeeTypes = async () => {
      try {
        const response = await axios.get(`${baseUrl}/fee-types`);
        console.log(response.data);
        setFeeTypes(response.data);
        console.log(feeTypes, "128");
      } catch (error) {
        console.error("Error fetching fee types:", error.message);
      }
    };
    fetchFeeTypes();
  }, []);

  useEffect(() => {
    setFeeValues([]);
    setSelectedRowIds([]);
    setSelectedRows([]);
    setMonth("");
    setTdsValue("");
    setGstValue("");
    setFundNameInput("");
    setRowStatus("");
    setRowStatusId("")
  }, [showDashboard]);

 

  useEffect(() => {
    const fetchBrokerageDetails = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get-brokerages-for-app`);
        // Initialize status for each row
        const data = response.data;
        console.log(response.data, "26");
        setTableData(response.data);
        console.log(checkerName, "checkername");
      } catch (error) {
        console.error("Error retrieving brokerage details:", error.message);
      }
    };
    fetchBrokerageDetails();
    const intervalId = setInterval(fetchBrokerageDetails, 9000);
    return () => clearInterval(intervalId);
  }, [userId]);

  if (userId === null) {
    return <NotFound />;
  }

  const clearAllFields = () => {
    formContainerRef.current.style.display = "none";
    setRowStatusId("")
    setSelectedRowIds([]);
    setSelectedRows([]);
    document.getElementById("dist-name").value = "";
    document.getElementById("select-fund").value = "";
    document.getElementById("invoice-date").value = "";
    setSelectedFile(null);
    document.getElementById("amnt").value = "";
    document.getElementById("total").value = "";
    setDistributorNameInput("");
    setFundNameInput("");
    // document.getElementById("upload-file").value="";
    document.getElementById("fee-type").value = "";
    setRemarks("");
    setGstValue("");
    setTdsValue("");
    setFeeValues([]);
    setMonth(null);
    document.getElementById("recentremarks").value = "";
    document.getElementById("remarks").value = "";
  };


  const handleRowClick = async (rowData) => {
    console.log(rowData, "71");

    if (
      rowData.statusId === 2 ||
      rowData.statusId === 4
    ) {
      console.log(rowData, "1");
      formContainerRef.current.style.display = "grid";
      // formContainerRef.current.scrollIntoView({ behavior: "auto" });
      // formContainerRef.current.focus();

      const updatedSelectedRows = selectedRowIds.includes(rowData.id)
        ? selectedRowIds.filter((id) => id !== rowData.id)
        : [...selectedRowIds, rowData.id];

      setSelectedRowIds(updatedSelectedRows);

      console.log(selectedRowIds, "102");

      // Populate input fields with row data
      document.getElementById("dist-name").value = rowData.distributorName;
      console.log(rowData, "name");

      // Handle file upload if needed

      setSelectedFile(rowData.brokerageFile);
      document.getElementById("amnt").value = rowData.basicAmount;
      console.log(rowData, "amnt");

      const feeCheckboxes = document.querySelectorAll(
        '#fee-type input[type="checkbox"]'
      );

      feeCheckboxes.forEach((checkbox) => {
        if (rowData.feeTypeCode.includes(checkbox.value)) {
          checkbox.checked = true;
        } else {
          checkbox.checked = false;
        }
      });

      if (rowData.invoiceMonth) {
        console.log(rowData.invoiceMonth);
        setMonth(rowData.invoiceMonth);
      }

      document.getElementById("recentremarks").value =
        rowData.userremarks || rowData.checkerRemarks || "";
      console.log(rowData, "remmarks");

    

      setDistributorNameInput(rowData.distributorName);
      setFundNameInput(rowData.fundName);
      document.getElementById("total").value = rowData.totalAmount;

      setRowId(rowData.id);
      setRowStatus(rowData.statusName);
      setRowStatusId(rowData.statusId);

      setTdsValue(rowData.tdcCategoryCode);
      console.log(rowData.gstCategoryCode, "494");
      setGstValue(rowData.gstCategoryCode);
      console.log(rowData.feeTypeCode, "494");
      setFeeValues([...rowData.feeTypeCode]);
    } else {
      formContainerRef.current.style.display = "none";
      setRowId("");
      setRowStatus("");
      setRowStatusId(); //-------------------
      console.log(rowStatus, "116");
    }
    // todo for recieved  to maker by distribuor

    // Handle row click in the child component
  };

  const handleRemarks = (e) => {
    setRemarks(e.target.value);
  };

  const handleAction = async (action) => {
    console.log(selectedRowIds, "178");
    // return;
    if (selectedRowIds.length === 0) {
      alert("Please select rows first");
      return;
    }

    if (rowId === "") {
      alert("Please select a row first");
      return;
    }
    if (
      (action === "reject" || action === "modify") &&
      selectedRowIds.length > 1
    ) {
      alert(
        "Please select only one row at a time for rejection or modifications"
      );
      return;
    }
    const loader = document.getElementById("loader");
    loader.style.display = "block"; // Show loader
    setTimeout(async function () {
      // Your actual functionality here
      // For demonstration, I'm just delaying the hiding of the loader after 3 seconds

      // Hide loader

     

      try {
        const response = await axios.post(`${baseUrl}/checker-action`, {
          selectedRowIds: selectedRowIds,
          remarks: remarks,
          action: action,
          userId,
          checkerName,
          rowStatus,
          rowStatusId
        });
        console.log(response.data); // Handle response data from backend if needed
        // setShowRemarksBox(false);
        // Update the status of the selected row
        // const updatedData = tableData.map((row) => {
        //   if (selectedRowIds.includes(row.id)) {
        //     return { ...row, statusName: response.data.message };
        //   }
        //   return row;
        // });
        // setTableData(updatedData);
        setRowStatus("");

        setSelectedRows([]);
        setSelectedRowIds([]);
        toast.success("Completed successfully.");
        console.log("Data updated successfully:", response.data);

        clearAllFields();
        // Disable the selected row
      } catch (error) {
        console.error("Error modifying:", error.message);
        // Handle error
      }
      loader.style.display = "none";
    }, 4000);
  };

  const handleDownloadFile = async (filePath) => {
    try {
      // Make a GET request to download the file
      const response = await axios.get(
        `${baseUrl}/download-file?filePath=${filePath}&user=${userId}`,
        {
          responseType: "blob", // Set the response type to blob
        }
      );
      // Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filePath.split("/").pop()); // Set the filename
      // Simulate a click on the link to trigger the download
      document.body.appendChild(link);
      link.click();
      // Clean up
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error.message);
    }
  };

  return (
    <>
      <Header
        text={["Transcation", "Reports"]}
        userId={userId}
        userName={checkerName}
        setShowDashboard={setShowDashboard}
        showDashboard={showDashboard}
      />
      <div id="loader" style={{ display: "none" }}></div>

      <div
        style={{
          marginLeft: "5px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {showDashboard ? (
          <ApproverDashboard
            setShowDashboard={setShowDashboard}
            setCurStatus={setCurStatus}
            userId={userId}
          />
        ) : (
          <div style={{ flex: 1 }}>
            <div
              style={{
                padding: "20px 20px",
                display: "flex",
                justifyContent: "space-between",
                // borderBottom: "2px solid #878787",
                alignItems: "center",
              }}
            >
              <span
                style={{ color: "black", fontWeight: "600", fontSize: "1rem" }}
              >
                Distributor Brokerage
              </span>
            </div>

            <div  ref={formContainerRef} style={{display:"none"}}className="distribution-brokerage-main">
              <div style={{ position: "relative" }}>
                <label htmlFor="dist-name">Distributor Name:</label>
                <input
                  className="dist-auto"
                  type="text"
                  id="dist-name"
                  disabled
                  // value={distributorNameInput}
                  // onChange={handleDistributorNameChange}
                />
                {/* Autocomplete suggestions */}
                {/* <ul className="dist-ul">
        {relatedDetails.map((distributor) => (
        <li key={distributor.id} onClick={() => handleSelectDistributor(distributor)}>
            {distributor.distributorName}
        </li>
        ))}
    </ul> */}
              </div>

              <div style={{ position: "relative" }}>
                <label htmlFor="select-fund">Fund Name:</label>
                <input
                  className="dist-auto"
                  type="text"
                  id="select-fund"
                  disabled
                  value={fundNameInput}
                  // value={fundNameInput}
                  // onChange={handleFundNameChange}
                />
                {/* Autocomplete suggestions
    <ul className="dist-ul">
        {relatedFunds.map((fund) => (
        <li key={fund.id} onClick={() => handleSelectFund(fund)}>
            {fund.fundName}
        </li>
        ))}
    </ul> */}
              </div>

              <div>
                <label htmlFor="invoice-date">Invoice Month:</label>
                <input
                  type="date"
                  id="invoice-date"
                  name="startDate"
                  disabled
                  value={month}
                />
              </div>

              <div>
                <label htmlFor="upload-file">Calculation File :</label>
                <input
                  type="file"
                  id="upload-file"
                  name="upload-file"
                  disabled
                  value={selectedFile ? selectedFile.FileName : null}
                  // onChange={handleFileChange}
                />
              </div>

              <div>
                <label htmlFor="amnt">Basic Amount:</label>
                <input type="number" id="amnt" name="amnt" disabled />
              </div>

              <div>
                <label htmlFor="gst">GST Category:</label>
                <input id="gst" name="gstCat" disabled value={GSTValue} />

                {/* {gstCategories.map((category) => (
                <option key={category.id} value={category.description1} name={category.Code}>
                    {category.description1}
                </option>
            ))} */}
              </div>

              <div>
                <label htmlFor="tds">TDS Category:</label>
                <input id="tds" name="tdsCat" disabled value={TDSValue} />
              </div>

              <div>
                <label htmlFor="total">Total Amount:</label>
                <input type="number" id="total" name="total" disabled />
              </div>

              <FeeTypeDropdown
                feeTypes={feeTypes}
                FEEValues={FEEValues}
                // handleFeeChange={handleFeeChange}
                disableFields={true}
              />

<div>
                <label htmlFor="recentremarks">Recent Remarks:</label>
                <textarea rows="5" cols="32" id="recentremarks" disabled />
              </div>

              <div>
                <label htmlFor="remarks">Remarks:</label>
                <textarea
                  rows="5"
                  cols="32"
                  id="remarks"
                  onChange={handleRemarks}
                />
              </div>

             
              {/* <div></div> */}
              <div></div>
              <div></div>
              {rowId &&
              (rowStatusId === 2 ||
                rowStatusId === 4) &&
              selectedRowIds.length > 0 && (
                // <div style={{ padding: "20px", border: "1px solid #ccc", marginBottom: "20px",marginTop:"20px", textAlign:"center"}}>

                <div className="approve-btns" style={{ marginBottom: "40px" }}>
                  <button onClick={() => handleAction("approve")}>
                    Approve
                  </button>
                  <button onClick={() => handleAction("modify")}>Modify</button>
                  <button onClick={() => handleAction("reject")}>Reject</button>
                </div>
              )}
            </div>


            

            {tableData.length > 0 && (
              <TableApprover
                tableData={tableData}
                headings={[
                  "Distributor Name",
                  "Fund Name",
                  "Invoice Month",
                  "Gst Category",
                  "Tds Category",
                  "Fee Type",
                  "Brokerage Amount",
                  "Brokerage Calculation File",
                  "Invoice File",
                ]}
                userId={userId}
                onRowClick={handleRowClick}
                setTableData={setTableData}
                onFileDownload={handleDownloadFile}
                setSelectedRowIds={setSelectedRowIds}
                selectedRowIds={selectedRowIds}
                curStatus={curStatus}
              />
            )}
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer
        // position="top-right"
        autoClose={3000}
        // hideProgressBar="false"
        // newestOnTop="false"
        // closeOnClick
        // rtl="false"
        // pauseOnFocusLoss
        // draggable
        // pauseOnHover
        // theme="light"
        // transition="Bounce"
      />
    </>
  );
};

export default ApproverPage;
