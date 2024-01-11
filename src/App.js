import React,{useState, useEffect} from "react";
import './App.css';
import {BrowserRouter,Routes,Route, Navigate} from "react-router-dom";
import RegistrationIntern from "./Components/Intern_Authentication/RegistrationPageIntern";
import Homepage from "./Components/Homepage/Homepage";
import LoginPage from "./Components/Login_Page/LoginPage";
import RegistrationCompany from "./Components/Company_Authentication/RegistrationPageCompany";
import UpdateInternInfo from "./Components/Profile_Updates/UpdateInternInfo";
import UpdateCompanyInfo from "./Components/Profile_Updates/UpdateCompanyInfo";

 function App() {

  const [token, setToken] = useState("");


  useEffect(() => {
    
    // Check if token is stored in localStorage when the app loads
    const storedToken = localStorage.getItem('token');
    if(storedToken){
      setToken(storedToken);
    }

  }, [])

    const user = () => {

    return !!token;  // !! converts the value to boolean

  }

const logout = () => {

    localStorage.removeItem("token");
    setToken("");

};

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = { user() ? <Homepage isAuthenticated = {user} logout = {logout}/>: <Navigate to = "/login" /> } />
          <Route path = "/register/intern" element = {<RegistrationIntern isAuthenticated = {user} setToken = {setToken} />} />
          <Route path = "/login" element = {user() ? <Navigate to = "/" /> : <LoginPage setToken = {setToken} isAuthenticated = {user}/>} />
          <Route path = "/register/company" element = {<RegistrationCompany isAuthenticated = {user} setToken = {setToken} />} />
          <Route path = "/update/intern/:id" element = {<UpdateInternInfo isAuthenticated = {user} />} />
          <Route path = "/update/company/:id" element = {<UpdateCompanyInfo isAuthenticated = {user} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
