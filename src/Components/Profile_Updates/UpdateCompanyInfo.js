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

    async function handleDelete(){

        try{

            const response = await axios.delete("http://localhost:5000/delete/company/" + id);

            if(response){

                localStorage.removeItem("token");
                props.setToken("");
                localStorage.removeItem("userType");
                props.setUserType("");

                navigate("/");

            }

        } catch (error) {

            console.error("Error deleting company account:", error);

        }

    }

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
            <Footer />
        </div>
    );

};

export default UpdateCompanyInfo;