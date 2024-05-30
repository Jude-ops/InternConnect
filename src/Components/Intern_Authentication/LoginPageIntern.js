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


    async function handleLogin(event){

        event.preventDefault();

        try{

            const response = await axios.post("http://localhost:5000/login", internLoginInfo);

            if(response.data.token){

                const token = response.data.token;
                localStorage.setItem("token", token);
                props.setToken(token);

                const userType = response.data.userType;
                localStorage.setItem("userType", userType);
                props.setUserType(userType);

                const internID = response.data.internID;
                localStorage.setItem("internID", internID);
                props.setInternID(internID);

                navigate("/");

            };


        } catch(error) {
            console.log('Login error:', error);
        }

    }

    return(
        <div>

            <div className = "container my-5 p-3" style = {{width:"450px"}}>

                <h2 className = "text-center fw-normal">Intern Portal</h2>
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
                        />

                        <FormElement 
                            labelFor = "password" 
                            type = "password" 
                            id = "password" 
                            name = "password" 
                            labelTitle = "Password"
                            onChange = {handleChange}
                            value = {internLoginInfo.password}
                        />

                        <div className = "mb-3">
                            <Link to = "/forgotpassword" style = {{textDecoration: "none", color: "#2980B9"}}>Forgot Password?</Link>
                        </div>

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