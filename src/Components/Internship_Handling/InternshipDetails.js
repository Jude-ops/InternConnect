import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';

function InternshipDetails(props) {

    const { id } = useParams();
    const [internshipDetails, setInternshipDetails] = useState(null);

    useEffect(() => {

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

                                            console.log(trimmedResponsibilities);
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

                            <button type = "button" className = "btn btn-primary mt-5 btn-lg">Apply Now</button>
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