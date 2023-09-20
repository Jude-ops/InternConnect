import React from "react";
import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import RegistrationIntern from "./Components/Intern_Authentication/RegistrationPageIntern";
import Homepage from "./Components/Homepage/Homepage";
import LoginPage from "./Components/Login_Page/LoginPage";
import RegistrationCompany from "./Components/Company_Authentication/RegistrationPageCompany";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Homepage />} />
          <Route path = "/register/intern" element = {<RegistrationIntern />} />
          <Route path = "/login" element = {<LoginPage />} />
          <Route path = "/register/company" element = {<RegistrationCompany />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
