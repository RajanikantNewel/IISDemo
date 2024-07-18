import Header from "../components/Header/Header";
import Table2 from "../components/Table/Table2";
import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect,useRef } from "react";
import NotFound from "./NotFound";
import Dashboard from "../components/Dashboard/Dashboard";
import Footer from "../components/Footer/Footer";
import Select from "react-select";
import FeeTypeDropdown from "../components/FeeTypeDropdown/FeeTypeDropdown";
import MakerDashboard from "../components/Dashboard/MakerDashboard";
import { ToastContainer, toast } from "react-toastify";

import { useSidebarContext } from "../components/Sidebar/context/SidebarState";

const DistributorBrokeragePage = () => {
  const location = useLocation();

  const {
    isMoreSidebar,
  
    setShowDashboard,
    showDashboard,
    sidebarText,
    
  } = useSidebarContext();

  const formContainerRef = useRef(null);

  const [curStatus, setCurStatus] = useState(null);
  const [showDrafts, setShowDrafts] = useState(true);

  const [disableFields, setDisableFields] = useState(false);

  const [totalAmount, setTotalAmount] = useState(0);

  const [TDSValue, setTdsValue] = useState("");
  const [GSTValue, setGstValue] = useState("");
  const [FEEValues, setFeeValues] = useState([]);

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [selectedFromAutocomplete, setSelectedFromAutocomplete] =
    useState(false);

  const {
    userId = null,
    distId,
    userName,
  } = location.state ? location.state : {};

  // const [showDashboard, setShowDashboard] = useState(true);

  const [distributorBrokerageId, setDistributorBrokerageId] = useState("");

  const [gstCategories, setGstCategories] = useState([]);
  const [tdsCategories, setTdsCategories] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);

  const [rowId, setRowId] = useState("");
  const [rowStatus, setRowStatus] = useState("");
  const [rowStatusId, setRowStatusId] = useState("");

  const [tableData, setTableData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [distributorNameInput, setDistributorNameInput] = useState("");
  const [relatedDetails, setRelatedDetails] = useState([]);
  const [fundNameInput, setFundNameInput] = useState("");
  const [relatedFunds, setFundDetails] = useState([]);

  const [allDistributorDetails, setAllDistributorDetails] = useState([]);

  const [allFundDetails, setAllFundDetails] = useState([]);

  const [remarks, setRemarks] = useState("");
  

  const [distributorMasterId, setDistributorMasterId] = useState("");

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  useEffect(() => {
    // Get today's date
    if (document.getElementById("invoice-date")) {
      const today = new Date().toISOString().split("T")[0];
      // Set max attribute to today's date
      document.getElementById("invoice-date").setAttribute("max", today);
    }
  }, []);

  useEffect(() => {
    const getAllDistributors = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/get-alldistributor-details`
        );
        const details = response.data;

        setAllDistributorDetails(details); // Update state with fetched details
        console.log(allDistributorDetails);
      } catch (error) {
        console.error("Error fetching distributor details:", error.message);
        setAllDistributorDetails([]); // Reset related details state on error
      }
    };

    getAllDistributors();
    const intervalId = setInterval(getAllDistributors, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const getAllFunds = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get-allfund-details`);
        const details = response.data;

        setAllFundDetails(details); // Update state with fetched details
        console.log(allFundDetails);
      } catch (error) {
        console.error("Error fetching distributor details:", error.message);
        setAllFundDetails([]); // Reset related details state on error
      }
    };
    getAllFunds();

    const intervalId = setInterval(getAllFunds, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchBrokerageDetails = async () => {
      try {
        console.log(userId);
        const response = await axios.get(`${baseUrl}?user=${userId}`);

        if (!response.data || response.data.length === 0) {
          // toast.error('No process status details found for the user.');
          console.log("No processes,,");
          setTableData([]);
          return;
        }

        const data = response.data.map((item) => {
          // Check if the status is "Received from Distributor"
          // If yes, set showSendButton to true, otherwise false
          return {
            ...item,
            showSendButton:
              item.statusId === 4 ||
              item.statusId === 9,
          };
        });
        console.log(data);
        setRemarks(data.makerRemarks);
        setTableData(data);
        // document.getElementById("upload-file").value=data.brokerageFile || "";

        console.log(tableData);
      } catch (error) {
        if (
          error.response &&
          error.response.status === 404 &&
          error.response.data.message ===
            "No process status details found for the user."
        ) {
          // toast.error('No process status details found for the user.');
          console.log("No processes");
          setTableData([]);
        } else {
          // Handle other errors
          console.error("Error retrieving brokerage details:", error.message);
          // toast.error('An error occurred while retrieving brokerage details.');
        }
      }
    };

    if (userId !== null) {
      fetchBrokerageDetails();
      const intervalId = setInterval(fetchBrokerageDetails, 9000);
      return () => clearInterval(intervalId);
    }
  }, [userId]);

  const handleBasicAmountChange = (e) => {
    const basicAmount = parseFloat(e.target.value) || 0;
    const gstPercentage =
      parseInt(GSTValue ? GSTValue.match(/\d+/)[0] : 0) || 0;
    const tdsPercentage =
      parseInt(TDSValue ? TDSValue.match(/\d+/)[0] : 0) || 0;

    const gstAmount = (basicAmount * gstPercentage) / 100;
    const totalBeforeTds = basicAmount + gstAmount;
    const tdsAmount = (totalBeforeTds * tdsPercentage) / 100;
    const total = totalBeforeTds - tdsAmount;

    setTotalAmount(total.toFixed(2));
  };

  const handleGstChange = (e) => {
    if (e.target.value > 100 || e.target.value < 0) {
      alert("take a valid Gst");
      return;
    }

    setGstValue(e.target.value);
    console.log(TDSValue, "112");
    //     const selectedOption = e.target.options[e.target.selectedIndex];
    // // Get the data-description attribute from the selected option
    // const dataDescription = selectedOption.getAttribute('data-description') || '';
    // setGstValue(dataDescription);

    // console.log(dataDescription,"118")

    const gstValue = e.target.value;

    const gstPercentage = gstValue
      ? parseFloat(gstValue.match(/[\d.]+/)?.[0]) || 0
      : 0;
    const basicAmount = parseFloat(document.getElementById("amnt").value) || 0;
    const tdsPercentage = TDSValue
      ? parseFloat(TDSValue.match(/[\d.]+/)?.[0]) || 0
      : 0;

    const gstAmount = (basicAmount * gstPercentage) / 100;
    const totalBeforeTds = basicAmount + gstAmount;
    const tdsAmount = (totalBeforeTds * tdsPercentage) / 100;
    const total = totalBeforeTds - tdsAmount;

    setTotalAmount(total.toFixed(2));
  };

  const handleFeeChange = (array) => {
    // const { value, checked } = event.target;
    // setFeeValues((prevValues) => {
    //   if (checked) {
    //     return [...prevValues, value];
    //   } else {
    //     return prevValues.filter((v) => v !== value);
    //   }
    // });
    console.log(array, "224");
    setFeeValues(array);
  };

  useEffect(() => {
    console.log(FEEValues);
  }, [FEEValues]);

  const handleTdsChange = (e) => {
    if (e.target.value > 100 || e.target.value < 0) {
      alert("take a valid Tds");
      return;
    }
    setTdsValue(e.target.value);
    const tdsValue = e.target.value;

    // const selectedOption = e.target.options[e.target.selectedIndex];

    // Get the data-description attribute from the selected option
    // const dataDescription = selectedOption.getAttribute('data-description') || '';

    // setGstValue(dataDescription);

    // const tdsValue=dataDescription;
    const tdsPercentage = tdsValue
      ? parseFloat(tdsValue.match(/[\d.]+/)?.[0]) || 0
      : 0;
    const basicAmount = parseFloat(document.getElementById("amnt").value) || 0;
    const gstPercentage = GSTValue
      ? parseFloat(GSTValue.match(/[\d.]+/)?.[0]) || 0
      : 0;

    const gstAmount = (basicAmount * gstPercentage) / 100;
    const totalBeforeTds = basicAmount + gstAmount;
    const tdsAmount = (totalBeforeTds * tdsPercentage) / 100;
    const total = totalBeforeTds - tdsAmount;

    setTotalAmount(total.toFixed(2));
  };

  // Function to fetch GST categories from the API
  const fetchGstCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/gst-categories`);
      setGstCategories(response.data);
    } catch (error) {
      console.error("Error fetching GST categories:", error.message);
    }
  };

  // Function to fetch TDS categories from the API
  const fetchTdsCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/tds-categories`);
      setTdsCategories(response.data);
      console.log(response.data, "51");
    } catch (error) {
      console.error("Error fetching TDS categories:", error.message);
    }
  };

  // Function to fetch fee types from the API
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

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchGstCategories();
    fetchTdsCategories();
    fetchFeeTypes();
  }, []);

  const clearAllFields = (a) => {

    if(a==="add-btn"){
      formContainerRef.current.style.display = "grid";
    }
    else{
    
    formContainerRef.current.style.display = "none";
    }
    setCurStatus("")
    setSelectedRowIds([]);
    setRowId("");
    document.getElementById("dist-name").value = "";
    document.getElementById("select-fund").value = "";
    document.getElementById("invoice-date").value = "";
    setSelectedFile(null);
    document.getElementById("amnt").value = "";
    document.getElementById("total").value = "";
    setDistributorNameInput("");
    setFundNameInput("");
    setSelectedFile(null);
    // document.getElementById("upload-file").value="";
    document.getElementById("fee-type").selectedIndex = -1;
    document.getElementById("tds").value = "";
    document.getElementById("gst").value = "";
    setGstValue("");
    setTdsValue("");
    setFeeValues([]);
    setRowStatus("");
    setRowStatusId("");

    setTotalAmount(0);
    document.getElementById("remarks").value = "";
    document.getElementById("recentremarks").value = "";
    document.getElementById("upload-file").value = null;
  };

  const getMonth = (input) => {
    const value = input.value;

    // Split the value to extract the month part
    const monthPart = value.split("-")[1];

    // Convert the month part to a Date object
    const date = new Date(`${monthPart}-01`);

    // Get the abbreviated month name
    const monthAbbreviation = date.toLocaleString("default", {
      month: "short",
    });

    return monthAbbreviation; // Output the abbreviated month name
  };

  const handleDistributorNameChange = async (e) => {
    const input = e.target.value.trim();
    setDistributorNameInput(input); // Update the state with the input value

    // Make an API call only if input is not empty
    if (input !== "") {
      try {
        const response = await axios.get(
          `${baseUrl}/distributor-details?name=${input}`
        );
        const details = response.data;

        setRelatedDetails(details); // Update state with fetched details
        console.log(relatedDetails);
      } catch (error) {
        console.error("Error fetching distributor details:", error.message);
        setRelatedDetails([]); // Reset related details state on error
      }
    } else {
      setRelatedDetails([]); // Reset related details state if input is empty
    }
  };

  // Function to handle selecting a distributor from autocomplete
  const handleSelectDistributor = (distributor) => {
    setDistributorNameInput(distributor.distributorName);
    setGstValue(distributor.Gst);
    setTdsValue(distributor.Tds);

    setRelatedDetails([]);
    setSelectedFromAutocomplete(true);
    setDistributorMasterId(distributor.id); // Clear the autocomplete suggestions
  };

  const handleFundNameChange = async (e) => {
    const input = e.target.value.trim();
    setFundNameInput(input); // Update the state with the input value

    // Make an API call only if input is not empty
    if (input !== "") {
      try {
        const response = await axios.get(
          `${baseUrl}/fund-details?name=${input}`
        );
        const details = response.data;
        setFundDetails(details); // Update state with fetched details
      } catch (error) {
        console.error("Error fetching fund details:", error.message);
        setFundDetails([]); // Reset related details state on error
      }
    } else {
      setFundDetails([]); // Reset related details state if input is empty
    }
  };

  // Function to handle selecting a fund from autocomplete
  const handleSelectFund = (fund) => {
    setSelectedFromAutocomplete(true);
    setFundNameInput(fund.fundName);
    setFundDetails([]); // Clear the autocomplete suggestions
  };

  if (userId === null) {
    return <NotFound />;
  }

  const addRow = async (e) => {
    const action = e.target.name;
    console.log(action, "419");

    console.log(rowId, "217");
    const distributorName = document.getElementById("dist-name").value.trim();
    const fundName = document.getElementById("select-fund").value.trim();
    const invoiceMonth = document.getElementById("invoice-date").value;
    const basicAmount = document.getElementById("amnt").value.trim();
    const totalAmount = document.getElementById("total").value.trim();
    const statusName =
      e.target.name === "save" ? "Draft" : "Pending with Processing team";

    const statusNameId =
    e.target.name === "save" ? 1 : 2;

    // Extract name attributes of selected options
    const feeTypeCode = FEEValues;

    const remarksByUser = document.getElementById("remarks").value;
    const gstCategory = GSTValue;
    const tdsCategory = TDSValue;

    console.log("365", feeTypeCode, tdsCategory, gstCategory, selectedFile);

    if (
      !distributorName ||
      !fundName ||
      !invoiceMonth ||
      !basicAmount ||
      !totalAmount ||
      !gstCategory ||
      !tdsCategory ||
      !feeTypeCode ||
      !selectedFile
    ) {
      alert("Please fill in all fields.");

      return;
    }

    if (basicAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    console.log(distributorName, allDistributorDetails, allFundDetails);

    // dist name and fund name validity
    const isValidInput = allDistributorDetails.some(
      (distributor) => distributor.distributorName === distributorName
    );
    if (!isValidInput) {
      alert(`Invalid distributor name: ${distributorName}`);
      setDistributorNameInput("");
      return;
    }

    console.log(fundName, "436");

    const isValidFund = allFundDetails.some(
      (fund) => fund.fundName === fundName
    );
    if (!isValidFund) {
      alert(`Invalid Fund name: ${fundName}`);
      setFundNameInput("");
      return;
    }

    // Check if any field is empty

    const loader = document.getElementById("loader");
    loader.style.display = "block"; // Show loader

    if (selectedRowIds.length > 1 && rowStatusId===1) {
      setTimeout(async function () {
        try {
          const response = await axios.post(`${baseUrl}/bulk-drafts`, {
            selectedRowIds: selectedRowIds,
            remarksByUser,
            userId,
            action,
          });
          console.log(response.data); // Handle response data from
          setRowStatus("");

          // setSelectedRows([]);
          setSelectedRowIds([]);

          clearAllFields();
          toast.success("Completed successfully.");
          console.log("Data updated successfully:", response.data);
          // Disable the selected row
        } catch (error) {
          console.error("Error modifying:", error.message);
          // Handle error
        }
        loader.style.display = "none";
      }, 4000);
    } else {
      setTimeout(async function () {
        // Hide loader

        console.log(selectedFile);

        const newContact = {
          distributorName,
          fundName,
          invoiceMonth,
          brokerageFile: selectedFile ? selectedFile : "",
          basicAmount,
          totalAmount,
          statusName,
          feeTypeCode,
          tdsCategory,
          gstCategory,
          remarksByUser,
          statusNameId,
        };

        // Create a new FormData object
        const formData = new FormData();
        formData.append("distributorName", distributorName);
        formData.append("fundName", fundName);
        formData.append("invoiceMonth", invoiceMonth);
        formData.append("file", selectedFile);
        formData.append("basicAmount", basicAmount);
        formData.append("totalAmount", totalAmount);
        formData.append("statusName", statusName);
        formData.append("statusNameId", statusNameId);
        formData.append("feeTypeCode", feeTypeCode);
        formData.append("tdsCategory", tdsCategory);
        formData.append("gstCategory", gstCategory);
        formData.append("remarksByUser", remarksByUser);
        formData.append("userId", userId);
        formData.append("distId", distId);
        formData.append("distributorMasterId", distributorMasterId);
        formData.append("action", action);
        formData.append("rowStatus", rowStatus);

        try {
          let response;
          let brokerageId;
          console.log("277 rowID", rowId);

          if (rowId) {
            // Update operation
            response = await axios.put(
              `${baseUrl}/distributor-brokerage/${rowId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            setDistributorBrokerageId(response.data.id);
            brokerageId = rowId;
            // const updatedTableData = tableData.map((row) => {
            //   if (row.id === rowId) {
            //     return {
            //       ...row,
            //       distributorName,
            //       fundName,
            //       invoiceMonth,
            //       brokerageFile: response.data.filePath,
            //       basicAmount,
            //       totalAmount,
            //       statusName,
            //       feeTypeCode,
            //       tdsCategory,
            //       gstCategory,
            //       remarksByUser,
            //     };
            //   }
            //   return row;
            // });
            // setTableData([...updatedTableData]);
          } else {
            // Insert operation
            response = await axios.post(
              `${baseUrl}/distributor-brokerage`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            console.log("Data saved successfully 319:", response.data.id);
            brokerageId = response.data.id;
            // setTableData([
            //   ...tableData,
            //   {
            //     ...newContact,
            //     id: brokerageId,
            //     brokerageFile: response.data.filePath,
            //   },
            // ]);
          }

          loader.style.display = "none";

          clearAllFields();
          toast.success("Completed successfully.");
          console.log("Data updated successfully:", response.data);
        } catch (error) {
          console.error("Error saving or updating data:", error.message);
          alert("Error saving data. Please try again.");
          loader.style.display = "none";
        }
      }, 4000);
    }
  };

  const handleDownloadFile = async (filePath) => {
    try {
      console.log(filePath, "493 file Path");
      // Make a GET request to download the file

      const response = await axios.get(`${baseUrl}/download-file`, {
        params: {
          filePath: filePath,
          user: userId,
        },
        responseType: "blob", // Set the response type to blob
      });
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log(file, "554");
  };

  const populateFields = (rowData) => {
    console.log(rowData);

    const feeCheckboxes = document.querySelectorAll(
      '#fee-type input[type="checkbox"]'
    );

    console.log(feeCheckboxes);

    feeCheckboxes.forEach((checkbox) => {
      if (
        rowData.feeTypeCode
          ? rowData.feeTypeCode.includes(checkbox.value)
          : rowData.feeType.includes(checkbox.value)
      ) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    });
    // Populate input fields with row data
    document.getElementById("total").value = rowData.totalAmount;

    document.getElementById("dist-name").value = rowData.distributorName;
    document.getElementById("invoice-date").value = rowData.invoiceMonth;
    // document.getElementById("remarks").value=rowData.userremarks || rowData.checkerRemarks || "";
    // setSelectedFile(rowData.brokerageFileRow ? rowData.brokerageFileRow.fileName : rowData.brokerageFile);
    // console.log(selectedFile,"602")
    document.getElementById("amnt").value = rowData.basicAmount;
    document.getElementById("recentremarks").value =
      rowData.userremarks ||
      rowData.makerRemarks ||
      rowData.checkerRemarks ||
      rowData.remarksByUser ||
      "";
    // setFeeValues(rowData.feeTypeCode)
    setDistributorNameInput(rowData.distributorName);
    setFundNameInput(rowData.fundName);
    setDistributorMasterId(rowData.distributorMasterId);
    setRowId(rowData.id);
    setRowStatus(rowData.statusName);
    setRowStatusId(rowData.statusId);
    setTdsValue(rowData.tdcCategoryCode || rowData.tdsCategory);
    setGstValue(rowData.gstCategoryCode || rowData.gstCategory);
    if (rowData.feeTypeCode.length > 0) {
      setFeeValues([...rowData.feeTypeCode]);
    } else {
      setFeeValues([...rowData.feeType]);
    }

    setSelectedFile(rowData.brokerageFileRow.folderPath);

    setTotalAmount(rowData.totalAmount);
  };

  const handleRowClick = (rowData) => {
    console.log(rowData, "429");

    if (rowData.statusId === 1) {

      formContainerRef.current.style.display = "grid";
      // formContainerRef.current.scrollIntoView({ behavior: "auto" });
      // formContainerRef.current.focus();
      const updatedSelectedRows = selectedRowIds.includes(rowData.id)
        ? selectedRowIds.filter((id) => id !== rowData.id)
        : [...selectedRowIds, rowData.id];

      setSelectedRowIds(updatedSelectedRows);
      // setRowId(rowData.statusId)
      console.log(selectedRowIds, "102");
      populateFields(rowData);
      setDisableFields(false);
    } else if (
      rowData.statusId === 5 ||
      rowData.statusId === 9 ||
      rowData.statusId === 12
    ) {
      console.log(rowData, "431");

      // Remove styling from previously clicked row, if any

      formContainerRef.current.style.display = "grid";
      formContainerRef.current.scrollIntoView({ behavior: "auto" });
      formContainerRef.current.focus();
      populateFields(rowData);
      setSelectedFile(null);
      setDisableFields(false);
      console.log(selectedFile, rowStatus, "650");
      // } else if (rowData.statusName === "Received from Distributor") {
      //   populateFields(rowData);

      //   setDisableFields(true);
    } else {
      formContainerRef.current.style.display = "none";
      setDisableFields(false);
      // clearAllFields();
      setRowId("");
      setRowStatus("");
      setRowStatusId("")
    }
    // todo for recieved  to maker by distribuor
  };

  const againToDistributor = async () => {
    const remarks = document.getElementById("remarks").value;
    console.log(rowId, rowStatus);

    const loader = document.getElementById("loader");
    loader.style.display = "block"; // Show loader
    setTimeout(async function () {
      // Your actual functionality here
      // For demonstration, I'm just delaying the hiding of the loader after 3 seconds

      loader.style.display = "none";
      alert("Sent to Distributor");
      try {
        const response = await axios.put(
          `${baseUrl}/distributor-brokerage-again-to-dist/${rowId}`,
          { userId, distId, distributorMasterId, remarks }
        );

        const updatedTableData = tableData.map((row) => {
          if (row.id === rowId) {
            return {
              ...row,
              statusName: "Pending from Distributor",
            };
          }
          return row;
        });
        setTableData([...updatedTableData]);
        clearAllFields();
        setDisableFields(false);
      } catch (error) {
        console.error("Error updating data:", error.message);
        return;
      }
    }, 1000);
  };

  const sendToChecker = async () => {
    const remarks = document.getElementById("remarks").value;
    console.log(rowId, rowStatus);

    const loader = document.getElementById("loader");
    loader.style.display = "block"; // Show loader
    setTimeout(async function () {
      // Your actual functionality here
      // For demonstration, I'm just delaying the hiding of the loader after 3 seconds

      loader.style.display = "none";
      alert("Sent to Processing Team");
      try {
        const response = await axios.post(`${baseUrl}/send-to-checker`, {
          userId,
          distId,
          remarks,
          rowId,
        });

        const updatedTableData = tableData.map((row) => {
          if (row.id === rowId) {
            return {
              ...row,
              statusName: "Pending Processing",
            };
          }
          return row;
        });

        setTableData([...updatedTableData]);
        clearAllFields();
        setDisableFields(false);
      } catch (error) {
        console.error("Error updating data:", error.message);
        return;
      }
    }, 1000);
  };

  return (
    <>
      <Header
        text={["Transcation", "Reports"]}
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
          <MakerDashboard
            setShowDashboard={setShowDashboard}
            showDrafts={showDrafts}
            setCurStatus={setCurStatus}
            clearAllFields={clearAllFields}
            userId={userId}
          />
        ) : (
          <div style={{ flex: 1 ,backgroundColor:"#f4f3ef;"}}>
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

              <button name="add-btn" className="add-new-btn" onClick={(e)=>clearAllFields(e.target.name)}>
                Add New
              </button>
            </div>

            <div ref={formContainerRef} style={{display:"none"}} className="distribution-brokerage-main">
              <div className="maker-divs">
                <label htmlFor="dist-name">Distributor Name:</label>
                <div style={{ position: "relative" }} >
                <input
                  className="dist-auto"
                  type="text"
                  id="dist-name"
                  value={distributorNameInput}
                  onChange={handleDistributorNameChange}
                  disabled={disableFields}
                  // onBlur={handleDistributorNameBlur}
                />
                {/* Autocomplete suggestions */}
                <ul className="dist-ul">
                  {relatedDetails.map((distributor) => (
                    <li
                      key={distributor.id}
                      onClick={() => handleSelectDistributor(distributor)}
                    >
                      {distributor.distributorName}
                    </li>
                  ))}
                </ul>
                </div>
              </div>

              <div className="maker-divs">
                <label htmlFor="select-fund">Fund Name:</label>
                <div  style={{ position: "relative" }} >
                <input
                  className="dist-auto"
                  type="text"
                  id="select-fund"
                  value={fundNameInput}
                  onChange={handleFundNameChange}
                  disabled={disableFields}
                  // onBlur={handleFundNameBlur}
                />
                {/* Autocomplete suggestions */}
                <ul className="dist-ul">
                  {relatedFunds.map((fund) => (
                    <li key={fund.id} onClick={() => handleSelectFund(fund)}>
                      {fund.fundName}
                    </li>
                  ))}
                </ul>
                </div>
              </div>

              <div className="maker-divs">
                <label htmlFor="invoice-date">Invoice Date:</label>
                <input
                  type="date"
                  id="invoice-date"
                  name="startDate"
                  disabled={disableFields}
                />
              </div>

              <div className="file-div">
                <label htmlFor="upload-file">Calculation File Upload:</label>
                <input
                  type="file"
                  id="upload-file"
                  name="upload-file"
                  onChange={handleFileChange}
                  disabled={disableFields}
                  style={{ border: "none" }}
                />
              </div>

              <div className="maker-divs">
                <label htmlFor="amnt">Basic Amount:</label>
                <input
                  type="number"
                  id="amnt"
                  name="amnt"
                  onChange={handleBasicAmountChange}
                  disabled={disableFields}
                />
              </div>

              <div className="maker-divs">
                <label htmlFor="gst">GST Category:</label>
                <input
                  id="gst"
                  name="gstCat"
                  onChange={handleGstChange}
                  value={GSTValue || null}
                  disabled={disableFields}
                />

                {/* <option value="">Select Category</option>
                        {gstCategories.map((category) => (
                            <option key={category.id} value={category.description1} name={category.Code}data-description={category.description1}>
                                {category.description1}
                            </option>
                        ))}
                </select> */}
              </div>

              <div className="maker-divs">
                <label htmlFor="tds">TDS Category:</label>
                <input
                  id="tds"
                  name="tdsCat"
                  onChange={handleTdsChange}
                  value={TDSValue || null}
                  disabled={disableFields}
                />
                {/* <option value="">Select Category</option>
                    {tdsCategories.map((category) => (
                        <option key={category.id} value={category.description1}
                        name={category.Code} data-description={category.description1}>
                            {category.description1}
                        </option>
                    ))}
                </select> */}
              </div>

              <div className="maker-divs">
                <label htmlFor="total">Total Amount:</label>
                <input
                  type="number"
                  id="total"
                  name="total"
                  value={totalAmount}
                  readonly
                  disabled={disableFields}
                />
              </div>

              <FeeTypeDropdown
                feeTypes={feeTypes}
                FEEValues={FEEValues}
                handleFeeChange={handleFeeChange}
                disableFields={disableFields}
              />

              

              <div className="maker-divs">
                <label htmlFor="recentRemarks">Recent Remarks:</label>
                <textarea rows="5" cols="32" id="recentremarks" disabled />
              </div>
              <div className="maker-divs">
                <label htmlFor="remarks">Remarks:</label>
                <textarea rows="5" cols="32" id="remarks" />
              </div>
              
              
              <div></div>
              <div></div>
              {disableFields === true ? (
              <div className="btns-broker">
                <button
                  className="save"
                  name="Sent to dist"
                  onClick={againToDistributor}
                >
                  Send To Distributor
                </button>
                <button
                  className="submit"
                  name="submit"
                  onClick={sendToChecker}
                >
                  Send To Processing
                </button>
              </div>
            ) : (
              <div className="btns-broker">
                <button className="save" name="save" onClick={(e) => addRow(e)}>
                  Save
                </button>
                <button
                  className="submit"
                  name="submit"
                  onClick={(e) => addRow(e)}
                >
                  Submit
                </button>
              </div>
            )}
            </div>
            

            {tableData.length > 0 && (
              <Table2
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
                onRowClick={handleRowClick}
                userId={userId}
                setTableData={setTableData}
                setDistributorNameInput={setDistributorNameInput}
                setSelectedFile={setSelectedFile}
                setFundNameInput={setFundNameInput}
                handleDownloadFile={handleDownloadFile}
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

export default DistributorBrokeragePage;
