import React from 'react'
import Header from './Header';
import Footer from './Footer';
import SubHeader from './SubHeader';
import internshipLogo from '../../internship-illustration.png';
import internshipSearch from '../../internship-search.png';
import { Link } from 'react-router-dom';

function About(props) {
  return (
    <div>
        <Header isAuthenticated = {props.isAuthenticated} logout = {props.logout} />
        <SubHeader 
            title="About Us" 
            subtitle="Thousands of prestigious companies are looking for you. Find your dream internship now!"
        />
        <div className="container my-5">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <h1 className="text-center fw-bold" style = {{color: "#2980B9"}}>Our Vision</h1>
                    <p className="text-center"><span className = "fw-bold">InternConnect</span> is a platform that connects companies with interns. 
                        We aim to bridge the gap between companies and interns, and make the internship process easier for both parties. 
                        We are on a mission to equip students with relevant skills & practical exposure to help them get the best possible start to their careers.
                        Imagine a world full of freedom and possibilities. A world where you can discover your passion and turn it into your career. 
                        A world where you graduate fully assured, confident, and prepared to stake a claim on your place in the world.
                    </p>
                </div>
            </div>
            <div className = "row mt-5 mx-auto" style = {{width: "70%"}} >
                <div className = "col-md-6">
                    <h1 className="text-center fw-bold" style = {{color: "#2980B9"}}>Our Mission</h1>
                    <p className="text-center">Our mission is to help students find internships that are relevant to their field of study, 
                        and to help companies find interns that are a good fit for their organization. 
                        We believe that internships are a great way for students to gain practical experience in their field of study, 
                        and for companies to find talented individuals who can help them grow. 
                        We are committed to helping students and companies find the perfect match, 
                        and to making the internship process as smooth and easy as possible.
                    </p>
                </div>
                <div className = "col-md-6">
                   <img src = {internshipLogo} alt = "about us" className = "img-fluid" id = "internship-illustration-image"/>
                </div>
            </div>
            <div className = "row mt-5 mx-auto" style = {{width: "70%"}}>
                <div className = "col-md-6">
                    <img src = {internshipSearch} alt = "about us" className = "img-fluid" id = "internship-illustration-image"/>
                </div>
                <div className = "col-md-6">
                    <h1 className="text-center fw-bold" style = {{color: "#2980B9"}}>Find Internships</h1>
                    <p className="text-center">
                        Looking for an internship? You've come to the right place. 
                        <span className = "fw-bold">InternConnect</span> is the best place to find internships that match your skills and interests. 
                        Whether you're a student looking for an internship, or a company looking for interns, 
                        we've got you covered. Our platform makes it easy to find the perfect match, 
                        so you can get the experience you need to kickstart your career. 
                        Sign up today and start your internship search!
                    </p>
                    <div className = "about-us-button text-center d-flex justify-content-evenly">
                        <Link to = "/internships"><button className = "btn btn-primary btn-lg">Find Internships</button></Link>
                        <Link to = "/login"><button className = "btn btn-primary btn-lg"><i className="bi bi-box-arrow-in-right me-2"></i>Sign Up</button></Link>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default About;