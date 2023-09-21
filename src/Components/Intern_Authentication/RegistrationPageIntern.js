import React, {useState} from "react";
import Header from "../Homepage/Header";
import Footer from "../Homepage/Footer";
import {Link,useNavigate} from "react-router-dom";
import FormElement from "../Form_Elements/FormElement";
import axios from "axios";

function RegistrationIntern(){

    const navigate = useNavigate();

    const [internInfo,setInternInfo] = useState({
        firstName: "",
        lastName: "",
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
            console.log(response.data);
            if(response.data === "success"){
                navigate("/login");
            }else{
                alert("Registration failed");
            }


        } catch (error) {

            console.error("Registration error:", error);

        }

    }

    return(
        <div>
            <Header />
            <div className = "container my-5 mx-auto p-3" style = {{width:"480px"}}>
                <h3 className = "text-center fw-bold h3-responsive">Sign-up and apply for free on InternConnect!</h3>
                <div className = "row mt-4">
                        <form className = "registration-form" method = "post" action = "/register/intern">

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
                                        labelFor = "emailAddress" 
                                        type = "email" 
                                        id = "emailAddress" 
                                        name = "emailAddress" 
                                        labelTitle = "Email Address"
                                        onChange = {handleChange}
                                        value = {internInfo.emailAddress}
                                    />
                                </div>
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

                            <div id = "submitButton" className = "mt-5">
                                <button type="submit" className ="btn btn-primary" onClick = {handleSubmit}>Sign Up</button>
                            </div>

                            <div className = "text-center mt-3" style = {{fontSize: "14px"}}>
                                Already registered? <Link to = "/login" style = {{textDecoration: "none"}}>Login</Link>
                            </div>
                          
                        </form>
                </div>
            </div>
            <Footer />
        </div>
    )

}

export default RegistrationIntern;