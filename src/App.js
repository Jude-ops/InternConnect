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
import ManageInternships from "./Components/Internship_Handling/ManageInternships";
import EditInternship from "./Components/Internship_Handling/EditInternship";
import ManageApplications from "./Components/Internship_Handling/ManageApplications";
import InternshipsListing from "./Components/Internship_Handling/InternshipsListing";
import MyApplications from "./Components/Intern_Profile/MyApplications";
import SavedInternships from "./Components/Intern_Profile/SavedInternships";
import PublicProfile from "./Components/Intern_Profile/PublicProfile";
import EducationWorkHistory from "./Components/Intern_Profile/EducationWorkHistory";
import CompanyPublicProfile from "./Components/Company_Profile/CompanyPublicProfile";
import ShortlistedInterns from "./Components/Company_Profile/ShortlistedInterns";
import InternshipApplications from "./Components/Company_Profile/InternshipApplications";
import ChatSection from "./Components/Homepage/ChatSection";
import VideoChat from "./Components/Communication/VideoChat";
import About from "./Components/Homepage/About";

 function App() {

  const [token, setToken] = useState("");
  const [userType, setUserType] = useState("");
  const [companyID, setCompanyID] = useState(null);
  const [internID, setInternID] = useState(null);
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState("");


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

    const storedCompanyID = localStorage.getItem('companyID');
    if(storedCompanyID){
      setCompanyID(storedCompanyID);
    }

    const storedInternID = localStorage.getItem('internID');
    if(storedInternID){
      setInternID(storedInternID);
    }

    const storedUserId = localStorage.getItem('userId');
    if(storedUserId){
      setUserId(storedUserId);
    }

    const storedFirstName = localStorage.getItem('firstName');
    if(storedFirstName){
      setFirstName(storedFirstName);
    }

  }, [companyID, internID, token, userType, userId, firstName]);

const user = () => {

  return !!token;  // !! converts the value to boolean

}


const logout = () => {

  localStorage.removeItem("token");
  setToken("");
  localStorage.removeItem("userType");
  setUserType("");
  localStorage.removeItem("companyID");
  setCompanyID("");
  localStorage.removeItem("internID");
  setInternID("");
  localStorage.removeItem("userId");
  setUserId("");
  localStorage.removeItem("firstName");
  setFirstName("");

};

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = { <Homepage isAuthenticated = {user} logout = {logout} /> } />
          <Route path = "/register/intern" element = {<RegistrationIntern isAuthenticated = {user} setToken = {setToken}  setUserType = {setUserType} setInternID = {setInternID} setUserId = {setUserId} setFirstName = {setFirstName}/>} />
          <Route path = "/login" element = {user() ? <Navigate to = "/" /> : <LoginPage setToken = {setToken} isAuthenticated = {user} setUserType = {setUserType} setCompanyID = {setCompanyID} setInternID = {setInternID} setUserId = {setUserId} setFirstName = {setFirstName}/>} />
          <Route path = "/register/company" element = {<RegistrationCompany isAuthenticated = {user} setToken = {setToken} setUserType = {setUserType} setCompanyID = {setCompanyID} setUserId = {setUserId} setFirstName={setFirstName}/>} />
          <Route path = "/update/intern/:id" element = {<UpdateInternInfo isAuthenticated = {user} logout = {logout}/>} />
          <Route path = "/update/company/:id" element = {<UpdateCompanyInfo isAuthenticated = {user} logout = {logout} />} />
          <Route path = "/post_internship" element = { user() && <PostInternship isAuthenticated = {user}/>} />
          <Route path = "/internship/:id" element = {<InternshipDetails isAuthenticated = {user} logout = {logout}/>} />
          <Route path = "/company/:id/internships" element = {<ManageInternships isAuthenticated = {user} logout = {logout} />} />
          <Route path = "/company/:id/received_applications" element = {<ManageApplications isAuthenticated = {user} logout = {logout} />} /> 
          <Route path = "/company/:companyID/internship/:id/edit" element = {<EditInternship isAuthenticated = {user} logout = {logout} />} />
          <Route path = "/internships" element = {<InternshipsListing isAuthenticated = {user} logout = {logout} />} />
          <Route path = "/intern/:id/applications" element = {<MyApplications isAuthenticated = {user} logout = {logout} />} />
          <Route path = "/intern/:id/saved_internships" element = {<SavedInternships isAuthenticated = {user} logout = {logout} />} />
          <Route path = "/intern/:id/public_profile" element = {<PublicProfile isAuthenticated = {user} logout = {logout} />} />
          <Route path = "/intern/:id/education_work_history" element = {<EducationWorkHistory isAuthenticated = {user} logout = {logout} />} />
          <Route path = "/company/:id/public_profile" element = {<CompanyPublicProfile isAuthenticated = {user} logout = {logout} />} />
          <Route path = "/company/:companyID/saved_interns" element = {<ShortlistedInterns isAuthenticated = {user} logout = {logout} />} />
          <Route path = "/company/:id/internship/:internshipID/applications" element = {<InternshipApplications isAuthenticated = {user} logout = {logout} />} />
          <Route path = "/chat/:userId" element = {<ChatSection isAuthenticated = {user} logout = {logout} />} />
          <Route path = "/video_chat" element = {<VideoChat isAuthenticated = {user} logout = {logout} />} />
          <Route path = "/about_us" element = {<About isAuthenticated = {user} logout = {logout} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
 }

export default App;
