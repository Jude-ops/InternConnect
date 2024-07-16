import React, {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import FormElement from "../Form_Elements/FormElement";
import axios from "axios";

function LoginIntern(props){   

    const navigate = useNavigate();

    const style = {
        color: props.clicked ? "#2980B9" : "black",
        borderBottom: props.clicked ? "2px solid #2980B9" : "none",
    }

    const [showPassword, setShowPassword] = useState(false);
    const [internLoginInfo, setInternLoginInfo] = useState({

        emailAddress: "",
        password: ""
    });

    function handleChange(name, value){
        setInternLoginInfo(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }
        });
    }

    function toggleShowPassword(){
        setShowPassword(!showPassword);
    }


    async function handleLogin(event){

        event.preventDefault();

        try{

            const response = await axios.post("http://localhost:5000/login", internLoginInfo);

            if(response.data.token){

                const userType = response.data.userType;
                //If userType is not intern, redirect to company login page
                if(userType !== "intern"){
                    alert("You are not an intern. Please login as a company.");
                    props.onCompany();
                    return;
                }

                const token = response.data.token;
                localStorage.setItem("token", token);
                props.setToken(token);

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

                navigate("/");

            } else{
                const error = document.querySelector(".login-error-message");
                error.classList.remove("hidden");
                error.innerHTML = "Wrong email/password combination! Please try again.";
                setTimeout(() => {
                    error.classList.add("hidden");
                }, 3000);
            };


        } catch(error) {
            console.log('Login error:', error);
        }

    }

    return(
        <div>

            <div className = "container my-5 p-3" style = {{width:"450px"}}>

                <h2 className = "text-center fw-normal" style = {{color: "#2980B9"}}>Intern Portal</h2>
                <h3 className = "text-center fw-bold h3-responsive">Login to your account</h3>

                <div className = "row my-3" style = {{width:"75%",margin:"0px auto"}}>
                    <div className = "col-6 text-center login-form-toggler" onClick={props.onIntern} style = {style}>
                        <span>Intern</span>
                    </div>

                    <div className = "col-6 text-center login-form-toggler"  onClick={props.onCompany}>
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
                            value = {internLoginInfo.emailAddress}
                            errorMessage = {internLoginInfo.emailAddress === "" ? "Input field should not be empty!" : "Invalid email address!"}
                        />

                        <FormElement 
                            labelFor = "password" 
                            type = {showPassword ? "text" : "password"} 
                            id = "password" 
                            name = "password" 
                            labelTitle = "Password"
                            onChange = {handleChange}
                            value = {internLoginInfo.password}
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
                            <button type="submit" className="btn btn-primary" onClick={handleLogin}>Login</button>
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

export default LoginIntern;