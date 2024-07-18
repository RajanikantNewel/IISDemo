import { useEffect, useState } from "react";
import FundTable from "../components/Table/FundTable";

import Header from "../components/Header/Header";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPageHeader from "./Admin";
import NotFound from "./NotFound";
import Footer from "../components/Footer/Footer";

const FundMasterPage = () => {
  const [status, setStatus] = useState("");

  const [rowId, setRowId] = useState("");

  const [funds, setFunds] = useState([]);

  const [disableFields, setDisableFields] = useState(false);

  const [roleInput, setRoleInput] = useState("");

  const [selectedOption, setSelectedOption] = useState("");

  const [tableData, setTableData] = useState([]);

  const [showDashboard, setShowDashboard] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const { userId = null, userName } = location.state ? location.state : {};

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/not", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const response = await axios.get(`${baseUrl}/fund-types`);
        console.log(response.data);
        setTableData(response.data);
      } catch (error) {
        console.error("Error fetching fund types:", error.message);
        toast.error("Error fetching fund details.");
      }
    };
    fetchFunds();
  }, []);

  const clearAllFields = () => {
    document.getElementById("fund-name").value = "";
    // console.log(rowData,"name"

    document.getElementById("des1").value = "";

    document.getElementById("des2").value = "";

    setRowId("");
  };

  if (userId === null) {
    return <NotFound />;
  }

  const handleAction = async (action) => {
    const fundNameInput = document.getElementById("fund-name").value;
    const des1 = document.getElementById("des1").value;
    const des2 = document.getElementById("des2").value;

    // Your actual functionality here

    if (!fundNameInput || !des1 || !des2) {
      toast.error("Please fill all the fields");
      return;
    }

    const loader = document.getElementById("loader");
    loader.style.display = "block";

    setTimeout(async function () {
      try {
        if (rowId) {
          const response = await axios.put(`${baseUrl}/update-fund/${rowId}`, {
            fundNameInput,
            des1,
            des2,
            action,
          });

          console.log(response.data, "68 updated");

          const updatedFund = response.data;

          const { fundName, description1, description2, isActive } =
            updatedFund;

          const updatedData = tableData.map((item) => {
            if (item.id === rowId) {
              return {
                id: item.id,
                fundName,
                description1,
                description2,
                isActive,
              };
            }
            return item;
          });

          setTableData(updatedData);
          toast.success("Fund updated successfully.");
        } else {
          const response = await axios.post(`${baseUrl}/add-fund-details`, {
            fundNameInput,
            des1,
            des2,
          });
          console.log(response.data);

          // Handle response data from backend if needed
          // setShowRemarksBox(false);
          setTableData([...tableData, response.data]);

          toast.success("Fund added successfully.");
        }
        clearAllFields();
      } catch (error) {
        console.error("Error modifying:", error.message);

        // Handle specific error for disabling the fund
        if (error.response && error.response.status === 400) {
          toast.error(
            "There is a transaction in processing with this Fund, try again later."
          );
        } else {
          toast.error("Error modifying Fund details.");
        }
      } finally {
        loader.style.display = "none";
      }
    }, 1000);
  };

  const handleRowClick = async (rowData) => {
    toast.info("Row get selected");
    document.getElementById("fund-name").value = rowData.fundName;

    document.getElementById("des1").value = rowData.description1;

    document.getElementById("des2").value = rowData.description2;

    setRowId(rowData.id);
  };

  return (
    <>
      <Header
        userId={userId}
        userName={userName}
        text={["Admin", "Masters"]}
        setShowDashboard={setShowDashboard}
      />

      <div id="loader" style={{ display: "none" }}></div>
      <div></div>

      <div
        style={{
          marginLeft: "5px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <div style={{ flex: 1 }}>
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
              style={{
                color: "black",
                fontWeight: "700",
                fontSize: "1.1rem",
              }}
            >
              Fund Master
            </span>
            <button
              className="add-new-btn"
              style={{ marginBottom: "10px" }}
              onClick={clearAllFields}
            >
              Add New
            </button>
          </div>

          <div className="distribution-brokerage-main">
            <div id="loader" style={{ display: "none" }}></div>
            <div>
              <label htmlFor="fund-name">Fund Name:</label>
              <input type="text" id="fund-name" />
            </div>

            <div>
              <label htmlFor="des1">Description 1:</label>
              <input type="text" id="des1" />
            </div>

            <div>
              <label htmlFor="des2">Description 2:</label>
              <input type="text" id="des2" />
            </div>
              <div></div>
              <div></div>

            <div
            className="sub-btn-main"
            style={{
              marginTop: "20px",
              marginBottom: "40px",
              // paddingRight: "15px",
              marginRight:"18px"
            }}
          >
            {rowId ? (
              <div
                className="btns-broker"
                style={{ marginTop: "0px", paddingRight: "-20px" }}
              >
                <button
                  className="save"
                  onClick={() => handleAction("update")}
                  style={{ marginRight: "10px", marginTop: "20px" }}
                >
                  Update
                </button>
                <button
                  className="submit"
                  onClick={() => handleAction("disable")}
                >
                  Disable
                </button>
              </div>
            ) : (
              <button className="submit" onClick={() => handleAction("")}>
                Submit
              </button>
            )}
          </div>
          </div>

          

          <FundTable
            tableData={tableData}
            handleRowClick={handleRowClick}
            setTableData={setTableData}
          />
        </div>
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

export default FundMasterPage;
