import React,{useState, useEffect} from "react";
import './App.css';
import {BrowserRouter,Routes,Route, Navigate} from "react-router-dom";
import RegistrationIntern from "./Components/Intern_Authentication/RegistrationPageIntern";
import Homepage from "./Components/Homepage/Homepage";
import LoginPage from "./Components/Login_Page/LoginPage";
import RegistrationCompany from "./Components/Company_Authentication/RegistrationPageCompany";
import UpdateInternInfo from "./Components/Profile_Updates/UpdateInternInfo";
import UpdateCompanyInfo from "./Components/Profile_Updates/UpdateCompanyInfo";
import PostInternship from "./Components/Internship_Handling/PostInternship";
import InternshipDetails from "./Components/Internship_Handling/InternshipDetails";

 function App() {

  const [token, setToken] = useState("");
  const [userType, setUserType] = useState("");


  useEffect(() => {
    
    // Check if token is stored in localStorage when the app loads
    const storedToken = localStorage.getItem('token');
    if(storedToken){
      setToken(storedToken);
    }

    const storedUserType = localStorage.getItem('userType');
    if(storedUserType){
      setUserType(storedUserType);
    }

  }, [])

    const user = () => {

    return !!token;  // !! converts the value to boolean

  }

const logout = () => {

    localStorage.removeItem("token");
    setToken("");
    localStorage.removeItem("userType");
    setUserType("");

};

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = { user() ? <Homepage isAuthenticated = {user} logout = {logout}/>: <Navigate to = "/login" /> } />
          <Route path = "/register/intern" element = {<RegistrationIntern isAuthenticated = {user} setToken = {setToken}  setUserType = {setUserType} />} />
          <Route path = "/login" element = {user() ? <Navigate to = "/" /> : <LoginPage setToken = {setToken} isAuthenticated = {user} setUserType = {setUserType} />} />
          <Route path = "/register/company" element = {<RegistrationCompany isAuthenticated = {user} setToken = {setToken} setUserType = {setUserType} />} />
          <Route path = "/update/intern/:id" element = {<UpdateInternInfo isAuthenticated = {user} />} />
          <Route path = "/update/company/:id" element = {<UpdateCompanyInfo isAuthenticated = {user} />} />
          <Route path = "/post_internship" element = { user() && <PostInternship isAuthenticated = {user}/>} />
          <Route path = "/internship/:id" element = {<InternshipDetails isAuthenticated = {user}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
