import "dotenv/config.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const saltRounds = 10;
const app = express();
const port = 5000;
const JWT_SECRET = "internconnect-cameroon";


app.use(cors()); //This is used to allow cross-origin requests
app.use(bodyParser.urlencoded({extended: true})); //This is used to parse the data from the form
app.use(bodyParser.json()); //This is used to parse the data from the form
app.use(express.static("public")); //This is used to serve static files like css, images, etc.



// Middleware to verify the token and decode it
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized, token not found.' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId; // Attach the decoded user ID to the request
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
  
  
  // A protected route that requires the token
  app.get('/protected', verifyToken, (req, res) => {
    // Access the decoded user ID from the request
    const userId = req.userId;
    res.json({ message: 'Access granted!', userId });
  });


let isActive = false;

//Create a connection to the database
const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database:"internconnect"

});

db.connect((err) => {

    if(err){

        console.log("Error connecting to the database!", err);
        return;

    } else{

        console.log("Successfully connected to the database!");

    }

});

//Registering interns into the database
app.post("/register/intern", (req, res) => {

    isActive = true;
    const userType = "intern";

    const {firstName, lastName, dateOfBirth, emailAddress, password, location, address, school, department, gender, telephone} = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {

        db.query('INSERT INTO interns (first_name,last_name,date_of_birth,email_address,password,location,address,school,department,gender,telephone,is_Active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ', [firstName, lastName,dateOfBirth, emailAddress,hash,location, address, school, department,gender,parseInt(telephone),isActive], (err, result) => {

            if(err){

                console.log("Error inserting the data into the database!", err);
                return;

            }

            console.log("Intern data inserted successfully!", result);

            // Get the internID of the newly inserted intern
            const internID = result.insertId;
            const firstName = result[0].first_name;

            db.query('INSERT INTO users (username,email,password,user_type,is_Active,intern_ID) VALUES (?,?,?,?,?,?) ', [firstName.concat(lastName),emailAddress,hash,userType,isActive,internID], (err, result) => {

                if(err){
    
                    console.log("Error inserting the data into the database!", err);
                    return;    
    
                }
    
                console.log("User data inserted successfully!", result);
                const token = jwt.sign({userId: result.insertId}, JWT_SECRET,{expiresIn: '8760h'});  //Generate token which will be used for authentication
                res.status(200).json({token, userType, firstName}); 
    
            });

        });      
        
    });

});


//Registering Companies into the database
app.post("/register/company", (req, res) => {

    isActive = true;
    const userType = "company";

    const {fullName, emailAddress, password, location, address, telephone, description} = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {

        db.query('INSERT INTO companies (company_name,company_email,password,location_city,address,telephone,is_Active, company_description) VALUES (?,?,?,?,?,?,?.?) ', [fullName, emailAddress, hash, location, address, parseInt(telephone), isActive, description], (err, result) => {
            
            if(err){

                console.log("Error inserting the data into the database!", err);
                return;

            }

            console.log("Company data inserted successfully!", result);

            // Get the companyID of the newly inserted company
            const companyID = result.insertId;

            db.query('INSERT INTO users (username,email,password,user_type,is_Active,company_ID) VALUES (?,?,?,?,?,?) ', [fullName,emailAddress,hash,userType,isActive,companyID], (err, result) => {

                if(err){
    
                    console.log("Error inserting the data into the database!", err);
                    return;
    
                }
    
                console.log("User data inserted successfully!", result);
                const token = jwt.sign({userId: result.insertId}, JWT_SECRET,{expiresIn: '8760h'});  //Generate token which will be used for authentication
                res.status(200).json({token, userType});
    
            });

        });

    });

});

//Login functionality
app.post("/login", (req,res) => {

    const {emailAddress, password} = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [emailAddress], (err, result) => {

        if(err){

            console.log("Error selecting the data from the database!", err);
            return;

        }
        

        if(result.length > 0){

            bcrypt.compare(password, result[0].password, (error, response) => {

                if(response){

                    console.log("Login successful!");
                    const token = jwt.sign({userId: result[0].user_ID}, JWT_SECRET,{expiresIn: '8760h'});  //Generate token which will be used for authentication
                    const companyID = result[0].company_ID;
                    const internID = result[0].intern_ID;
                    res.status(200).json({token, userType: result[0].user_type, companyID, internID});

                }else{

                    console.log("Wrong username/password combination!");
                    res.send({message: "Wrong username/password combination!"}); 

                }

            });

        }else{

            console.log("User doesn't exist!");
            res.send({message: "User doesn't exist!"});
           

        }

    });

});

