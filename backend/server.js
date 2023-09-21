import "dotenv/config.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcrypt";


const saltRounds = 10;
const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({extended: true})); //This is used to parse the data from the form
app.use(bodyParser.json()); //This is used to parse the data from the form
app.use(express.static("public")); //This is used to serve static files like css, images, etc.
app.use(cors()); //This is used to allow cross-origin requests


let isActive = false;

//Create a connection to the database
const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database: "internconnect"

});

db.connect((err) => {

    console.log("Successfully connected to the database!");

    if(err){

        console.log("Error connecting to the database!", err);
        return;

    }

});

app.post("/register/intern", (req, res) => {

    console.log(req.body);
    isActive = true;
    const userType = "intern";

    const {firstName, lastName, dateOfBirth, emailAddress, password, location, address, school, department, gender, telephone} = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {

         db.query('INSERT INTO users (username,email,password,user_type,is_Active) VALUES (?,?,?,?,?) ', [firstName.concat(lastName),emailAddress,hash,userType,isActive], (err, result) => {

            if(err){

                console.log("Error inserting the data into the database!", err);
                return;

            }

            console.log("Intern data inserted successfully!", result);


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

app.post("register/company", (req, res) => {

    console.log(req.body);
    isActive = true;
    const userType = "company";

    const {fullName, emailAddress, password, location, address, telephone} = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {

         db.query('INSERT INTO users (username,email,password,user_type,is_Active) VALUES (?,?,?,?,?) ', [fullName,emailAddress,hash,userType,isActive], (err, result) => {

            if(err){

                console.log("Error inserting the data into the database!", err);
                return;

            }

            console.log("Intern data inserted successfully!", result);


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

app.post("/login", (req,res) => {

    console.log(req.body);

    const {emailAddress, password} = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [emailAddress], (err, result) => {

        if(err){

            console.log("Error selecting the data from the database!", err);
            return;

        }

        if(result.length > 0){

            bcrypt.compare(password, result[0].password, (error, response) => {

                if(response){

                    res.send({message: "Login successful!"});
                    console.log("Login successful!")

                }else{

                    res.send({message: "Wrong username/password combination!"});
                    console.log("Wrong username/password combination!");

                }

            });

        }else{

            res.send({message: "User doesn't exist!"});
            console.log("User doesn't exist!");

        }

    });

});


app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
