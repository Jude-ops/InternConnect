import React, {useState, useEffect} from 'react'
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import { useParams} from 'react-router-dom';
import axios from 'axios';

function ManageApplications(props) {

  const {id} = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(
    () => {
      async function fetchApplications() {
        try {
          const response = await axios.get(`http://localhost:5000/company/${id}/applications`);
          setApplications(response.data);
        } catch (error) {
          console.error("Error fetching company applications: ", error);
        }
      }

      fetchApplications();

    }, [id])


  return (
    <div>
      <Header isAuthenticated = {props.isAuthenticated}/>

      <div className = "container my-5">

        <h2 className = "heading text-center fw-bold">Manage Applications</h2>

        <div className = "row mt-5">
            <div className = "col-12">
                <h3 className = "h3 fw-bold">
                    You've received 3 applications
                </h3>
            </div>
        </div>

        <div className = "row mt-2">
            <div className = "col-md-12 table-responsive posted-internships-table">
                <table className = "table table-hover align-middle text-center">
                    <thead>
                        <tr>
                            <th scope = "col" className = "text-uppercase">Candidate</th>
                            <th scope = "col" className = "text-uppercase">Applied Internship</th>
                            <th scope = "col" className = "text-uppercase">Applied Date</th>
                            <th scope = "col" className = "text-uppercase">Action</th>
                            <th scope = "col" className = "text-uppercase">CV</th>
                            <th scope = "col" className = "text-uppercase">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>John Doe</td>
                            <td>Software Developer Intern</td>
                            <td>12-08-2021</td>
                            <td>
                              <button className = "btn btn-primary">View</button>
                              <button className = "btn btn-success ms-2">Accept</button>
                              <button className = "btn btn-danger ms-2">Reject</button>
                            </td>
                            <td><a href = "#" className = "text-decoration-none">Download</a></td>
                            <td>Shortlisted</td>
                        </tr>

                        <tr>
                            <td>Jane Doe</td>
                            <td>Marketing Intern</td>
                            <td>12-08-2021</td>
                            <td>
                              <button className = "btn btn-primary">View</button>
                              <button className = "btn btn-success ms-2">Accept</button>
                              <button className = "btn btn-danger ms-2">Reject</button>
                            </td>
                            <td><a href = "#" className = "text-decoration-none">Download</a></td>
                            <td className = "text-danger">Rejected</td>
                        </tr>

                        <tr>
                            <td>John Smith</td>
                            <td>Software Developer Intern</td>
                            <td>12-08-2021</td>
                            <td>
                              <button className = "btn btn-primary">View</button>
                              <button className = "btn btn-success ms-2">Accept</button>
                              <button className = "btn btn-danger ms-2">Reject</button>
                            </td>
                            <td><a href = "#" className = "text-decoration-none">Download</a></td>
                            <td className = "text-success">Accepted</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default ManageApplications;