//Update intern information
app.put("/update/intern/:id", (req, res) => {

    const id = req.params.id;
    const {emailAddress, password, location, address, telephone} = req.body;

    // First, get the intern_ID from the users table

    db.query('SELECT intern_ID FROM users WHERE user_ID = ?', [id], (err, result) => {

        if(err){

            console.log("Error fetching intern ID from the database!", err);
            return res.status(500).json({ message: 'Error fetching intern ID from the database' });

        }

        if(result.length > 0){

            const internID = result[0].intern_ID;

            // Then, update the intern information
            bcrypt.hash(password, saltRounds, (err, hash) => {

                const data = [emailAddress, hash, location, address, parseInt(telephone)];
            
                db.query('UPDATE interns SET `email_address` = ?, `password` = ?, `location` = ?, `address` = ?, `telephone` = ? WHERE intern_ID = ?', [...data, internID], (err, result) => {
        
                    if(err){
        
                        console.log("Error updating the data in the database!", err);
                        return;
        
                    }
        
                    console.log("Intern data updated successfully!", result);
                    res.send({message: "Intern data updated successfully!"});
        
                });
        
                db.query('UPDATE users SET `email` = ?, `password` = ? WHERE user_ID = ?', [emailAddress, hash, id], (err, result) => {
        
                    if(err){
        
                        console.log("Error updating the data in the database!", err);
                        return;
        
                    }
        
                    console.log("User data updated successfully!", result);
                    
        
                });
        
            });

        }

    });


});

//Update company information
app.put("/update/company/:id", (req, res) => {

    const id = req.params.id;
    const {emailAddress, password, telephone} = req.body;

    // First, get the company_ID from the users table
    db.query('SELECT company_ID FROM users WHERE user_ID = ?', [id], (err, result) => {

        if (err) {
        console.log("Error fetching company ID from the database!", err);
        return res.status(500).json({ message: 'Error fetching company ID from the database' });
        }

        if (result.length > 0) {

            const companyID = result[0].company_ID;

            // Then, update the company information
            bcrypt.hash(password, saltRounds, (err, hash) => {

                const data = [emailAddress, hash, parseInt(telephone)];
            
                db.query('UPDATE companies SET `company_email` = ?, `password` = ?, `telephone` = ? WHERE company_ID = ?', [...data, companyID], (err, result) => {
        
                    if(err){
        
                        console.log("Error updating the data in the database!", err);
                        return;
        
                    }
        
                    console.log("Company data updated successfully!", result);
                    res.send({message: "Company data updated successfully!"});
        
                });
        
                db.query('UPDATE users SET `email` = ?, `password` = ? WHERE user_ID = ?', [emailAddress, hash, id], (err, result) => {
        
                    if(err){
        
                        console.log("Error updating the data in the database!", err);
                        return;
        
                    }
        
                    console.log("User data updated successfully!", result);
                
        
                });
        
            });    

        }

    });


    

});

//Delete intern information
app.delete("/delete/intern/:id", (req, res) => {

    const id = req.params.id;
    
    db.query('SELECT intern_ID FROM users WHERE user_ID = ?', [id], (err, result) => {

        if(err){

        console.log("Error fetching intern ID from the database!", err);
        return res.status(500).json({ message: 'Error fetching intern ID from the database' });

        }

        if(result.length > 0){

            const internID = result[0].intern_ID;

            db.query('DELETE FROM interns WHERE intern_ID = ?', [internID], (err, result) => {

                if(err){

                    console.log("Error deleting the data from the database!", err);
                    return;

                }

                console.log("Intern data deleted successfully!", result);
                res.send({message: "Intern data deleted successfully!"});

            });

            db.query('DELETE FROM users WHERE user_ID = ?', [id], (err, result) => {

                if(err){

                    console.log("Error deleting the data from the database!", err);
                    return;

                }

                console.log("User data deleted successfully!", result);

            });

            db.query('DELETE FROM applications WHERE intern_ID = ?', [internID], (err, result) => {

                if(err){

                    console.log("Error deleting the data from the database!", err);
                    return;

                }

                console.log("Application data deleted successfully!", result);

            });

        }

    });

});

//Delete company information
app.delete("/delete/company/:id", (req, res) => {

    const id = req.params.id;

    db.query('SELECT company_ID FROM users WHERE user_ID = ?', [id], (err, result) => {

        if(err){

        console.log("Error fetching company ID from the database!", err);
        return res.status(500).json({ message: 'Error fetching company ID from the database' });

        }

        if(result.length > 0){

           const companyID = result[0].company_ID;

           db.query('DELETE FROM internships WHERE company_ID = ?', [companyID], (err, result) => {

                if(err){

                    console.log("Error deleting the data from the database!", err);
                    return;

                }

                console.log("Internship data deleted successfully!", result);

           });

           db.query('DELETE FROM companies WHERE company_ID = ?', [companyID], (err, result) => {

                if(err){

                    console.log("Error deleting the data from the database!", err);
                    return;

                }

                console.log("Company data deleted successfully!", result);
                res.send({message: "Company data deleted successfully!"});

           });

           db.query('DELETE FROM users WHERE user_ID = ?', [id], (err, result) => {

                if(err){

                    console.log("Error deleting the data from the database!", err);
                    return;

                }

                console.log("User data deleted successfully!", result);

           });

        }

    });

});

