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
import { useSidebarContext } from "../Sidebar/context/SidebarState";
import graph1 from "../../images/graph1.png"
import graph2 from "../../images/graph2.png"

import LineChart from "../Graph/Graph";

const Dashboard = ({

  showDrafts = false,
  setCurStatus = null,
  distId
}) => {

  const {
    isMoreSidebar,
    userName,
    userId,
    setShowDashboard,
    showDashboard,
    sidebarText,
    
  } = useSidebarContext();
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
          `${baseUrl}/get-graphdatadistributor?distId=${distId}`
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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/get-dashboarddetailsdistributor`
        );
        setBoxes(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (box) => {
    
    if(box.boxId==11){
      setCurStatus("Exceeding 2 days")
    }
    else if(box.boxId==10){
      setCurStatus("all")
    }
    else{
      setCurStatus(box.statusName);
    }
    setShowDashboard(false);
  };

  // Return the component
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.gridContainer}>
        {boxes.map((box) => {
          // Define icon style dynamically based on box.statusId
          const iconStyle = {
            fontSize: "3rem", // Adjust the size as needed
            color:
              box.boxId == 10
                ? "#eb5e28"
                : box.boxId == 11
                ? "#3498db"
                : box.boxId == 7
                ? "#f3bb45"
                : box.statusId == 3
                ? "#7ac29a"
                : "red",
          };

          // Check if box title is Draft and showDrafts is false, skip rendering
          if (box.statusId == 1 && !showDrafts) {
            return null;
          }

          return (
            <div className={styles.statusBox} key={box.id}>
              <div className={styles.mainContent}>
                <div className={styles.iconContainer}>
                  {box.boxId == 10 ? (
                    <ListItemIcon>
                      <CheckCircleIcon style={iconStyle} />
                    </ListItemIcon>
                  ) : box.boxId == 7 ? (
                    <ListItemIcon>
                      <PaymentIcon style={iconStyle} />
                    </ListItemIcon>
                  ) : box.boxId == 8 ? (
                    <ListItemIcon>
                      <UploadFileIcon style={iconStyle} />
                    </ListItemIcon>
                  ) : box.boxId == 9 ? (
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
                    {box.totalAmount === "0" ? "0" : box.totalAmount.split('.')[0]}
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
            <LineChart graphData={graphData2}/>
          </div>
        </div>
      {/* <div className={styles.graphContainer}>
        <div >
          <img src={graph1} alt="" />
        </div>
        <div>
          <img src={graph2} alt="" />
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
