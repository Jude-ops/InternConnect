import React, {useState, useEffect} from 'react'
import Header from '../Homepage/Header'
import Footer from '../Homepage/Footer'
import InternProfileNavbar from './InternProfileNavbar'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom';
import SubHeader from '../Homepage/SubHeader'

function SavedInternships(props) {

    const [savedInternships, setSavedInternships] = useState([]);
    const {id} = useParams();

    useEffect(() => {
            
        async function fetchSavedInternships(){
            try {
                const response = await axios.get(`http://localhost:5000/intern/${id}/saved-internships`);
                console.log(response.data);
                setSavedInternships(response.data);
            } catch (error) {
                console.log('Error fetching saved internships:', error);
            }
        }

        fetchSavedInternships();
    
    }, [id]);

    async function removeSavedInternship(internshipID){
        try {
            const response = await axios.delete(`http://localhost:5000/intern/${id}/saved-internship/${internshipID}`);
            console.log(response.data);
            setSavedInternships(savedInternships.filter(internship => internship.internship_ID !== internshipID));
        } catch (error) {
            console.log('Error removing saved internship:', error);
        }
    }

  return (
    <div>
        <Header isAuthenticated = {props.isAuthenticated} />
        <SubHeader 
            title = "Saved Internships"
            subtitle = "View all your saved internships here"
        />
        <div className="container my-5">
            <h1 className="heading text-center fw-bold">Saved Internships</h1>
            <div className = "row mt-5">
                <div className = "col-12 col-md-4">
                    <InternProfileNavbar logout = {props.logout} />
                </div>
                <div className = "col-12 col-md-8">
                    <h3 className = "fw-bold">Saved Internships</h3>
                    <div className = "row mt-4 row-cols-1 row-cols-md-2 g-4">
                        {savedInternships.map((internship, index) => {
                            return (
                                <div className = "col">
                                    <div className="card mb-3 p-2 h-100" id = "saved-internships-card">
                                        <div className="card-body d-flex flex-column justify-content-between">
                                            <div>
                                                <div className = "d-flex mb-3">
                                                    <div className = "logo me-3">
                                                        <img src = {`http://localhost:5000/uploads/${internship.profile_image}`} alt = "company logo" className = "img-fluid rounded"/>
                                                    </div>
                                                    <div className = "d-flex flex-column">
                                                        <h5 className="card-title">{internship.company_Name}</h5>
                                                        <span className="card-subtitle">
                                                            <small className = "text-muted">
                                                                <i className="bi bi-geo-alt-fill me-2"></i>
                                                                {internship.location_city}
                                                            </small>
                                                        </span>
                                                    </div> 
                                                </div>
                                                <p className="card-text fw-bold fs-5">{internship.internship_name}</p>
                                                <div className = "d-flex mb-3">
                                                    <span className = "card-text me-3">
                                                        <small className = "text-muted">
                                                            <i class="bi bi-calendar-range me-1"></i>
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

                                                    <span className = "card-text me-3">
                                                        <small className = "text-muted">
                                                            <i class="bi bi-clock me-1"></i>
                                                            {
                                                                new Date(internship.posted_On).toLocaleDateString() === new Date().toLocaleDateString() ? "Posted Today" 
                                                                : 
                                                                (()=> {
                                                                    const datePosted = new Date(internship.posted_On);
                                                                    const dateToday = new Date();
                                                                    const daysSincePosted = Math.floor((dateToday - datePosted) / (1000 * 60 * 60 * 24));
                                                                    return `Posted ${daysSincePosted} days ago`;
                                                                
                                                                })()
                                                            }
                                                        </small>
                                                    </span>  
                                                </div>
                                                <p className="card-text text-wrap">{internship.internship_description}</p>
                                                <div className = "d-flex mb-4">
                                                    {
                                                        (() => {
                                                            const skills = internship.skills_required.split(/[\n,]+/);
                                                            const trimmedSkills = skills.map((skill) => {
                                                                return skill.trim();
                                                            });

                                                            return trimmedSkills.map((skill,index) => {
                                                                return <div key = {index} className = "profile-skill me-2">{skill}</div>
                                                            })
                                                        })()
                                                    }
                                                </div>
                                            </div>

                                            <div className = "d-flex justify-content-between align-items-center">
                                                <span><i class="bi bi-trash3 h3 remove-saved-internship" onClick = {() => {removeSavedInternship(internship.internship_ID)}}></i></span>
                                                <Link to = {`/internship/${internship.internship_ID}`}><button className = "btn btn-primary">View Details</button></Link>
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
        <Footer />
    </div>
  )
}

export default SavedInternships;