import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import neo from "../../images/neo.png";
import styles from "./Sidebar.module.css"; // Import CSS module

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import DescriptionIcon from "@mui/icons-material/Description";

const SidebarMain = ({
  isOpen,
  toggleSidebar,
  text,
  setShowMenu,
  showMenu,
  handleNavigationMasters,
  setShowDashboard,
  noDash = null,
  showDashboard,
}) => {
  console.log(showDashboard, "17");
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null);
  const [openMasters, setOpenMasters] = useState(false);

  const handleNavigation = (path) => {
    if (path === "/fundmaster" || path === "/distributormaster" || path === "/usermaster") {
      handleNavigationMasters(path);
    }
    else if(path === "/dashboard"){
      setShowDashboard(!showDashboard)
    }
    else {

    }
    toggleSidebar(); // Close sidebar after navigation
  };

  const handleToggleMasters = () => {
    setOpenMasters(!openMasters);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainerSidebar}>
        <img className={styles.logoImg} src={neo} alt="Logo" />
      </div>

      <List className={styles.sidebarMenu}>
      {!noDash && !showDashboard && (
          <ListItem
            onMouseEnter={() => setActiveItem("Back to Dashboard")}
            onMouseLeave={() => setActiveItem(null)}
            className={styles.sidebarItem}
            button
            onClick={() => handleNavigationMasters("/dashboard")}
            sx={{
              "&:hover": {
                color: "#ec8057",
              },
              "&:hover .MuiListItemIcon-root": {
                color: "#ec8057",
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon fontSize="small" sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="DASHBOARD" />
          </ListItem>
        )}
        {text.map((item, idx) => (
          <div key={idx}>
            <ListItem
              onMouseEnter={() => setActiveItem(item)}
              onMouseLeave={() => setActiveItem(null)}
              className={styles.sidebarItem}
              button
              onClick={item === "Masters" ? handleToggleMasters : () => handleNavigation(`/${item.toLowerCase()}`)}
              sx={{
                "&:hover": {
                  color: "#ec8057",
                },
                "&:hover .MuiListItemIcon-root": {
                  color: "#ec8057",
                },
              }}
            >
              <ListItemIcon>
            <DescriptionIcon fontSize="small" sx={{ color: "white" }} />
          </ListItemIcon>
              <ListItemText primary={(item).toUpperCase()} />
              {item === "Masters" && (openMasters ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
            {item === "Masters" && (
              <Collapse in={openMasters} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    button
                    onClick={() => handleNavigationMasters("/usermaster")}
                    className={styles.subMenuItem}
                    sx={{
                      "&:hover": {
                        color: "#ec8057",
                      },
                      "&:hover .MuiListItemIcon-root": {
                        color: "#ec8057",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "white",
                      }}
                    >
                      <PeopleAltIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="User Master" 
                    sx={{
                      color: "white",
                      "&:hover": {
                        color: "#ec8057",
                      },
                      "&:hover .MuiListItemIcon-root": {
                        color: "#ec8057",
                      },
                    }}
                    />
                  </ListItem>
                  <ListItem
                    button
                    onClick={() => handleNavigationMasters("/distributormaster")}
                    className={styles.subMenuItem}
                    sx={{
                      color: "white",
                      "&:hover": {
                        color: "#ec8057",
                      },
                      "&:hover .MuiListItemIcon-root": {
                        color: "#ec8057",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "white",
                      }}
                    >
                      <StorefrontIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Distributor Master" 
                    sx={{
                      color: "white",
                      "&:hover": {
                        color: "#ec8057",
                      },
                      "&:hover .MuiListItemIcon-root": {
                        color: "#ec8057",
                      },
                    }}/>
                  </ListItem>
                  <ListItem
                    button
                    onClick={() => handleNavigationMasters("/fundmaster")}
                    className={styles.subMenuItem}
                    sx={{
                      color: "white",
                      "&:hover": {
                        color: "#ec8057",
                      },
                      "&:hover .MuiListItemIcon-root": {
                        color: "#ec8057",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "white",
                      }}
                    >
                      <AssessmentIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Fund Master" 
                    sx={{
                      color: "white",
                      "&:hover": {
                        color: "#ec8057",
                      },
                      "&:hover .MuiListItemIcon-root": {
                        color: "#ec8057",
                      },
                    }}/>
                  </ListItem>
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>

    </div>
  );
};

export default SidebarMain;
