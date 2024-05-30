import React, {useEffect, useState} from 'react'
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import { useParams} from 'react-router-dom';
import axios from 'axios';

function PublicProfile(props) {

    const {id} = useParams();
    const [profileInfo, setProfileInfo] = useState(null);
    const [educationInfo, setEducationInfo] = useState(null);
    const [experienceInfo, setExperienceInfo] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {

        async function fetchProfileInfo(){
            try {
                const response = await axios.get(`http://localhost:5000/intern/${id}`);
                if(response){
                    console.log(response.data);
                    const profileImage = response.data[0].profile_image;
                    const profileImageURL = `http://localhost:5000/uploads/${profileImage}`;
                    setProfileImage(profileImageURL);
                    setProfileInfo(response.data);
                }

            } catch (error) {
                console.log('Error fetching profile info:', error);
            }
        }

        async function fetchEducationInfo(){
            try {
                const response = await axios.get(`http://localhost:5000/intern/${id}/education`);
                if(response){
                    console.log(response.data);
                    setEducationInfo(response.data);
                }

            } catch (error) {
                console.log('Error fetching education info:', error);
            }
        }

        async function fetchExperienceInfo(){
            try {
                const response = await axios.get(`http://localhost:5000/intern/${id}/work_experience`);
                if(response){
                    console.log(response.data);
                    setExperienceInfo(response.data);
                }
            }catch (error) {
                console.log('Error fetching experience info:', error);
            }
        }

        fetchProfileInfo();
        fetchEducationInfo();
        fetchExperienceInfo();
    
    }, [id]);

  return (
    <div>
        <Header 
            isAuthenticated = {props.isAuthenticated} 
            logout = {props.logout}    
        />

        { profileInfo && profileImage &&
            <section id = "public-profile">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className = "intern-profile d-flex">
                                <div className = "public-profile-img me-4">
                                    <img src = {profileImage} alt = "Profile"/>
                                </div>
                                <div className = "public-profile-info d-flex flex-column justify-content-center">
                                    <h3>{profileInfo[0].first_name} {profileInfo[0].last_name}</h3>
                                    <p>{profileInfo[0].professional_title}</p>
                                    <div className = "d-flex">
                                        <p>
                                            <i className = "bi bi-geo-alt-fill me-2"></i>
                                            {profileInfo[0].location}, Cameroon
                                        </p>
                                        <p className = "ms-3">
                                            <i className = "bi bi-calendar-range-fill me-2"></i> 
                                            Member since
                                            {
                                                (() => {
                                                    //Get the month, day and year from the date
                                                    const date = new Date(profileInfo[0].registration_date);
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
                                    <a href = {`http://localhost:5000/document/${profileInfo[0].intern_ID}`} className = "btn" role = "button">Download CV</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        }

        { profileInfo && profileImage &&
            <section id = "public-profile-details" className = "my-5">
                <div className = "container">
                    <div className = "row">
                        <div className = "col-12 col-sm-12 col-md-12 col-lg-8">
                            <div className = "public-profile-details">

                                <div className = "about-section">
                                    <h3 className = "header fw-bold">About Me</h3>
                                    <p className = "mt-3">{profileInfo[0].short_bio}</p>
                                </div>
                                <hr className = "line-divider my-4"/>

                                <div className = "education-section">
                                    <h3 className = "header fw-bold">
                                        <i className="bi bi-mortarboard me-3"></i>
                                        Education
                                    </h3>
                                    <ul className = "education mt-3">
                                        {
                                            educationInfo && educationInfo.map((education, index) => {
                                                return <li key = {education.education_id}>
                                                    <div className = "education mt-3">
                                                        <h5 className = "fw-bold">{education.degree}</h5>
                                                        <p className = "text-muted">{education.school_name}, {education.location}</p>
                                                        <p className = "text-muted">
                                                            {
                                                                (() => {
                                                                    //Get the month and year from the date
                                                                    const startDate = new Date(education.start_date);
                                                                    const startMonth = startDate.toLocaleString('default', { month: 'short' });
                                                                    const startYear = startDate.getFullYear();

                                                                    const endDate = new Date(education.end_date);
                                                                    const endMonth = endDate.toLocaleString('default', { month: 'short' });
                                                                    const endYear = endDate.getFullYear();

                                                                    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
                                                                })()
                                                            }
                                                        </p>
                                                        <p>{education.department}</p>
                                                    </div>
                                                </li>
                                            })
                                        }
                                    </ul>
                                </div>
                                <hr className = "line-divider my-4"/>

                                <div className = "experience-section">
                                    <h3 className = "header fw-bold">
                                        <i className="bi bi-briefcase me-3"></i>
                                        Work Experience
                                    </h3>
                                    <div className = "row">
                                        {
                                            experienceInfo && experienceInfo.map((experience, index) => {
                                                return <div className = "col-12 col-sm-6 col-md-4" key = {index}>
                                                    <div className = "experience mt-3">
                                                        <h5 className = "fw-bold">{experience.position}</h5>
                                                        <p className = "text-muted">{experience.company_name}, {experience.location}</p>
                                                        <p className = "text-muted">
                                                            {
                                                                (() => {
                                                                    //Get the month and year from the date
                                                                    const startDate = new Date(experience.start_date);
                                                                    const startMonth = startDate.toLocaleString('default', { month: 'short' });
                                                                    const startYear = startDate.getFullYear();

                                                                    const endDate = new Date(experience.end_date);
                                                                    const endMonth = endDate.toLocaleString('default', { month: 'short' });
                                                                    const endYear = endDate.getFullYear();

                                                                    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
                                                                })()
                                                            }
                                                        </p>
                                                        <p>{experience.short_description}</p>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                                <hr className = "line-divider my-4"/>

                                <div className = "skills-section">
                                    <h3 className = "header fw-bold">
                                        <i className="bi bi-tools me-3"></i>
                                        Skills
                                    </h3>
                                    <div className = "skills mt-3 d-flex flex-wrap">
                                        {
                                            (() => {
                                                const skills = profileInfo[0].skills.split(/[\n,]+/);
                                                const trimmedSkills = skills.map((skill) => {
                                                    return skill.trim();
                                                });

                                                return trimmedSkills.map((skill,index) => {
                                                    return <span className = "profile-skill">{skill}</span>
                                                })
                                            })()
                                        }
                                    </div>
                                </div>
                                <hr className = "line-divider my-4"/>

                                <div className = "hire-me-section">
                                    <button className = "btn btn-primary">Hire Now</button>
                                    <button id = "save-profile-button" className = "btn btn-primary ms-3">Save Profile</button>
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
                                        <span className = "fw-bold">{profileInfo[0].email_address}</span>
                                    </div>
                                </div>
                                <div className = "d-flex mt-4">
                                    <span>
                                        <i className = "bi bi-telephone-fill h4 me-2"></i>
                                    </span>
                                    <div className = "d-flex flex-column ms-2">
                                        <span className = "text-muted">Telephone</span>
                                        <span className = "fw-bold">+237-{profileInfo[0].telephone}</span>
                                    </div>
                                </div>
                                <div className = "d-flex mt-4">
                                    <span>
                                        <i className = "bi bi-backpack h4 me-2"></i>
                                    </span>
                                    <div className = "d-flex flex-column ms-2">
                                        <span className = "text-muted">Age</span>
                                        <span className = "fw-bold">{profileInfo[0].age} years</span>
                                    </div>
                                </div>
                                <div className = "d-flex mt-4">
                                    <span>
                                        <i className = "bi bi-geo-alt-fill h4 me-2"></i>
                                    </span>
                                    <div className = "d-flex flex-column ms-2">
                                        <span className = "text-muted">From</span>
                                        <span className = "fw-bold">{profileInfo[0].location}, Cameroon</span>
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
                                                    const date = new Date(profileInfo[0].registration_date);
                                                    const month = date.toLocaleString('default', { month: 'short' });
                                                    const day = date.getDate();
                                                    const year = date.getFullYear();
                                                    return `${month} ${day}, ${year}`;
                                                })()
                                            }
                                        </span>
                                    </div>
                                </div>

                                <hr className = "line-divider my-4"/>

                                <div className = "contact-me">
                                    <button className = "btn">Contact Me</button>
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

export default PublicProfile;