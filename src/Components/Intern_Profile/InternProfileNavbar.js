import React, {useState, useEffect} from 'react'


function InternProfileNavbar(props) {

    const [internID, setInternID] = useState(null);

    useEffect(() => {
            
            const internID = localStorage.getItem("internID");
            setInternID(internID);

    }, []);

  return (
    <div>
        <div className="list-group user-profile">
            <a href={`/update/intern/${internID}`} className="list-group-item list-group-item-action" aria-current="true">
                <i className = "bi bi-person-circle me-3"></i>
                My Profile
            </a>

            <a href={`/intern/${internID}/saved_internships`} className="list-group-item list-group-item-action">
                <i className = "bi bi-bookmark-fill me-3"></i>
                Saved Internships
            </a>

            <a href={`/intern/${internID}/applications`} className="list-group-item list-group-item-action">
                <i className = "bi bi-journal-text me-3"></i>
                My Applications
            </a>

            <a href={`/intern/${internID}/public_profile`} className="list-group-item list-group-item-action">
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