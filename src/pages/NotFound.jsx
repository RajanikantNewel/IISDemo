import neoHeader from "../images/neoHeader.png"

const NotFound=()=>{
    return (
        <div class="error-container">
            <div><img style={{height:"100px",borderRadius:"50%",border:"2px solid black",marginBottom:"20px"}} src={neoHeader} alt="" /></div>
            <div class="error-code">404</div>
            <div class="error-message">Oops! Page not found</div>
            <div class="error-description">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</div>
            <a href="/" class="button">Go to Login Page</a>
            <style>{`
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f6f6f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .error-container {
            text-align: center;
        }
        .error-code {
            font-size: 5rem;
            color: #ff5722;
            margin-bottom: 20px;
        }
        .error-message {
            font-size: 1.5rem;
            color: #333;
            margin-bottom: 20px;
        }
        .error-description {
            font-size: 1rem;
            color: #666;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            background-color: #3498db;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #45a049;
        }`
        }
    </style>
        </div>
    )
}

export default NotFound;