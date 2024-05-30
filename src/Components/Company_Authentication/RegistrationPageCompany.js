import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Homepage/Header";
import Footer from "../Homepage/Footer";
import FormElement from "../Form_Elements/FormElement";
import SubHeader from "../Homepage/SubHeader";
import axios from "axios";

function RegistrationCompany(props){

    const navigate = useNavigate();

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
                <h3 className = "text-center fw-bold h3-responsive">Company Registration Portal</h3>
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
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "website" 
                                        type = "text" 
                                        id = "website" 
                                        name = "website" 
                                        labelTitle = "Website"
                                        onChange = {handleChange}
                                        value = {companyInfo.website}
                                    />
                                </div>
                            </div>

                            <div className = "mb-3">
                                <label for="description" className="form-label fw-bold">Company Description</label>
                                <textarea 
                                    className="form-control" 
                                    id="description" 
                                    rows="6" 
                                    value = {`${companyInfo.description}`}
                                    name = "description"
                                    onChange={(event) => {
                                        handleChange(event.target.name, event.target.value)
                                    }}
                                ></textarea>
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