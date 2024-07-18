// import React from "react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import neoHeader from "../../images/neoHeader.png";
import styles from "./Sidebar.module.css"; // Import CSS module

// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import Collapse from "@mui/material/Collapse";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DashboardIcon from "@mui/icons-material/Dashboard";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";

import DescriptionIcon from "@mui/icons-material/Description";
import TuneIcon from "@mui/icons-material/Tune";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
} from "react-pro-sidebar";
import { ListItemText } from "@mui/material";
import { useSidebarContext } from "./context/SidebarState";

function SidebarPro() {
  const { collapseSidebar, collapsed, broken, toggleSidebar } = useProSidebar();
  //   const [isActive, setIsActive] = React.useState(false);
  const {
    isMoreSidebar,
    userName,
    userId,
    setShowDashboard,
    showDashboard,
    sidebarText,
    
  } = useSidebarContext();
  const [openMasters, setOpenMasters] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const noDash = null;

  const handleNavigationMasters = (path) => {
    navigate(path, { state: { userId: userId, userName } });
  };
  const handleNavigation = (path) => {
    if (
      path === "/fundmaster" ||
      path === "/distributormaster" ||
      path === "/usermaster"
    ) {
      handleNavigationMasters(path);
    } else if (path === "/dashboard") {
      setShowDashboard((value) => !value);
    } else {
    }
    // toggleSidebar(); // Close sidebar after navigation
  };
  const handleToggleMasters = () => {
    setOpenMasters(!openMasters);
  };
  //   const userId =
  //     location.state?.userId ||
  //     localStorage.getItem("userId") ||
  //     sessionStorage.getItem("userId");

  //     if(!userId){
  //         return <></>
  //     }

  const onMouseEnterSidebar = () => {
    if (collapsed && isMoreSidebar) {
      collapseSidebar();
    }
  };

  const onMouseOutSidebar = () => {
    if (!collapsed && isMoreSidebar) {
      collapseSidebar();
    }
  };

  return (
    <div
      style={{
        minHeight: "100%",
        backgroundColor: "#66615b",
        zIndex: 1000,
        
        transition: "left 0.4s ",
        position: isMoreSidebar ? "fixed" : "relative",
      }}
      // onMouseEnter={onMouseEnterSidebar}
      // onMouseLeave={onMouseOutSidebar}
    >
      <Sidebar
        breakPoint="sm"
        transitionDuration={300}
        style={{ borderRightWidth: 0, height: "100%" }}
        rootStyles={{
          ".ps-sidebar-container": {
            backgroundColor: "#66615b",
            height: "100%",
            // borderRight: "none",
            fontFamily:"Helvetica, Arial, sans-serif !important"
           
          },
          ".ps-menuitem-root:hover": { color: "#ec8057 !important", },
          ".ps-menu-button:hover": { color:'#ec8057 !important', },
          ".ps-submenu-content":{
            backgroundColor: "#66615b",
        }
        }}
      >
        <Menu
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity:"0.9"
          }}
        >
          <img className={styles.logoImg} src={neoHeader} alt="Logo" />
        </Menu>
        <hr  style={{margin:!collapsed?"10px 10px 3px 5px":"10px 10px 3px 5px"}}/>
        <Menu
          style={{ paddingTop: "30px" }}
          rootStyles={{
            ".ps-menu-button:hover": { backgroundColor: "inherit" },
          }}
          menuItemStyles={{
            button: ({ active }) => ({
              borderLeft: active && "6px solid #f54707",
            }),
          }}
        >
          { !showDashboard ? (
            <MenuItem
            sx={{
              "&:hover": {
                color: "#ec8057 !important",
                fontWeight: "900"
              },
              "&:hover .MuiListItemIcon-root": {
                color: "#ec8057 !important",
              },
            }}
              // onMouseEnter={() => setActiveItem("Back to Dashboard")}
              // onMouseLeave={() => setActiveItem(null)}
              // className={styles.sidebarItem}
              // button
              // onClick={() => handleNavigation("/dashboard")}
              style={{ color: "white" }}
              icon={<DashboardIcon fontSize="small" sx={{ color: "white" , "&:hover": {
                color: "#ec8057 !important",
              },}} />}
              onClick={()=>handleNavigation("/dashboard")}
            >
              DASHBOARD
            </MenuItem>
          ):null}

          {sidebarText.map((item, idx) => (
            <>
              {item === "Masters" ? (
                <SubMenu
                sx={{
                  "&:hover": {
                    color: "#ec8057",
                  },
                  "&:hover .MuiListItemIcon-root": {
                    color: "#ec8057",
                  },
                   fontWeight: "900"
                }}
                  label={item.toUpperCase()}
                //   color="black"
                    style={{ color: "white" }}
                  icon={
                    <DescriptionIcon fontSize="small" sx={{ color: "white" , "&:hover": {
                      color: "#ec8057 !important",
                    },}} />
                  }
                >
                  <MenuItem
                    style={{ color: "white" }}
                    icon={<PeopleAltIcon sx={{ color: "white" , "&:hover": {
                      color: "#ec8057 !important",
                       fontWeight: "900"
                    },}} fontSize="small" />}
                    onClick={() => handleNavigationMasters("/usermaster")}
                  >
                    UserMaster
                  </MenuItem>
                  <MenuItem
                    style={{ color: "white" }}
                    icon={<StorefrontIcon sx={{ color: "white", "&:hover": {
                      color: "#ec8057 !important",
                    }, }} fontSize="small" />}
                    onClick={() =>
                      handleNavigationMasters("/distributormaster")
                    }
                  >
                    Distributor Master
                  </MenuItem>
                  {/* <MenuItem onClick={() => handleNavigationMasters("/fundmaster")}>
                        Fund Master
                        </MenuItem> */}
                  <MenuItem
                    style={{ color: "white" }}
                    icon={<AssessmentIcon sx={{ color: "white", "&:hover": {
                      color: "#ec8057 !important",
                    }, }} fontSize="small" />}
                    onClick={() => handleNavigationMasters("/fundmaster")}
                  >
                    Fund Master
                  </MenuItem>
                </SubMenu>
              ) : (
                <MenuItem
                  key={idx}
                  style={{ color: "white" }}
                  onClick={() =>
                    item === "Masters"
                      ? null
                      : () => handleNavigation(`/${item.toLowerCase()}`)
                  }
                  icon={
                    <DescriptionIcon fontSize="small" sx={{ color: "white", "&:hover": {
                      color: "#ec8057 !important",
                    }, }} />
                  }
                >
                  {item.toUpperCase()}
                </MenuItem>
              )}
            </>
          ))}
          {/* <MenuItem
            icon={<DashboardIcon fontSize="medium" sx={{ color: "white" }} />}
          >
            Master
          </MenuItem>
          <MenuItem
            icon={
              <TuneIcon
                fontSize="medium"
                sx={{ color: "white", rotate: "90deg" }}
              />
            }
          >
            DASHBOARD
          </MenuItem>
          <MenuItem
            icon={<DashboardIcon fontSize="medium" sx={{ color: "white" }} />}
          >
            User Master
          </MenuItem> */}
        </Menu>
      </Sidebar>
    </div>
  );
}

export default SidebarPro;
