import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import InternshipCard from "./InternshipCard";

function Homepage(props){

    return(
        <div>
            <Header isAuthenticated = {props.isAuthenticated} logout = {props.logout}/>
            <InternshipCard storedName = {props.storedValue}/>
            <Footer />
        </div>
    )

}

export default Homepage;