import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';

function CompanyProfileNavbar(props) {

    const location = useLocation();
    const [companyID, setCompanyID] = useState(null);
    const [userId, setUserId] = useState(null);
    const [activeLink, setActiveLink] = useState(null);

    useEffect(() => {
        const companyID = localStorage.getItem("companyID");
        setCompanyID(companyID);
        const userId = localStorage.getItem("userId");
        setUserId(userId);
    }, []);

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location]);

    const isActive = (path) => {
        if(path === activeLink){
            return "active-profile-link";
        }
        return "";
    }


  return (
    <div>
        <div className="list-group user-profile">
            <a href={`/update/company/${companyID}`} className={`list-group-item list-group-item-action ${isActive(`/update/company/${companyID}`)}`}>
                <i className = "bi bi-person-circle me-3"></i>
                My Profile
            </a>

            <a href={`/company/${companyID}/internships`} className={`list-group-item list-group-item-action ${isActive(`/company/${companyID}/internships`)}`}>
                <i className = "bi bi-kanban-fill me-3"></i>
                Manage Internships
            </a>

            <a href={`/company/${companyID}/received_applications`} className={`list-group-item list-group-item-action ${isActive(`/company/${companyID}/received_applications`)}`}>
                <i className = "bi bi-journal-text me-3"></i>
                Received Applications
            </a>

            <a href={`/chat/${userId}`} className={`list-group-item list-group-item-action ${isActive(`/chat`)}`}>
                <i className = "bi bi-chat-dots me-3"></i>
                Messages
            </a>

            <a href={`/company/${companyID}/saved_interns`} className={`list-group-item list-group-item-action ${isActive(`/company/${companyID}/saved_interns`)}`}>
                <i className = "bi bi-heart me-3"></i>
                Shortlisted Interns
            </a>

            <a href={`/post_internship`} className={`list-group-item list-group-item-action`}>
                <i className = "bi bi-plus-circle me-3"></i>
                Post a new Internship
            </a>

            <a href={`/company/${companyID}/public_profile`} className={`list-group-item list-group-item-action ${isActive(`/company/${companyID}/public_profile`)}`}>
                <i className = "bi bi-person-circle me-3"></i>
                Public Profile
            </a>

            <a href="/" className="list-group-item list-group-item-action" onClick = {props.logout}>
                <i className = "bi bi-box-arrow-right me-3"></i>
                Logout
            </a>       
        </div>
    </div>
  )
}

export default CompanyProfileNavbar