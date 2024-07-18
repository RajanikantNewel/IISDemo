import accountlogin from "../images/accountlogin.png";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';



// ?todo logout
const Header=({text,userId})=>{

    const location = useLocation();
    

    const navigate = useNavigate();

    const handleLogout = () => {

        const loader=document.getElementById("loader")
        loader.style.display ='block'; // Show loader
        setTimeout(async function() {
          // Your actual functionality here
          // For demonstration, I'm just delaying the hiding of the loader after 3 seconds
          
         loader.style.display='none';
        // Clear user ID from local storage

        location.state.userId=null;
        // Navigate to the login page
        navigate("/login");
        },1000)
    };

    return (
        
            
        
        <div style={{height:"40px",backgroundColor:"black",color:"white",padding:"10px",fontWeight:"700",position:"relative"}}>
               {
                text[0] === "accountLogin" || text[0] === "distributorLoginPage" ? (
                    <>
                   <span style={{position:"absolute",right:"80px",cursor:"pointer"}} onClick={handleLogout}>Logout</span>
                    <img style={{position:"absolute",right:"10px",top:"1px"}} src={accountlogin} alt="" />
                    </>

                    
                ) :
                <>
                {
                text.map((item,idx)=>{
                    return (
                        <span style={{marginRight:"20px"}}key={idx}>{item}</span>
                    )
                })}
                <span style={{position:"absolute",right:"20px",cursor:"pointer"} } onClick={handleLogout}>Logout</span>
                </>
               }
               
        </div>
        
    )
}

export default Header;