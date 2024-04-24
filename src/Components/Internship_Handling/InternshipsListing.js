import React, {useState, useEffect} from 'react'
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import axios from 'axios';
import { Link } from 'react-router-dom';

function InternshipsListing(props) {

    const [internships, setInternships] = useState([]);
    const [filteredInternships, setFilteredInternships] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [internshipsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        internshipCategory: "all",
        internshipLocation: "all",
        internshipDuration: "all",
        datePosted: "all",
    });


    function handleFiltersChange(name, value){
        setFilters(prevValue => {
            return {
                ...prevValue,
                [name]: value,
            };
        });
    }

    useEffect(() => {
       async function fetchInternships(){
           try{
               const response = await axios.get("http://localhost:5000/internships");
               setInternships(response.data);
           }catch(err){
               console.log(err);
           }
       }

        fetchInternships();
    }, []); 

    // Filter internships based on the filters selected
    useEffect(() => {
        const filteredInternships = internships.filter((internship) => {
            if(filters.internshipCategory === "all" && filters.internshipLocation === "all" && filters.internshipDuration === "all" && filters.datePosted === "all"){
                return true;
            }

            if(filters.internshipCategory !== "all" && internship.category !== filters.internshipCategory){
                return false;
            }

            if(filters.internshipLocation !== "all" && internship.location_city !== filters.internshipLocation){
                return false;
            }

            if(filters.internshipDuration !== "all") {
                const start = new Date(internship.start_date);
                const end = new Date(internship.end_date);
              
                const startYear = start.getFullYear();
                const startMonth = start.getMonth();
              
                const endYear = end.getFullYear();
                const endMonth = end.getMonth();
              
                const duration = (endYear - startYear) * 12 + (endMonth - startMonth);
              
                if (duration !== parseInt(filters.internshipDuration)) {
                  return false;
                }
            }

            if(filters.datePosted === "all"){
                return true;
            }

            const currentDate = new Date();
            const postedDate = new Date(internship.posted_On);
            const timeDifference = currentDate.getTime() - postedDate.getTime();

            if(filters.datePosted === "last24Hours" && timeDifference > 24 * 60 * 60 * 1000){
                return false;
            }

            if(filters.datePosted === "last7Days" && timeDifference > 7 * 24 * 60 * 60 * 1000){
                return false;
            }

            if(filters.datePosted === "last14Days" && timeDifference > 14 * 24 * 60 * 60 * 1000){
                return false;
            }

            if(filters.datePosted === "last30Days" && timeDifference > 30 * 24 * 60 * 60 * 1000){
                return false;
            }

            return true;
        });

        setFilteredInternships(filteredInternships);
    }, [internships, filters]);

    const indexOfLastInternship = currentPage * internshipsPerPage;
    const indexOfFirstInternship = indexOfLastInternship - internshipsPerPage;
    const currentInternships = filteredInternships.slice(indexOfFirstInternship, indexOfLastInternship);

    function resetFilters(){
        setFilters({
            internshipCategory: "all",
            internshipLocation: "all",
            internshipDuration: "all",
            datePosted: "all",
        });

        setSearchKeyword("");
    }

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
            <div className="col-md-4" style = {{position: "sticky", top: "30px", height: "100%"}}>
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
                                onChange={(e) => {
                                    setSearchKeyword(e.target.value);
                                }}
                            />
                            <button className="btn btn-outline-secondary" type="button" id="keywordSearchButton">Search</button>
                        </div>
                    </div>

                    <div className="form-group mt-3">
                        <label className = "form-label fw-bold" for="internshipSelect">Internship Category</label>
                        <select 
                            className="form-control form-select" 
                            id="internshipSelect" 
                            name = "internshipCategory"
                            onChange = {(event) => handleFiltersChange(event.target.name, event.target.value)}
                            value = {filters.internshipCategory}
                        >
                            <option value = "all">All Categories</option>
                            <option value = "Software Development">Software Development</option>
                            <option value = "Data Science">Data Science</option>
                            <option value = "Security Management">Security Management</option>
                            <option value = "Networking">Networking</option>
                        </select>
                    </div>

                    <div className="form-group mt-3">
                        <label className = "form-label fw-bold" for="locationSelect">Location</label>
                        <select 
                            className="form-control form-select" 
                            id="locationSelect" 
                            name = "internshipLocation"
                            onChange = {(event) => handleFiltersChange(event.target.name, event.target.value)}
                            value = {filters.internshipLocation}
                        >
                            <option value = "all">All Locations</option>
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
                        <select 
                            className="form-control form-select" 
                            id="durationSelect" 
                            name = "internshipDuration"
                            onChange = {(event) => handleFiltersChange(event.target.name, event.target.value)}
                            value = {filters.internshipDuration}
                        >
                            <option value = "all">Any Duration</option>
                            <option value = "1">1 Month</option>
                            <option value = "2">2 Months</option>
                            <option value = "3">3 Months</option>
                            <option value = "4">4 Months</option>
                            <option value = "5">5 Months</option>
                            <option value = "6">6 Months</option>
                            <option value = "7">7 Months</option>
                            <option value = "8">8 Months</option>
                        </select>
                    </div>

                    <div className="form-group mt-3">

                        <h6 className = "mt-3 mb-2 fw-bold">Date Posted</h6>

                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                value="last24Hours" 
                                id="last24Hours" 
                                name = "datePosted"
                                checked = {filters.datePosted === "last24Hours"}
                                onChange={
                                    (event) => {
                                        handleFiltersChange(event.target.name, event.target.value);
                                    }
                                }
                            />
                            <label className="form-check-label" for="last24Hours">
                                Last 24 hours
                            </label>
                        </div>

                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                value="last7Days" 
                                id="last7Days" 
                                name = "datePosted"
                                checked = {filters.datePosted === "last7Days"}
                                onChange={
                                    (event) => {
                                        handleFiltersChange(event.target.name, event.target.value);
                                    }
                                }
                            />
                            <label className="form-check-label" for="last7Days">
                                Last 7 days
                            </label>
                        </div>

                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                value="last14Days" 
                                id="last14Days" 
                                name = "datePosted"
                                checked = {filters.datePosted === "last14Days"}
                                onChange={
                                    (event) => {
                                        handleFiltersChange(event.target.name, event.target.value);
                                    }
                                }
                            />
                            <label className="form-check-label" for="last14Days">
                                Last 14 days
                            </label>
                        </div>

                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                value="last30Days" 
                                id="last30Days" 
                                name = "datePosted"
                                checked = {filters.datePosted === "last30Days"}
                                onChange={
                                    (event) => {
                                        handleFiltersChange(event.target.name, event.target.value);
                                    }
                                }
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
                                checked = {filters.datePosted === "all"}
                                onChange={
                                    (event) => {
                                        handleFiltersChange(event.target.name, event.target.value);
                                    }
                                }
                            />
                            <label className="form-check-label" for="allPostedDates">
                                All
                            </label>
                        </div>
                    </div>

                    <div className="form-group mt-3 d-flex flex-row-reverse">
                        <button className="btn btn-primary" onClick={resetFilters}>Reset Filters</button>
                    </div>

                </div>
            </div>

            <div className="col-md-8">
                <div className = "internship-key-details w-100">
                    {currentInternships.filter((internship) => {
                            return searchKeyword.toLowerCase() === "" ? internship : internship.internship_name.toLowerCase().includes(searchKeyword);
                        }).map((internship) => (
                        <div className = "card internship-listing mb-4">
                            <div className="card-body d-flex flex-column">
                                <div className = "d-flex mb-3">
                                    <div className = "me-3 logo"></div>
                                    <div className = "d-flex flex-column">
                                        <h3 className="card-title fw-bold">{internship.internship_name}</h3>
                                        <p className="card-subtitle mb-2 text-muted">{internship.company_Name}</p>
                                    </div>
                                </div>
                                
                                <div className = "d-flex justify-content-between align-items-center">
                                    <span className="card-text"><small className = "text-muted">{internship.location_city}</small></span>
                                    <span className="card-text"><small className = "text-muted">{
                                            (() => {
                                                const start = new Date(internship.start_date);
                                                const end = new Date(internship.end_date);

                                                const startYear = start.getFullYear();
                                                const startMonth = start.getMonth();

                                                const endYear = end.getFullYear();
                                                const endMonth = end.getMonth();

                                                return (endYear - startYear) * 12 + (endMonth - startMonth) + " months";
                                            })()
                                            }</small></span>
                                    <span className="card-text"><small className = "text-muted">Start Date: {new Date(internship.start_date).toDateString()}</small></span>
                                    <Link to = {`/internship/${internship.internship_ID}`}><button className="btn btn-primary btn-sm">View Details</button></Link>
                                </div>

                                <span className="card-text mt-3"><small className = "text-muted">Posted Date: {new Date(internship.posted_On).toDateString()}</small></span>
                            </div>
                        </div>
                    ))}
                </div>

                <nav aria-label="Page navigation example" className="mt-3">
                    <ul className="pagination justify-content-center">
                        <li className="page-item">
                            <button className="page-link" onClick = {() => setCurrentPage(currentPage - 1)} disabled = {currentPage === 1 } aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </button>
                        </li>
                        {Array.from({length: Math.ceil(filteredInternships.length / internshipsPerPage)}, (_, i) => 
                            <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                            </li>
                        )}
                        <li className="page-item">
                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled = {currentPage === Math.ceil(filteredInternships.length / internshipsPerPage)} aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div> 
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default InternshipsListing;