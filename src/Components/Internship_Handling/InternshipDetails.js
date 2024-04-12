import React, {useState, useEffect, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import FormElement from '../Form_Elements/FormElement';

function InternshipDetails(props) {

    const { id } = useParams();
    const navigate = useNavigate();
    const fileInput = useRef();
    const [internshipDetails, setInternshipDetails] = useState(null);
    const [userType, setUserType] = useState("");
    const [internID, setInternID] = useState(null);
    const [application, setApplication] = useState({
        fullName: "",
        email: "",
        phone: "",
        coverletter: "",
        applicationStatus: "pending"
    });

    function handleChange(name, value) {
        setApplication((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            }
        });
        
    }

    async function getInternDetails() {

        try {

            //Check if user is logged in
            if (!localStorage.getItem("internID")) {
                alert("Please login to apply for this internship.");
                navigate("/login");
            } else {

                const response = await axios.get(`http://localhost:5000/intern/info/${internID}`);
                setApplication((prevValue) => {
                    return {
                        ...prevValue,
                        fullName: response.data[0].first_name + " " + response.data[0].last_name,
                        email: response.data[0].email_address,
                        phone: response.data[0].telephone
                    }
                })
            }

        } catch (error) {
            console.log('Error fetching intern details:', error);
        }

    };

    async function handleApplicationSubmit(event) {

        event.preventDefault();
        
        try {

            const formData = new FormData();
            const resume = fileInput.current.files[0];
            formData.append("resume", resume);
            formData.append("internID", internID);
            formData.append("companyID", internshipDetails[0].company_ID);
            formData.append("fullName", application.fullName);
            formData.append("email", application.email);
            formData.append("phone", application.phone);
            formData.append("coverletter", application.coverletter);
            formData.append("applicationStatus", application.applicationStatus);

            const response = await axios.post(`http://localhost:5000/internship/${id}/apply`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response) {
                window.location.reload();
            }

        } catch (error) {
            console.log('Error submitting application:', error);
        }
    };


    useEffect(() => {

        const userType = localStorage.getItem("userType");
        setUserType(userType);
        const internID = localStorage.getItem("internID");
        setInternID(internID);

        async function fetchInternshipDetails() {

            try {

                const response = await axios.get("http://localhost:5000/internship/" + id);
                setInternshipDetails(response.data);

            } catch (error) {
                console.log('Error fetching internship details:', error);
            }
        }

        fetchInternshipDetails();

    }, [id]);


    return (
        <div>
            <Header isAuthenticated = {props.isAuthenticated}/>
            {internshipDetails && (

                <div className = "container my-5 internship-details">

                    <h2 className = "text-center fw-bolder fs-1">{internshipDetails[0].company_Name}</h2>

                    <div className = "row">
                        <div className = "col-md-8">
                            <div className = "d-flex flex-column internship-key-details w-100">
                                <div className = "d-flex internship-title-box">
                                    <div className = "logo"></div>
                                    <div className = "internship-title d-flex flex-column flex-grow-1">
                                        <h3 class = "h3 fw-bolder fs-2">{internshipDetails[0].internship_name}</h3>
                                        <div className = "d-flex justify-content-between align-items-center">
                                            <p className = "small">
                                                {
                                                    new Date(internshipDetails[0].posted_On).toLocaleDateString() === new Date().toLocaleDateString() ? "Posted Today" 
                                                    : 
                                                    (()=> {
                                                        const datePosted = new Date(internshipDetails[0].posted_On);
                                                        const dateToday = new Date();
                                                        const daysSincePosted = Math.floor((dateToday - datePosted) / (1000 * 60 * 60 * 24));
                                                        return `Posted ${daysSincePosted} days ago`;
                                                    
                                                    })()
                                                }
                                            </p>
                                            <p>{internshipDetails[0].location_city}</p>
                                            <p className = "small"> Duration: {
                                            (() => {
                                                const start = new Date(internshipDetails[0].start_date);
                                                const end = new Date(internshipDetails[0].end_date);

                                                const startYear = start.getFullYear();
                                                const startMonth = start.getMonth();

                                                const endYear = end.getFullYear();
                                                const endMonth = end.getMonth();

                                                return (endYear - startYear) * 12 + (endMonth - startMonth) + " months";
                                            })()
                                            }</p>
                                            
                                        </div>
                                    </div>
                                </div>

                                <div className = "mt-4">
                                    <h4 className = "h4 fw-bold fs-4 text-dark">About the internship</h4>
                                    <p>Selected intern's day-to-day responsibilities include:</p>
                                    {
                                        (() => {
                                            const responsibilities = internshipDetails[0].internship_description.split(/[\n,]+/);
                                            const trimmedResponsibilities = responsibilities.map((responsibility) => {
                                                return responsibility.trim();
                                            });

                                            return trimmedResponsibilities.map((responsibility,index) => {
                                                return <ul key = {index}><li>{responsibility}</li></ul>
                                            })
                                        })()
                                    }
                                </div>

                                <div className = "mt-3">
                                    <h4 className = "h4 fw-bold fs-4 text-dark">Who can apply</h4>
                                    <p>Only those candidates can apply who:</p>
                                    {
                                        (() => {
                                            const eligibility = internshipDetails[0].who_can_apply.split(/[\n,]+/);
                                            const trimmedEligibility = eligibility.map((eligibility) => {
                                                return eligibility.trim();
                                            });

                                            return trimmedEligibility.map((eligibility,index) => {
                                                return <ul key = {index}><li>{eligibility}</li></ul>
                                            })
                                        })()
                                    }
                                </div>

                                <div className = "mt-4">
                                    <h4 className = "h4 fw-bold fs-4 text-dark">Skills Required</h4>
                                    {
                                        (() => {
                                            const skills = internshipDetails[0].skills_required.split(/[\n,]+/);
                                            const trimmedSkills = skills.map((skill) => {
                                                return skill.trim();
                                            });

                                            return trimmedSkills.map((skill,index) => {
                                                return <div key = {index} className = "badge rounded-pill bg-primary me-2 skill-required">{skill}</div>
                                            })
                                        })()
                                    }
                                </div>

                                <div className = "mt-4">
                                    <h4 className = "h4 fw-bold fs-4 text-dark">Perks of the internship</h4>
                                    {
                                        (() => {
                                            const perks = internshipDetails[0].perks.split(/[\n,]+/);
                                            const trimmedPerks = perks.map((perk) => {
                                                return perk.trim();
                                            });

                                            return trimmedPerks.map((perk,index) => {
                                                return <div key = {index} className = "badge rounded-pill bg-primary me-2 perks-internship">{perk}</div>
                                            })
                                        })()
                                    }
                                </div>
                    
                            </div>

                            {userType === "intern" && 

                                <div className = "mt-5">
                                    <button onClick = {getInternDetails} type="button" class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Apply Now
                                    </button>

                                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog modal-lg">
                                            <div class="modal-content">
                                                <div class="modal-header text-center">
                                                    <h5 class="modal-title fw-bold text-uppercase w-100" id="exampleModalLabel">Apply for Internship</h5>
                                                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                <form>
                                                    <FormElement 
                                                        labelFor = "fullName"
                                                        labelTitle = "Full Name"
                                                        type = "text"
                                                        id = "fullName"
                                                        placeholder = "Full Name"
                                                        name = "fullName"
                                                        value = {application.fullName}
                                                        onChange = {handleChange}
                                                    />

                                                    <FormElement 
                                                        labelFor = "email"
                                                        labelTitle = "Email"
                                                        type = "email"
                                                        id = "email"
                                                        placeholder = "Email"
                                                        name = "email"
                                                        value = {application.email}
                                                        onChange = {handleChange}
                                                    />

                                                    <FormElement
                                                        labelFor = "phone"
                                                        labelTitle = "Phone"
                                                        type = "tel"
                                                        id = "phone"
                                                        placeholder = "Phone"
                                                        name = "phone"
                                                        value = {application.phone}
                                                        onChange = {handleChange}
                                                    />

                                                    <div className="mb-3">
                                                        <label for="coverletter" className="form-label fw-bold text-uppercase">Cover Letter</label>
                                                        <textarea
                                                            className="form-control"
                                                            id="coverletter"
                                                            name = "coverletter"
                                                            placeholder = "Mention in detail what skill or past experience you have for this internship. What excites you about this internship? Why would you be a good fit?"
                                                            rows="5"
                                                            value = {`${application.coverletter}`}
                                                            onChange = {(event) => {
                                                                handleChange(event.target.name, event.target.value)
                                                            }}
                                                        ></textarea>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label for="resume" className="form-label fw-bold text-uppercase">Resume/CV</label>
                                                        <input 
                                                            type = "file" 
                                                            className = "form-control" 
                                                            id = "resume" 
                                                            name = "resume" 
                                                            multiple 
                                                            ref = {fileInput}  
                                                            onChange={(event) => {
                                                                handleChange(event.target.name, event.target.files[0])
                                                            }}    
                                                        />
                                                    </div>
                                                </form>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-primary" onClick = {handleApplicationSubmit}>Submit Application</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            }

                        </div>
                    
                        <div className = "col-md-4">
                            <div className = "internship-overview w-100">
                                <h3 className = "h3 fw-bolder fs-2">Internship Overview</h3>

                                <div className = "d-flex flex-column mt-5">

                                    <div className = "d-flex mb-3">
                                        <div className = "icon"></div>
                                        <div className = "p-1 ms-3">Category: 
                                            <p className = "small">{internshipDetails[0].category}</p>
                                        </div>
                                    </div>

                                    <div className = "d-flex mb-3">
                                        <div className = "icon"></div>
                                        <div className = "p-1 ms-3">Start Date: 
                                            <p className = "small">{new Date(internshipDetails[0].start_date).toDateString()}</p>
                                        </div>
                                        <div className = "p-1 ms-3">End Date:
                                            <p className = "small">{new Date(internshipDetails[0].end_date).toDateString()}</p>
                                        </div>
                                    </div>
                                    <div className = "d-flex mb-3">
                                        <div className = "icon"></div>
                                        <div className = "p-1 ms-3">Apply By: 
                                            <p className = "small">{new Date(internshipDetails[0].apply_by).toDateString()}</p>
                                        </div>
                                    </div>
                                    <div className = "d-flex">
                                        <div className = "icon"></div>
                                        <div className = "p-1 ms-3">No. of available positions:
                                            <p className = "small">{internshipDetails[0].available_positions}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className = "internship-overview w-100 mt-4">
                                
                                <div className = "d-flex justify-content-between align-items-center">
                                    <div className = "icon" style = {{width: "100px", height: "100px"}}></div>
                                    <div style = {{width: "225px"}}><h5 className = "h5 fw-bold fs-5">About {internshipDetails[0].company_Name}</h5></div>
                                </div>

                                <p className = "mt-3">{internshipDetails[0].company_description}</p>
                            </div>

                        </div>
                    </div>

                </div>
            
            )}
            <Footer />
        </div>
    )

}

export default InternshipDetails;