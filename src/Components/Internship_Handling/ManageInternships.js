import React, {useState, useEffect} from 'react'
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ManageInternships(props) {

    const {id} = useParams();
    const [internships, setInternships] = useState([]);

    useEffect(() => {
        async function fetchInternships() {
            try {
                const response = await axios.get(`http://localhost:5000/company/${id}/internships`);
                setInternships(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching company internships: ", error);
            }
        }

        fetchInternships();
    }, [id]);


  return (
    
    <div>
        <Header isAuthenticated = {props.isAuthenticated}/>

        <div className = "container my-5">

            <h2 className = "heading text-center fw-bold">Manage Internships</h2>

            <div className = "row mt-5">
                <div className = "col-12">
                    <h3 className = "h3 fw-bold">
                        You've posted {internships.length} internship{internships.length > 1 ? ('s') : ('')}
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
                            {internships.map((internship, index) => (
                                <tr key = {index}>
                                    <td>{internship.internship_name}</td>
                                    <td>{internship.location_city}</td>
                                    <td>{new Date(internship.apply_by).toDateString()}</td>
                                    <td>{internship.available_positions}</td>
                                    <td>{internship.internship_status}</td>
                                    <td>
                                        <a href = {`/internship/${internship.internship_ID}`} className = "btn btn-outline-primary">View</a>
                                        <button className = "btn btn-outline-success ms-2">Edit</button>
                                        <button className = "btn btn-outline-danger ms-2">Delete</button>
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