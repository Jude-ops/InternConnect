import React, {useState, useEffect} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { Link } from "react-router-dom";
import SubHeader from "./SubHeader";
import companyLogo from "../../company-logo1.png";

function InternshipCard(props){

    const [internshipData, setInternshipData] = useState([]);

    useEffect(() => {

        async function fetchData(){
            try{
                const response = await axios.get("http://localhost:5000/internships");
                setInternshipData(response.data);
            } catch(error){
                console.log('Error:', error);
            }
        }

        fetchData();

    }, []);

    async function saveInternship(internship_ID){
            
        const token = localStorage.getItem("token");
        const userType = localStorage.getItem("userType");
        const internID = localStorage.getItem("internID");

        if(!token){
            alert("Please login to save internships");
            return;
        }

        if(userType !== "intern"){
            alert("Only interns can save internships");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/intern/${internID}/saved-internships`, {
                internship_ID: internship_ID
            }, {
                headers: {
                    Authorization: token
                }
            });

            alert(response.data.message);

        } catch (error) {
            console.log('Error saving internship:', error);
        }
    }


    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 3000,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
        ],
    };

    return(
        <div>

            <SubHeader 
                title = "Welcome to InternConnect!"
                subtitle = "Let's help you find your internship quickly"
            />

            <div className = "internshipCardComponent">
            
                <h2 className = "heading text-center mt-5">Latest Internships on InternConnect</h2>

                <div className="container mt-5">

                    <div className="row">

                        <Slider {...settings}>
                            {internshipData.map((internship) => {

                                //Get days since posted
                                const datePosted = new Date(internship.posted_On);
                                const dateToday = new Date();

                                //Calculate difference in milliseconds and convert to days
                                const daysSincePosted = Math.floor((dateToday - datePosted) / (1000 * 60 * 60 * 24));

        
                                //Get duration of internship
                                function calculateMonthDifference(startDate, endDate){

                                    const start = new Date(startDate);
                                    const end = new Date(endDate);

                                    const startYear = start.getFullYear();
                                    const startMonth = start.getMonth();

                                    const endYear = end.getFullYear();
                                    const endMonth = end.getMonth();

                                    return (endYear - startYear) * 12 + (endMonth - startMonth);
                                }

                                const startDate = internship.start_date;
                                const endDate = internship.end_date;

                                const duration = calculateMonthDifference(startDate, endDate);

                                return(
                                    
                                    <div className="card shadow-sm mb-4" key = {internship.internship_ID} id = "home-internship-card">
                                        <div className = "card-header text-center" id = "internship-card-header">
                                            <h4 className = "my-0 fw-bold">{internship.company_Name}</h4>
                                        </div>
                                        <div className="card-body d-flex flex-column">
                                            <div className = "d-flex mb-3">
                                                <div className = "logo me-3">
                                                    <img src={companyLogo} alt="Company Logo" />
                                                </div>
                                                <div className = "d-flex flex-column">
                                                    <h4 className = "card-title">{internship.internship_name}</h4>
                                                    <h6 className="card-subtitle mb-2 text-muted">{internship.category}</h6>
                                                </div>
                                            </div>
                                            <hr id = "card-hr" className = "my-3" />
                                            <p className="card-text">
                                                <i className="bi bi-geo-alt-fill me-2"></i>
                                                {internship.location_city}
                                            </p>
                                            <p className="card-text">
                                                <i className="bi bi-clock me-2"></i>
                                                Posted {daysSincePosted} days ago
                                            </p>
                                            <p className="card-text">
                                                <i className="bi bi-calendar-range me-2"></i>
                                                {duration} months
                                            </p>

                                            <div className = "d-flex justify-content-between align-items-end">
                                                <Link to = {`/internship/${internship.internship_ID}`}><button className="btn btn-primary mt-4">View Details</button></Link>
                                                <div className = "me-2"><i class="bi bi-heart h4 save-internship-icon" onClick={() => {saveInternship(internship.internship_ID)}}></i></div>
                                            </div>
                                        </div>
                                    </div>
                        
                                )
                            })}
                        </Slider>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default InternshipCard;