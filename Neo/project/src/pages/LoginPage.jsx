import React, { useState } from "react";
import axios from "axios";
import neo from "../images/neo.png";
import authscreens from "../images/auth-screens.png";
import "../css/main.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginBackground from "../images/LoginBackground.jpg";

const LoginPage = () => {
  const [userInput, setUserInput] = useState("");
  const [otp, setOTP] = useState("");
  const [otpSent, setOTPSent] = useState(false);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isGeneratingOTP, setIsGeneratingOTP] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  console.log(baseUrl);

  const generateOTP = async () => {
    setError("");
    setIsGeneratingOTP(true);

    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (userInput === "" || !emailRegex.test(userInput)) {
      setError("Please enter a valid email address");
      setIsGeneratingOTP(false);
      return;
    }

    try {
      // Make API call to backend to generate OTP
      const response = await axios.post(`${baseUrl}/generate-otp`, {
        email: userInput,
      });
      console.log(response);
      if (response.data.success) {
        setOTPSent(true);
        toast.success("OTP sent successfully!");
        setError("");
      } else {
        console.log("line 26", response.data.error);
        toast.error(response.data.error || "Invalid Email format.");
      }
    } catch (error) {
      console.error("Error validating OTP:", error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error
      ) {
        setError(error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        setError(error.response.data.error);
        toast.error(error.response.data.error);
      }
    } finally {
      setIsGeneratingOTP(false);
    }
  };

  const handleLogin = async () => {
    setError("");
    setIsLoggingIn(true);

    if (userInput === "") {
      setError("Please enter a valid email address");
      toast.error("Enter a valid email address");
      setIsLoggingIn(false);
      return;
    }

    if (otp === "") {
      setError("Please enter a valid OTP");
      toast.error("Enter a valid OTP");
      setIsLoggingIn(false);
      return;
    }

    try {
      // Make API call to backend to validate OTP
      const response = await axios.post(`${baseUrl}/validate-otp`, {
        email: userInput,
        otp,
      });
      console.log(response);
      if (response.data.success) {
        setError("");
        toast.success("Login successful!");
        const res = response.data;
        setRole(res.role);
        // Save user data in local storage
        localStorage.setItem("userId", res.userId);
        // Redirect based on user role
        if (res.role.toLowerCase() === "maker") {
          navigate("/distributor-brokerage", {
            state: {
              userId: res.userId,
              distId: res.distId,
              userName: res.userName,
            },
          });
        } else if (res.role.toLowerCase() === "checker") {
          navigate("/Approver", {
            state: {
              userId: res.userId,
              distId: res.distId,
              userName: res.userName,
            },
          });
        } else if (res.role.toLowerCase() === "distributor") {
          navigate("/Distributor-Login", {
            state: {
              userId: res.userId,
              distId: res.distId,
              userName: res.userName,
            },
          });
        } else if (res.role.toLowerCase() === "admin") {
          navigate("/usermaster", {
            state: {
              userId: res.userId,
              distId: res.distId,
              userName: res.userName,
            },
          });
        } else {
          navigate("/Account-Login", {
            state: {
              userId: res.userId,
              distId: res.distId,
              userName: res.userName,
            },
          });
        }
      } else {
        setError(response.data.error || "Invalid OTP. Please try again.");
        toast.error(response.data.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error validating OTP:", error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error
      ) {
        setError(error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        setError("Failed to validate OTP. Please try again.");
        toast.error("Failed to validate OTP. Please try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUserChange = (e) => {
    setUserInput(e.target.value);
    setError("");
  };

  const handleOtpChange = (e) => {
    setOTP(e.target.value);
    setError("");
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login In</h2>
        {/* <p className="subtitle">Sub Title Section</p> */}

        <form>
          <label htmlFor="email">Email ID:</label>
          <input
            type="text"
            id="email"
            placeholder="Enter Email ID"
            value={userInput}
            onChange={handleUserChange}
          />

          <button
            type="button"
            className="otp-btn"
            onClick={generateOTP}
            disabled={isGeneratingOTP}
          >
            {isGeneratingOTP ? <div className="loader"></div> : "Generate OTP"}
          </button>

          <label htmlFor="otp">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleOtpChange}
          />

          <button
            type="button"
            className="login-btn"
            onClick={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? <div className="loader"></div> : "Login"}
          </button>

          <div className="error-message">{error ? error : ""}</div>
        </form>
      </div>
      <div className="asset-management-visual">
        <div className="logo-contain">
          <img src={neo} alt="Neo Asset Management Logo" className="neo-logo" />
        </div>
        <div className="dashboard-preview">
          <img
            src={authscreens}
            alt="Dashboard Preview"
            className="auth-screens"
          />
        </div>
      </div>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default LoginPage;


// import React, { useState } from 'react';
// import axios from 'axios';
// import logo from '../images/logo.png';
// import "../css/main.css"
// import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import LoginBackground from '../images/LoginBackground.jpg';




// const LoginPage=()=>{

//     const [userInput, setUserInput] = useState('');
//     const [otp, setOTP] = useState('');
//     const [otpSent, setOTPSent] = useState(false);
//     const [role,setRole]=useState("");
//     const [error, setError] = useState('');

//     const navigate = useNavigate();

//     const baseUrl = process.env.REACT_APP_SERVER_BASE_URL

//     console.log(baseUrl);


     



//     const generateOTP = async () => {

//         setError("");
//         const loader=document.getElementById("loader")
//         loader.style.display ='block'; // Show loader
//         setTimeout(async function() {
//           // Your actual functionality here
//           // For demonstration, I'm just delaying the hiding of the loader after 3 seconds
          
//          loader.style.display='none';// Hide loader


       
//         // Regular expression for basic email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         if (userInput === "" || !emailRegex.test(userInput)) {
//             loader.style.display = 'none'; // Hide loader if email is invalid
//             setError("Please enter a valid email address");
//             return;
//         }
//         try {
//             // Make API call to backend to generate OTP
//             const response = await axios.post(`${baseUrl}/generate-otp`, { email: userInput });
//             console.log(response);
//             if (response.data.success) {
//                 setOTPSent(true);
//                 toast.success('OTP sent successfully!');
//                 setError('');
//             } 
//             else {
//                 console.log("line 26",response.data.error)
//                 toast.error(response.data.error || 'Invalid Email format.');
//                 // alert('Failed to send OTP. Please try again.');
//             }
//         } catch (error) {
//             console.error('Error validating OTP:', error);
//             // Check if the error response contains the error message from the backend
//             if (error.response && error.response.status === 400 && error.response.data.error) {
//                 setError(error.response.data.error);
//                 toast.error(error.response.data.error);
//             } else {
//                 setError(error.response.data.error);
//                 toast.error(error.response.data.error);
//             }
//         }
//     },1000)
//     };


//     const handleLogin = async () => {



//         setError("");
//         const loader=document.getElementById("loader")
//         loader.style.display ='block'; // Show loader
//         setTimeout(async function() {
//           // Your actual functionality here
//           // For demonstration, I'm just delaying the hiding of the loader after 3 seconds
          

       
//          if(userInput===""){
//             setError("Please enter a valid email address")
//             toast.error("Enter a valid email address")
//             return ;
//         }
        
//         if(otp===""){
//             setError("Please enter a valid OTP")
//             toast.error("Enter a valid email address")
//             return ;
//         }

//         try {
//             // Make API call to backend to validate OTP
//             const response = await axios.post(`${baseUrl}/validate-otp`, { email: userInput, otp });
//             console.log(response);
//             if (response.data.success) {

//                 setError('');
//                 alert('Login successful!');
//                 toast.success('Login successful!');
//                 const res=response.data;
//                 setRole(res.role);
//                  // Save user data in local storage
//                 localStorage.setItem('userId', res.userId);
//                 // Redirect based on user role
//                 if (res.role.toLowerCase() === 'maker') {
//                     navigate('/distributor-brokerage',{ state: { userId: res.userId,distId:res.distId ,userName:res.userName} }); // Navigate to distributor brokerage page
//                 } 
//                 else if (res.role.toLowerCase()  === 'checker') {
//                     navigate('/Approver',{ state: { userId: res.userId,distId:res.distId,userName:res.userName } }); // Navigate to approver page
//                 }
//                 else if (res.role.toLowerCase()  === 'distributor') {
//                     navigate('/Distributor-Login',{ state: { userId: res.userId,distId:res.distId ,userName:res.userName} }); // Navigate to approver page
//                 }
//                 else if(res.role.toLowerCase()  === 'admin'){
//                     navigate('/usermaster',{ state: { userId: res.userId,distId:res.distId,userName:res.userName } }); // Navigate to approver page
//                 }
//                 else{
//                     navigate('/Account-Login',{ state: { userId: res.userId,distId:res.distId ,userName:res.userName} }); // Navigate to approver page
//                 }
//             }
//             else {
//                 setError(response.data.error || 'Invalid OTP. Please try again.');
//                 toast.error(response.data.error || 'Invalid OTP. Please try again.');
                
//             }
//         }
//          catch (error) {
//             console.error('Error validating OTP:', error);
//             // Check if the error response contains the error message from the backend
//             if (error.response && error.response.status === 400 && error.response.data.error) {
//                 setError(error.response.data.error);
//                 toast.error(error.response.data.error);
//             } else {
//                 setError('Failed to validate OTP. Please try again.');
//                 toast.error('Failed to validate OTP. Please try again.');
//             }
//         }
//         loader.style.display='none';
//     }, 1000);
//     };

//     const handleUserChange=(e)=>{
//         setUserInput(e.target.value);
//         setError("");
//     }

//     const handleOtpChange=(e)=>{
//         setOTP(e.target.value)
//         setError("");
//     }


//     return (
//         <>

//             <ul class="circles">
//                     <li></li>
//                     <li></li>
//                     <li></li>
//                     <li></li>
//                     <li></li>
//                     <li></li>
//                     <li></li>
//                     <li></li>
//                     <li></li>
//                     <li></li>
//                     <li></li>
//                     <li></li>
//                     <li></li>
//                     <li></li>
//                     <li></li>
//             </ul>
       
//         <div className='login-main'>

        

//             <div id="loader" style={{display:"none"}}></div>

//             <div className='logo-container'>
//             {/* <div class="trail"></div>
//             <div class="rotating-sphere">Do Good</div>     */}
//             </div> 
            
//             <br />
//             <div>
//             <label htmlFor="email">Email ID:</label>
//             <input
//             type="text"
//             placeholder="Enter email or mobile number"
//             id="email"
//             value={userInput}
//             onChange={handleUserChange}
//             />
           
            
//             <button className="otp-btn" onClick={generateOTP}>Generate OTP</button> <br />
            
//             <label htmlFor="otp">Enter OTP:</label>
//             <input
//                 type="text"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 id='otp'
//                 onChange={handleOtpChange}
//             />
//             </div>
//             <button className="login-btn"  onClick={handleLogin}>Login</button> <br />
//             {error && <div className="error-message">{error}</div>}

        

//             <style>{`
//             html,body{
//                 margin:0;
//                 padding:0;
//                 height:100%;
//             }
//             body {
//                 background: black;  
//                 background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8);  
//                 background:url(${LoginBackground});
//                 font-family: 'Arial', sans-serif;
//                 margin: 0;
//                 padding:0;
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 height: 100vh;
//                 background-size: cover;
//                 background-position: center;
//                 background-repeat: no-repeat;
//                 background-attachment: fixed;
            
                
//             }
//             html, body {
//                 height: 100%;
//                 margin: 0;
//                 overflow: hidden; /* Prevent scrolling */
//               }
              
//             `}</style>


           
// {/* Same as */}
                
//          </div>
//          <ToastContainer
//             // position="top-right"
//             autoClose={3000}
//             // hideProgressBar="false"
//             // newestOnTop="false"
//             // closeOnClick
//             // rtl="false"
//             // pauseOnFocusLoss
//             // draggable
//             // pauseOnHover
//             // theme="light"
//             // transition="Bounce"
        
//             />
//          </>
//     )
// }

// export default LoginPage;
