import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

function Header(props){

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


    return(

        
        <div>

             <header className="p-3 text-bg-light">
                <div className="container-fluid">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <a href="/" className="navbar-brand d-flex align-items-start mb-2 mb-lg-0 text-dark text-decoration-none">
                           <span>InternConnect</span> 
                        </a>

                        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 ms-5 justify-content-center mb-md-0">
                            <li className = "nav-item mx-3"><a href = "/" className="nav-link px-2 text-dark" id = "header-link">Home</a></li>
                            <li className = "nav-item mx-3"><a href = "/internships" className="nav-link px-2 text-secondary" id = "header-link">Internships</a></li>
                            <li className = "nav-item mx-3"><a href = "/about" className="nav-link px-2 text-secondary" id = "header-link">About</a></li>
                        </ul>

                        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
                            <input id = "searchInput" type="search" className="form-control form-control-dark text-bg-light" placeholder="Search..." aria-label="Search" />
                        </form>

                        {
                            props.isAuthenticated() ? 
                            
                            <div className = "text-end">

                                {
                                    userType === "company" && <Link to = "/post_internship"><button type="button" className="btn btn-outline-primary me-2">Post Internship</button></Link>
                                }

                                <div class="btn-group">
                                    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Profile
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="/">Home</a></li>
                                        {
                                            userType === "intern" ? 
                                            <li><a class="dropdown-item" href={`/intern/${internID}/applications`}>My Applications</a></li>   
                                        :
                                            <div>
                                                <li><a class="dropdown-item" href={`/company/${companyID}/internships`}>Manage Internships</a></li>
                                                <li><a class = "dropdown-item" href = "/company/received_applications">Received Applications</a></li>
                                            </div>    
                                        }
                                        <li><a class="dropdown-item" href = {`/update/${userType}/${userId}`}>Edit Profile</a></li>
                                        <li><a class="dropdown-item" href="/" onClick={() => {props.logout()}}>Logout</a></li>
                                    </ul>
                                </div>
                            </div> 
                            : 
                            <div className="text-end">
                                <Link to = "/login"><button type="button" className="btn btn-outline-primary me-2">Login</button></Link>
                                <div class="btn-group">
                                    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Register
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="/register/intern">Register as Intern</a></li>
                                        <li><a class="dropdown-item" href="/register/company">Register as Company</a></li>
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