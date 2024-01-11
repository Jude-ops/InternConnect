import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import FormElement from "../Form_Elements/FormElement";
import Header from "../Homepage/Header";
import Footer from "../Homepage/Footer";
import axios from "axios";

function UpdateCompanyInfo(props){

    const navigate = useNavigate();
    const {id} = useParams();

    const [companyInfo, setCompanyInfo] = useState({

        emailAddress: "",
        password: "",
        confirmPassword: "",
        telephone: "",

    });

    function handleChange(name, value){

        setCompanyInfo(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }
        });

    };

    async function handleSubmit(event){

        event.preventDefault();

        try{

           const response =  await axios.put("http://localhost:5000/update/company/" + id, companyInfo);

            if(response){

                //navigate("/profile/company/" + id);
                navigate("/");

            }

        } catch (error) {

            console.error("Error updating company info:", error);

        }

    };

    return (
        <div>
            <Header isAuthenticated = {props.isAuthenticated}/>
            <div className = "container my-5 mx-auto p-3" style = {{width:"480px"}}>
                <h3 className = "text-center fw-bold h3-responsive">Update your Credentials!</h3>
                <div className = "row mt-4">
                    <form className = "registration-form">

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
                            <button type = "submit" className ="btn btn-primary" onClick = {handleSubmit}>Save</button>
                        </div>

                    </form>

                </div>
            </div>
            <Footer />
        </div>
    );

};

export default UpdateCompanyInfo;