import React, {useState} from "react";
import Header from "../Homepage/Header";
import Footer from "../Homepage/Footer";
import {Link,useNavigate} from "react-router-dom";
import FormElement from "../Form_Elements/FormElement";
import SubHeader from "../Homepage/SubHeader";
import axios from "axios";

function RegistrationIntern(props){

    const navigate = useNavigate();

    const [description1Touched, setDescription1Touched] = useState(false);
    const [description2Touched, setDescription2Touched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
        gender: "",
        telephone: ""
    });

    function handleDescriptionBlur(event){
        const {name} = event.target;
        if(name === "description"){
            setDescription1Touched(true);
        } else if(name === "skills"){
            setDescription2Touched(true);
        }
    };

    function toggleShowPassword(){
        setShowPassword(!showPassword);
    }
    
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

            //Verify if all input fields are filled and valid before sending a POST request
           const form = event.target.closest("form")
           if(!form.checkValidity()){
            form.reportValidity();
            return;
           }

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

                const userId = response.data.userId;
                localStorage.setItem("userId", userId);
                props.setUserId(userId);

                const firstName = response.data.firstName;
                localStorage.setItem("firstName", firstName);
                props.setFirstName(firstName);

                navigate(`/intern/${internID}/education_work_history`);

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
                <h2 className = "text-center fw-bold" style = {{color: "#2980B9"}}>Intern Registration Portal</h2>
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
                                        errorMessage = "Input field should not be empty!"
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
                                        errorMessage = "Input field should not be empty!"
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
                                        errorMessage = {internInfo.emailAddress === "" ? "Input field should not be empty!" : "Invalid email address!"}
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
                                        errorMessage = "Input field should not be empty!"
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
                                        errorMessage = "Input field should not be empty!"
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
                                        errorMessage = "Input field should not be empty!"
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label for="description" className="form-label fw-bold">Short Description</label>
                                <textarea
                                    required
                                    className="form-control"
                                    id="description"
                                    name = "description"
                                    placeholder = "Tell Us a Little About Yourself..."
                                    rows="6"
                                    value = {`${internInfo.description}`}
                                    onChange = {(event) => {
                                        handleChange(event.target.name, event.target.value)
                                    }}
                                    onBlur = {handleDescriptionBlur}
                                    isTouched = {description1Touched ? "true" : "false"}
                                ></textarea>
                                <p className = "reg-error-message">Input field should not be empty!</p>
                            </div>

                            <div className = "row">
                                <div className = "col-12 col-sm-6">  
                                    <FormElement 
                                        labelFor = "password" 
                                        type = {showPassword ? "text" : "password"}
                                        id = "password" 
                                        name = "password" 
                                        labelTitle = "Password"
                                        onChange = {handleChange}
                                        value = {internInfo.password}
                                        // Password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
                                        pattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#%*?&])[A-Za-z\d@!#%*?&]{8,}$" 
                                        errorMessage = {internInfo.password === "" ? "Input field should not be empty!" : "Password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character!"}
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "confirmPassword" 
                                        type = {showPassword ? "text" : "password"} 
                                        id = "confirmPassword" 
                                        name = "confirmPassword" 
                                        labelTitle = "Confirm Password"
                                        onChange = {handleChange}
                                        value = {internInfo.confirmPassword}
                                        pattern = {internInfo.password}
                                        errorMessage = {internInfo.confirmPassword === "" ? "Input field should not be empty" : "Passwords do not match!"}
                                    />
                                </div>
                                <div className = "col-12 mb-3">
                                    <input 
                                        type = "checkbox"
                                        id = "showPassword"
                                        checked = {showPassword}
                                        onChange = {toggleShowPassword}
                                        className = "form-check-input me-2"
                                    />
                                    <label htmlFor="showPassword" className = "form-check-label fw-bold">Show Password</label>
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
                                        errorMessage = "Input field should not be empty!"
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
                                        errorMessage = "Input field should not be empty!"
                                    />
                                </div>
                            </div>

                            <div className = "row">
                                <div className = "col-12 col-sm-6">
                                    <div className="mb-3">
                                        <label for="skillsRequired" class="form-label fw-bold">My Skill(s)</label>
                                        <textarea
                                            required
                                            className="form-control"
                                            placeholder = "e.g. Web Development, Graphic Design, etc." 
                                            id="skills" 
                                            rows="4" 
                                            value = {`${internInfo.skills}`}
                                            name = "skills"
                                            onChange={(event) => {
                                                handleChange(event.target.name, event.target.value)
                                            }}
                                            onBlur={handleDescriptionBlur}
                                            isTouched = {description2Touched ? "true" : "false"}
                                        ></textarea>
                                        <p className = "reg-error-message">Input field should not be empty!</p> 
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
                                        pattern = "^[6]{1}[0-9]{8}$" // Telephone number should start with 6 and have 9 digits
                                        errorMessage = {internInfo.telephone === "" ? "Input field should not be empty!" : "Telephone number should start with 6 and have 9 digits!"}
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
                                    <p className = "reg-error-message">At least one box should be checked!</p>
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