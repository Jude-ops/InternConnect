import React, {useState, useEffect} from 'react'
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import SubHeader from '../Homepage/SubHeader';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import FormElement from '../Form_Elements/FormElement';

function EditInternship(props) {

  const {companyID, id} = useParams();
  const navigate = useNavigate();

  const [internshipData, setInternshipData] = useState({
    internshipName: "",
    internshipDescription: "",
    location: "",
    internshipStartDate: "",
    internshipEndDate: "",
    internshipStatus: "",
    category: "",
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

        //Function to convert all retrieved dates to string
        function convertDate(date){
          const newDate = new Date(date);
          const offset = newDate.getTimezoneOffset();
          newDate.setMinutes(newDate.getMinutes() - offset);
          return newDate.toISOString().split('T')[0];
        }


        setInternshipData(prevValue => {
          return {
            ...prevValue,
            internshipName: response.data[0].internship_name,
            internshipDescription: response.data[0].internship_description,
            location: response.data[0].location_city,
            internshipStartDate: convertDate(response.data[0].start_date),
            internshipEndDate: convertDate(response.data[0].end_date),
            internshipStatus: response.data[0].internship_status,
            category: response.data[0].category,
            applyBy: convertDate(response.data[0].apply_by),
            availablePositions: response.data[0].available_positions,
            whoCanApply: response.data[0].who_can_apply,
            perksOfInternship: response.data[0].perks,
            skillsRequired: response.data[0].skills_required,
          }
        });
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
      <Header isAuthenticated = {props.isAuthenticated} logout ={props.logout} />
      <SubHeader
        title = {internshipData && internshipData.internshipName}
        subtitle = "Make changes to your internship listing"
      />

      {internshipData && (
        <div className = "container my-5">
          <p className = "text-center h3 fw-bold">Edit Internship Portal</p>
          <div className = "row mt-4">
            <div className = "col-12 col-md-8 mx-auto">
              <form className = "registration-form">

                <FormElement
                  labelFor = "internshipName"
                  type = "text"
                  placeholder = "e.g. Web Development Internship"
                  id = "internshipName"
                  name = "internshipName"
                  labelTitle = "Internship Name"
                  onChange = {handleChange}
                  value = {internshipData.internshipName}
                />

                <div className = "row mb-3">
                    <div className = "col-12 col-sm-6">
                        <FormElement 
                            labelFor = "category" 
                            type = "text" 
                            placeholder = "e.g. Web Development"
                            id = "category"
                            name = "category"
                            labelTitle = "Category"
                            onChange = {handleChange}
                            value = {internshipData.category}
                        />
                    </div>

                    <div className = "col-12 col-sm-6">
                        <FormElement 
                            labelFor = "location" 
                            type = "text" 
                            placeholder = "e.g. New York"
                            id = "location"
                            name = "location"
                            labelTitle = "Location"
                            onChange = {handleChange}
                            value = {internshipData.location}
                        />
                    </div>
                </div>

                <div className="my-3">
                    <label for="internshipDescription" class="form-label fw-bold">Description</label>
                    <textarea 
                        className="form-control" 
                        id="internshipDescription" 
                        rows="6" 
                        value = {`${internshipData.internshipDescription}`}
                        name = "internshipDescription"
                        onChange={(event) => {
                            handleChange(event.target.name, event.target.value)
                        }}
                    ></textarea>
                </div>

                <div className = "row mb-3">
                    <div className = "col-12 col-sm-6">
                        <FormElement 
                            labelFor = "internshipStartDate" 
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
                            labelFor = "internshipEndDate" 
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
                            labelFor = "applyBy" 
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
                            labelFor = "availablePositions" 
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

                <div className="my-3">
                    <label for="whoCanApply" class="form-label fw-bold">Who Can Apply</label>
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

                <div className="my-4">
                        <label for="skillsRequired" class="form-label fw-bold">Skill(s) Required</label>
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
                        labelFor = "perksOfInternship" 
                        type = "text" 
                        placeholder = "Perks of Internship"
                        id = "perksOfInternship"
                        name = "perksOfInternship"
                        labelTitle = "Perks of Internship"
                        onChange = {handleChange}
                        value = {internshipData.perksOfInternship}
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