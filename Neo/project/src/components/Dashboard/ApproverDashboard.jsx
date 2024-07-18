import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css"; // Import the CSS Module
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { ListItemIcon } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import PendingIcon from "@mui/icons-material/Pending";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DraftsIcon from "@mui/icons-material/Drafts";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { useSidebarContext } from "../Sidebar/context/SidebarState";
import PaidIcon from "@mui/icons-material/Paid";
import PendingInvoice from "../../images/PendingInvoice.png";
import LineChart from "../Graph/Graph";

const ApproverDashboard = ({
  // setShowDashboard,
  showDrafts = false,
  setCurStatus = null,
  userId
}) => {
  const {
    isMoreSidebar,
    userName,
    
    setShowDashboard,
    showDashboard,
    sidebarText,
  } = useSidebarContext();
  //   console.lof(setShowDashboard,"")
  const [boxes, setBoxes] = useState([]);

  const [graphData, setGraphData] = useState([]);
  const [graphData2, setGraphData2] = useState([]);
  
  const [overAllAmount, setOverAllAmount] = useState([]);
  const [overAllAmount2, setOverAllAmount2] = useState([]);


  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/get-dashboarddetailschecker`
        );
        setBoxes(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [baseUrl]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/get-graphdatachecker?userId=${userId}`
        );
        setGraphData(response.data.response1.rows);
        setOverAllAmount(response.data.response1.overallTotalAmount);
        setGraphData2(response.data.response2.rows);
        setOverAllAmount2(response.data.response2.overallTotalAmount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [baseUrl]);

  const handleClick = (box) => {
    if (box.boxId == 23) {
      setCurStatus("Exceeding 2 days");
    } else if (box.boxId == 1) {
      setCurStatus("all");
    } else {
      setCurStatus(box.statusName);
    }
    setShowDashboard(false);
  };


  function formatAmount(amount) {
    if (amount) {
      // Remove commas and convert to number
      const numericAmount = parseFloat(amount.replace(/,/g, ''));
      
      // Convert amount to lakhs and format accordingly
      const lakhs = numericAmount / 100000;
      
      // Format lakhs with appropriate decimals and return as string
      return `${lakhs.toLocaleString('en-IN', { maximumFractionDigits: 2 })} lakhs`;
    }
    return "0"; // Default value if amount is not available
  }

  // Calculate the Distributor box data
  const distributorBox = {
    boxId: 1,
    title: "Distributor",
    totalAmountTitle: boxes.find((box) => box.boxId == 17)?.title || "",
    PendingAmountTitle: boxes.find((box) => box.boxId == 18)?.title || "",
    DisputedAmountTitle: boxes.find((box) => box.boxId == 19)?.title || "",

    totalAmount: boxes.find((box) => box.boxId == 17)?.totalAmount || "0",
    pendingAmount: boxes.find((box) => box.boxId == 18)?.totalAmount || "0",
    disputedAmount: boxes.find((box) => box.boxId == 19)?.totalAmount || "0",
  };

  return (
    <>
      <div className={styles.dashboardContainer}>
        <div className={styles.gridContainer}>
          {/* Distributor Box */}

          <div className={styles.statusBox}>
            <div className={styles.mainContent}>
              <div className={styles.iconContainer}>
                <ListItemIcon>
                  <PaymentIcon style={{ fontSize: "3rem", color: "#a64fe8" }} />
                </ListItemIcon>
              </div>
              <div className={styles.contentContainer}>
                {/* <p className={styles.title}>Distributor</p> */}
                {/* <h2 className={styles.amount}>
                  <span className={styles.unit}>₹</span>
                  {distributorBox.totalAmount === "0.00" ? "0" : distributorBox.totalAmou
                  nt}
                </h2> */}
                {/* <div className={styles.combinedDiv}>
                <span  className={styles.title}>{distributorBox.totalAmountTitle}:</span>
                <span>₹{distributorBox.totalAmount.split('.')[0]}

                </span>
                </div>
                <div className={styles.combinedDiv}>
                <span  className={styles.title}>{distributorBox.PendingAmountTitle}:</span>
                 <span>₹{distributorBox.pendingAmount.split('.')[0]}</span>
                </div>
                <div className={styles.combinedDiv}>
                <span  className={styles.title}>{distributorBox.DisputedAmountTitle}:</span> 
                <span> ₹{distributorBox.disputedAmount.split('.')[0]}</span>
                </div> */}

                <table className={styles.combinedTable}>
                  <thead>
                    <th className={styles.header}>Total</th>
                    <th className={styles.header}>Pending</th>
                    <th className={styles.header}>Disputed</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>₹{distributorBox.totalAmount.split(".")[0]}</td>
                      <td>₹{distributorBox.pendingAmount.split(".")[0]}</td>
                      <td>₹{distributorBox.disputedAmount.split(".")[0]}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className={styles.moreInfoIcon}>
              <div
                title="More info"
                onClick={() => handleClick(distributorBox)}
              >
                ℹ️
              </div>
            </div>
          </div>

          {boxes.map((box) => {
            // Define icon style dynamically based on box.box
            const iconStyle = {
              fontSize: "3rem", // Adjust the size as needed
              color:
                box.boxId == 20
                  ? "#eb5e28"
                  : box.boxId == 2
                  ? "#f3bb45"
                  : box.boxId == 21
                  ? "#7ac29a"
                  : distributorBox.boxId == 23
                  ? "red"
                  : "#3498db",
            };

            // Check if box title is Draft and showDrafts is false, skip rendering
            if (
              (box.boxId == 17 || box.boxId == 18 || box.boxId == 19) &&
              !showDrafts
            ) {
              return null;
            }

            return (
              <div className={styles.statusBox} key={box.id}>
                <div className={styles.mainContent}>
                  <div className={styles.iconContainer}>
                    {box.boxId == 21 ? (
                      <ListItemIcon>
                        <CheckCircleIcon style={iconStyle} />
                      </ListItemIcon>
                    ) : box.boxId == 20 ? (
                      <ListItemIcon>
                        <CheckCircleIcon style={iconStyle} />
                      </ListItemIcon>
                    ) : box.boxId == 22 ? (
                      <ListItemIcon>
                        <span>
                          <img
                            style={{ height: "45px", color: "#f3bb45" }}
                            src={PendingInvoice}
                            alt=""
                          />
                        </span>
                      </ListItemIcon>
                    ) : box.boxId == 14 ? (
                      <ListItemIcon>
                        <AssignmentReturnedIcon style={iconStyle} />
                      </ListItemIcon>
                    ) : (
                      <ListItemIcon>
                        <ErrorIcon style={iconStyle} />
                      </ListItemIcon>
                    )}
                  </div>
                  <div className={styles.contentContainer}>
                    <p
                      className={styles.title}
                      dangerouslySetInnerHTML={{
                        __html: box.title.replace(/,/g, "<br/>"),
                      }}
                    ></p>

                    <h2 className={styles.amount}>
                      <span className={styles.unit}>₹</span>
                      {box.totalAmount === "0"
                        ? "0"
                        : box.totalAmount.split(".")[0]}
                    </h2>
                  </div>
                </div>
                <div className={styles.moreInfoIcon}>
                  <div onClick={() => handleClick(box)} title="More info">
                    ℹ️
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.graphContainer}>
          
          <div>
          {graphData.length > 0 && <p>{overAllAmount}Lakhs</p> }
            <LineChart graphData={graphData}/>
          </div>


          <div>
         {graphData2.length > 0 && <p>{overAllAmount2}Lakhs</p> }
          <LineChart graphData={graphData2}/>
          </div>
        </div>


      </div>
    </>
  );
};

export default ApproverDashboard;
