import React, {useState, useEffect} from 'react'
import Header from '../Homepage/Header'
import Footer from '../Homepage/Footer'
import axios from 'axios'


function MyApplications(props) {
  return (
    <div>
        <Header isAuthenticated = {props.isAuthenticated} />
        <div className="container mt-5">
            <h1 className="heading text-center fw-bold">My Applications</h1>
            <div className="row mt-5">
            <div className="col-md-4">
                <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Internship Title</h5>
                    <p className="card-text">Company Name</p>
                    <p className="card-text">Location</p>
                    <p className="card-text">Start Date</p>
                    <p className="card-text">End Date</p>
                    <p className="card-text">Status</p>
                </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Internship Title</h5>
                    <p className="card-text">Company Name</p>
                    <p className="card-text">Location</p>
                    <p className="card-text">Start Date</p>
                    <p className="card-text">End Date</p>
                    <p className="card-text">Status</p>
                </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Internship Title</h5>
                    <p className="card-text">Company Name</p>
                    <p className="card-text">Location</p>
                    <p className="card-text">Start Date</p>
                    <p className="card-text">End Date</p>
                    <p className="card-text">Status</p>
                </div>
                </div>
            </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default MyApplications;