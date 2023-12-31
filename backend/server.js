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

         db.query('INSERT INTO users (username,email,password,user_type,is_Active) VALUES (?,?,?,?,?) ', [firstName.concat(lastName),emailAddress,hash,userType,isActive], (err, result) => {

            if(err){

                console.log("Error inserting the data into the database!", err);
                return;    

            }

            console.log("User data inserted successfully!", result);
            const token = jwt.sign({userId: result.insertId}, JWT_SECRET,{expiresIn: '8760h'});  //Generate token which will be used for authentication
            res.status(200).json({token}); 


        });

        db.query('INSERT INTO interns (first_name,last_name,date_of_birth,email_address,password,location,address,school,department,gender,telephone,is_Active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ', [firstName, lastName,dateOfBirth, emailAddress,hash,location, address, school, department,gender,parseInt(telephone),isActive], (err, result) => {

            if(err){

                console.log("Error inserting the data into the database!", err);
                return;

            }

            console.log("Intern data inserted successfully!", result);


        });
        

    });

    

});


//Registering Companies into the database
app.post("register/company", (req, res) => {

    isActive = true;
    const userType = "company";

    const {fullName, emailAddress, password, location, address, telephone} = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {

         db.query('INSERT INTO users (username,email,password,user_type,is_Active) VALUES (?,?,?,?,?) ', [fullName,emailAddress,hash,userType,isActive], (err, result) => {

            if(err){

                console.log("Error inserting the data into the database!", err);
                return;

            }

            console.log("User data inserted successfully!", result);
            const token = jwt.sign({userId: result.insertId}, JWT_SECRET,{expiresIn: '8760h'});  //Generate token which will be used for authentication
            res.status(200).json({token});


        });


        db.query('INSERT INTO companies (company_name,company_email,password,location_city,address,telephone,is_Active) VALUES (?,?,?,?,?,?,?) ', [fullName, emailAddress, hash, location, address, parseInt(telephone), isActive], (err, result) => {
            
            if(err){

                console.log("Error inserting the data into the database!", err);
                return;

            }

            console.log("Company data inserted successfully!", result);

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
        console.log(result)
        if(result.length > 0){

            bcrypt.compare(password, result[0].password, (error, response) => {

                if(response){

                    console.log("Login successful!");
                    const token = jwt.sign({userId: result[0].user_ID}, JWT_SECRET,{expiresIn: '8760h'});  //Generate token which will be used for authentication
                    res.status(200).json({token});

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
    const q = "UPDATE interns SET `email_address` = ?, `password` = ?, `location` = ?, `address` = ?, `telephone` = ? WHERE intern_ID = ?";
    const {emailAddress, password, location, address, telephone} = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {

        const data = [emailAddress, hash, location, address, parseInt(telephone)];
    
        db.query(q, [...data, id], (err, result) => {

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
            res.send({message: "User data updated successfully!"});

        });

    });

});

//Update company information
app.put("/update/company/:id", (req, res) => {

    const id = req.params.id;
    const q = "UPDATE companies SET `company_email` = ?, `password` = ?, `telephone` = ? WHERE company_ID = ?";
    const {emailAddress, password, telephone} = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {

        const data = [emailAddress, hash, parseInt(telephone)];
    
        db.query(q, [...data, id], (err, result) => {

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
            res.send({message: "User data updated successfully!"});

        });

    });

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
