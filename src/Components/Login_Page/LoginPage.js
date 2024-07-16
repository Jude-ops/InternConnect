import React, {useState} from "react";
import Header from "../Homepage/Header";
import Footer from "../Homepage/Footer";
import LoginCompany from "../Company_Authentication/LoginPageCompany";
import LoginIntern from "../Intern_Authentication/LoginPageIntern";

function LoginPage({setToken, isAuthenticated, setUserType, setInternID, setCompanyID, setUserId, setFirstName}){

    const [isIntern,setForm] = useState(true);
    const [isClicked,setClick]  = useState(true);

    function displayCompanyForm(){
        setForm(false);
    }

    function displayInternForm(){
        setForm(true);
        setClick(true)
    }

    return(
        <div>
            <Header isAuthenticated = {isAuthenticated}/>
            {isIntern ? 
                <LoginIntern 
                    onCompany = {displayCompanyForm} 
                    onIntern = {displayInternForm} 
                    clicked = {isClicked}
                    setToken = {setToken}
                    setUserType = {setUserType}
                    setInternID = {setInternID}
                    setUserId = {setUserId}
                    setFirstName = {setFirstName}
                /> 
                : <LoginCompany 
                    onCompany = {displayCompanyForm} 
                    onIntern = {displayInternForm} 
                    clicked = {isClicked}
                    setToken = {setToken}
                    setUserType = {setUserType}
                    setCompanyID = {setCompanyID}
                    setUserId = {setUserId}
                    setFirstName = {setFirstName}
                />
            }
            <Footer />
        </div>
    )

}

export default LoginPage;