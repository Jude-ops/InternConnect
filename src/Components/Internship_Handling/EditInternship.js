import React, {useState, useEffect} from 'react'
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import FormElement from '../Form_Elements/FormElement';

function EditInternship(props) {

  const {companyID, id} = useParams();
  const navigate = useNavigate();

  const [internshipInfo, setInternshipInfo] = useState(null);
  const [internshipData, setInternshipData] = useState({

    internshipStartDate: "",
    internshipEndDate: "",
    internshipStatus: "",
    applyBy: "",
    availablePositions: "",
    whoCanApply: "",
    perksOfInternship: "",
    skillsRequired: "",

  });

  function handleChange(name, value) {
    setInternshipData(prevValue => {
      return {
        ...prevValue,
        [name]: value
      }
    });
  }

  useEffect(() => {
    async function fetchInternshipData() {
      try {
        const response = await axios.get(`http://localhost:5000/internship/${id}`);
        console.log(response.data);
        setInternshipInfo(response.data);
      } catch (error) {
        console.error("Error fetching internship data: ", error);
      }
    }

    fetchInternshipData();
  }, [id]);

  async function postUpdatedInternship(event) {

    event.preventDefault();

    try {

      const response = await axios.put(`http://localhost:5000/internship/${id}`, internshipData);

      if (response) {
        console.log("Internship updated successfully");
        navigate(`/company/${companyID}/internships`);

      }

    } catch (error) {
      console.log('Error updating internship:', error);
    }

  };

  return (
    <div>
      <Header isAuthenticated = {props.isAuthenticated}/>

      {internshipInfo && (
        <div className = "container my-5">
          <h2 className = "heading text-center fw-bold mb-5">Edit Internship</h2>
          <h3 className = "text-center fw-bold text-uppercase">{internshipInfo[0].internship_name}</h3>
          <p className = "text-center fs-5 fst-italic text-muted">Make changes to your internship listing</p>
          <div className = "row mt-2">
            <div className = "col-md-6 offset-md-3">
              <form className = "registration-form">

                <div className = "row mb-3">
                    <div className = "col-12 col-sm-6">
                        <FormElement 
                            label = "internshipStartDate" 
                            type = "date" 
                            placeholder = "Internship Start Date"
                            id = "internshipStartDate"
                            name = "internshipStartDate"
                            labelTitle = "Internship Start Date"
                            onChange = {handleChange}
                            value = {internshipData.internshipStartDate}
                        />
                    </div>

                    <div className = "col-12 col-sm-6">
                        <FormElement 
                            label = "internshipEndDate" 
                            type = "date" 
                            placeholder = "Internship End Date"
                            id = "internshipEndDate"
                            name = "internshipEndDate"
                            labelTitle = "Internship End Date"
                            onChange = {handleChange}
                            value = {internshipData.internshipEndDate}
                        />
                    </div>
                </div>

                <div className = "row mb-3">
                    <div className = "col-12 col-sm-6">
                        <FormElement 
                            label = "applyBy" 
                            type = "date" 
                            placeholder = "Apply By"
                            id = "applyBy"
                            name = "applyBy"
                            labelTitle = "Application Deadline Date"
                            onChange = {handleChange}
                            value = {internshipData.applyBy}
                        />
                    </div>

                    <div className = "col-12 col-sm-6">
                        <FormElement 
                            label = "availablePositions" 
                            type = "number" 
                            placeholder = "Available Positions"
                            id = "availablePositions"
                            name = "availablePositions"
                            labelTitle = "No. of available positions"
                            onChange = {handleChange}
                            value = {internshipData.availablePositions}
                        />
                    </div>
                </div>

                <div className="my-4">
                    <label for="whoCanApply" class="form-label">Who Can Apply</label>
                    <textarea 
                        className="form-control" 
                        id="whoCanApply" 
                        rows="6" 
                        value = {`${internshipData.whoCanApply}`}
                        name = "whoCanApply"
                        onChange={(event) => {
                            handleChange(event.target.name, event.target.value)
                        }}
                    ></textarea>
                </div>

                <div className="mb-4 mt-4">
                        <label for="skillsRequired" class="form-label">Skill(s) Required</label>
                        <textarea
                            className="form-control" 
                            id="skillsRequired" 
                            rows="4" 
                            value = {`${internshipData.skillsRequired}`}
                            name = "skillsRequired"
                            onChange={(event) => {
                                handleChange(event.target.name, event.target.value)
                            }}
                        ></textarea> 
                    </div>

                <FormElement 
                        label = "perksOfInternship" 
                        type = "text" 
                        placeholder = "Perks of Internship"
                        id = "perksOfInternship"
                        name = "perksOfInternship"
                        labelTitle = "Perks of Internship"
                        onChange = {handleChange}
                        value = {internshipInfo.perksOfInternship}
                />
                
                <div>
                  <label>Internship Status</label>
                </div>

                <div className ="form-check form-check-inline mb-3">
                    <input 
                        className ="form-check-input" 
                        type="radio" 
                        name="internshipStatus" 
                        id="open" 
                        value = "open" 
                        checked = {internshipData.internshipStatus === "open"} 
                        onChange = {(event) => {
                                handleChange(event.target.name,event.target.value)
                            }
                        } 
                        required
                    />
                    <label className ="form-check-label" for="open">Open</label>
                </div>

                <div className ="form-check form-check-inline mb-3">
                    <input 
                        className ="form-check-input" 
                        type="radio" 
                        name="internshipStatus" 
                        id="closed" 
                        value = "closed" 
                        checked = {internshipData.internshipStatus === "closed"} 
                        onChange = {(event) => {
                                handleChange(event.target.name,event.target.value)
                            }
                        } 
                        required
                    />
                    <label className ="form-check-label" for="closed">Closed</label>
                </div>    

                <div className = "text-center mt-4">
                        <button type="submit" class="btn btn-primary" onClick = {postUpdatedInternship}>Update Internship</button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default EditInternship