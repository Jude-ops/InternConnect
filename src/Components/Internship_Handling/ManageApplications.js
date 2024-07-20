import React, {useState, useEffect} from 'react'
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import SubHeader from '../Homepage/SubHeader';
import CompanyProfileNavbar from '../Profile_Updates/CompanyProfileNavbar';
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
          console.log("Applications: ", response.data)
          setApplications(response.data);
        } catch (error) {
          console.error("Error fetching company applications: ", error);
        }
      }

      fetchApplications();

    }, [id])

  async function shortlistIntern(internID) {
    try {
      const response = await axios.post(`http://localhost:5000/company/${id}/shortlist`, {
        internID: internID
      });
      if(response) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error shortlisting intern: ", error);
    }
  }

  async function acceptIntern(internID, internshipID) {
    try {
      const response = await axios.patch(`http://localhost:5000/company/${id}/accept`, {
        internID: internID,
        internshipID: internshipID
      });
      if(response) {
        const successMessage = document.querySelector('.accept-message');
        successMessage.classList.remove('hidden');
        setTimeout(() => {
          successMessage.classList.add('hidden');
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error("Error accepting intern: ", error);
    }
  }

  async function rejectIntern(internID, internshipID) {
    try {
      const response = await axios.patch(`http://localhost:5000/company/${id}/reject`, {
        internID: internID,
        internshipID: internshipID
      });
      if(response) {
        const successMessage = document.querySelector('.reject-message');
        successMessage.classList.remove('hidden');
        setTimeout(() => {
          successMessage.classList.add('hidden');
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error("Error accepting intern: ", error);
    }
  }

  return (
    <div>
      <Header isAuthenticated = {props.isAuthenticated} logout = {props.logout} />
      <SubHeader
        title = "Manage Applications"
        subtitle = "Manage applications for your posted internships"
      />

      <div className = "container my-5">
        <div className = "row">
          <div className = "col-12 col-lg-4">
            <CompanyProfileNavbar logout = {props.logout} />
          </div>

          <div className = "col-12 col-lg-8">
            <div className = "mt-4 mt-lg-0">
              <div className = "row">
                <div className = "col-12">
                  <h4 className = "h4 fw-bold">
                    You've received {applications && applications.length} application{applications && (applications.length > 1 || applications.length === 0 ? ('s') : (''))}
                  </h4>
                  <p className = "login-success-message hidden accept-message">Intern has been accepted into your internship program!</p>
                  <p className = "login-success-message hidden reject-message">Intern has been rejected from your internship program!</p>
                </div>
              </div>

              <div className = "row mt-2">
                <div className = "col-md-12 table-responsive posted-internships-table">
                  <table className = "table table-hover align-middle text-center">
                    <thead>
                      <tr>
                        <th scope = "col" className = "text-uppercase small">Candidate</th>
                        <th scope = "col" className = "text-uppercase small">Applied Internship</th>
                        <th scope = "col" className = "text-uppercase small">Applied Date</th>
                        <th scope = "col" className = "text-uppercase small">Action</th>
                        <th scope = "col" className = "text-uppercase small">CV</th>
                        <th scope = "col" className = "text-uppercase small">Cover Letter</th>
                      </tr>
                    </thead>

                    <tbody>
                      {applications && applications.map((application) => {
                        return (
                          <tr key = {application.application_ID}>
                            <td className = "small">{application.full_name}</td>
                            <td className = "small">{application.internship_name}</td>
                            <td className = "small">
                              {new Date(application.date_applied).toLocaleDateString()}
                            </td>
                            <td className = "small">
                              <a href = {`/intern/${application.intern_ID}/public_profile`}><i className = "bi bi-eye ms-2" style = {{color:"green"}}></i></a>
                              <i 
                                role = "button" 
                                onClick = {() => shortlistIntern(application.intern_ID)} 
                                className = "bi bi-heart ms-2" 
                                style = {{color:"#2980B9"}}>
                              </i>
                              <i
                                role = "button"
                                className = "bi bi-hand-thumbs-up ms-2"
                                style = {{color:"green"}}
                                onClick = {() => acceptIntern(application.intern_ID, application.internship_ID)}
                              ></i>
                              <i
                                role = "button"
                                className = "bi bi-hand-thumbs-down ms-2"
                                style = {{color:"red"}}
                                onClick = {() => rejectIntern(application.intern_ID, application.internship_ID)}
                              ></i>
                            </td>
                            <td className = "small">
                              <a href = {`http://localhost:5000/document/${application.intern_ID}`} className = "btn" role = "button" style = {{color:"#2980B9", textDecoration:"underline"}}>Download</a>
                            </td>
                            <td className = "small">
                              <span role = "button" data-bs-toggle="modal" data-bs-target="#exampleModal" style = {{color:"green"}}>View</span>

                              <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                  <div class="modal-dialog modal-dialog-centered">
                                      <div class="modal-content">
                                          <div class="modal-header text-center" style = {{backgroundColor: "#2980B9"}}>
                                              <h1 class="modal-title w-100 fs-5" id="exampleModalLabel">Cover Letter</h1>
                                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                          </div>
                                          <div class="modal-body">
                                            <p style = {{lineHeight: "2"}}>{application.cover_letter}</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
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

export default ManageApplications;