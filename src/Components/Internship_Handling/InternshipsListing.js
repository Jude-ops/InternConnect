import React, {useState, useEffect} from 'react'
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';

function InternshipsListing(props) {

    const [internships, setInternships] = useState([]);
    const [filteredInternships, setFilteredInternships] = useState([]);
    const [filters, setFilters] = useState({
        internshipCategory: "all",
        internshipLocation: "all",
        internshipDuration: "all",
        datePosted: "all",
    });

  return (
    <div>
      <Header isAuthenticated = {props.isAuthenticated} />
      <div className="container my-5" style = {{width: "75%"}}>
        <h2 className="heading text-center fw-bold">Internships</h2>
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="h3 fw-bold">Internships Available</h3>
            <p className="fst-italic"><span className="fw-bold">Note:</span> Internships are updated regularly. Check back often for new listings.</p>
          </div>
        </div>

        <div className="row mt-4">
            <div className="col-md-4">
                <div className = "internship-overview internship-filters w-100">
                    <div className = "filter-section">
                        <h4>Filters</h4>
                        <hr style = {{width: "30%"}}/>
                    </div>

                    <div className="form-group">
                        <label className = "form-label fw-bold" for="keywordSearch">Keyword Search</label>
                        <div className="input-group mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search by keyword" 
                                aria-label="Search by keyword" 
                                aria-describedby="keywordSearch"
                                id = "keywordSearch"
                                name = "keywordSearch"
                            />
                            <button className="btn btn-outline-secondary" type="button" id="keywordSearchButton">Search</button>
                        </div>
                    </div>

                    <div className="form-group mt-3">
                        <label className = "form-label fw-bold" for="internshipSelect">Internship Category</label>
                        <select className="form-control form-select" id="internshipSelect" name = "internshipCategory">
                            <option selected value = "all">All Categories</option>
                            <option value = "Software Development">Software Development</option>
                            <option value = "Data Science">Data Science</option>
                            <option value = "Security Management">Security Management</option>
                            <option value = "Networking">Networking</option>
                        </select>
                    </div>

                    <div className="form-group mt-3">
                        <label className = "form-label fw-bold" for="locationSelect">Location</label>
                        <select className="form-control form-select" id="locationSelect" name = "internshipLocation">
                            <option selected value = "all">All Locations</option>
                            <option value = "Bamenda">Bamenda</option>
                            <option value = "Yaounde">Yaounde</option>
                            <option value = "Douala">Douala</option>
                            <option value = "Maroua">Maroua</option>
                            <option value = "Garoua">Garoua</option>
                            <option value = "Ngaoundere">Ngaoundere</option>
                            <option value = "Bafoussam">Bafoussam</option>
                            <option value = "Bertoua">Bertoua</option>
                            <option value = "Ebolowa">Ebolowa</option>
                            <option value = "Buea">Buea</option>
                        </select>
                    </div>

                    <div className="form-group mt-3">
                        <label className = "form-label fw-bold" for="durationSelect">Max. duration (months)</label>
                        <select className="form-control form-select" id="durationSelect" name = "internshipDuration">
                            <option selected value = "all">Any Duration</option>
                            <option value = "1">1 Month</option>
                            <option value = "2">2 Months</option>
                            <option value = "3">3 Months</option>
                            <option value = "4">4 Months</option>
                            <option value = "5">5 Months</option>
                            <option value = "6">6 Months</option>
                        </select>
                    </div>

                    <div className="form-group mt-3">

                        <h6 className = "mt-3 mb-2 fw-bold">Date Posted</h6>

                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                value="" 
                                id="last24Hours" 
                                name = "datePosted"
                            />
                            <label className="form-check-label" for="last24Hours">
                                Last 24 hours
                            </label>
                        </div>

                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                value="" 
                                id="last7Days" 
                                name = "datePosted"
                            />
                            <label className="form-check-label" for="last7Days">
                                Last 7 days
                            </label>
                        </div>

                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                value="" 
                                id="last14Days" 
                                name = "datePosted"
                            />
                            <label className="form-check-label" for="last14Days">
                                Last 14 days
                            </label>
                        </div>

                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                value="" 
                                id="last30Days" 
                                name = "datePosted"
                            />
                            <label className="form-check-label" for="last30Days">
                                Last 30 days
                            </label>
                        </div>

                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                value="all" 
                                id="allPostedDates"
                                name = "datePosted"
                            />
                            <label className="form-check-label" for="allPostedDates">
                                All
                            </label>
                        </div>
                    </div>

                    <div className="form-group mt-3 d-flex flex-row-reverse">
                        <button className="btn btn-primary">Reset Filters</button>
                    </div>

                </div>
            </div>

            <div className="col-md-8">
                <div className = "internship-key-details w-100">

                    <div className = "card internship-listing">
                        <div className="card-body d-flex flex-column">
                            <div className = "d-flex mb-3">
                                <div className = "me-3 logo"></div>
                                <div className = "d-flex flex-column">
                                    <h3 className="card-title fw-bold">Software Development Intern</h3>
                                    <p className="card-subtitle mb-2 text-muted">Company Name</p>
                                </div>
                            </div>
                            
                            <div className = "d-flex justify-content-between align-items-center">
                                <span className="card-text"><small className = "text-muted">Location</small></span>
                                <span className="card-text"><small className = "text-muted">Duration</small></span>
                                <span className="card-text"><small className = "text-muted">Start Date</small></span>
                                <button className="btn btn-primary btn-sm">View Details</button>
                            </div>

                            <span className="card-text mt-3"><small className = "text-muted">Posted Date</small></span>
                        </div>
                    </div>

                    <div className = "card internship-listing mt-4">
                        <div className="card-body d-flex flex-column">
                            <div className = "d-flex mb-3">
                                <div className = "me-3 logo"></div>
                                <div className = "d-flex flex-column">
                                    <h3 className="card-title fw-bold">Data Science Intern</h3>
                                    <p className="card-subtitle mb-2 text-muted">Company Name</p>
                                </div>
                            </div>
                            
                            <div className = "d-flex justify-content-between align-items-center">
                                <span className="card-text"><small className = "text-muted">Location</small></span>
                                <span className="card-text"><small className = "text-muted">Duration</small></span>
                                <span className="card-text"><small className = "text-muted">Start Date</small></span>
                                <button className="btn btn-primary btn-sm">View Details</button>
                            </div>

                            <span className="card-text mt-3"><small className = "text-muted">Posted Date</small></span>
                        </div>
                    </div>

                    <div className = "card internship-listing mt-4">
                        <div className="card-body d-flex flex-column">
                            <div className = "d-flex mb-3">
                                <div className = "me-3 logo"></div>
                                <div className = "d-flex flex-column">
                                    <h3 className="card-title fw-bold">Cyber Security Intern</h3>
                                    <p className="card-subtitle mb-2 text-muted">Company Name</p>
                                </div>
                            </div>
                            
                            <div className = "d-flex justify-content-between align-items-center">
                                <span className="card-text"><small className = "text-muted">Location</small></span>
                                <span className="card-text"><small className = "text-muted">Duration</small></span>
                                <span className="card-text"><small className = "text-muted">Start Date</small></span>
                                <button className="btn btn-primary btn-sm">View Details</button>
                            </div>

                            <span className="card-text mt-3"><small className = "text-muted">Posted Date</small></span>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default InternshipsListing;