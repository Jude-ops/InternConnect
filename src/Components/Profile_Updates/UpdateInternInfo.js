import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import FormElement from "../Form_Elements/FormElement";
import Header from "../Homepage/Header";
import Footer from "../Homepage/Footer";
import SubHeader from "../Homepage/SubHeader";
import InternProfileNavbar from "../Intern_Profile/InternProfileNavbar";
import axios from "axios";

function UpdateInternInfo(props){

    const navigate = useNavigate();
    const {id} = useParams();

    const [image, setImage] = useState(null); //Image file to be uploaded
    const [selectedFile, setSelectedFile] = useState(null); //Image file to be sent to the server
    const [educationHistory, setEducationHistory] = useState([]);
    const [workExperience, setWorkExperience] = useState([]);
    const [internID, setInternID] = useState(null);

    const [internInfo, setInternInfo] = useState({
        fullName: "",
        emailAddress: "",
        dateOfBirth: "",
        age: "",
        professionalTitle: "",
        description: "",
        skills: "",
        password: "",
        confirmPassword: "",
        location: "",
        address: "",
        school: "",
        department: "",
        telephone: "",
    });

    useEffect(() => {

        const internID = localStorage.getItem("internID");
        setInternID(internID);

        async function fetchEducationInfo(){ 
            try{
                const response = await axios.get(`http://localhost:5000/intern/${internID}/education/`);
                if(response){
                    setEducationHistory(response.data);
                }
            } catch (error) {
                console.error("Error fetching education info:", error);
            }
        }

        async function fetchWorkExperienceInfo(){
            try{
                const response = await axios.get(`http://localhost:5000/intern/${internID}/work_experience/`);
                if(response){
                    setWorkExperience(response.data);
                }
            } catch (error) {
                console.error("Error fetching work experience info:", error);
            }
        }

        async function fetchInternInfo(){

            try{
                const response = await axios.get("http://localhost:5000/intern/" + internID);
                if(response){
                    console.log(response.data);
                    
                    //Retrieve profile image and set it to the state variable image
                    const profileImage = response.data[0].profile_image;
                    const profileImagePath = "http://localhost:5000/uploads/" + profileImage;
                    setImage(profileImagePath);

                    //Convert retrieved date of birth to a string
                    const dateOfBirth = new Date(response.data[0].date_of_birth);
                    const offset = dateOfBirth.getTimezoneOffset();
                    dateOfBirth.setMinutes(dateOfBirth.getMinutes() - offset);
                    const dateOfBirthString = dateOfBirth.toISOString().split("T")[0];

                    setInternInfo((prevValue) => {
                        return{
                            ...prevValue,
                            fullName: response.data[0].first_name + " " + response.data[0].last_name,
                            emailAddress: response.data[0].email_address,
                            dateOfBirth: dateOfBirthString,
                            age: response.data[0].age,
                            professionalTitle: response.data[0].professional_title,
                            description: response.data[0].short_bio,
                            location: response.data[0].location,
                            address: response.data[0].address,
                            school: response.data[0].school,
                            department: response.data[0].department,
                            telephone: response.data[0].telephone,
                            skills: response.data[0].skills
                        }
                    })
                }
            } catch (error) {
                console.error("Error fetching intern info:", error);
            }

        }

        fetchInternInfo();
        fetchEducationInfo();
        fetchWorkExperienceInfo();

    }, [id]);

    function handleChange(name, value){

        setInternInfo(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }
        });

    };

    function handleEducationChange(index, name, value){ 
        const values = [...educationHistory];
        values[index][name] = value;
        setEducationHistory(values);
    }

    function handleWorkExperienceChange(index, name, value){
        const values = [...workExperience];
        values[index][name] = value;
        setWorkExperience(values);
    }

    function handleImageChange(event){
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result);
        }

        if(file){
            reader.readAsDataURL(file);
            setSelectedFile(file);
        } else {
            setImage(null);
            setSelectedFile(null);
        }
    }

    async function handleSubmit(event){
        event.preventDefault();

        try{

            //Update education history
            for(let i = 0; i < educationHistory.length; i++){
                const education = educationHistory[i];
                const response = await axios.put(`http://localhost:5000/update/intern/${internID}/education/${education.education_id}`, education);
                if(response){
                    console.log("Education history updated successfully!");
                }
            }

            //Update work experience
            for(let i = 0; i < workExperience.length; i++){
                const work = workExperience[i];
                const response = await axios.put(`http://localhost:5000/update/intern/${internID}/work_experience/${work.work_id}`, work);
                if(response){
                    console.log("Work experience updated successfully!");
                }
            }

            const internInfoUpdate = new FormData();
            const profileImage = selectedFile;

            for (let key in internInfo){
                internInfoUpdate.append(key, internInfo[key]);
            }

            if(profileImage){
                internInfoUpdate.append("profileImage", profileImage);
            }

           const response =  await axios.put("http://localhost:5000/update/intern/" + id, internInfoUpdate, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }       
           });

            if(response){
                navigate("/");
            }

        } catch (error) {

            console.error("Error updating intern info:", error);

        }

    };

    async function handleDelete(){

        try{

            const response = await axios.delete("http://localhost:5000/delete/intern/" + id);

            if(response){

                localStorage.removeItem("token");
                props.setToken("");
                localStorage.removeItem("userType");
                props.setUserType("");

                navigate("/");

            }

        } catch (error) {

            console.error("Error deleting intern info:", error);

        }

    };

    return (
        <div>
            <Header isAuthenticated = {props.isAuthenticated} />
            <SubHeader 
                title = "Update Intern Info"
                subtitle = "Update your credentials to get the best out of your internship experience!"
            />
            <div className = "container my-5 mx-auto p-3">
                
                <div className = "row mt-4">
                    <div className = "col-12 col-md-4">
                        <InternProfileNavbar logout = {props.logout} />
                    </div>

                    <div className = "col-12 col-md-8">

                        <form className = "registration-form mt-4 mt-md-0">

                            <div className = "profile-image-container mb-3">
                                <div className = "resume-image mb-3">
                                    <img 
                                        src = {image ? image : "https://via.placeholder.com/150"}
                                        alt = "Profile" 
                                        className = "profile-image"
                                    />
                                </div>

                                <div className = "text-center" style = {{width: "200px", margin: "0 auto"}}>
                                    <label htmlFor = "profileImageUpload" className = " fw-bold text-uppercase btn btn-primary">
                                        <i className = "bi bi-pencil-fill me-2"></i>
                                        Edit
                                    </label>
                                    <input 
                                        type = "file" 
                                        id = "profileImageUpload" 
                                        className = "form-control"
                                        name = "profileImage" 
                                        accept = "image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>

                            <div className = "mt-5">
                                <h4 className = "fw-bold h4-responsive" style = {{color: "#2980B9"}}>My Profile</h4>
                            </div>
                            
                            <hr className = "line-divider" />

                            <div className = "row mb-3">

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "fullName" 
                                        type = "text" 
                                        id = "fullName" 
                                        name = "fullName" 
                                        labelTitle = "Full Name"
                                        onChange = {handleChange}
                                        value = {internInfo.fullName}
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "professionalTitle" 
                                        type = "text" 
                                        id = "professionalTitle" 
                                        name = "professionalTitle" 
                                        labelTitle = "Professional Title"
                                        onChange = {handleChange}
                                        value = {internInfo.professionalTitle}
                                    />
                                </div>

                            </div> 

                            <div className = "row mb-3">

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "dateOfBirth" 
                                        type = "date" 
                                        id = "dateOfBirth" 
                                        name = "dateOfBirth" 
                                        labelTitle = "Date of Birth"
                                        onChange = {handleChange}
                                        value = {internInfo.dateOfBirth}
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "age" 
                                        type = "number" 
                                        id = "age" 
                                        name = "age" 
                                        labelTitle = "Age"
                                        onChange = {handleChange}
                                        value = {internInfo.age}
                                    />
                                </div>

                            </div> 

                            <div className="mb-3">
                                <label for="description" className="form-label fw-bold">Short Description</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name = "description"
                                    placeholder = "Tell Us a Little About Yourself..."
                                    rows="6"
                                    value = {`${internInfo.description}`}
                                    onChange = {(event) => {
                                        handleChange(event.target.name, event.target.value)
                                    }}
                                ></textarea>
                            </div>

                            <div className = "mt-5">
                                <h4 className = "fw-bold h4-responsive" style = {{color: "#2980B9"}}>Contact Information</h4>
                            </div>
                            <hr className = "line-divider" />

                            <div className = "row mb-3">
                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "emailAddress" 
                                        type = "email" 
                                        id = "emailAddress" 
                                        name = "emailAddress" 
                                        labelTitle = "Email Address"
                                        onChange = {handleChange}
                                        value = {internInfo.emailAddress}
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "telephone" 
                                        type = "tel" 
                                        id = "telephone" 
                                        name = "telephone" 
                                        labelTitle = "Telephone"
                                        placeholder = "e.g. 678123456"
                                        onChange = {handleChange}
                                        value = {internInfo.telephone}
                                    />
                                </div>

                            </div>
                            
                            <div className = "row mb-3">
                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "location" 
                                        type = "text" 
                                        id = "location" 
                                        name = "location" 
                                        labelTitle = "Location(City)"
                                        placeholder = "e.g. Bamenda"
                                        onChange = {handleChange}
                                        value = {internInfo.location}
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "address" 
                                        type = "text" 
                                        id = "address" 
                                        name = "address" 
                                        labelTitle = "Address"
                                        placeholder = "e.g. Mile 2 Nkwen"
                                        onChange = {handleChange}
                                        value = {internInfo.address}
                                    />
                                </div>
                            </div>

                            <div className = "mt-5">
                                <h4 className = "fw-bold h4-responsive" style = {{color: "#2980B9"}}>Education History</h4>
                            </div>
                            <hr className = "line-divider" />

                            {educationHistory.map((education, index) => {
                                return(
                                    <div className = "row mb-3" key = {index}>
                                        <h6 className = "fw-bold h5-responsive" style = {{color: "#2980B9"}}>Education {index + 1}</h6>
                                        <div><hr className = "line-divider" style = {{width: "17%", marginTop:"0"}}/></div>
                                        <div className = "col-12 col-sm-6 mb-3">
                                            <label for="school" className="form-label fw-bold">School Name</label>
                                            <input 
                                                type = "text"
                                                className = "form-control"
                                                id = "school"
                                                name = "school_name"
                                                placeholder = "e.g. University of Buea"
                                                onChange = {(event) => handleEducationChange(index, event.target.name, event.target.value)}
                                                value = {education.school_name}
                                            />
                                        </div>
                                        <div className = "col-12 col-sm-6">
                                            <label for = "department" className = "form-label fw-bold">Department</label>
                                            <input
                                                type = "text"
                                                className = "form-control"
                                                id = "department"
                                                name = "department"
                                                placeholder = "e.g. Computer Science"
                                                onChange = {(event) => handleEducationChange(index, event.target.name, event.target.value)}
                                                value = {education.department}
                                            />
                                        </div>
                                        <div className = "col-12 col-sm-6 mb-3">
                                            <label for = "degree" className = "form-label fw-bold">Degree</label>
                                            <input
                                                type = "text"
                                                id = "degree"
                                                className = "form-control"
                                                name = "degree"
                                                placeholder = "e.g. BSc"
                                                onChange = {(event) => handleEducationChange(index, event.target.name, event.target.value)}
                                                value = {education.degree}
                                            />
                                        </div>
                                        <div className = "col-12 col-sm-6">
                                            <label for = "end_date" className = "form-label fw-bold">Graduation Date</label>
                                            <input
                                                type = "date"
                                                id = "end_date"
                                                name = "end_date"
                                                className = "form-control"
                                                placeholder = "e.g. 2021-12-31"
                                                onChange = {(event) => handleEducationChange(index, event.target.name, event.target.value)}
                                                value = {
                                                    //Convert date to string
                                                    (() => {
                                                        const date = new Date(education.end_date);
                                                        const year = date.getFullYear();
                                                        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-indexed in JS
                                                        const day = ('0' + date.getDate()).slice(-2);
                                                        return `${year}-${month}-${day}`;
                                                    })()
                                                }
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            <div className = "mt-5">
                                <h4 className = "fw-bold h4-responsive" style = {{color: "#2980B9"}}>Work History</h4>
                            </div>
                            <hr className = "line-divider" />

                            {workExperience.map((work, index) => {
                                return(
                                    <div className = "row mb-3" key = {index}>
                                        <h6 className = "fw-bold h5-responsive" style = {{color: "#2980B9"}}>Work Experience {index + 1}</h6>
                                        <div><hr className = "line-divider" style = {{width: "17%", marginTop:"0"}}/></div>
                                        <div className = "col-12 col-sm-6 mb-3">
                                            <label for = "companyName" className = "form-label fw-bold">Company Name</label>
                                            <input
                                                type = "text"
                                                className = "form-control"
                                                id = "companyName"
                                                name = "company_name"
                                                placeholder = "e.g. Google"
                                                onChange = {(event) => handleWorkExperienceChange(index, event.target.name, event.target.value)}
                                                value = {work.company_name}
                                            />
                                        </div>
                                        <div className = "col-12 col-sm-6">
                                            <label for = "position" className = "form-label fw-bold">Position</label>
                                            <input
                                                type = "text"
                                                className = "form-control"
                                                id = "position"
                                                name = "position"
                                                placeholder = "e.g. Software Engineer"
                                                onChange = {(event) => handleWorkExperienceChange(index, event.target.name, event.target.value)}
                                                value = {work.position}
                                            />
                                        </div>
                                        <div className = "col-12 col-sm-6 mb-3">
                                            <label for = "startDate" className = "form-label fw-bold">Start Date</label>
                                            <input
                                                type = "date"
                                                className = "form-control"
                                                id = "startDate"
                                                name = "start_date"
                                                placeholder = "e.g. 2021-12-31"
                                                onChange = {(event) => handleWorkExperienceChange(index, event.target.name, event.target.value)}
                                                value = {
                                                    //Convert date to string
                                                    (() => {
                                                        const date = new Date(work.start_date);
                                                        const year = date.getFullYear();
                                                        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-indexed in JS
                                                        const day = ('0' + date.getDate()).slice(-2);
                                                        return `${year}-${month}-${day}`;
                                                    })()
                                                }
                                            />
                                        </div>
                                        <div className = "col-12 col-sm-6">
                                            <label for = "endDate" className = "form-label fw-bold">End Date</label>
                                            <input
                                                type = "date"
                                                className = "form-control"
                                                id = "endDate"
                                                name = "end_date"
                                                placeholder = "e.g. 2021-12-31"
                                                onChange = {(event) => handleWorkExperienceChange(index, event.target.name, event.target.value)}
                                                value = {
                                                    //Convert date to string
                                                    (() => {
                                                        const date = new Date(work.end_date);
                                                        const year = date.getFullYear();
                                                        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-indexed in JS
                                                        const day = ('0' + date.getDate()).slice(-2);
                                                        return `${year}-${month}-${day}`;
                                                    })()
                                                }
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="mb-4 mt-4">
                                <label for="skills" class="form-label fw-bold">Skill(s)</label>
                                <textarea
                                    className="form-control" 
                                    id="skills" 
                                    rows="4" 
                                    value = {`${internInfo.skills}`}
                                    name = "skills"
                                    onChange={(event) => {
                                        handleChange(event.target.name, event.target.value)
                                    }}
                                ></textarea> 
                            </div>

                            <div className = "mt-5">
                                <h4 className = "fw-bold h4-responsive" style = {{color: "#2980B9"}}>Change Your Password (Optional)</h4>
                            </div>
                            <hr className = "line-divider" />

                            <h6 className = "text-muted h6-responsive">
                                If you don't wish to change your password, enter your old password in the password field and leave the confirm password field empty.
                            </h6>

                            <div className = "row mb-3">
                                <div className = "col-12 col-sm-5">  
                                    <FormElement 
                                        labelFor = "password" 
                                        type = "password" 
                                        id = "password" 
                                        name = "password" 
                                        labelTitle = "Password"
                                        onChange = {handleChange}
                                        value = {internInfo.password}
                                    />
                                </div>

                                <div className = "col-12 col-sm-5">
                                    <FormElement 
                                        labelFor = "confirmPassword" 
                                        type = "password" 
                                        id = "confirmPassword" 
                                        name = "confirmPassword" 
                                        labelTitle = "Confirm Password"
                                        onChange = {handleChange}
                                        value = {internInfo.confirmPassword}
                                    />
                                </div>
                            </div>
      
                            <div id = "submitButton" className = "mt-5">
                                <button type = "submit" className ="btn btn-primary" onClick = {handleSubmit}>Update</button>
                            </div>

                        </form>

                        <div className = "col-12 text-center mt-5">
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Delete Account
                            </button>

                            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header text-center">
                                            <h1 class="modal-title w-100 fs-5" id="exampleModalLabel">Delete Account</h1>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            Are you sure you want to delete your account?<br />
                                            This action cannot be reversed!
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                            <button type="button" class="btn btn-danger" onClick={handleDelete}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

};

export default UpdateInternInfo;