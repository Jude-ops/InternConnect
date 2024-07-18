import React, {useState, useEffect} from 'react'
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import SubHeader from '../Homepage/SubHeader';
import CompanyProfileNavbar from '../Profile_Updates/CompanyProfileNavbar';
import { useParams} from 'react-router-dom';
import axios from 'axios';

function ManageInternships(props) {

    const {id} = useParams();
    const [internships, setInternships] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        async function fetchInternships() {
            try {
                const response = await axios.get(`http://localhost:5000/company/${id}/internships`);
                setInternships(response.data);
            } catch (error) {
                console.error("Error fetching company internships: ", error);
            }
        }

        async function fetchApplications() {
            try {
                const response = await axios.get(`http://localhost:5000/company/${id}/applications`);
                if(response){
                    console.log(response.data);
                    setApplications(response.data);
                }
            } catch (error) {
                console.error("Error fetching company applications: ", error);
            }
        }

        fetchInternships();
        fetchApplications();
    }, [id]);
    
    async function deleteInternship(internshipID){

        try{

            const response = await axios.delete(`http://localhost:5000/company/${id}/internship/${internshipID}/delete`);
            if(response){
                window.location.reload();
            }

        } catch (error) {

            console.error("Error deleting internship: ", error);

        }

    };


  return (
    
    <div>
        <Header isAuthenticated = {props.isAuthenticated} logout = {props.logout} />
        <SubHeader 
            title = "Manage Your Internships"
            subtitle = "View and manage your posted internships"
        />

        <div className = "container my-5">

            <div className = "row">

                <div className = "col-12 col-lg-4">
                    <CompanyProfileNavbar logout = {props.logout}/>
                </div>

                <div className = "col-12 col-lg-8">

                    <div className = "mt-4 mt-lg-0">
                        <div className = "row">
                            <div className = "col-12">
                                <h4 className = "h4 fw-bold">
                                    You've posted {internships.length} internship{internships.length > 1 && ('s')}
                                </h4>
                                <p className = "fst-italic small"><span className = "fw-bold">Note:</span> Expired listings will be automatically removed after 30 days.</p>
                            </div>
                        </div>

                        <div className = "row mt-2">
                            <div className = "col-md-12 table-responsive posted-internships-table">
                                <table className = "table table-hover align-middle text-center">
                                    <thead>
                                        <tr>
                                            <th scope = "col" className = "text-uppercase small">Title</th>
                                            <th scope = "col" className = "text-uppercase small">Location</th>
                                            <th scope = "col" className = "text-uppercase small">Date Posted</th>
                                            <th scope = "col" className = "text-uppercase small">Applications</th>
                                            <th scope = "col" className = "text-uppercase small">Status</th>
                                            <th scope = "col" className = "text-uppercase small">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {internships.map((internship) => (
                                            <tr key = {internship.internship_ID}>
                                                <td className = "small">{internship.internship_name}</td>
                                                <td className = "small">{internship.location_city}</td>
                                                <td className = "small">
                                                    {
                                                        (() => {
                                                            //Get the month, day and year from the date
                                                            const date = new Date(internship.posted_On);
                                                            const month = date.toLocaleString('default', { month: 'short' });
                                                            const day = date.getDate();
                                                            const year = date.getFullYear();
                                                            return ` ${month} ${day}, ${year}`;
                                                        })()
                                                    }
                                                </td>
                                                <td className = "small">
                                                    <a className = "nav-link" style = {{color: "#2980B9"}} href = {`/company/${id}/internship/${internship.internship_ID}/applications`}>
                                                        {applications.filter(application => application.internship_ID === internship.internship_ID).length} {applications.filter(application => application.internship_ID === internship.internship_ID).length > 1 ||  applications.filter(application => application.internship_ID === internship.internship_ID).length === 0 ? "Applications" : "Application"}
                                                    </a>
                                                </td>
                                                <td className = "small">
                                                    {internship.internship_status === "open" ? <span className = "badge bg-success">Open</span> : <span className = "badge bg-danger">Closed</span>}
                                                </td>
                                                <td>
                                                    <a href = {`/internship/${internship.internship_ID}`}><i className = "bi bi-eye ms-2" style = {{color:"green"}}></i></a>
                                                    <a href = {`/company/${id}/internship/${internship.internship_ID}/edit`} ><i className = "bi bi-pencil ms-2" style = {{color:"#2980B9"}}></i></a>
                                                    <i role = "button" className = "bi bi-trash3 ms-2" data-bs-toggle="modal" data-bs-target="#exampleModal" style = {{color:"red"}}></i>

                                                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                        <div class="modal-dialog modal-dialog-centered">
                                                            <div class="modal-content">
                                                                <div class="modal-header text-center" style = {{backgroundColor: "#2980B9"}}>
                                                                    <h1 class="modal-title w-100 fs-5" id="exampleModalLabel">Delete Account</h1>
                                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                </div>
                                                                <div class="modal-body">
                                                                    Are you sure you want to delete this internship?<br />
                                                                    This action cannot be reversed!
                                                                </div>
                                                                <div class="modal-footer">
                                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                                    <button type="button" class="btn btn-danger" onClick={() => deleteInternship(internship.internship_ID)}>Delete</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}          
                                    </tbody>
                                </table>
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

export default ManageInternships