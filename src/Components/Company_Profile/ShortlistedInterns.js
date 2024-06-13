import React, {useState, useEffect} from 'react';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import CompanyProfileNavbar from '../Profile_Updates/CompanyProfileNavbar';
import SubHeader from '../Homepage/SubHeader';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function ShortlistedInterns(props) {

    const [shortlistedInterns, setShortlistedInterns] = useState([]);
    const {companyID} = useParams();

    useEffect(() => {          
        async function fetchShortlistedInterns(){
            try {
                const response = await axios.get(`http://localhost:5000/company/${companyID}/shortlist`);
                console.log(response.data);
                setShortlistedInterns(response.data);
            } catch (error) {
                console.log('Error fetching shortlisted interns:', error);
            }
        }

        fetchShortlistedInterns();       
        }, [companyID]);

    async function removeShortlistedIntern(internID){
        try {
            const response = await axios.delete(`http://localhost:5000/company/${companyID}/shortlist/${internID}`);
            console.log(response.data);
            setShortlistedInterns(shortlistedInterns.filter(intern => intern.intern_ID !== internID));
        } catch (error) {
            console.log('Error removing shortlisted intern:', error);
        }
    }

  return (
    <div>
        <Header isAuthenticated = {props.isAuthenticated}/>
        <SubHeader 
            title = {shortlistedInterns.length > 0 && shortlistedInterns[0].company_name}
            subtitle = "View all your shortlisted interns here"
        />

        <div className="container my-5">
            <div className = "row mt-5">
                <div className = "col-12 col-md-4">
                    <CompanyProfileNavbar logout = {props.logout} />
                </div>
                <div className = "col-12 col-md-8">
                    <div className = "mt-4 mt-md-0">
                        <h3 className = "fw-bold">Shortlisted Interns</h3>
                        <div className = "row mt-1 row-cols-1 row-cols-md-2 g-4">
                            {shortlistedInterns.map((intern, index) => {
                                return (
                                    <div className = "col">
                                        <div className="card mb-3 p-0 h-100" id = "shortlisted-interns-card">
                                            <div className="card-body d-flex flex-column justify-content-between">
                                                <div>
                                                    <div className = "d-flex mb-3">
                                                        <div className = "logo me-3 d-flex align-items-center">
                                                            <img src = {`http://localhost:5000/uploads/${intern.profile_image}`} alt = "Intern Profile" className = "img-fluid rounded" />
                                                        </div>
                                                        <div className = "d-flex flex-column w-100">
                                                            <div className = "d-flex justify-content-between">
                                                                <h5 className="card-title">{intern.first_name} {intern.last_name}</h5>
                                                                <a className = "shortlist-link" href = {`http://localhost:5000/document/${intern.intern_ID}`} role = "button"><i className = "bi bi-download me-2"></i>Download CV</a>    
                                                            </div>
                                                            <span className="card-subtitle">
                                                                <small className = "text-muted">
                                                                    {intern.professional_title}
                                                                </small>
                                                            </span>
                                                            <small className = "fw-bold">Location: <span className = "text-muted fw-normal">{intern.location}</span></small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className = "d-flex justify-content-between">
                                                    <Link to = "/shortlisted-interns/shortlisted-interns-details" className="btn btn-primary btn-sm">
                                                        <i className="bi bi-chat-dots me-2"></i>
                                                        Message
                                                    </Link>
                                                    <Link to = {`/intern/${intern.intern_ID}/public_profile`} className="btn btn-primary btn-sm">
                                                        <i className="bi bi-eye me-2"></i>
                                                        View Profile
                                                    </Link>
                                                    <button className = "btn btn-danger btn-sm" onClick = {() => {removeShortlistedIntern(intern.intern_ID)}}>
                                                        <i className="bi bi-trash3 me-2"></i>
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Footer />
    </div>
  )
}

export default ShortlistedInterns;