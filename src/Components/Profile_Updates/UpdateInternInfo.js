import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import FormElement from "../Form_Elements/FormElement";
import Header from "../Homepage/Header";
import Footer from "../Homepage/Footer";
import axios from "axios";

function UpdateInternInfo(props){

    const navigate = useNavigate();
    const {id} = useParams();

    const [internInfo, setInternInfo] = useState({

        emailAddress: "",
        password: "",
        confirmPassword: "",
        location: "",
        address: "",
        telephone: "",


    });


    function handleChange(name, value){

        setInternInfo(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }
        });

    };

    async function handleSubmit(event){

        event.preventDefault();

        try{

           const response =  await axios.put("http://localhost:5000/update/intern/" + id, internInfo);

            if(response){

                //navigate("/profile/intern/" + id);
                navigate("/");

            }

        } catch (error) {

            console.error("Error updating intern info:", error);

        }

    };

    return (
        <div>
            <Header isAuthenticated = {props.isAuthenticated} />
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
                            value = {internInfo.emailAddress}
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
                            <button type = "submit" className ="btn btn-primary" onClick = {handleSubmit}>Save</button>
                        </div>

                    </form>

                </div>
            </div>
            <Footer />
        </div>
    );

};

export default UpdateInternInfo;