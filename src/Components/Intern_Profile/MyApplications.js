import React, {useState, useEffect} from 'react'
import Header from '../Homepage/Header'
import Footer from '../Homepage/Footer'
import InternProfileNavbar from './InternProfileNavbar'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom';
import SubHeader from '../Homepage/SubHeader'


function MyApplications(props) {

    const [applications, setApplications] = useState([]);
    const [internshipDetails, setInternshipDetails] = useState([]);

    const {id} = useParams();

    useEffect(() => {
        
        async function fetchInternApplications(){
            try {
                const response = await axios.get(`http://localhost:5000/intern/${id}/applications`);
                setApplications(response.data);
            } catch (error) {
                console.log('Error fetching applications:', error);
            }
        }

        fetchInternApplications();

    }, [id]);

    useEffect(() => {

        async function fetchInternshipDetails(){
            try {
                const details = await Promise.all(applications.map(async (application) => {
                    if (application && application.internship_ID) {
                        const response = await axios.get(`http://localhost:5000/internship/${application.internship_ID}`);
                        return response.data;
                    }
                }));
                setInternshipDetails(details.filter((detail) => detail));
            } catch (error) {
                console.log('Error fetching internship details:', error);
            }
        }

        if (applications.length > 0) {
            fetchInternshipDetails();
        }

    }, [applications]);

  return (
    <div>
        <Header isAuthenticated = {props.isAuthenticated} logout = {props.logout} />
        <SubHeader 
            title = "My Applications"
            subtitle = "View all your applications here"
        />
        <div className="container my-5">
            <h1 className="heading text-center fw-bold">My Applications</h1>
            <div className = "row mt-5">
                <div className = "col-12 col-md-4">
                    <InternProfileNavbar logout = {props.logout} />
                </div>

                <div className = "col-12 col-md-8">
                    <h3 className="fw-bold">Applied Internships</h3>
                    <div className = "row mt-4 table-responsive posted-internships-table">
                        <table className="table align-middle">
                            <thead className = "table-light">
                                <tr>
                                    <th>Internship Title</th>
                                    <th>Company</th>
                                    <th>Application Status</th>
                                    <th>Date Applied</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((application, index) => (
                                    <tr key = {application.application_ID}>
                                        <td>
                                            <div className = "d-flex">
                                                <div className = "logo">
                                                    {internshipDetails[index] && ( 
                                                        <img src = {`http://localhost:5000/uploads/${internshipDetails[index][0].profile_image}`} alt = "company logo" className = "img-fluid rounded"/>
                                                    )}
                                                </div>
                                                {internshipDetails[index] && (
                                                    <Link to = {`/internship/${application.internship_ID}`} style = {{textDecoration: "none", color: "black"}}>
                                                        {internshipDetails[index][0].internship_name}
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                        <td>{internshipDetails[index] && internshipDetails[index][0].company_Name}</td>
                                        <td>{application.application_status}</td>
                                        <td>{new Date(application.date_applied).toDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div> 
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default MyApplications;