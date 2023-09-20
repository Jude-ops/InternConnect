import React from "react";
import {Link} from "react-router-dom";

function Header(){
    return(
        
        <div>

             <header className="p-3 text-bg-light my-0">
                <div className="container-fluid">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <a href="/" className="navbar-brand d-flex align-items-start mb-2 mb-lg-0 text-dark text-decoration-none">
                           <span>InternConnect</span> 
                        </a>

                        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 ms-5 justify-content-center mb-md-0">
                            <li className = "nav-item mx-3"><span className="nav-link px-2 text-dark" id = "header-link">Home</span></li>
                            <li className = "nav-item mx-3"><span className="nav-link px-2 text-secondary" id = "header-link">Internships</span></li>
                            <li className = "nav-item mx-3"><span className="nav-link px-2 text-secondary" id = "header-link">About</span></li>
                        </ul>

                        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
                            <input id = "searchInput" type="search" className="form-control form-control-dark text-bg-light" placeholder="Search..." aria-label="Search" />
                        </form>

                        <div className="text-end">
                            <Link to = "/login"><button type="button" className="btn btn-outline-primary me-2">Login</button></Link>
                            <Link to  = "/register/intern"><button type="button" className="btn btn-primary">Register</button></Link>
                            <Link to = "/register/company"><button type="button" className="btn btn-outline-primary ms-2">Hire Talent</button></Link>
                        </div>
                    </div>
                </div>
            </header>

        </div>
        
    )
}

export default Header;