import { useState } from "react";
import { useEffect,useRef } from "react";
import { useLocation } from "react-router-dom";
// import axios from "axios";

import Header from "../components/Header/Header";
import axios from "axios";
import Table3 from "../components/Table/Table3";
import NotFound from "./NotFound";
import Dashboard from "../components/Dashboard/Dashboard";
import Footer from "../components/Footer/Footer";
import FeeTypeDropdown from "../components/FeeTypeDropdown/FeeTypeDropdown";
import { useSidebarContext } from "../components/Sidebar/context/SidebarState";
import AccountDashboard from "../components/Dashboard/AccountDashboard";
import { ToastContainer, toast } from "react-toastify";

const AccountLoginPage = () => {
  const [UTR, setUTR] = useState("");

  const {
    isMoreSidebar,
  
    setShowDashboard,
    showDashboard,
    sidebarText,
    
  } = useSidebarContext();

  const location = useLocation();
  const {
    userId = null,
    distId,
    userName,
  } = location.state ? location.state : {};

  const formContainerRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const [curStatus, setCurStatus] = useState(null);
  const [TDSValue, setTdsValue] = useState("");
  const [GSTValue, setGstValue] = useState("");
  const [FEEValues, setFeeValues] = useState([]);
  const [distributorNameInput, setDistributorNameInput] = useState("");
  const [relatedDetails, setRelatedDetails] = useState([]);
  const [fundNameInput, setFundNameInput] = useState("");
  const [relatedFunds, setFundDetails] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [feeTypes, setFeeTypes] = useState([]);

  const [rowId, setRowId] = useState("");
  const [rowStatus, setRowStatus] = useState("");
  const [rowStatusId, setRowStatusId] = useState("");
  const [remarks, setRemarks] = useState("");

  const [month, setMonth] = useState("");
  // const [showDashboard, setShowDashboard] = useState(true);

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  const clearAllFields = () => {
    formContainerRef.current.style.display = "none";
    setRowStatusId("")
    setRemarks("");
    document.getElementById("dist-name").value = "";
    document.getElementById("select-fund").value = "";
    document.getElementById("invoice-date").value = "";
    setSelectedFile(null);
    document.getElementById("amnt").value = "";
    document.getElementById("total").value = "";
    setDistributorNameInput("");
    setFundNameInput("");
    setFeeValues([]);
    // document.getElementById("upload-file").value="";
    document.getElementById("fee-type").value = "";
    document.getElementById("tds").value = "";
    document.getElementById("gst").value = "";
    document.getElementById("remarks").value = "";
    setGstValue("");
    setTdsValue("");
    setMonth(null);
    document.getElementById("recentremarks").value = "";
  };

  useEffect(() => {
    setFeeValues([]);
    setRowStatusId("")
    setMonth("");
    setTdsValue("");
    setGstValue("");
    setFundNameInput("");
    setRowStatus("");
  }, [showDashboard]);

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
    const fetchBrokerageDetails = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/get-brokerages-for-account`
        );
        // Initialize status for each row
        const data = response.data;
        console.log(response.data, "26");
        setTableData(response.data);
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

  const handleRowClick = async (rowData) => {
    console.log(rowData, "71");
    if (rowData.statusId === 6) {

      formContainerRef.current.style.display = "grid";
      formContainerRef.current.scrollIntoView({ behavior: "auto" });
      formContainerRef.current.focus();

      console.log(rowData, "1");
      // Populate input fields with row data
      document.getElementById("dist-name").value = rowData.distributorName;
      console.log(rowData, "name");

      setUTR("");

      // Handle file upload if needed
      console.log(rowData, "mahina");
      setSelectedFile(rowData.brokerageFile);
      document.getElementById("amnt").value = rowData.basicAmount;
      console.log(rowData, "amnt");

      if (rowData.invoiceMonth) {
        console.log(rowData.invoiceMonth);
        setMonth(rowData.invoiceMonth);
      }

      document.getElementById("recentremarks").value =
        rowData.userremarks || rowData.checkerRemarks || "";
      console.log(rowData, "remmarks");

      // document.getElementById("remarks").value=rowData.userremarks || rowData.checkerRemarks || "";

      // document.getElementById("upload-file").value=rowData.brokerageFile || "";

      setDistributorNameInput(rowData.distributorName);
      setFundNameInput(rowData.fundName);
      document.getElementById("total").value = rowData.totalAmount;

      setRowId(rowData.id);
      setRowStatus(rowData.statusName);
      setRowStatusId(rowData.statusId)

      setTdsValue(rowData.tdcCategoryCode);
      console.log(rowData.gstCategoryCode, "494");
      setGstValue(rowData.gstCategoryCode);
      console.log(rowData.feeTypeCode, "494");
      setFeeValues([...rowData.feeTypeCode]);
    } else {
      formContainerRef.current.style.display = "none";
      setRowId("");
      setRowStatus("");
      setRowStatusId("") //-------------------
      console.log(rowStatus, "116");
    }
    // todo for recieved  to maker by distribuor
  };

  const handleRemarks = (e) => {
    setRemarks(e.target.value);
  };

  const handleAction = async (action) => {
    if (UTR === "" && action === "submit") {
      alert("Please Enter UTR");
      return;
    }
    const loader = document.getElementById("loader");
    loader.style.display = "block"; // Show loader

    setTimeout(async function () {
      // Your actual functionality here
      // For demonstration, I'm just delaying the hiding of the loader after 3 seconds

      try {
        const response = await axios.post(`${baseUrl}/account-action`, {
          brokerageId: rowId,
          remarks: remarks,
          UTR,
          action: action,
          userId,
        });
        console.log(response.data); // Handle response data from backend if needed
        // setShowRemarksBox(false);
        // Update the status of the selected row
        const updatedData = tableData.map((row) => {
          if (row.id === rowId) {
            return { ...row, statusName: response.data.message };
          }
          return row;
        });
        setTableData(updatedData);
        setRowStatus("");
        clearAllFields();
        toast.success("Completed successfully.");
       
      } catch (error) {
        console.error("Error modifying:", error.message);
        // Handle error
      }
      loader.style.display = "none";
    }, 5000);
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
        text={["Accounts Team"]}
        userId={userId}
        userName={userName}
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
          <AccountDashboard
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
                Account Details
              </span>
            </div>

            <div ref={formContainerRef} style={{display:"none"}}className="distribution-brokerage-main">
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

              <div></div>
              {rowId && rowStatusId === 6 && (
              // <div
              //   style={{
              //     // padding: "20px 0px 20px 20px",
              //     // border: "1px solid #ccc",
              //     marginBottom: "10px",
              //     textAlign: "center",
              //     marginTop: "20px",
              //     textAlign: "left",
                  
              //   }}
              // >
              <>
                <div>
                
                  <label htmlFor="utr">UTR Number</label>

                  <input
                    type="text"
                    value={UTR}
                    onChange={(e) => setUTR(e.target.value)}
                    style={{
                      margin: "0 auto 20px 00px",
                      width: "260px",
                      padding: "2px 4px",
                      height: "24px",
                    }}
                  />
                  </div>
                  {/* <div></div> */}
                  <div className="approve-btns">
                  <button
                    onClick={() => handleAction("modify")}
                    className="save"
                  >
                    {" "}
                    Modify
                  </button>
                  <button
                    onClick={() => handleAction("submit")}
                    className="submit"
                  >
                    Submit
                  </button>
                </div>
                </>
              // </div>
            )}
            </div>

           

            {tableData.length > 0 && (
              <Table3
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

export default AccountLoginPage;
