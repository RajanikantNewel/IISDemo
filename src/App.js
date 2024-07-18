import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MasterPage from "./pages/MasterPage";
import DistributorBrokeragePage from "./pages/DistributorBrokerage";
import ApproverPage from "./pages/ApproverPage";
import AccountLoginPage from "./pages/AccountLoginPage";
import DistributorLoginPage from "./pages/DistributorLoginPage";
import NotFound from "./pages/NotFound";
import UserMasterPage from "./pages/UserMaster";
import FundMasterPage from "./pages/FundMaster";
import AdminPage from "./pages/Admin";
import { useLocation, Navigate } from "react-router-dom";
import SidebarPro from "./components/Sidebar/SidebarPro";
import { useSidebarContext } from "./components/Sidebar/context/SidebarState";

const ProtectedRoute = ({ children }) => {
  const { isMoreSidebar } = useSidebarContext();
  const location = useLocation();
  const userId =
    location.state?.userId ||
    localStorage.getItem("userId") ||
    sessionStorage.getItem("userId");

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ display: "flex" ,transition: "left 0.8s"}}>
      <SidebarPro />
      <div
        style={{
          backgroundColor:"#f4f3ef",
          flex: 1,
          marginLeft: isMoreSidebar ? "70px" : 0,
          transition: "right 0.8s",
        }}
      >
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />{" "}
        <Route
          path="/distributormaster"
          element={
            <ProtectedRoute>
              <MasterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fundmaster"
          element={
            <ProtectedRoute>
              <FundMasterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usermaster"
          element={
            <ProtectedRoute>
              <UserMasterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/distributor-brokerage"
          element={
            <ProtectedRoute>
              <DistributorBrokeragePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Approver"
          element={
            <ProtectedRoute>
              <ApproverPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Account-Login"
          element={
            <ProtectedRoute>
              <AccountLoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Distributor-Login"
          element={
            <ProtectedRoute>
              <DistributorLoginPage />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/Sidebar"
          element={
            <ProtectedRoute>
              <SidebarPro />
            </ProtectedRoute>
          }
        /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
