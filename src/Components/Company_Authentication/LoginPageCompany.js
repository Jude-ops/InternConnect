import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import FormElement from "../Form_Elements/FormElement";
import axios from "axios";

function LoginCompany(props){

    const navigate = useNavigate();

    const style = {
        color: props.clicked ? "#2980B9" : "black",
        borderBottom: props.clicked ? "2px solid #2980B9" : "none"
    }

    const [showPassword, setShowPassword] = useState(false);
    const [companyLoginInfo, setCompanyLoginInfo] = useState({
        emailAddress: "",
        password: ""
    })

    function handleChange(name, value){
        setCompanyLoginInfo(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }
        })
    }

    function toggleShowPassword(){
        setShowPassword(!showPassword);
    }

    async function handleLogin(event){

        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/login", companyLoginInfo);

            if(response.data.token){

                const userType = response.data.userType;
                //If userType is not company, redirect to intern login page
                if(userType !== "company"){
                    alert("You are not a company. Please login as an intern.");
                    props.onIntern();
                    return;
                }

                const token = response.data.token;
                localStorage.setItem("token", token);
                props.setToken(token);

                localStorage.setItem("userType", userType);
                props.setUserType(userType);

                const companyID = response.data.companyID;
                console.log(companyID);
                localStorage.setItem("companyID", companyID);
                props.setCompanyID(companyID);

                const userId = response.data.userId;
                console.log(userId);
                localStorage.setItem("userId", userId);
                props.setUserId(userId);

                const firstName = response.data.firstName;
                localStorage.setItem("firstName", firstName);
                props.setFirstName(firstName);

                navigate("/");

            } else{
                const errorMessage = document.querySelector(".login-error-message");
                errorMessage.classList.remove("hidden");
                errorMessage.innerHTML = "Wrong email/password combination! Please try again.";
                setTimeout(() => {
                    errorMessage.classList.add("hidden");
                }, 3000);
            };

        } catch (error) {
            console.log('Login error:', error)
        }
    }

    return(
        <div>

            <div className = "container my-5 p-3" style = {{width:"450px"}}>

                <h2 className = "text-center fw-normal" style = {{color: "#2980B9"}}>Company Portal</h2>
                <h3 className = "text-center fw-bold h3-responsive">Login to your account</h3>

                <div className = "row my-3" style = {{width:"75%",margin:"0px auto"}}>
                    <div className = "col-6 text-center login-form-toggler" onClick={props.onIntern}>
                        <span>Intern</span>
                    </div>

                    <div className = "col-6 text-center login-form-toggler"  onClick={props.onCompany} style = {style}>
                        <span>Company</span>
                    </div>
                </div>
                <div className = "row mt-4">
                        <form className = "registration-form" method = "post" action = "/login">

                            <FormElement 
                                labelFor = "emailAddress" 
                                type = "email" 
                                id = "emailAddress" 
                                name = "emailAddress" 
                                labelTitle = "Email address"
                                onChange = {handleChange}
                                value = {companyLoginInfo.emailAddress}
                                errorMessage = {companyLoginInfo.emailAddress === "" ? "Input field should not be empty!" : "Invalid email address!"}
                            />
 
                            <FormElement 
                                labelFor = "password" 
                                type = {showPassword ? "text" : "password"} 
                                id = "password" 
                                name = "password" 
                                labelTitle = "Password"
                                onChange = {handleChange}
                                value = {companyLoginInfo.password}
                                errorMessage = "Input field should not be empty!"
                            />

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

                            <p className = "mt-3 hidden login-error-message" style = {{fontSize: "14px"}}></p>

                            <div id = "submitButton" className = "mt-5">
                                <button type="submit" className="btn btn-primary" onClick = {handleLogin}>Login</button>
                            </div>

                            <div className = "text-center mt-3" style = {{fontSize: "14px"}}>
                                New to InternConnect? Register here: <Link to  = "/register/intern" style = {{textDecoration: "none", color: "#2980B9"}}>Intern</Link>
                                /<Link to  = "/register/company" style = {{textDecoration: "none", color: "#2980B9"}}>Company</Link>
                            </div>
                          
                        </form>
                </div>
            </div>
        </div>
    )

}

export default LoginCompany;