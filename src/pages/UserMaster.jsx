import { useEffect, useState } from "react";
import TableUser from "../components/Table/TableUser";

import Header from "../components/Header/Header";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPageHeader from "./Admin";
import NotFound from "./NotFound";
import Footer from "../components/Footer/Footer";
import Dashboard from "../components/Dashboard/Dashboard";

const UserMasterPage = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState("");

  const [rowId, setRowId] = useState("");

  const [roles, setRoles] = useState([]);

  const [admin, setAdmin] = useState("");

  const [role, setRole] = useState("");

  const [disableFields, setDisableFields] = useState(false);

  const [roleInput, setRoleInput] = useState("");

  const [selectedOption, setSelectedOption] = useState("");

  const [tableData, setTableData] = useState([]);

  const location = useLocation();

  const {
    userId = null,
    distId,
    userName,
  } = location.state ? location.state : {};

  const [showDashboard, setShowDashboard] = useState(true);

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/not", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${baseUrl}/role-types`);
        console.log(response.data);
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching role types:", error.message);
        toast.error("Error retrieving Role details.");
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get-all-users`);
        // Initialize status for each row
        const data = response.data;
        console.log(response.data, "20");

        setTableData(data);
      } catch (error) {
        console.error("Error retrieving Users details:", error.message);
        toast.error("Error retrieving Users details.");
      }
    };
    fetchUsers();
  }, []);

  if (userId === null) {
    return <NotFound />;
  }

  const clearAllFields = () => {
    document.getElementById("user-name").value = "";
    // console.log(rowData,"name")

    // document.getElementById("user-id").value = "";

    document.getElementById("user-email").value = "";

    document.getElementById("user-mobile").value = "";

    document.getElementById("role").value = "";

    setStatus("");
    setRowId("");
    setSelectedOption("");
    setDisableFields(false);
  };

  const handleAction = async (action) => {
    const userName = document.getElementById("user-name").value;
    const emailId = document.getElementById("user-email").value;
    const mobile = document.getElementById("user-mobile").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(emailId);

    const phoneRegex = /^\d{10}$/;
    const isPhoneValid = phoneRegex.test(mobile);

    if (!isEmailValid) {
      toast.error("Invalid email format");
      return;
    } else if (!isPhoneValid) {
      toast.error("Invalid phone number. It should be 10 digits.");
      return;
    }

    const selectElement = document.getElementById("role");
    const role = selectedOption;

    if (!userName || !emailId || !mobile || !role) {
      toast.error("Please fill all the fields");
      return;
    }

    const loader = document.getElementById("loader");
    loader.style.display = "block";

    try {
      let response;
      if (rowId) {
        response = await axios.put(`${baseUrl}/update-user/${rowId}`, {
          userName,
          emailId,
          mobile,
          status,
          role,
          action,
        });
      } else {
        action = "";
        response = await axios.post(`${baseUrl}/add-user-details`, {
          userName,
          emailId,
          mobile,
          status,
          role,
          action,
        });
      }

      // Handle success response
      console.log(response.data);
      const user = response.data;

      const { newUserRow, newRoleRow } = user;

      const { id, username, isactive, email, mobile_no } = newUserRow;

      const { roleCode } = newRoleRow;

      const updatedData = tableData.map((item) => {
        if (item.id === id) {
          return {
            id,
            username,
            isactive,
            email,
            mobile_no,
            roleCode,
          };
        }
        return item;
      });

      setTableData(updatedData);

      if (rowId) {
        toast.success("User updated successfully.");
      } else {
        toast.success("User added successfully.");
      }

      clearAllFields();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle specific error responses
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
      } else {
        // Handle generic error
        console.error("Error modifying:", error.message);
        toast.error("Error modifying User details.");
      }
    }

    loader.style.display = "none";
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleRowClick = async (rowData) => {
    setRole(rowData.roleCode);
    toast.info("Row get selected");
    if (rowData.roleCode == "Distributor") {
      setDisableFields(true);
      setRoleInput("Distributor");
      document.getElementById("user-name").value = rowData.username;
      console.log(rowData, "name");

      document.getElementById("user-email").value = rowData.email;

      document.getElementById("user-mobile").value = rowData.mobile_no;

      setSelectedOption(rowData.roleCode);

      setStatus(rowData.isactive === 1 ? true : false);
      setRowId(rowData.id);
    } else {
      setRoleInput("");
      setDisableFields(false);
      setSelectedOption(rowData.roleCode);

      console.log(selectedOption, "241");

      document.getElementById("user-name").value = rowData.username;
      console.log(rowData, "name");

      // document.getElementById("user-id").value = rowData.id;

      document.getElementById("user-email").value = rowData.email;

      document.getElementById("user-mobile").value = rowData.mobile_no;

      setStatus(rowData.isactive === 1 ? true : false);
      setRowId(rowData.id);
    }
  };

  const handleSelectChange = (e) => {
    // const selectedRoleDescription = e.target.value;
    // setSelectedOption(e.target.value)

    const tdsCategory = document
      .getElementById("role")
      .options[document.getElementById("role").selectedIndex].getAttribute(
        "data-description"
      );
    console.log(tdsCategory, "266");

    setSelectedOption(tdsCategory);
    console.log(selectedOption, "264");
  };
  const logState = state => {
    console.log('Toggled:', state)
    setStatus(state);
}

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
        <div style={{ flex: 1,backgroundColor:"#f4f3ef;" }}>
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
              User Master
            </span>
            <button className="add-new-btn" onClick={clearAllFields}>
              Add New
            </button>
          </div>

          <div className="distribution-brokerage-main">
            <div id="loader" style={{ display: "none" }}></div>
            <div>
              <label htmlFor="user-name">User Name:</label>
              <input type="text" id="user-name" disabled={disableFields} />
            </div>

              {/*<div>
             <label htmlFor="user-id">User ID:</label>
                <input type="number" id="user-id" disabled={disableFields}/>
            </div> */}

            <div>
              <label htmlFor="user-email">Email ID:</label>
              {/* <div className="add-name-container">
                    {emails.map((item,idx)=>{
                        return <button key={idx}>{item}
                        <span onClick={()=>deleteEmail(item)}>X</span>
                        </button>
                    })}   */}
              <input
                type="text"
                id="user-email"
                disabled={disableFields}

                // onKeyDown={addEmail}
              />
              {/* </div> */}
            </div>

            <div>
              <label htmlFor="user-mobile">Mobile Number:</label>
              {/* <div className="add-name-container">
                    {mobiles.map((item,idx)=>{
                        return <button key={idx}>{item}
                        <span onClick={()=>deleteMobile(item)}>X</span>
                        </button>
                    })} */}
              <input type="text" id="user-mobile" disabled={disableFields} />
            </div>

            <div>
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                onChange={handleSelectChange}
                value={disableFields ? "Distributor" : selectedOption}
                //  defaultValue={disableFields ? "Distributor": selectedOption}
                disabled={disableFields}
              >
                <option value="">Select Role</option>
                {roles.map((category) => {
                  if (category.description1 !== "Distributor") {
                    return (
                      <option
                        key={category.id}
                        value={category.description1}
                        name={category.Code}
                        data-description={category.description1}
                      >
                        {category.description1}
                      </option>
                    );
                  }
                })}
              </select>
            </div>

             {/*<div >
              <label>Status:</label>
              <div className="status-div">
                <div >
                <input
                  style={{ width: "15px" }}
                  type="radio"
                  id="status-active"
                  name="status"
                  value="active"
                  checked={status === "active"}
                  onChange={handleStatusChange}
                  disabled={disableFields}
                />
                <label htmlFor="status-active">Active</label>
                </div>
              </div>
              <div className="status-div">
                <div >
                <input
                  style={{ width: "15px" }}
                  type="radio"
                  id="status-inactive"
                  name="status"
                  value="inactive"
                  checked={status === "inactive"}
                  onChange={handleStatusChange}
                  disabled={disableFields}
                />
                <label htmlFor="status-inactive">InActive</label>
                </div>
              </div> 
             
            </div>
            */}
            <div></div>
            {/* <div></div> */}
            <div></div>
            <div></div>
            {role !== "Distributor" ? (
            <div
              className="sub-btn-main"
              style={{
                marginTop: "20px",
                marginBottom: "40px",
                paddingRight: "15px",
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
          ) : (
            <div
              className="sub-btn-main"
              style={{
                marginTop: "20px",
                marginBottom: "40px",
                paddingRight: "15px",
                height: "55px",
              }}
            ></div>
          )}
          </div>

          

    

          <TableUser
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

export default UserMasterPage;
