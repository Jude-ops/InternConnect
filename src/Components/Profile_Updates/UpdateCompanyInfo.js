import React, {useState,useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import FormElement from "../Form_Elements/FormElement";
import Header from "../Homepage/Header";
import Footer from "../Homepage/Footer";
import SubHeader from "../Homepage/SubHeader";
import CompanyProfileNavbar from "./CompanyProfileNavbar";
import axios from "axios";

function UpdateCompanyInfo(props){

    const navigate = useNavigate();
    const {id} = useParams();

    const [image, setImage] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);

    const [companyInfo, setCompanyInfo] = useState({
        fullName: "",
        emailAddress: "",
        foundedDate: "",
        website: "",
        password: "",
        confirmPassword: "",
        location: "",
        address: "",
        telephone: "",
        description: "",
    });

    function handleChange(name, value){
        setCompanyInfo(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }
        });
    };

    function handleImageChange(event){
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result);
        };

        if(file){
            reader.readAsDataURL(file);
            setSelectedImageFile(file);
        } else {
            setImage(null);
            setSelectedImageFile(null);
        }
    };

    useEffect(() => {
        const companyID = localStorage.getItem("companyID");

        async function fetchCompanyInfo(){
            try{
                const response = await axios.get("http://localhost:5000/company/" + companyID);
                if(response){
                    console.log(response.data);

                    //Retrieve profile image and set it to the state variable image
                    const profileImage = response.data[0].profile_image;
                    const profileImagePath = "http://localhost:5000/uploads/" + profileImage;
                    setImage(profileImagePath);

                    //Convert retrieved date of birth to a string
                    const foundedDate = new Date(response.data[0].founded_date);
                    const offset = foundedDate.getTimezoneOffset();
                    foundedDate.setMinutes(foundedDate.getMinutes() - offset);
                    const foundedDateString = foundedDate.toISOString().split("T")[0];

                    setCompanyInfo(prevValue => {
                        return{
                            ...prevValue,
                            fullName: response.data[0].company_name,
                            emailAddress: response.data[0].company_email,
                            foundedDate: foundedDateString,
                            website: response.data[0].website,
                            location: response.data[0].location_city,
                            address: response.data[0].address,
                            telephone: response.data[0].telephone,
                            description: response.data[0].company_description
                        }
                    });
                }
            } catch (error) {
                console.error("Error fetching company info:", error);
            }
        }
        
        fetchCompanyInfo();
    }, [id]);

    //Update Company Info
    async function handleSubmit(event){
        event.preventDefault();

        try{
            const companyInfoUpdate = new FormData();
            const profileImage = selectedImageFile;

            for(let key in companyInfo){
                companyInfoUpdate.append(key, companyInfo[key]);
            }

            if(profileImage){
                companyInfoUpdate.append("profileImage", profileImage);
            }

            const response =  await axios.put("http://localhost:5000/update/company/" + id, companyInfoUpdate, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if(response){
                window.location.reload();
            }
        } catch (error) {
            console.error("Error updating company info:", error);
        }
    };

    //Delete company account
    async function handleDelete(){
        try{
            const response = await axios.delete("http://localhost:5000/delete/company/" + id);
            if(response){
                localStorage.removeItem("token");
                props.setToken("");
                localStorage.removeItem("userType");
                props.setUserType("");
                navigate("/");
            }
        } catch (error) {
            console.error("Error deleting company account:", error);
        }
    }

    return (
        <div>
            <Header isAuthenticated = {props.isAuthenticated}/>
            <SubHeader 
                title = "Update Company Info"
                subtitle = "Update your company credentials"
            />
            <div className = "container my-5 mx-auto p-3">
                <div className = "row mt-4">
                    <div className = "col-12 col-md-4">
                        <CompanyProfileNavbar logout = {props.logout}/>
                    </div>

                    <div className = "col-12 col-md-8">
                        <form className = "registration-form mt-4 mt-md-0">
                        
                            <div className = "profile-image-container mb-3">
                                <div className = "resume-image mb-3">
                                    <img 
                                        src = {image ? image : "https://via.placeholder.com/150"}
                                        alt = "Profile" 
                                        className = "profile-image"
                                    />
                                </div>

                                <div className = "text-center" style = {{width: "200px", margin: "0 auto"}}>
                                    <label htmlFor = "profileImageUpload" className = " fw-bold text-uppercase btn btn-primary">
                                        <i className = "bi bi-pencil-fill me-2"></i>
                                        Edit
                                    </label>
                                    <input 
                                        type = "file" 
                                        id = "profileImageUpload" 
                                        className = "form-control"
                                        name = "profileImage" 
                                        accept = "image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>

                            <div className = "mt-5">
                                <h4 className = "fw-bold h4-responsive" style = {{color: "#2980B9"}}>My Profile</h4>
                            </div>
                            <hr className = "line-divider" />

                            <div className = "row mb-3">
                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "companyName" 
                                        type = "text" 
                                        id = "companyName" 
                                        name = "fullName" 
                                        labelTitle = "Company Name"
                                        onChange = {handleChange}
                                        value = {companyInfo.fullName}
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "emailAddress" 
                                        type = "email" 
                                        id = "emailAddress" 
                                        name = "emailAddress" 
                                        labelTitle = "Email Address"
                                        onChange = {handleChange}
                                        value = {companyInfo.emailAddress}
                                    />
                                </div>
                            </div>

                            <div className = "row mb-3">
                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "foundedDate" 
                                        type = "date" 
                                        id = "foundedDate" 
                                        name = "foundedDate" 
                                        labelTitle = "Founded Date"
                                        onChange = {handleChange}
                                        value = {companyInfo.foundedDate}
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "website" 
                                        type = "text" 
                                        id = "website" 
                                        name = "website" 
                                        labelTitle = "Company Website"
                                        onChange = {handleChange}
                                        value = {companyInfo.website}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label for="description" className="form-label fw-bold">Company Description</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name = "description"
                                    placeholder = "A brief description of your company..."
                                    rows="6"
                                    value = {`${companyInfo.description}`}
                                    onChange = {(event) => {
                                        handleChange(event.target.name, event.target.value)
                                    }}
                                ></textarea>
                            </div>

                            <div className = "mt-5">
                                <h4 className = "fw-bold h4-responsive" style = {{color: "#2980B9"}}>Contact Information</h4>
                            </div>
                            <hr className = "line-divider" />
                            
                            <FormElement 
                                labelFor = "telephone" 
                                type = "tel" 
                                id = "telephone" 
                                name = "telephone" 
                                labelTitle = "Telephone"
                                placeholder = "e.g. 678123456"
                                onChange = {handleChange}
                                value = {companyInfo.telephone}
                            />

                            <div className = "row mb-3">
                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "location" 
                                        type = "text" 
                                        id = "location" 
                                        name = "location" 
                                        labelTitle = "Location"
                                        onChange = {handleChange}
                                        value = {companyInfo.location}
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "address" 
                                        type = "text" 
                                        id = "address" 
                                        name = "address" 
                                        labelTitle = "Address"
                                        onChange = {handleChange}
                                        value = {companyInfo.address}
                                    />
                                </div>
                            </div>

                            <div className = "mt-5">
                                <h4 className = "fw-bold h4-responsive" style = {{color: "#2980B9"}}>Change Your Password (Optional)</h4>
                            </div>
                            <hr className = "line-divider" />

                            <h6 className = "text-muted h6-responsive">
                                If you don't wish to change your password, enter your old password in the password field and leave the confirm password field empty.
                            </h6>

                            <div className = "row">
                                <div className = "col-12 col-sm-6">  
                                    <FormElement 
                                        labelFor = "password" 
                                        type = "password" 
                                        id = "password" 
                                        name = "password" 
                                        labelTitle = "Password"
                                        onChange = {handleChange}
                                        value = {companyInfo.password}
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        labelFor = "confirmPassword" 
                                        type = "password" 
                                        id = "confirmPassword" 
                                        name = "confirmPassword" 
                                        labelTitle = "Confirm Password"
                                        onChange = {handleChange}
                                        value = {companyInfo.confirmPassword}
                                    />
                                </div>
                            </div>
                        
                            <div id = "submitButton" className = "mt-5">
                                <button type = "submit" className ="btn btn-primary" onClick = {handleSubmit}>Update</button>
                            </div>

                        </form>
                    </div>

                    <div className = "col-12 text-center mt-5">
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Delete Account
                        </button>

                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header text-center">
                                        <h1 class="modal-title w-100 fs-5" id="exampleModalLabel">Delete Account</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        Are you sure you want to delete your account?<br />
                                        This action cannot be reversed!
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                        <button type="button" class="btn btn-danger" onClick={handleDelete}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );

};

export default UpdateCompanyInfo;