app.post("/internships", (req,res) => {

    const {
        companyName, 
        internshipTitle, 
        internshipDescription, 
        internshipLocation, 
        internshipStartDate, 
        internshipEndDate, 
        internshipStatus,
        category,
        applyBy,
        availablePositions,
        whoCanApply,
        perksOfInternship,
        skillsRequired
    } = req.body;

    // First, get the companyID from the companies table
    db.query('SELECT company_ID, company_description FROM companies WHERE company_name = ?', [companyName], (err, result) => {
        if(err){
            console.log("Error fetching company ID!", err);
            return;
        }

        if(result.length > 0){
            
            const companyID = result[0].company_ID;
            const companyDescription = result[0].company_description;

            // Then, insert the new internship with the companyID
            const q = 'INSERT INTO internships (internship_name, company_ID, internship_description, location_city, start_date, end_date, internship_status, company_Name, company_description, posted_On, category, apply_by, available_positions, who_can_apply, perks, skills_required) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
            const data = [
                internshipTitle, 
                companyID, 
                internshipDescription, 
                internshipLocation, 
                internshipStartDate, 
                internshipEndDate, 
                internshipStatus, 
                companyName,
                companyDescription, 
                new Date(), 
                category,
                applyBy,
                availablePositions,
                whoCanApply,
                perksOfInternship,
                skillsRequired,
            ];
            db.query(q, data, (err, result) => {

                if(err){
                    console.log("Error inserting the internship data into the database!", err);
                    return;
                }

                console.log("Internship data inserted successfully!", result);
                res.send({message: "Internship data inserted successfully!"});

            });
        } else {
            console.log("Company not found!");
            res.send({message: "Company not found!"});
        }
    });
});


app.get("/internships", (req,res) => {

    db.query('SELECT * FROM internships', (err, result) => {

        if(err){

            console.log("Error selecting the data from the database!", err);
            return;

        }

        console.log("Internship data selected successfully!");
        return res.json(result);

    });

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});

app.get("/internship/:id", (req,res) => {

    const id = req.params.id;

    db.query('SELECT * FROM internships WHERE internship_ID = ?', [id], (err, result) => {

        if(err){

            console.log("Error selecting the data from the database!", err);
            return;

        }

        console.log("Internship data selected successfully!", result);
        return res.json(result);

    });

});

app.put("/internship/:id", (req,res) => {

    const id = req.params.id;
    const {
        internshipStartDate,
        internshipEndDate,
        internshipStatus,
        applyBy,
        availablePositions,
        whoCanApply,
        perksOfInternship,
        skillsRequired
    } = req.body;

    const data = [
        internshipStartDate,
        internshipEndDate,
        internshipStatus,
        applyBy,
        availablePositions,
        whoCanApply,
        perksOfInternship,
        skillsRequired,
    ];

    db.query('UPDATE internships SET start_date = ?, end_date = ?, internship_status = ?, apply_by = ?, available_positions = ?, who_can_apply = ?, perks = ?, skills_required = ? WHERE internship_ID = ?', [...data, id], (err, result) => {
            
            if(err){
    
                console.log("Error updating the data in the database!", err);
                return;
    
            }
    
            console.log("Internship data updated successfully!", result);
            res.send({message: "Internship data updated successfully!"});
    });

});

app.get("/company/:id/internships", (req,res) => {

    const id = req.params.id;

    db.query('SELECT * FROM internships WHERE company_ID = ?', [id], (err, result) => {

        if(err){

            console.log("Error selecting the data from the database!", err);
            return;

        }

        console.log("Internship data selected successfully!");
        return res.json(result);

    });

});

app.get("/intern/:id/applications", (req,res) => {

    const id = req.params.id;

    db.query('SELECT * FROM applications WHERE intern_ID = ?', [id], (err, result) => {

        if(err){

            console.log("Error selecting the data from the database!", err);
            return;

        }

        console.log("Application data selected successfully!", result);
        return res.json(result);

    });

});

app.delete("company/:id/internship/:internshipID/delete", (req,res) => {

    const internshipID = req.params.internshipID;

    db.query('DELETE FROM internships WHERE internship_ID = ?', [internshipID], (err, result) => {

        if(err){

            console.log("Error deleting the data from the database!", err);
            return;

        }

        console.log("Internship data deleted successfully!", result);
        res.send({message: "Internship data deleted successfully!"});

    });

});
