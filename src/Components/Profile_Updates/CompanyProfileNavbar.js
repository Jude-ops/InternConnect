import React, {useState, useEffect} from 'react'

function CompanyProfileNavbar(props) {

    const [companyID, setCompanyID] = useState(null);

    useEffect(() => {
        const companyID = localStorage.getItem("companyID");
        setCompanyID(companyID);
    }, []);

  return (
    <div>
        <div className="list-group user-profile">
            <a href={`/update/company/${companyID}`} className="list-group-item list-group-item-action" aria-current="true">
                <i className = "bi bi-person-circle me-3"></i>
                My Profile
            </a>

            <a href={`/company/${companyID}/internships`} className="list-group-item list-group-item-action">
                <i className = "bi bi-kanban-fill me-3"></i>
                Manage Internships
            </a>

            <a href={`/company/${companyID}/saved_interns`} className="list-group-item list-group-item-action">
                <i className = "bi bi-heart me-3"></i>
                Shortlisted Interns
            </a>

            <a href={`/post_internship`} className="list-group-item list-group-item-action">
                <i className = "bi bi-plus-circle me-3"></i>
                Post a new Internship
            </a>

            <a href={`/company/${companyID}/public_profile`} className="list-group-item list-group-item-action">
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