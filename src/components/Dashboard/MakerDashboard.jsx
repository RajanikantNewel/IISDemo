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
import MakerLineChart from "../Graph/MakerGraph";
import LineChart from "../Graph/Graph";

const MakerDashboard = ({
  // setShowDashboard,
  showDrafts = false,
  setCurStatus = null,
  clearAllFields,
  userId
}) => {

  const {
    isMoreSidebar,
    userName,
    
    setShowDashboard,
    showDashboard,
    sidebarText,
    
  } = useSidebarContext();
  const [boxes, setBoxes] = useState([]);

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const [graphData2, setGraphData2] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [overAllAmount, setOverAllAmount] = useState([]);
  const [overAllAmount2, setOverAllAmount2] = useState([]);

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    document.documentElement.scrollTop = 0;
    
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/get-dashboarddetailsmaker`
        );
        const newResponse = await response.data;
        console.log(newResponse,"response")
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
          `${baseUrl}/get-graphdataMaker?userId=${userId}`
        );
        setGraphData(response.data.response2.rows);
        setOverAllAmount(response.data.response2.overallTotalAmount);
        setGraphData2(response.data.response.rows);
        setOverAllAmount2(response.data.response.overallTotalAmount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (box) => {

    console.log(box,"boxes")
    console.log(box,"57")
    console.log(box.statusName,"58");
    if(box.boxId==6){
      setCurStatus("Exceeding 2 days")
    }
    else if(box.boxId==5){
      setCurStatus("all")
    }
    else if(box.boxId==4){
      setCurStatus("returned")
    }
   
    else{
      setCurStatus(box.statusName);

    }
    setShowDashboard(false);
  };

  // Return the component
  return (
    <>
      <div
        style={{
          padding: "20px 20px",
          display: "flex",
          justifyContent: "space-between",
          // borderBottom: "2px solid #878787",
          alignItems: "center",
        }}
      >
        <span style={{ color: "black", fontWeight: "600", fontSize: "1rem" }}>
          Distributor Brokerage
        </span>

        <button className="add-new-btn" onClick={handleClick}>
          Add New
        </button>
      </div>
      <div className={styles.dashboardContainer}>
        <div className={styles.gridContainer}>
          {boxes.map((box) => {
            // Define icon style dynamically based on box.box
            const iconStyle = {
              fontSize: "3rem", // Adjust the size as needed
              color:
                box.boxId == 5
                  ? "#eb5e28"
                  : box.boxId == 3
                  ? "#f3bb45"
                  : box.boxId == 2
                  ? "#7ac29a"
                  : box.boxId == 4
                  ? "red "
                  : "#3498db",
            };

            // Check if box title is Draft and showDrafts is false, skip rendering
            if (box.statusId == 1 && !showDrafts) {
              return null;
            }

            return (
              <div className={styles.statusBox} key={box.id}>
                <div className={styles.mainContent}>
                  <div className={styles.iconContainer}>
                    {box.boxId == 3 ? (
                      <ListItemIcon>
                        <DraftsIcon style={iconStyle} />
                      </ListItemIcon>
                    ) : box.boxId == 5 ? (
                      <ListItemIcon>
                        <CheckCircleIcon style={iconStyle} />
                      </ListItemIcon>
                    ) : box.boxId == 2 ? (
                      <ListItemIcon>
                        <PublishedWithChangesIcon style={iconStyle} />
                      </ListItemIcon>
                    ) : box.boxId == 4 ? (
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
                    <p className={styles.title}>{box.title}</p>
                    <h2 className={styles.amount}>
                      <span className={styles.unit}>₹</span>
                      {box.totalAmount === "0.00" ? "0" : box.totalAmount.split('.')[0]}
                    </h2>
                  </div>
                </div>
                <div className={styles.moreInfoIcon}>
                  {/* Replace with appropriate icon component */}
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
            <MakerLineChart graphData={graphData2}/>
          </div>
        </div>


      </div>
    </>
  );
};

export default MakerDashboard;
