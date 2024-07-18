import React, {useState, useEffect} from 'react'
import {Link, useLocation} from 'react-router-dom'

function SubHeader(props) {

    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);
    const filteredPathnames = pathnames.filter((name) => isNaN(Number(name)));

    const [userType, setUserType] = useState("");

    useEffect(() => {
            
        const userType = localStorage.getItem("userType");
        setUserType(userType);
    
     }, []);

  return (
    <div>
        <div id = "sub-header">
            <div className = "container">
                <div className = "row">
                    <div className = "col-12">
                        <h1 className = "heading text-center fw-bold">{props.title}</h1>
                        {
                            userType === "intern" ?  
                            <div>
                                <h5 className = "text-center mt-3">{props.subtitle}</h5>
                            </div>
                            :
                            <div>
                                <h5 className = "text-center mt-3">{props.subtitle}</h5>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>

        <div id = "app-breadcrumb">
            <div className = "container">
                <div className = "row">
                    <div className = "col-12 d-flex justify-content-center">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item active link-breadcrumb" aria-current = "page">
                                    <Link to = "/" className = "text-white nav-link">Home</Link>
                                </li>

                                {
                                    filteredPathnames.map((name, index) => {
                                        //Remove underscores and capitalize the first letter of each word
                                        const nameWithoutUnderscores = name.replace(/_/g, " ");
                                        //Captitalize the first letter of each word
                                        const valueCapitalized = nameWithoutUnderscores.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
                                        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                                        const isLast = index === pathnames.length - 1;
                                        return isLast ? (
                                            <li className = "breadcrumb-item active link-breadcrumb" aria-current = "page" key = {index}>
                                                {valueCapitalized}
                                            </li>
                                        ) : (
                                            <li className = "breadcrumb-item link-breadcrumb" key = {index}>
                                                <Link to = {routeTo} className = "text-white nav-link">{valueCapitalized}</Link>
                                            </li>
                                        );
                                    })
                                
                                }

                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SubHeader;