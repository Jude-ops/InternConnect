import React from "react";

function FormElement(props){


    return(
        <div className="mb-3">
            <label for={props.labelFor} className="form-label">{props.labelTitle}</label>
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