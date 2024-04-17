import React from "react";

function FormElement(props){


    return(
        <div className="mb-3">
            <label htmlFor={props.labelFor} className="form-label fw-bold text-uppercase">{props.labelTitle}</label>
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
            />
        </div>
    );

};

export default FormElement;