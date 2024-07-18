// Header.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import accountlogin from "../../images/accountlogin.png";
import neoHeader from "../../images/neoHeader.png";
import styles from "./Header.module.css"; // Import the CSS Module

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useProSidebar } from "react-pro-sidebar";
import { useSidebarContext } from "../Sidebar/context/SidebarState";
import LoginIcon from '@mui/icons-material/Login';
import expand from "../../images/sidebar.png"
import collapse from "../../images/collapse.png"

import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import { ListItemIcon } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';



const Header = ({
  text,
  userName,
  userId,
  setShowDashboard,
  showDashboard = null,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { collapseSidebar } = useProSidebar();
  const [isActive, setIsActive] = useState(false);
  const [expandBtn,setExpandBtn] = useState(false);

  const { setIsMoreSidebar, setSidebarText, setUserName, setUserId } =
    useSidebarContext();

  useEffect(() => {
    setSidebarText(text);
    setUserName(userName);
    setUserId(userId);
  }, []);

  const handleLogout = () => {
    setTimeout(async function () {
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
      sessionStorage.removeItem("userId");
      location.state.userId = null;
      navigate("/", { replace: true });
    }, 1000);
  };

  const toggleSidebar = () => {
    // setSidebarOpen(!sidebarOpen);
    collapseSidebar();
    setExpandBtn(!expandBtn)
    setIsMoreSidebar((value) => !value);
  };

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
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
      color: 'white',
      cursor:"pointer",
     
    },
  };

  return (
    <div style={{ display: "flex", transition: "left 0.5s" }}>
      {/* <Sidebar
        // isOpen={sidebarOpen}
        // toggleSidebar={toggleSidebar} // this is not needed
        text={text}
        setShowDashboard={setShowDashboard}
        showDashboard={showDashboard}
        // isActive={isActive}
      /> */}

      <div className={styles.headerContainer} style={{ flex: 1 }}>
        <div className={styles.headerLeft} >
          {/* // menu , more buttons */}
          {expandBtn ? 
          <ListItemIcon onClick={toggleSidebar}>
          <img src={expand} className={styles.logoImgHeader}></img>
          </ListItemIcon>
        :
        <ListItemIcon onClick={toggleSidebar}>
        <img src={collapse} className={styles.logoImgHeader}></img>
        </ListItemIcon>
}
          {/* <img className={styles.logoImgHeader} src={neoHeader} alt="Logo" /> */}
          <span className={styles.appTitle}>Distributor Invoice</span>
        </div>

        <div className={styles.headerRight}>
          <span className={styles.welcomeText}>
            Welcome {toTitleCase(userName)}!
          </span>
          <div className={styles.userInfo}>
            <img
              className={styles.userAvatar}
              src={accountlogin}
              alt="User Avatar"
            />
            <span className={styles.logoutText} onClick={handleLogout}>
              Logout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
