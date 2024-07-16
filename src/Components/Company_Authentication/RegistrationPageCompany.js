import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Homepage/Header";
import Footer from "../Homepage/Footer";
import FormElement from "../Form_Elements/FormElement";
import SubHeader from "../Homepage/SubHeader";
import axios from "axios";

function RegistrationCompany(props){

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [descriptionTouched, setDescriptionTouched] = useState(false);
    const [companyInfo, setCompanyInfo] = useState({
        fullName: "",
        emailAddress: "",
        dateFounded: "",
        website: "",
        password: "",
        confirmPassword: "",
        location: "",
        address: "",
        telephone: "",
        description: "",
    });

    function handleDescriptionBlur(){
        setDescriptionTouched(true);
    }

    function toggleShowPassword(){
        setShowPassword(!showPassword);
    }

    function handleChange(name, value){

        setCompanyInfo(prevValue => {

            return {
                ...prevValue,
                [name]: value
            }

        });

    }

    async function handleSubmit(event){
        event.preventDefault();

        //Verify that all input fields are filled and valide before sending a POST request
        const form = event.target.closest("form")
        if(!form.checkValidity()){
            form.reportValidity();
            return;
        }

        try{

            const response = await axios.post("http://localhost:5000/register/company", companyInfo);
            console.log(response);

            if(response){

                console.log("Registration successful!", response.data);

                const token = response.data.token;
                localStorage.setItem("token", token);
                props.setToken(token);

                const userType = response.data.userType;
                localStorage.setItem("userType", userType);
                props.setUserType(userType);

                const companyID = response.data.companyID;
                localStorage.setItem("companyID", companyID);
                props.setCompanyID(companyID);

                const userId = response.data.userId;
                localStorage.setItem("userId", userId);
                props.setUserId(userId);

                //Get first name from full name
                const fullName = response.data.fullName.split(" ");
                const firstName = fullName[0];
                localStorage.setItem("firstName", firstName);
                props.setFirstName(firstName);

                
                navigate(`/update/company/${companyID}`);

            };


        } catch (error) {

            console.error("Registration error:", error);

        }

    }

    return(
        <div>
            <Header isAuthenticated = {props.isAuthenticated} />
            <SubHeader
                title = "Company Registration"
                subtitle = "Hire interns and freshers faster on InternConnect!"
            />
            <div className = "container my-5 p-3">
                <h3 className = "text-center fw-bold h3-responsive" style = {{color: "#2980B9"}}>Company Registration Portal</h3>
                <div className = "row mt-4">
                    <div className = "col-12">
                        <form className = "registration-form" style = {{width: "75%"}} method = "post" action = "/register/company">
                            <div className = "row">
                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "fullName" 
                                        type = "text" 
                                        id = "fullName" 
                                        name = "fullName" 
                                        labelTitle = "Company full name"
                                        onChange = {handleChange}
                                        value = {companyInfo.fullName}
                                        errorMessage = "Input field should not be empty!"
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "emailAddress" 
                                        type = "email" 
                                        id = "emailAddress" 
                                        name = "emailAddress" 
                                        labelTitle = "Email Address"
                                        onChange = {handleChange}
                                        value = {companyInfo.emailAddress}
                                        errorMessage = {companyInfo.emailAddress === "" ? "Input field should not be empty!" : "Invalid email address!"}
                                    />
                                </div>
                            </div>

                            <div className = "row">
                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "dateFounded" 
                                        type = "date" 
                                        id = "dateFounded" 
                                        name = "dateFounded" 
                                        labelTitle = "Date Founded"
                                        onChange = {handleChange}
                                        value = {companyInfo.dateFounded}
                                        errorMessage = "Input field should not be empty!"
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "website" 
                                        type = "url" 
                                        id = "website" 
                                        name = "website" 
                                        labelTitle = "Website"
                                        onChange = {handleChange}
                                        value = {companyInfo.website}
                                        errorMessage = {companyInfo.website === "" ? "Input field should not be empty!" : "Please enter a valid URL!"}
                                    />
                                </div>
                            </div>

                            <div className = "mb-3">
                                <label for="description" className="form-label fw-bold">Company Description</label>
                                <textarea 
                                    required
                                    className="form-control" 
                                    id="description" 
                                    rows="6" 
                                    value = {`${companyInfo.description}`}
                                    name = "description"
                                    onChange={(event) => {
                                        handleChange(event.target.name, event.target.value)
                                    }}
                                    onBlur = {handleDescriptionBlur}
                                    isTouched = {descriptionTouched ? "true" : "false"}
                                ></textarea>
                                <p className = "reg-error-message">Input field should not be empty!</p>
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
                                        value = {companyInfo.location}
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
                                        value = {companyInfo.address}
                                        errorMessage = "Input field should not be empty!"
                                    />
                                </div>
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
                                        value = {companyInfo.password}
                                        pattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#%*?&])[A-Za-z\d@!#%*?&]{8,}$"
                                        errorMessage = {companyInfo.password === "" ? "Input field should not be empty!" : "Password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character!"}
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
                                        value = {companyInfo.confirmPassword}
                                        pattern = {companyInfo.password}
                                        errorMessage = {companyInfo.confirmPassword === "" ? "Input field should not be empty!" : "Passwords do not match!"}
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

                            <FormElement 
                                labelFor = "telephone" 
                                type = "tel" 
                                id = "telephone" 
                                name = "telephone" 
                                labelTitle = "Telephone"
                                placeholder = "e.g. 678123456"
                                onChange = {handleChange}
                                value = {companyInfo.telephone}
                                pattern = "^[6]{1}[0-9]{8}$"
                                errorMessage = {companyInfo.telephone === "" ? "Input field should not be empty!" : "Telephone number should start with 6 and have 9 digits!"}
                            />

                            <div id = "submitButton" className = "mt-5">
                                <button type="submit" className="btn btn-primary" onClick = {handleSubmit}>Sign Up</button>
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

export default RegistrationCompany;