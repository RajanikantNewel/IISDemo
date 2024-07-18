import { createContext, useContext, useState } from "react";

import { ProSidebarProvider } from "react-pro-sidebar";
export const CreateSidebarContext = createContext(null);


const SidebarStateProvider = (props) => {
  const [isMoreSidebar, setIsMoreSidebar] = useState(false);
  const [sidebarText,setSidebarText]=useState([]);
  const [showMenu,setShowMenu]=useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [isDashboard,setIsDashboard]=useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  // isOpen,
  // toggleSidebar,
  // text,
  // setShowMenu,
  // showMenu,
  // handleNavigationMasters,
  // setShowDashboard,
  // noDash = null,
  // showDashboard
  const sidebarData={
    isMoreSidebar,
    setIsMoreSidebar,
    sidebarText,
    setSidebarText,
    showMenu,
    setShowMenu,
    showDashboard,
    setShowDashboard,
    isDashboard,
    setIsDashboard,
    userId,
    userName,
    setUserId,
    setUserName
  }

  return (
    <CreateSidebarContext.Provider value={{...sidebarData}}>
      <ProSidebarProvider>{props.children}</ProSidebarProvider>
    </CreateSidebarContext.Provider>
  );
};

export const useSidebarContext=()=>useContext(CreateSidebarContext);
export default SidebarStateProvider;
