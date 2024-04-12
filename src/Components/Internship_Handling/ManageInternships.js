import React, {useState, useEffect} from 'react'
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import { useParams} from 'react-router-dom';
import axios from 'axios';

function ManageInternships(props) {

    const {id} = useParams();
    const [internships, setInternships] = useState([]);

    useEffect(() => {
        async function fetchInternships() {
            try {
                const response = await axios.get(`http://localhost:5000/company/${id}/internships`);
                setInternships(response.data);
            } catch (error) {
                console.error("Error fetching company internships: ", error);
            }
        }

        fetchInternships();
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
        <Header isAuthenticated = {props.isAuthenticated}/>

        <div className = "container my-5">

            <h2 className = "heading text-center fw-bold">Manage Internships</h2>

            <div className = "row mt-5">
                <div className = "col-12">
                    <h3 className = "h3 fw-bold">
                        You've posted {internships.length} internship{internships.length > 1 && ('s')}
                    </h3>
                    <p className = "fst-italic"><span className = "fw-bold">Note:</span> Expired listings will be automatically removed after 30 days.</p>
                </div>
            </div>

            <div className = "row mt-2">
                <div className = "col-md-12 table-responsive posted-internships-table">
                    <table className = "table table-hover align-middle text-center">
                        <thead>
                            <tr>
                                <th scope = "col" className = "text-uppercase">Title</th>
                                <th scope = "col" className = "text-uppercase">Location</th>
                                <th scope = "col" className = "text-uppercase">Application Deadline</th>
                                <th scope = "col" className = "text-uppercase">Applications</th>
                                <th scope = "col" className = "text-uppercase">Status</th>
                                <th scope = "col" className = "text-uppercase">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {internships.map((internship) => (
                                <tr key = {internship.internship_ID}>
                                    <td>{internship.internship_name}</td>
                                    <td>{internship.location_city}</td>
                                    <td>{new Date(internship.apply_by).toDateString()}</td>
                                    <td>{internship.available_positions} Application{internship.available_positions > 1 && "s" }</td>
                                    <td>{internship.internship_status}</td>
                                    <td>
                                        <a href = {`/internship/${internship.internship_ID}`} className = "btn btn-outline-primary">View</a>
                                        <a href = {`/company/${id}/internship/${internship.internship_ID}/edit`} ><button className = "btn btn-outline-success ms-2">Edit</button></a>
                                        <button type = "button" className="btn btn-outline-danger ms-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                            Delete
                                        </button>

                                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog modal-dialog-centered">
                                                <div class="modal-content">
                                                    <div class="modal-header text-center">
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

        <Footer />
    </div>
  )
}

export default ManageInternships