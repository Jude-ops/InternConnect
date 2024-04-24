import React, {useState, useEffect} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { Link } from "react-router-dom";


function InternshipCard(props){

    const [internshipData, setInternshipData] = useState([]);
    const [userType, setUserType] = useState("");

    useEffect(() => {

        const userType = localStorage.getItem("userType");
        setUserType(userType);

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


    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    };

    return(
        <div className = "internshipCardComponent">

            <h1 className = "heading text-center fw-bold mt-5">Welcome to InternConnect!</h1>

            {
                userType === "intern" && 
                <div>
                    <h5 className = "text-center text-muted mt-3">Let's help you find your internship quickly</h5>
                </div>
            }
            
            <h2 className = "heading text-center mt-5">Latest Internships on InternConnect</h2>

            <div className="container mt-3">

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
                                
                                <div className="card shadow-sm mb-4" key = {internship.internship_ID}>
                                    <div className = "card-header text-center">
                                        <h4 className = "my-0 fw-bold">{internship.company_Name}</h4>
                                    </div>
                                    <div className="card-body">
                                        <h4 className = "card-title">{internship.internship_name}</h4>
                                        <h6 className="card-subtitle mb-2 text-muted">{internship.category}</h6>
                                        <hr className = "my-3" />
                                        <p className="card-text">{internship.location_city}</p>
                                        <p className="card-text">Posted {daysSincePosted} days ago</p>
                                        <p className="card-text">{duration} months</p>
                                        <Link to = {`/internship/${internship.internship_ID}`}><button className="btn btn-primary mt-4">View Details</button></Link>
                                    </div>
                                </div>
                    
                            )
                        })}
                    </Slider>

                </div>
            </div>

        </div>
    )
}

export default InternshipCard;