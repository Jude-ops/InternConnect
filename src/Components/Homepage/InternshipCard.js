import React from "react";
import internshipData from "../../internshipData";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function InternshipCard(props){

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    };

    return(
        <div className = "internshipCardComponent">

            <h3 className = "text-center fw-bold">Hi {props.storedName}!</h3>

            <h5 className = "text-center text-muted">Let's help you find your internship quickly</h5>

            <h2 className = "heading text-center mt-5">Latest Internships on InternConnect</h2>

            <div className="container pt-5">

                <div className="row">

                    <Slider {...settings}>
                        {internshipData.map((internship) => {
                            return(   

                                <div className="card shadow-sm mb-4">
                                    <div className = "card-header text-center">
                                        <h4 className = "my-0 fw-bold">{internship.company}</h4>
                                    </div>
                                    <div className="card-body">
                                        <h4 className = "card-title">{internship.title}</h4>
                                        <h6 className="card-subtitle mb-2 text-muted">{internship.category}</h6>
                                        <hr className = "my-3" />
                                        <p className="card-text">{internship.location}</p>
                                        <p className="card-text">{internship.payment}</p>
                                        <p className="card-text">{internship.duration}</p>
                                        <button className="btn btn-primary mt-4">View Details</button>
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