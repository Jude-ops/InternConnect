import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import axios from "axios";
import mainLogo from "../../app-logo1.png";

function Header(props){

    const location = useLocation();
    const [userId, setUserId] = useState(null);
    const [userType, setUserType] = useState(null);
    const [companyID, setCompanyID] = useState(null);
    const [internID, setInternID] = useState(null);

    useEffect(() => {

        const token = localStorage.getItem("token");
        const userType = localStorage.getItem("userType");
        const companyID = localStorage.getItem("companyID");
        const internID = localStorage.getItem("internID");

        setCompanyID(companyID);
        setInternID(internID);

        async function fetchUserId(){

            try {
                const response = await axios.get("http://localhost:5000/protected", {
                    headers: {
                        Authorization: token
                    }
                });

                const {userId} = response.data;
                setUserId(userId)
                setUserType(userType);
                

            } catch (error) {
                console.log('Error fetching user data:', error);
            }
        }

        fetchUserId();

    }, [userId]);

    useEffect(() => {
        const headerLinks = document.querySelectorAll("#header-link");

        headerLinks.forEach(link => {
            if(new URL(link.href).pathname === location.pathname) {
                link.classList.add("active-link");
                link.classList.remove("text-secondary");
              } else {
                link.classList.remove("active-link");
                link.classList.add("text-secondary");
            }
        });

    }, [location]);

    return(

        
        <div>

            <header className="text-bg-light navbar navbar-expand-lg" style = {{padding: "13px 15px"}}>
                <div className="container d-flex flex-wrap align-items-center justify-content-between justify-content-lg-start" style = {{padding: "0px 15px", width: "84%"}}>
                    <a href="/" className="navbar-brand d-flex align-items-start mb-2 mb-lg-0 text-dark text-decoration-none">
                        <img src = {mainLogo} alt = "InternConnect" style = {{width: "150px", height: "50px"}} /> 
                    </a>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">

                        <ul className="navbar-nav me-auto col-12 col-lg-auto me-lg-auto mb-2 ms-5 justify-content-center mb-md-0">
                            <li className = "nav-item mx-3"><a href = "/" className="nav-link px-2 text-secondary" id = "header-link">Home</a></li>
                            <li className = "nav-item mx-3"><a href = "/internships" className="nav-link px-2 text-secondary" id = "header-link">Internships</a></li>
                            <li className = "nav-item mx-3"><a href = "/about_us" className="nav-link px-2 text-secondary" id = "header-link">About</a></li>
                        </ul>

                        {
                            props.isAuthenticated() ? 
                            
                            <div className = "d-flex">

                                {
                                    userType === "company" && <Link to = "/post_internship"><button type="button" className="btn me-2" id = "post-internship-button"><i className = "bi bi-upload me-2"></i>Post Internship</button></Link>
                                }

                                <div class="dropdown">
                                    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Profile
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <a class="dropdown-item" href="/">
                                                <i class="bi bi-house-door-fill me-2"></i>
                                                Home
                                            </a>
                                        </li>
                                        {
                                            userType === "intern" ? 
                                            <div>
                                                <li>
                                                    <a class = "dropdown-item" href = {`/intern/${internID}/saved_internships`}>
                                                        <i class = "bi bi-bookmark-fill me-2"></i>
                                                        Saved Internships
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" href={`/intern/${internID}/applications`}>
                                                        <i class="bi bi-journal-text me-2"></i>
                                                        My Applications
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" href={`/intern/${internID}/education_work_history`}>
                                                        <i class="bi bi-duffle me-2"></i>
                                                        Education / Work
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" href={`/intern/${internID}/public_profile`}>
                                                        <i class="bi bi-person-circle me-2"></i>
                                                        Public Profile
                                                    </a>
                                                </li>  
                                            </div>  
                                        :
                                            <div>
                                                <li>
                                                    <a class="dropdown-item" href={`/company/${companyID}/internships`}>
                                                        <i class="bi bi-kanban-fill me-2"></i>
                                                        Manage Internships
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class = "dropdown-item" href = {`/company/${companyID}/received_applications`}>
                                                        <i class = "bi bi-journal-text me-2"></i>
                                                        Received Apps.
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class = "dropdown-item" href = {`/company/${companyID}/saved_interns`}>
                                                        <i class = "bi bi-journal-text me-2"></i>
                                                        Shortlisted Interns
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" href={`/company/${companyID}/public_profile`}>
                                                        <i class="bi bi-person-circle me-2"></i>
                                                        Public Profile
                                                    </a>
                                                </li>  
                                            </div>    
                                        }
                                        <li>
                                            <a class="dropdown-item" href = {`/update/${userType}/${userId}`}>
                                                <i class="bi bi-pencil-square me-2"></i>
                                                Edit Profile
                                            </a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" href="/" onClick={props.logout}>
                                                <i class="bi bi-box-arrow-right me-2"></i>
                                                Logout
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div> 
                            : 
                            <div className="d-flex">
                                <Link to = "/login"><button type="button" className="btn me-2" id = "login-button"><i className = "bi bi-door-open me-2"></i>Login</button></Link>
                                <div class="btn-group">
                                    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Register
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <a class="dropdown-item" href="/register/intern">
                                                <i class="bi bi-box-arrow-in-right me-2"></i>
                                                Register as Intern
                                            </a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" href="/register/company">
                                                <i class="bi bi-box-arrow-in-right me-2"></i>
                                                Register as Company
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </header>

        </div>
        
    )
}

export default Header;