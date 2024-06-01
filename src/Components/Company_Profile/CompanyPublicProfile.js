import React, {useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import axios from 'axios'
import Header from '../Homepage/Header'
import Footer from '../Homepage/Footer'

function CompanyPublicProfile(props) {

    const {id} = useParams();
    const [companyInfo, setCompanyInfo] = useState(null);
    const [internships, setInternships] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        async function getCompanyInfo(){
            try{
                const response = await axios.get(`http://localhost:5000/company/${id}`);
                if(response){
                    const profileImage = response.data[0].profile_image;
                    const profileImageURL = `http://localhost:5000/uploads/${profileImage}`;
                    setProfileImage(profileImageURL);
                    setCompanyInfo(response.data);
                }
            }catch(error){
                console.error("Error fetching company profile info", error);
            }
        }

        async function getInternships(){
            try{
                const response = await axios.get(`http://localhost:5000/company/${id}/internships`);
                if(response){
                    setInternships(response.data);
                }
            }catch(error){
                console.error("Error fetching internship info for company", error);
            }
        }

        getCompanyInfo();
        getInternships();

    }, [id])

  return (
    <div>
        <Header 
            isAuthenticated = {props.isAuthenticated}
            logout = {props.logout}
        />

        {companyInfo && profileImage &&
            <section id = "public-profile">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className = "intern-profile d-flex">
                                <div className = "public-profile-img me-4">
                                    <img src = {profileImage} alt = "Company Logo"/>
                                </div>
                                <div className = "public-profile-info d-flex flex-column justify-content-center">
                                    <h3>{companyInfo[0].company_name}</h3>
                                    <div className = "d-flex">
                                        <p>
                                            <i className = "bi bi-geo-alt-fill me-2"></i>
                                            {companyInfo[0].address}, {companyInfo[0].location_city} 
                                        </p>
                                        <p className = "ms-3">
                                            <i className = "bi bi-calendar-range-fill me-2"></i> 
                                            Member since
                                            {
                                                (() => {
                                                    //Get the month, day and year from the date
                                                    const date = new Date(companyInfo[0].registration_date);
                                                    const month = date.toLocaleString('default', { month: 'short' });
                                                    const day = date.getDate();
                                                    const year = date.getFullYear();
                                                    return ` ${month} ${day}, ${year}`;
                                                })()
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className = "col-md-6 mt-4 mt-md-0">
                            <div className = "d-flex justify-content-md-end align-items-center h-100">
                                <div className = "download-resume">
                                    <a href = "#top" className = "btn" role = "button">Posted Jobs</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        }

        {companyInfo && profileImage &&
            <section id = "public-profile-details" className = "my-5">
                <div className = "container">
                    <div className = "row">
                        <div className = "col-12 col-sm-12 col-md-12 col-lg-8">
                            <div className = "public-profile-details">

                                <div className = "about-section">
                                    <h3 className = "header fw-bold">Company Description</h3>
                                    <p className = "mt-3">{companyInfo[0].company_description}</p>
                                </div>
                                <hr className = "line-divider my-4"/>

                                <div className = "internship-section">
                                    <h3 className = "header fw-bold mb-3">Open Internship Positions</h3>        
                                    {
                                        internships && internships.map((internship) => {
                                            return(
                                                <div className = "card internship-listing mb-4">
                                                    <div className="card-body d-flex flex-column">
                                                        <div className = "d-flex mb-3">
                                                            <div className = "me-3 logo">
                                                                <img src = {profileImage} alt = "Company Logo" />
                                                            </div>
                                                            <div className = "d-flex flex-column">
                                                                <h3 className="card-title fw-bold">{internship.internship_name}</h3>
                                                                <p className="card-subtitle mb-2 text-muted">{internship.company_Name}</p>
                                                            </div>
                                                        </div>
                            
                                                        <div className = "d-flex justify-content-between align-items-center">
                                                            <span className="card-text">
                                                                <small className = "text-muted">
                                                                <i className="bi bi-geo-alt-fill me-2"></i>
                                                                {internship.location_city}
                                                                </small>
                                                            </span>
                                                            <span className="card-text">
                                                                <small className = "text-muted">
                                                                    <i className="bi bi-calendar-range me-2"></i>
                                                                    {
                                                                        (() => {
                                                                            const start = new Date(internship.start_date);
                                                                            const end = new Date(internship.end_date);

                                                                            const startYear = start.getFullYear();
                                                                            const startMonth = start.getMonth();

                                                                            const endYear = end.getFullYear();
                                                                            const endMonth = end.getMonth();

                                                                            return (endYear - startYear) * 12 + (endMonth - startMonth) + " months";
                                                                        })()
                                                                    }
                                                                </small>
                                                            </span>

                                                            <span className="card-text">
                                                                <small className = "text-muted">
                                                                    <i className="bi bi-clock me-2"></i>
                                                                        {
                                                                            new Date(internship.posted_On).toLocaleDateString() === new Date().toLocaleDateString() ? "Posted Today" 
                                                                            : 
                                                                            (()=> {
                                                                                const datePosted = new Date(internship.posted_On);
                                                                                const dateToday = new Date();
                                                                                const daysSincePosted = Math.floor((dateToday - datePosted) / (1000 * 60 * 60 * 24));
                                                                                const weeksSincePosted = Math.floor(daysSincePosted / 7);
                                                                                const monthsSincePosted = Math.floor(daysSincePosted / 30);

                                                                                if (monthsSincePosted > 0) {
                                                                                    return `Posted ${monthsSincePosted} month${monthsSincePosted > 1 ? 's' : ''} ago`;
                                                                                } else if (weeksSincePosted > 0) {
                                                                                    return `Posted ${weeksSincePosted} week${weeksSincePosted > 1 ? 's' : ''} ago`;
                                                                                } else {
                                                                                    return `Posted ${daysSincePosted} day${daysSincePosted > 1 ? 's' : ''} ago`;
                                                                                }
                                                                            })()
                                                                        }
                                                                </small>
                                                            </span>

                                                        </div>

                                                        <div className = "d-flex justify-content-between mt-4">
                                                            <span className="card-text">
                                                                <small className = "text-muted">
                                                                    <i className="bi bi-calendar2-check-fill me-2"></i>
                                                                    Start Date:
                                                                    {
                                                                        (() => {
                                                                            const date = new Date(internship.start_date);
                                                                            const month = date.toLocaleString('default', { month: 'short' });
                                                                            const day = date.getDate();
                                                                            const year = date.getFullYear();
                                                                            return ` ${month} ${day}, ${year}`;
                                                                        })()
                                                                    }
                                                                </small>
                                                            </span>
                                                            <Link to = {`/internship/${internship.internship_ID}`}><button className="btn btn-primary btn-sm">View Details</button></Link>
                                                        </div>
                            
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>                        
                            </div>
                        </div>
                        <div className = "col-12 col-sm-12 col-md-12 col-lg-4 mt-4 mt-md-0">
                            <div className = "public-profile-overview d-flex flex-column">
                                <h3 className = "header fw-bold">Overview</h3>
                                <hr className = "line-divider my-3"/>
                                <div className = "d-flex">
                                    <span>
                                        <i className = "bi bi-envelope-fill h4 me-2"></i>
                                    </span>
                                    <div className = "d-flex flex-column ms-2">
                                        <span className = "text-muted">Email</span>
                                        <span className = "fw-bold">{companyInfo[0].company_email}</span>
                                    </div>
                                </div>
                                <div className = "d-flex mt-4">
                                    <span>
                                        <i className = "bi bi-telephone-fill h4 me-2"></i>
                                    </span>
                                    <div className = "d-flex flex-column ms-2">
                                        <span className = "text-muted">Telephone</span>
                                        <span className = "fw-bold">+237-{companyInfo[0].telephone}</span>
                                    </div>
                                </div>
                                <div className = "d-flex mt-4">
                                    <span>
                                        <i className = "bi bi-globe2 h4 me-2"></i>
                                    </span>
                                    <div className = "d-flex flex-column ms-2">
                                        <span className = "text-muted">Website</span>
                                        <span className = "fw-bold">{companyInfo[0].website}</span>
                                    </div>
                                </div>
                                <div className = "d-flex mt-4">
                                    <span>
                                        <i className = "bi bi-geo-alt-fill h4 me-2"></i>
                                    </span>
                                    <div className = "d-flex flex-column ms-2">
                                        <span className = "text-muted">From</span>
                                        <span className = "fw-bold">{companyInfo[0].address}, {companyInfo[0].location_city}</span>
                                    </div>
                                </div>
                                <div className = "d-flex mt-4">
                                    <span>
                                        <i className = "bi bi-calendar-range-fill h4 me-2"></i>
                                    </span>
                                    <div className = "d-flex flex-column ms-2">
                                        <span className = "text-muted">Member Since</span>
                                        <span className = "fw-bold">
                                            {
                                                (() => {
                                                    //Get the month, day and year from the date
                                                    const date = new Date(companyInfo[0].registration_date);
                                                    const month = date.toLocaleString('default', { month: 'short' });
                                                    const day = date.getDate();
                                                    const year = date.getFullYear();
                                                    return `${month} ${day}, ${year}`;
                                                })()
                                            }
                                        </span>
                                    </div>
                                </div>
                                <div className = "d-flex mt-4">
                                    <span>
                                        <i className = "bi bi-briefcase-fill h4 me-2"></i>
                                    </span>
                                    <div className = "d-flex flex-column ms-2">
                                        <span className = "text-muted">Total Internships Posted</span>
                                        <span className = "fw-bold">{internships && internships.length}</span>
                                    </div>
                                </div>

                                <hr className = "line-divider my-4"/>

                                <div className = "contact-me">
                                    <button className = "btn">Send Message</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        }

        <Footer />
    </div>
  )
}

export default CompanyPublicProfile;