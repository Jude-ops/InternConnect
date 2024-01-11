import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Homepage/Header";
import Footer from "../Homepage/Footer";
import FormElement from "../Form_Elements/FormElement";
import axios from "axios";

function RegistrationCompany(props){

    const navigate = useNavigate();

    const [companyInfo, setCompanyInfo] = useState({

        fullName: "",
        emailAddress: "",
        password: "",
        confirmPassword: "",
        location: "",
        address: "",
        telephone: ""

    });

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

        try{

            const response = await axios.post("http://localhost:5000/register/company", companyInfo);
            console.log(response);

            if(response.data.token){

                const token = response.data.token;
                localStorage.setItem("token", token);
                props.setToken(token);
                navigate("/");

            };

        } catch (error) {

            console.error("Registration error:", error);

        }

    }

    return(
        <div>
             <Header isAuthenticated = {props.isAuthenticated} />
            <div className = "container my-5 p-3" style = {{width:"480px"}}>
                <h3 className = "text-center fw-bold h3-responsive">Hire interns and freshers faster on InternConnect! </h3>
                <div className = "row mt-4">
                        <form className = "registration-form" method = "post" action = "/register/company">

                            <FormElement 
                                labelFor = "fullName" 
                                type = "text" 
                                id = "fullName" 
                                name = "fullName" 
                                labelTitle = "Company full name"
                                onChange = {handleChange}
                                value = {companyInfo.fullName}
                            />

                            <FormElement 
                                labelFor = "emailAddress" 
                                type = "email" 
                                id = "emailAddress" 
                                name = "emailAddress" 
                                labelTitle = "Email Address"
                                onChange = {handleChange}
                                value = {companyInfo.emailAddress}
                            />

                            <div className = "row">
                                <div className = "col-12 col-sm-6">  
                                    <FormElement 
                                        labelFor = "password" 
                                        type = "password" 
                                        id = "password" 
                                        name = "password" 
                                        labelTitle = "Password"
                                        onChange = {handleChange}
                                        value = {companyInfo.password}
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
                                        value = {companyInfo.confirmPassword}
                                    />
                                </div>
                            </div>

                            <FormElement 
                                labelFor = "location" 
                                type = "text" 
                                id = "location" 
                                name = "location" 
                                labelTitle = "Location(City)"
                                placeholder = "e.g. Bamenda"
                                onChange = {handleChange}
                                value = {companyInfo.location}
                            />

                            <FormElement 
                                labelFor = "address" 
                                type = "text" 
                                id = "address" 
                                name = "address" 
                                labelTitle = "Address"
                                placeholder = "e.g. Mile 2 Nkwen"
                                onChange = {handleChange}
                                value = {companyInfo.address}
                            />

                            <FormElement 
                                labelFor = "telephone" 
                                type = "tel" 
                                id = "telephone" 
                                name = "telephone" 
                                labelTitle = "Telephone"
                                placeholder = "e.g. 678123456"
                                onChange = {handleChange}
                                value = {companyInfo.telephone}
                            />

                            <div id = "submitButton" className = "mt-5">
                                <button type="submit" className="btn btn-primary" onClick = {handleSubmit}>Sign Up</button>
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

export default RegistrationCompany;