import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';


function InternProfileNavbar(props) {

    const [internID, setInternID] = useState(null);
    const [userId, setUserId] = useState(null);
    const [activeLink, setActiveLink] = useState(null);
    const location = useLocation();

    useEffect(() => {         
        const internID = localStorage.getItem("internID");
        setInternID(internID);
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
            <a href={`/update/intern/${internID}`} className={`list-group-item list-group-item-action ${isActive(`/update/intern/${internID}`)}`}>
                <i className = "bi bi-person-circle me-3"></i>
                My Profile
            </a>

            <a href={`/intern/${internID}/saved_internships`} className={`list-group-item list-group-item-action ${isActive(`/intern/${internID}/saved_internships`)}`}>
                <i className = "bi bi-bookmark-fill me-3"></i>
                Saved Internships
            </a>

            <a href={`/intern/${internID}/applications`} className={`list-group-item list-group-item-action ${isActive(`/intern/${internID}/applications`)}`}>
                <i className = "bi bi-journal-text me-3"></i>
                My Applications
            </a>

            <a href={`/chat/${userId}`} className={`list-group-item list-group-item-action ${isActive(`/chat`)}`}>
                <i className = "bi bi-chat-dots me-3"></i>
                Messages
            </a>

            <a href={`/intern/${internID}/education_work_history`} className={`list-group-item list-group-item-action ${isActive(`/intern/${internID}/education_work_history`)}`}>
                <i className = "bi bi-duffle me-3"></i>
                Education / Work History
            </a>

            <a href={`/intern/${internID}/public_profile`} className={`list-group-item list-group-item-action ${isActive(`/intern/${internID}/public_profile`)}`}>
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

export default InternProfileNavbar;