import React, {useState, useEffect} from 'react';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import CompanyProfileNavbar from '../Profile_Updates/CompanyProfileNavbar';
import SubHeader from '../Homepage/SubHeader';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function InternshipApplications(props) {

    const [internshipApplications, setInternshipApplications] = useState([]);
    const {internshipID} = useParams();

    useEffect(() => {
        async function fetchInternshipApplications(){
            try {
                const response = await axios.get(`http://localhost:5000/internship/${internshipID}/applications`);
                console.log(response.data);
                setInternshipApplications(response.data);
            } catch (error) {
                console.log('Error fetching internship applications:', error);
            }
        }

        fetchInternshipApplications();       
        }, [internshipID]);

  return (
    <div>
        <Header isAuthenticated = {props.isAuthenticated} logout = {props.logout} />
        <SubHeader 
            title = {internshipApplications.length > 0 && internshipApplications[0].internship_name}
            subtitle = "View all applications for this internship here"
        />

        <div className="container my-5">
            <div className = "row mt-5">
                <div className = "col-12 col-md-4">
                    <CompanyProfileNavbar logout = {props.logout} />
                </div>
                <div className = "col-12 col-md-8">
                    <div className = "mt-4 mt-md-0">
                        <h3 className = "fw-bold">
                            {internshipApplications.length === 0 || internshipApplications.length > 1 ? internshipApplications.length + " Applications" : internshipApplications.length + " Application"}
                        </h3>
                        <div className = "row mt-1 row-cols-1 row-cols-md-2 g-4">
                            {internshipApplications.map((application, index) => {
                                return (
                                    <div className = "col">
                                        <div className="card mb-3 p-0 h-100" id = "internship-applications-card">
                                            <div className="card-body d-flex flex-column justify-content-between">
                                                <div>
                                                    <div className = "d-flex mb-3">
                                                        <div className = "logo me-3">
                                                            <img src = {`http://localhost:5000/uploads/${application.profile_image}`} alt = "intern profile" className = "img-fluid rounded"/>
                                                        </div>
                                                        <div className = "d-flex flex-column w-100">
                                                            <div className = "d-flex justify-content-between">
                                                                <Link to = {`/intern/${application.intern_ID}/public_profile`} className = "nav-link"><h5 className="card-title">{application.full_name}</h5></Link>
                                                                <a className = "shortlist-link" href = {`http://localhost:5000/document/${application.intern_ID}`} role = "button"><i className = "bi bi-download me-2"></i>Download CV</a>
                                                            </div>
                                                            <span className="card-subtitle">
                                                                <small className = "text-muted">
                                                                    {application.professional_title}
                                                                </small>
                                                            </span>
                                                            <div className = "d-flex mt-2">
                                                                <small className = "app-info-span me-2">Applied on: {new Date(application.date_applied).toLocaleDateString()}</small>
                                                                <small className = "app-info-span">Status: {application.application_status}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className = "d-flex justify-content-between">
                                                    <button className = "btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="bi bi-card-text me-2"></i>Cover Letter</button>

                                                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                        <div class="modal-dialog modal-dialog-centered">
                                                            <div class="modal-content">
                                                                <div class="modal-header text-center" style = {{backgroundColor: "#2980B9"}}>
                                                                    <h1 class="modal-title w-100 fs-5" id="exampleModalLabel">Cover Letter</h1>
                                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                </div>
                                                                <div class="modal-body">
                                                                <p style = {{lineHeight: "2"}}>{application.cover_letter}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className = "btn btn-success btn-sm">
                                                        <bi className="bi bi-magic me-2"></bi>
                                                        Approve
                                                    </button>
                                                    <button className = "btn btn-danger btn-sm">
                                                        <i className ="bi bi-x-lg me-2"></i>
                                                        Reject
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

export default InternshipApplications