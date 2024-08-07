import React,{useState} from "react";
import Header from "../Homepage/Header";
import Footer from "../Homepage/Footer";
import FormElement from "../Form_Elements/FormElement";
import SubHeader from "../Homepage/SubHeader"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PostInternship(props){

    const navigate = useNavigate();
    
    const [description1Touched, setDescription1Touched] = useState(false);
    const [description2Touched, setDescription2Touched] = useState(false);
    const [description3Touched, setDescription3Touched] = useState(false);
    const [internshipInfo, setInternshipInfo] = useState({
        internshipTitle: "",
        category: "",
        internshipDescription: "",
        internshipLocation: "",
        internshipStartDate: "",
        internshipEndDate: "",
        internshipStatus: "Open",
        companyName: "",
        applyBy: "",
        availablePositions: "",
        whoCanApply: "",
        perksOfInternship: "",
        skillsRequired: "",
    });

    function handleDescriptionBlur(event){
        const {name} = event.target;
        if(name === "internshipDescription"){
            setDescription1Touched(true);
        } else if(name === "skillsRequired"){
            setDescription2Touched(true);
        } else if(name === "whoCanApply"){
            setDescription3Touched(true);
        }
    }

    function handleChange(name, value){

        setInternshipInfo(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }
        });

    }

    async function postInternship(event){
        event.preventDefault();

        const form = event.target.closest("form");
        if(!form.checkValidity()){
            form.reportValidity();
            return;
        }

        try{
            const response = await axios.post("http://localhost:5000/internships", internshipInfo);
            if(response){
                navigate("/");
            }
        } catch(error){
            console.log('Error posting internship:', error);
        }    
    }

    return(
        <div>
            <Header isAuthenticated = {props.isAuthenticated} logout = {props.logout}/>
            <SubHeader
                title = "Post New Internship"
                subtitle = "Add A New Internship to Our Platform!🚀"
            />

            <div className = "container my-5 p-3">
                <div className = "row">
                    <div className = "col-12 col-md-10 mx-auto">
                        <h1 className = "text-center fw-bold" style = {{color: "#2980B9"}}>Add Internship Portal</h1>
                        <form className = "mt-3 registration-form">

                            <FormElement 
                                label = "internshipTitle" 
                                type = "text" 
                                placeholder = "Internship Title"
                                id = "internshipTitle"
                                name = "internshipTitle"
                                labelTitle = "Internship Title"
                                onChange = {handleChange}
                                value = {internshipInfo.internshipTitle}
                                errorMessage = "Input field should not be empty"
                            />

                            <div class="mb-4 mt-4">
                                <label for="internshipDescription" class="form-label fw-bold">About Internship</label>
                                <textarea 
                                    required
                                    className="form-control" 
                                    id="internshipDescription" 
                                    rows="6" 
                                    value = {`${internshipInfo.internshipDescription}`}
                                    name = "internshipDescription"
                                    onChange={(event) => {
                                        handleChange(event.target.name, event.target.value)
                                    }}
                                    onBlur = {handleDescriptionBlur}
                                    isTouched = {description1Touched ? "true" : "false"}
                                ></textarea>
                                <p className = "reg-error-message">Input field should not be empty!</p>
                            </div>
                            
                            <div className = "row mb-3">         
                                
                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        label = "category" 
                                        type = "text" 
                                        placeholder = "Category"
                                        id = "category"
                                        name = "category"
                                        labelTitle = "Category"
                                        onChange = {handleChange}
                                        value = {internshipInfo.category}
                                        errorMessage = "Input field should not be empty"
                                    />
                                </div>

                                <div className = "col-12 col-sm-6">
                                    <FormElement 
                                        label = "internshipLocation" 
                                        type = "text" 
                                        placeholder = "Internship Location"
                                        id = "internshipLocation"
                                        name = "internshipLocation"
                                        labelTitle = "Internship Location"
                                        onChange = {handleChange}
                                        value = {internshipInfo.internshipLocation}
                                        errorMessage = "Input field should not be empty"
                                    />
                                </div>

                            </div>

                        <div className = "row mb-3">
                            <div className = "col-12 col-sm-6">
                                <FormElement 
                                    label = "internshipStartDate" 
                                    type = "date" 
                                    placeholder = "Internship Start Date"
                                    id = "internshipStartDate"
                                    name = "internshipStartDate"
                                    labelTitle = "Internship Start Date"
                                    onChange = {handleChange}
                                    value = {internshipInfo.internshipStartDate}
                                    errorMessage = "Input field should not be empty"
                                />
                            </div>

                            <div className = "col-12 col-sm-6">
                                <FormElement 
                                    label = "internshipEndDate" 
                                    type = "date" 
                                    placeholder = "Internship End Date"
                                    id = "internshipEndDate"
                                    name = "internshipEndDate"
                                    labelTitle = "Internship End Date"
                                    onChange = {handleChange}
                                    value = {internshipInfo.internshipEndDate}
                                    errorMessage = "Input field should not be empty"
                                />
                            </div>    
                        </div>

                        <div className = "row mb-3">
                            <div className = "col-12 col-sm-6">
                                <FormElement 
                                    label = "applyBy" 
                                    type = "date" 
                                    placeholder = "Apply By"
                                    id = "applyBy"
                                    name = "applyBy"
                                    labelTitle = "Application Deadline Date"
                                    onChange = {handleChange}
                                    value = {internshipInfo.applyBy}
                                    errorMessage = "Input field should not be empty"
                                />
                            </div>

                            <div className = "col-12 col-sm-6">
                                <FormElement 
                                    label = "availablePositions" 
                                    type = "number" 
                                    placeholder = "Available Positions"
                                    id = "availablePositions"
                                    name = "availablePositions"
                                    labelTitle = "No. of available positions"
                                    onChange = {handleChange}
                                    value = {internshipInfo.availablePositions}
                                    errorMessage = "Input field should not be empty"
                                />
                            </div>
                        </div>
                            
                            <div className="mb-4 mt-4">
                                <label for="skillsRequired" class="form-label fw-bold">Skill(s) Required</label>
                                <textarea
                                    required
                                    className="form-control" 
                                    id="skillsRequired" 
                                    rows="4" 
                                    value = {`${internshipInfo.skillsRequired}`}
                                    name = "skillsRequired"
                                    onChange={(event) => {
                                        handleChange(event.target.name, event.target.value)
                                    }}
                                    onBlur = {handleDescriptionBlur}
                                    isTouched = {description2Touched ? "true" : "false"}
                                ></textarea>
                                <p className = "reg-error-message">Input field should not be empty!</p> 
                            </div>

                        <FormElement 
                                label = "perksOfInternship" 
                                type = "text" 
                                placeholder = "Perks of Internship"
                                id = "perksOfInternship"
                                name = "perksOfInternship"
                                labelTitle = "Perks of Internship"
                                onChange = {handleChange}
                                value = {internshipInfo.perksOfInternship}
                                errorMessage = "Input field should not be empty"
                        />

                            <div className="mb-4 mt-4">
                                <label for="whoCanApply" class="form-label fw-bold">Who Can Apply</label>
                                <textarea 
                                    required
                                    className="form-control" 
                                    id="whoCanApply" 
                                    rows="6" 
                                    value = {`${internshipInfo.whoCanApply}`}
                                    name = "whoCanApply"
                                    onChange={(event) => {
                                        handleChange(event.target.name, event.target.value)
                                    }}
                                    onBlur = {handleDescriptionBlur}
                                    isTouched = {description3Touched ? "true" : "false"}
                                ></textarea>
                                <p className = "reg-error-message">Input field should not be empty!</p>
                            </div>

                            <FormElement 
                                label = "companyName" 
                                type = "text" 
                                placeholder = "Company Name"
                                id = "companyName"
                                name = "companyName"
                                labelTitle = "Company Name"
                                onChange = {handleChange}
                                value = {internshipInfo.companyName}
                                errorMessage = "Input field should not be empty"
                            />

                            <div className = "text-center mt-4">
                                <button type="submit" class="btn btn-primary" onClick = {postInternship}>Post Internship</button>
                            </div>

                        </form>
                    </div>
                </div> 
            </div>

            <Footer />
        </div>
    )

}

export default PostInternship;