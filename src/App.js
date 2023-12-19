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

    const storedToken = localStorage.getItem('token');
    if(storedToken){
      setToken(storedToken);
    }

  }, [])

    const user = () => {

    return !!token;  // !! converts the value to boolean

  }

  //localStorage.clear();

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = { user() ? <Homepage />: <Navigate to = "/login" /> } />
          <Route path = "/register/intern" element = {<RegistrationIntern setToken = {setToken} />} />
          <Route path = "/login" element = {user() ? <Navigate to = "/" /> : <LoginPage setToken = {setToken} />} />
          <Route path = "/register/company" element = {<RegistrationCompany setToken = {setToken} />} />
          <Route path = "/update/intern/:id" element = {<UpdateInternInfo />} />
          <Route path = "/update/company/:id" element = {<UpdateCompanyInfo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
