import React from "react";

function Footer(){

    const date = new Date().getFullYear();

    return(
        <div>
            <footer className="py-3 container-fluid text-bg-light">
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                    <li className="nav-item"><span className="nav-link px-2 text-muted">Home</span></li>
                    <li className="nav-item"><span className="nav-link px-2 text-muted">Internships</span></li>
                    <li className="nav-item"><span className="nav-link px-2 text-muted">About</span></li>
                </ul>
                <p className="text-center text-muted">© {date} InternConnect</p>
            </footer>     
        </div>
    )
}

export default Footer;