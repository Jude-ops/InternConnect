import React from "react";
//import internshipData from "../../internshipData";

function InternshipCard(props){

    return(
        <div className = "internshipCardComponent">

            <h3 className = "text-center fw-bold">Hi {props.storedName}!</h3>

            <h5 className = "text-center text-muted">Let's help you find your internship quickly</h5>

            <h2 className = "heading text-center mt-5">Latest Internships on InternConnect</h2>

            <div className="container pt-5">

                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card shadow-sm mb-4">
                            <div className = "card-header text-center">
                                <h4 className = "my-0 fw-bold">Company Name</h4>
                            </div>
                            <div className="card-body">
                                <h4 className = "card-title">Internship Title</h4>
                                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                                <hr className = "my-3" />
                                <p className="card-text">Location</p>
                                <p className="card-text">Payment</p>
                                <p className="card-text">Duration</p>
                                <button className="btn btn-primary mt-4">View Details</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card shadow-sm mb-4">
                            <div className = "card-header text-center">
                                <h4 className = "my-0 fw-bold">Company Name</h4>
                            </div>
                            <div className="card-body">
                                <h4 className = "card-title">Internship Title</h4>
                                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                                <hr className = "my-3" />
                                <p className="card-text">Location</p>
                                <p className="card-text">Payment</p>
                                <p className="card-text">Duration</p>
                                <button className="btn btn-primary mt-4">View Details</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card shadow-sm mb-4">
                            <div className = "card-header text-center">
                                <h4 className = "my-0 fw-bold">Company Name</h4>
                            </div>
                            <div className="card-body">
                                <h4 className = "card-title">Internship Title</h4>
                                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                                <hr className = "my-3" />
                                <p className="card-text">Location</p>
                                <p className="card-text">Payment</p>
                                <p className="card-text">Duration</p>
                                <button className="btn btn-primary mt-4">View Details</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default InternshipCard;