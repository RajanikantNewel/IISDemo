import { useState } from "react";
import Table from "../components/Table/Table";

import Header from "../components/Header/Header";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import ContactTable from "../components/ContactTable/contactTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPageHeader from "./Admin";
import NotFound from "./NotFound";
import Footer from "../components/Footer/Footer";

const MasterPage = () => {
  // const [contactPersonNameInput,setContactPersonNameInput]=useState("");
  const [editMode, setEditMode] = useState(null);

  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [mobiles, setMobiles] = useState([]);
  const [mobileInput, setMobileInput] = useState("");

  const [rowId, setRowId] = useState("");

  const [contactNames, setContactNames] = useState([]);
  const [contactNameInput, setContactNameInput] = useState("");

  const [contactMobiles, setContactMobiles] = useState([]);
  const [contactMobileInput, setContactMobileInput] = useState("");

  const [contactEmails, setContactEmails] = useState([]);
  const [contactEmailInput, setContactEmailInput] = useState("");

  const [addInputs, setAddInputs] = useState(false);

  const [tableData, setTableData] = useState([]);

  let [data, setData] = useState([]);

  const [showDashboard, setShowDashboard] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const { userId = null, userName } = location.state ? location.state : {};

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  // const toastOptions = {
  //     position: "top-right",
  //   };

  // const Slide = cssTransition({
  //     enter: 'Toastify__toast-enter',
  //     exit: 'Toastify__toast-exit',
  //     duration: 500,
  // });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/not", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get-all-distributors`);
        // Initialize status for each row
        const data = response.data;
        console.log(response.data, "20");

        setTableData(response.data);
      } catch (error) {
        console.error("Error retrieving distributors details:", error.message);
        toast.error("Error retrieving distributors details.");
      }
    };
    fetchDistributors();
  }, []);

  const clearAllFields = () => {
    document.getElementById("dist-name").value = "";
    document.getElementById("dist-arn").value = "";
    document.getElementById("pan").value = "";

    document.getElementById("email").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("gst").value = "";
    document.getElementById("tds").value = "";

    // document.getElementById("upload-file").value="";
    setData([]);
    setRowId("");
  };

  if (userId === null) {
    return <NotFound />;
  }

  const updateContactDetails = (rowIndex, editedValues) => {
    // console.log(editedValues);

    // Check if any contact person has empty or null fields

    const contact = editedValues;
    if (!contact.name || !contact.email || !contact.mobile) {
      toast.error("Please fill all fields for each contact person");
      // loader.style.display = 'none';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(contact.email);

    const phoneRegex = /^\d{10}$/;
      const isPhoneValid = phoneRegex.test(contact.mobile);

      if (!isEmailValid) {
        // alert("Invalid email format");
        toast.error("Invalid email format");
        return;
      } else if (!isPhoneValid) {
        // alert("Invalid phone number. It should be 10 digits.");
        toast.error("Invalid phone number. It should be 10 digits.");
        return;
      }

    const updatedTableData = [...data];
    updatedTableData[rowIndex] = {
      ...updatedTableData[rowIndex],
      ...editedValues,
    };
    setData(updatedTableData);
    console.log(data, "updated data");
    setEditMode(null); // Exit edit mode
  };

  const addContactDetails = () => {
    if (contactNameInput && contactEmailInput && contactMobileInput) {
      //enter

      // alert(contactPersonNameInput)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = emailRegex.test(contactEmailInput);

      // phone validation (10 digits)
      const phoneRegex = /^\d{10}$/;
      const isPhoneValid = phoneRegex.test(contactMobileInput);

      if (!isEmailValid) {
        // alert("Invalid email format");
        toast.error("Invalid email format");
        return;
      } else if (!isPhoneValid) {
        // alert("Invalid phone number. It should be 10 digits.");
        toast.error("Invalid phone number. It should be 10 digits.");
        return;
      }

      if (editMode) {
        // Update existing row
        const updatedTableData = [...data];
        updatedTableData[editMode.index] = {
          name: contactNameInput,
          email: contactEmailInput,
          mobile: contactMobileInput,
        };
        setData(updatedTableData);
        setEditMode(null);
        // Exit edit mode
        toast.success("Contact details updated successfully.");
      } else {
        const newContact = {
          name: contactNameInput,
          email: contactEmailInput,
          mobile: contactMobileInput,
        };
        setData([...data, newContact]); // Add new contact to tableData
        console.log(data, "setData");
        toast.success("Contact details added successfully.");
      }

      setContactNameInput("");
      setContactMobileInput("");
      setContactEmailInput("");
    } else {
      toast.warn("Please fill in all contact details.");
    }
  };

  const handleDeleteContact = (index) => {
    const updatedTableData = [...data].filter((_, i) => i !== index);
    setData(updatedTableData);
    toast.info("Contact removed.");
  };

  const handleAction = async (action) => {
    const distName = document.getElementById("dist-name").value;
    const distARN = document.getElementById("dist-arn").value;
    const distPAN = document.getElementById("pan").value;
    const distEmail = document.getElementById("email").value;
    const distMobile = document.getElementById("mobile").value;
    const Gst = document.getElementById("gst").value;
    const Tds = document.getElementById("tds").value;

    console.log(data, "125");
    if (
      !distName ||
      !distARN ||
      !distPAN ||
      !distEmail ||
      !distMobile ||
      !Gst ||
      !Tds
    ) {
      toast.error("Please fill in all details.");
      return;
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(distEmail);

    // phone validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    const isPhoneValid = phoneRegex.test(distMobile);

    // PAN validation (5 letters, 4 digits, 1 letter)
    const panRegex = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
    const isPanValid = panRegex.test(distPAN);

    if (Gst === 0 || Tds === 0) {
      alert("GST and TDS can't be 0");
      return;
    }

    // // ARN validation (assuming alphanumeric and length between 6 to 15 characters)
    // const arnRegex = /^[a-zA-Z0-9]{6,15}$/;
    // const isArnValid = arnRegex.test(distARN);

    // Validate all fields
    if (!isEmailValid) {
      // alert("Invalid email format");
      toast.error("Invalid email format");
      return;
    } else if (!isPhoneValid) {
      // alert("Invalid phone number. It should be 10 digits.");
      toast.error("Invalid phone number. It should be 10 digits.");
      return;
    } else if (!isPanValid) {
      // alert("Invalid PAN format");
      toast.error("Invalid PAN format");
      return;
      // } else if (!isArnValid) {
      //     console.log("Invalid ARN format");
    } else {
      console.log("All inputs are valid");
      // You can now proceed with further processing
      // For example, submitting the form or making an API call
    }

    // Assuming `data` is defined somewhere in your code

    if (data.length === 0) {
      toast.error("Please add at least one contact person");
      // loader.style.display = 'none';
      return;
    }

    const loader = document.getElementById("loader");
    loader.style.display = "block"; // Show loader

    setTimeout(async function () {
      console.log("Row ID:", rowId); // Add this log to check the value of rowId

      try {
        if (rowId) {
          const response = await axios.put(
            `${baseUrl}/update-distributor/${rowId}`,
            {
              distName,
              distARN,
              distPAN,
              distEmail,
              distMobile,
              data,
              action,
              Gst,
              Tds,
            }
          );

          console.log("Updated");
          console.log(response.data, " -----  ", action);

          if (action === "disable") {
            console.log("disable");
            const updatedData = tableData.map((item) => {
              if (item.id === rowId) {
                return {
                  ...item,
                  distName,
                  distARN,
                  distPAN,
                  distEmail,
                  distMobile,
                  isActive: 0,
                  data,
                };
              }
              return item;
            });

            setTableData(updatedData);
            toast.success("Distributor disabled successfully.");
          } else {
            data = response.data.updatedMainData;
            console.log(data, "185 updated");

            const updatedData = tableData.map((item) => {
              if (item.id === rowId) {
                return {
                  ...item,
                  distName,
                  distARN,
                  distPAN,
                  distEmail,
                  distMobile,
                  isActive: 1,
                  data,
                };
              }
              return item;
            });

            setTableData(updatedData);
            toast.success("Distributor updated successfully.");
          }
        } else {
          const response = await axios.post(
            `${baseUrl}/add-distributor-details`,
            {
              distName,
              distARN,
              distPAN,
              distEmail,
              distMobile,
              data,
              Gst,
              Tds,
            }
          );
          console.log(response.data); // Handle response data
          setTableData([...tableData, response.data]);
          toast.success("Distributor added successfully.");
        }

        clearAllFields();
      } catch (error) {
        console.error("Error modifying:", error.message);

        // Handle specific error for disabling the distributor
        if (error.response && error.response.status === 400) {
          toast.error(
            "There is a transaction in processing with this Distributor, try again later."
          );
        } else {
          toast.error("Error modifying distributor details.");
        }
      } finally {
        loader.style.display = "none"; // Hide loader in finally block
      }
    }, 1000);
  };

  const handleRowClick = async (rowData) => {
    console.log(rowData, "71");
    toast.info("Row get selected");
    // Extract distributor details from rowData
    const {
      id,
      distName,
      distPAN,
      distARN,
      distEmail,
      distMobile,
      data,
      Gst,
      Tds,
    } = rowData;

    // Set distributor details in input fields
    document.getElementById("dist-name").value = distName;
    document.getElementById("dist-arn").value = distARN;
    document.getElementById("pan").value = distPAN;
    document.getElementById("email").value = distEmail;
    document.getElementById("mobile").value = distMobile;
    document.getElementById("gst").value = Gst;
    document.getElementById("tds").value = Tds;
    setData(data);
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
              backgroundColor: "white",
            }}
          >
            <span
              style={{
                color: "black",
                fontWeight: "700",
                fontSize: "1.1rem",
              }}
            >
              Distributor Master
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
            <div>
              <label htmlFor="dist-name">Distributor Name:</label>
              <input type="text" id="dist-name" />
            </div>

            <div>
              <label htmlFor="dist-arn">Distribution ARN:</label>
              <input type="text" id="dist-arn" />
            </div>

            <div>
              <label htmlFor="pan">PAN Number:</label>
              <input type="text" id="pan" />
            </div>

            <div>
              <label htmlFor="email">Email ID:</label>

              <input
                type="text"
                id="email"
                // onKeyDown={addEmail}
              />
            </div>

            <div>
              <label htmlFor="mobile">Mobile Number:</label>

              <input type="text" id="mobile" />
            </div>

            <div>
              <label htmlFor="gst">GST:</label>

              <input type="number" id="gst" />
            </div>

            <div>
              <label htmlFor="tds">TDS:</label>

              <input type="number" id="tds" />
            </div>
            <div></div>
            {/* <div></div> */}
            {/* <div className="contact-main"> */}
            <div style={{ marginBottom: "40px" }}>
              <strong>Contact Person Details</strong>
            </div>
            <div></div>
            {/* <div></div> */}
            {/* <div></div> */}

            <div
              style={
                {
                  //  display: "flex", alignItems: "center"
                }
              }
            >
              <label style={{ marginBottom: "10px" }} htmlFor="contact-name">
                Contact Person Name
              </label>

              <input
                type="text"
                id="contact-name"
                value={contactNameInput}
                onChange={(e) => setContactNameInput(e.target.value)}
              />
            </div>

            <div
              style={
                {
                  // display: "flex", alignItems: "center"
                }
              }
            >
              <label htmlFor="contact-email">Contact Person Email:</label>

              <input
                type="text"
                id="contact-email"
                value={contactEmailInput}
                onChange={(e) => setContactEmailInput(e.target.value)}
              />
            </div>

            <div
              style={
                {
                  // display: "flex", alignItems: "center"
                }
              }
            >
              <label htmlFor="contact-phone">Contact Person Phone:</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="number"
                  id="contact-phone"
                  value={contactMobileInput}
                  onChange={(e) => setContactMobileInput(e.target.value)}
                />
                <span
                title="Add more Contact person"
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                    backgroundColor: "inherit",
                  }}
                  onClick={addContactDetails}
                >
                  <img
                    style={{
                      borderRadius: "50%",
                      backgroundColor: "inherit",
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      marginTop:"10px"
                    }}
                    height="35px"
                    width="40px"
                    src="https://static.vecteezy.com/system/resources/previews/013/313/415/original/plus-icon-3d-render-vector.jpg"
                    alt=""
                  />
                </span>
              </div>
            </div>

            <div style={{ textAlign: "left" }}></div>
          {/* </div> */}

         
          <div></div>
          <div
            className="sub-btn-main"
            style={{
              marginTop: "20px",
              marginBottom: "40px",
              paddingRight: "20px",
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

          
            {data.length>0 &&
          <ContactTable
            data={data}
            editMode={editMode}
            setEditMode={setEditMode}
            contactNameInput={contactNameInput}
            setContactNameInput={setContactNameInput}
            contactEmailInput={contactEmailInput}
            setContactEmailInput={setContactEmailInput}
            contactMobileInput={contactMobileInput}
            setContactMobileInput={setContactMobileInput}
            addContactDetails={addContactDetails}
            handleDeleteContact={handleDeleteContact}
            updateContactDetails={updateContactDetails}
          />
            }

          

          <Table
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

export default MasterPage;
