import React, {useState} from "react";
import Header from "../Homepage/Header";
import Footer from "../Homepage/Footer";
import {Link,useNavigate} from "react-router-dom";
import FormElement from "../Form_Elements/FormElement";
import SubHeader from "../Homepage/SubHeader";
import axios from "axios";

function RegistrationIntern(props){

    const navigate = useNavigate();

    const [internInfo,setInternInfo] = useState({
        firstName: "",
        lastName: "",
        age: "",
        professionalTitle: "",
        description: "",
        skills: "",
        dateOfBirth: "",
        emailAddress: "",
        password: "",
        confirmPassword: "",
        location: "",
        address: "",
        school: "",
        department: "",
        gender: "",
        telephone: ""
    });

    
    function handleChange(name, value){

        setInternInfo(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }
        });

    }

   async function handleSubmit(event){

        event.preventDefault();
        
        try{

            const response = await axios.post("http://localhost:5000/register/intern", internInfo);

            if(response.data.token){

                console.log("Registration successful:", response.data)

                const token = response.data.token;
                localStorage.setItem("token", token);
                props.setToken(token);

                const userType = response.data.userType;
                localStorage.setItem("userType", userType);
                props.setUserType(userType);

                const internID = response.data.internID;
                localStorage.setItem("internID", internID);
                props.setInternID(internID);

                navigate("/");

            };


        } catch (error) {

            console.error("Registration error:", error);

        }

    }

    return(
        <div>
            <Header isAuthenticated = {props.isAuthenticated} />
            <SubHeader
                title = "Intern Registration"
                subtitle = "Sign Up and Apply for free on InternConnect!"
            />
            <div className = "container my-5 mx-auto p-3">
                <h2 className = "text-center fw-bold">Intern Registration Portal</h2>
                <div className = "row mt-4">
                    <div className = "col-12">
                        <form className = "registration-form" style = {{width: "75%"}} method = "post" action = "/register/intern">
                            <div  className = "row">
                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "firstName" 
                                        type = "text" 
                                        id = "firstName" 
                                        name = "firstName" 
                                        labelTitle = "First Name"
                                        onChange = {handleChange}
                                        value = {internInfo.firstName}
                                        storedValue = {internInfo.firstName}
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "lastName" 
                                        type = "text" 
                                        id = "lastName" 
                                        name = "lastName" 
                                        labelTitle = "Last Name"
                                        onChange = {handleChange}
                                        value = {internInfo.lastName}
                                    />
                                </div>
                            </div>

                            <div  className = "row">
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

                            <div  className = "row">
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

                            <div className = "row">
                                <div className = "col-12 col-sm-6">  
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

                                <div className = "col-12 col-sm-6">
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

                            <div className = "row">
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

                            <div className = "row">
                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "school" 
                                        type = "text" 
                                        id = "school" 
                                        name = "school" 
                                        labelTitle = "School"
                                        placeholder = "e.g. NAHPI Bambili"
                                        onChange = {handleChange}
                                        value = {internInfo.school}
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "department" 
                                        type = "text" 
                                        id = "department" 
                                        name = "department" 
                                        labelTitle = "Department"
                                        placeholder = "e.g. Computer Engineering"
                                        onChange = {handleChange}
                                        value = {internInfo.department}
                                    />
                                </div>
                            </div>

                            <div className = "row">
                                <div className = "col-12 col-sm-6">
                                    <div className="mb-3">
                                        <label for="skillsRequired" class="form-label fw-bold">My Skill(s)</label>
                                        <textarea
                                            className="form-control"
                                            placeholder = "e.g. Web Development, Graphic Design, etc." 
                                            id="skills" 
                                            rows="4" 
                                            value = {`${internInfo.skills}`}
                                            name = "skills"
                                            onChange={(event) => {
                                                handleChange(event.target.name, event.target.value)
                                            }}
                                        ></textarea> 
                                    </div>
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

                                    <div>
                                        <label>Gender</label>
                                    </div>

                                    <div className ="form-check form-check-inline mb-3">
                                        <input 
                                            className ="form-check-input" 
                                            type="radio" 
                                            name="gender" 
                                            id="male" 
                                            value = "male" 
                                            checked = {internInfo.gender === "male"} 
                                            onChange = {(event) => {
                                                    handleChange(event.target.name,event.target.value)
                                                }
                                            } 
                                            required
                                        />
                                        <label className ="form-check-label" for="male">Male</label>
                                    </div>

                                    <div className ="form-check form-check-inline mb-3">
                                        <input 
                                            className ="form-check-input" 
                                            type="radio" 
                                            name="gender" 
                                            id="female" 
                                            value = "female" 
                                            checked = {internInfo.gender === "female"} 
                                            onChange = {(event) => {
                                                    handleChange(event.target.name,event.target.value)
                                                }
                                            } 
                                            required
                                        />
                                        <label className ="form-check-label" for="female">Female</label>
                                    </div>
                                </div>
                            </div>
                                   
                            <div id = "submitButton" className = "mt-5">
                                <button type = "submit" className ="btn btn-primary" onClick = {handleSubmit}>Sign Up</button>
                            </div>

                            <div className = "text-center mt-3" style = {{fontSize: "14px"}}>
                                Already registered? <Link to = "/login" style = {{textDecoration: "none", color: "#2980B9"}}>Login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )

}

export default RegistrationIntern;