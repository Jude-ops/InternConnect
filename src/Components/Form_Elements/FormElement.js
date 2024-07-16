import React, {useState} from "react";

function FormElement(props){

    const [isTouched, setIsTouched] = useState(false);

    const handleBlur = (event) => {
        setIsTouched(true);
    };

    return(
        <div className="mb-3">
            <label htmlFor={props.labelFor} className="form-label fw-bold">{props.labelTitle}</label>
            <input 
                type={props.type} 
                className="form-control" 
                id={props.id} 
                name = {props.name} 
                placeholder = {props.placeholder} 
                required
                onChange={(event) => {
                    props.onChange(props.name, event.target.value)
                    }
                }
                value = {props.value}
                pattern = {props.pattern}
                onBlur={handleBlur}
                isTouched = {isTouched.toString()}
            />
            <p className = "reg-error-message">{props.errorMessage}</p>
        </div>
    );

};

export default FormElement;