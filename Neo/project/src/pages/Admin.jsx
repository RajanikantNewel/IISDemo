import accountlogin from "../images/accountlogin.png";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import NotFound from "./NotFound";
import neoHeader from "../images/neoHeader.png";
import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { useSidebarContext } from "../components/Sidebar/context/SidebarState";
import { useProSidebar } from "react-pro-sidebar";

const AdminPageHeader = ({ 
  userId, userName, 
  text }) => {
  const navigate = useNavigate(); // Hook for navigation

  // hooks for handling sidebar
  const {setIsMoreSidebar,setSidebarText,setUserName,setUserId}=useSidebarContext();
  const {collapseSidebar,
    // userId,userName

  }=useProSidebar();

  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const [noDash,setNoDash]=useState(true);
  // const { userId = null, distId } = location.state ? location.state : {};

  // // Function to handle navigation when span is clicked
  const handleNavigationMasters = (path) => {
    navigate(path, { state: { userId: userId, userName } });
  };
  // const toggleSidebar = () => {
  //   setSidebarOpen(!sidebarOpen);
  // };

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  const handleLogout = () => {
    const loader = document.getElementById("loader");
    loader.style.display = "block"; // Show loader
    setTimeout(async function () {
      // Your actual functionality here
      // For demonstration, I'm just delaying the hiding of the loader after 3 seconds

      localStorage.removeItem("userId");
      localStorage.removeItem("user");
      sessionStorage.removeItem("userId");

      loader.style.display = "none";
      // Clear user ID from local storage

      location.state.userId = null;
      // Navigate to the login page
      navigate("/", { replace: true });
    }, 1000);
  };
  const toggleSidebar = () => {

    // setSidebarOpen(!sidebarOpen);
    collapseSidebar();
    setIsMoreSidebar(value=>!value);

  };
  useEffect(()=>{
    setSidebarText(text);
    setUserName(userName);
    setUserId(userId);
  },[])

  // if (userId === null) {
  //     return <NotFound/>;
  // }

  return (
    <>
    <div style={{ display: "flex", transition: "left 0.5s" }}>
      {/* <div> */}
        {/* <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          text={text}
          handleNavigationMasters={handleNavigationMasters}
          setShowMenu={setShowMenu}
          showMenu={showMenu}
          setShowDashboard={setShowDashboard}
          noDash={noDash}
        /> */}
        <div
         className="header-container"
         style={{ flex: 1 }}
        >
          <div
            onClick={toggleSidebar}
            className="header-left" 
          >
            <img
              className="logo-img-header"
              src={neoHeader}
            />
            <span
             className="app-title"
            >
              Distributor Invoice
            </span>
          </div>

        
          <div
            className="header-right"
          >
            <span  className="welcome-text">
              Welcome {toTitleCase(userName)}
            </span>
            <div
              className="user-info"
            >
              <img
               className="user-avatar"
                src={accountlogin}
                alt="User Avatar" 
              />
              <span
               className="logout-text"
                onClick={handleLogout}
              >
                Logout
              </span>
            </div>
          </div>
          {/* </>
                } */}
        </div>
      {/* </div> */}
      </div>
    </>
  );
};

export default AdminPageHeader;
