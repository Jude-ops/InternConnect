import React, {useState} from 'react'
import axios from 'axios'
import Header from '../Homepage/Header';
import SubHeader from '../Homepage/SubHeader';
import Footer from '../Homepage/Footer';
import { useNavigate,useParams } from 'react-router-dom';

function EducationWorkHistory(props) {

    const navigate = useNavigate();
    const {id} = useParams();

    const [educationEntries, setEducationEntries] = useState([{}]);

    const [workHistoryEntries, setWorkHistoryEntries] = useState([{}]);

    const addEducation = () => {
        setEducationEntries([...educationEntries, {}]);
    }

    const addWorkHistory = () => {
        setWorkHistoryEntries([...workHistoryEntries, {}]);
    }

    function handleEducationChange(index,name,value){
        const newEducationEntries = [...educationEntries];
        newEducationEntries[index][name] = value;
        setEducationEntries(newEducationEntries);
    }

    function handleWorkHistoryChange(index,name,value){
        const newWorkHistoryEntries = [...workHistoryEntries];
        newWorkHistoryEntries[index][name] = value;
        setWorkHistoryEntries(newWorkHistoryEntries);
    }

    async function submitAllEntries(){
        try{

            //Check if all fields are filled in the education entries
            if(educationEntries.length > 0){
                for(let i = 0; i < educationEntries.length; i++){
                    if(!educationEntries[i].school_name || !educationEntries[i].department || !educationEntries[i].location || !educationEntries[i].degree || !educationEntries[i].start_date || !educationEntries[i].end_date){
                        alert("Please fill all fields in the education section!");
                        break;  //Exit the loop if any field is empty
                    }
                    const educationResponse = await axios.post(`http://localhost:5000/intern/${id}/education`, educationEntries);
                    if(educationResponse){
                        navigate('/');  //Navigate to the homepage if the response is successful
                    }
                }
            }

            //Check if all fields are filled in the work history entries
            if(workHistoryEntries.length > 0){
                for(let i = 0; i < workHistoryEntries.length; i++){
                    if(!workHistoryEntries[i].company_name || !workHistoryEntries[i].location || !workHistoryEntries[i].position || !workHistoryEntries[i].description || !workHistoryEntries[i].start_date || !workHistoryEntries[i].end_date){
                        alert("Please fill all fields in the work history section!");
                        break;
                    }
                    const workHistoryResponse = await axios.post(`http://localhost:5000/intern/${id}/work-history`, workHistoryEntries);
                    if(workHistoryResponse){
                        navigate('/');
                    }
                }
            }
        } catch(error){
            console.log(error);
        }
    }

  return (
    <div>
        <Header isAuthenticated = {props.isAuthenticated} />
        <SubHeader 
            title = "Education and Work History"
            subtitle = "Add your education and work history here!"
        />
            <div className = "container my-5 p-3 mx-auto">
                <div className = "row">
                    <div className = "col-12 col-md-6 mx-auto">
                        <h3 className = "text-center fw-bold">Add Education</h3>
                        {educationEntries.map((entry, index) => {
                            return(
                                <form className = "registration-form mt-4" key = {index}>
                                    <div className="mb-3">
                                        <label for="school" className="form-label fw-bold">School Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="school"
                                            name = "school_name"
                                            placeholder = "E.g. University of Nairobi"
                                            onChange = {(event) => handleEducationChange(index, event.target.name, event.target.value)}
                                            value = {entry.school_name}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label for="department" className="form-label fw-bold">Department</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="department" 
                                            name = "department"
                                            placeholder = "E.g. Computer Science"
                                            onChange = {(event) => handleEducationChange(index, event.target.name, event.target.value)}
                                            value = {entry.department}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label for="location" className="form-label fw-bold">Location</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="location" 
                                            name = "location"
                                            placeholder = "E.g. Nairobi, Kenya"
                                            onChange = {(event) => handleEducationChange(index, event.target.name, event.target.value)}
                                            value = {entry.location}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label for="degree" className="form-label fw-bold">Degree</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="degree" 
                                            name = "degree"
                                            placeholder = "E.g. BSc. Computer Science"
                                            onChange = {(event) => handleEducationChange(index, event.target.name, event.target.value)}
                                            value = {entry.degree}
                                            required
                                        />
                                    </div>

                                    <div className = "row mb-3">
                                        <div className="col-12 col-sm-6">
                                            <label for="start_date" className="form-label fw-bold">Start Date</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                id="start_date" 
                                                name = "start_date"
                                                onChange = {(event) => handleEducationChange(index, event.target.name, event.target.value)}
                                                value = {entry.start_date}
                                                required
                                            />
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <label for="end_date" className="form-label fw-bold">End Date</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                id="end_date" 
                                                name = "end_date"
                                                onChange = {(event) => handleEducationChange(index, event.target.name, event.target.value)}
                                                value = {entry.end_date}
                                                required
                                            />
                                        </div>
                                    </div>
                                </form>
                        )})}
                        <button type="button" className="btn btn-primary mt-3" onClick={addEducation}>
                            <i className="bi bi-plus me-2"></i>
                            Add Education
                        </button>
                    </div>
                </div>

                <div className = "row mt-5">
                    <div className = "col-12 col-md-6 mx-auto">
                        <h3 className = "text-center fw-bold">Add Work History</h3>
                        {workHistoryEntries.map((entry, index) => {
                            return(
                                <form className = "registration-form mt-4" key = {index}>
                                    <div className="mb-3">
                                        <label for="company" className="form-label fw-bold">Company Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="company"
                                            name = "company_name"
                                            placeholder = "E.g. Google"
                                            onChange = {(event) => handleWorkHistoryChange(index, event.target.name, event.target.value)}
                                            value = {entry.company_name}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label for="location" className="form-label fw-bold">Location</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="location"
                                            name = "location"
                                            placeholder = "E.g. Mountain View, California"
                                            onChange = {(event) => handleWorkHistoryChange(index, event.target.name, event.target.value)}
                                            value = {entry.location}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label for="position" className="form-label fw-bold">Position</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="position" 
                                            name = "position"
                                            placeholder = "E.g. Software Engineer"
                                            onChange = {(event) => handleWorkHistoryChange(index, event.target.name, event.target.value)}
                                            value = {entry.position}
                                            required
                                        />
                                    </div>

                                    <div className = "mb-3">
                                        <label for="description" className="form-label fw-bold">Short Job Description</label>
                                        <textarea 
                                            className="form-control" 
                                            id="description" 
                                            name = "description"
                                            placeholder = "E.g. Worked on the Google Search Engine"
                                            onChange = {(event) => handleWorkHistoryChange(index, event.target.name, event.target.value)}
                                            value = {entry.description}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className = " row mb-3">
                                        <div className="col-12 col-sm-6">
                                            <label for="start_date" className="form-label fw-bold">Start Date</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                id="start_date" 
                                                name = "start_date"
                                                onChange = {(event) => handleWorkHistoryChange(index, event.target.name, event.target.value)}
                                                value = {entry.start_date}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-sm-6">
                                            <label for="end_date" className="form-label fw-bold">End Date</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                id="end_date" 
                                                name = "end_date"
                                                onChange = {(event) => handleWorkHistoryChange(index, event.target.name, event.target.value)}
                                                value = {entry.end_date}
                                                required
                                            />
                                        </div>
                                    </div>
                                </form>
                        )})}
                        <button type="button" className="btn btn-primary mt-3" onClick={addWorkHistory}>
                            <i className="bi bi-plus me-2"></i>
                            Add Work History
                        </button>
                        <div className = "d-flex justify-content-center mt-5">
                            <button type="submit" className="btn btn-primary" onClick = {submitAllEntries}>Submit All Entries</button>
                        </div>
                    </div>
                </div>
            </div>
        <Footer />
    </div>
  )
}

export default EducationWorkHistory;