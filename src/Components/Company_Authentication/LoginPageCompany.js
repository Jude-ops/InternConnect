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

    async function handleLogin(event){

        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/login", companyLoginInfo);

            if(response.data.token){

                const token = response.data.token;
                localStorage.setItem("token", token);
                props.setToken(token);

                const userType = response.data.userType;
                localStorage.setItem("userType", userType);
                props.setUserType(userType);

                const companyID = response.data.companyID;
                console.log(companyID);
                localStorage.setItem("companyID", companyID);
                props.setCompanyID(companyID);

                navigate("/");

            };

        } catch (error) {
            console.log('Login error:', error)
        }
    }

    return(
        <div>

            <div className = "container my-5 p-3" style = {{width:"450px"}}>

                <h2 className = "text-center fw-normal">Company Portal</h2>
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
                            />
 
                            <FormElement 
                                labelFor = "password" 
                                type = "password" 
                                id = "password" 
                                name = "password" 
                                labelTitle = "Password"
                                onChange = {handleChange}
                                value = {companyLoginInfo.password}
                            />

                            <div className = "mb-3">
                                <Link to = "/forgotpassword" style = {{textDecoration: "none", color: "#2980B9"}}>Forgot Password?</Link>
                            </div>

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