import "dotenv/config.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import {dirname, join} from "path";
import {fileURLToPath} from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const saltRounds = 10;
const app = express();
const port = 5000;
const JWT_SECRET = "internconnect-cameroon";


app.use(cors()); //This is used to allow cross-origin requests
app.use(bodyParser.urlencoded({extended: true})); //This is used to parse the data from the form
app.use(bodyParser.json()); //This is used to parse the data from the form
app.use(express.static("public")); //This is used to serve static files like css, images, etc.
app.use('/uploads', express.static('uploads')); // Serve uploaded files


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

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, join(__dirname, 'uploads/')); // Save files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename
    }
});
const upload = multer({ storage: storage });


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

    const {
            firstName, 
            lastName, 
            dateOfBirth, 
            age, 
            professionalTitle, 
            description,
            skills, 
            emailAddress, 
            password, 
            location, 
            address, 
            gender, 
            telephone
        } = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {

        db.query('INSERT INTO interns (first_name,last_name,date_of_birth, age, professional_title, short_bio, skills, email_address,password,location,address,gender,telephone,is_Active, registration_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ', [firstName, lastName,dateOfBirth, age, professionalTitle, description, skills, emailAddress,hash,location, address, gender,parseInt(telephone),isActive, new Date()], (err, result) => {

            if(err){

                console.log("Error inserting the data into the database!", err);
                return;

            }

            console.log("Intern data inserted successfully!", result);

            // Get the internID of the newly inserted intern
            const internID = result.insertId;

            db.query('INSERT INTO users (username,email,password,user_type,is_Active,intern_ID) VALUES (?,?,?,?,?,?) ', [firstName.concat(lastName),emailAddress,hash,userType,isActive,internID], (err, result) => {

                if(err){
    
                    console.log("Error inserting the data into the database!", err);
                    return;    
    
                }
    
                console.log("User data inserted successfully!", result);
                const token = jwt.sign({userId: result.insertId}, JWT_SECRET,{expiresIn: '8760h'});  //Generate token which will be used for authentication
                res.status(200).json({token, userType, firstName, internID}); 
    
            });

        });      
        
    });

});


//Registering Companies into the database
app.post("/register/company", (req, res) => {

    isActive = true;
    const userType = "company";

    const {
            fullName, 
            emailAddress,
            dateFounded,
            website, 
            password, 
            location, 
            address, 
            telephone, 
            description
        } = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {

        db.query('INSERT INTO companies (company_name,company_email,founded_date,website,password,location_city,address,telephone,is_Active, company_description, registration_date) VALUES (?,?,?,?,?,?,?,?,?,?,?) ', [fullName, emailAddress, dateFounded, website, hash, location, address, parseInt(telephone), isActive, description], (err, result) => {
            
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
                res.status(200).json({token, userType, companyID, fullName});
    
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
app.put("/update/intern/:id", upload.single('profileImage'), (req, res) => {

    const id = req.params.id;
    let profileImage;
    if(req.file){
        profileImage = req.file.originalname;
    };

    const {
        fullName, 
        emailAddress, 
        dateOfBirth, 
        age, 
        professionalTitle, 
        description,
        skills, 
        password, 
        location, 
        address, 
        telephone,
    } = req.body;

    const names = fullName.split(" ");
    const firstName = names[0];
    const lastName = names[1];

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

                const data = [
                        firstName, 
                        lastName, 
                        dateOfBirth, 
                        age, 
                        professionalTitle, 
                        description,
                        skills,
                        emailAddress, 
                        hash, 
                        location, 
                        address,
                        parseInt(telephone),
                    ];

                if(profileImage){
                    data.push(profileImage);
                }
            
                db.query(`UPDATE interns SET first_name = ?, last_name = ?, date_of_birth = ?, age = ?, professional_title = ?, short_bio = ?, skills = ?, email_address = ?, password = ?, location = ?, address = ?, telephone = ?${profileImage ? ', profile_image = ?' : ''} WHERE intern_ID = ?`, [...data, internID], (err, result) => {
        
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

app.delete("/company/:id/internship/:internshipID/delete", (req,res) => {

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

//Get intern info to update profile info
app.get("/intern/:id", (req,res) => {
    const internID = req.params.id;
    db.query('SELECT * FROM interns WHERE intern_ID = ?', [internID], (err, result) => {
        if(err){
            console.log("Error selecting the data from the database!", err);
            return;
        }
        console.log("Intern data selected successfully!");
        return res.json(result);
    });
});

//Add intern education info
app.post("/intern/:id/education", (req,res) => {
    const internID = req.params.id;
    const educationEntries = req.body;

    educationEntries.forEach(education => {
        const {
            school_name,
            department,
            location,
            degree,
            start_date,
            end_date
        } = education;

        const data = [
            internID,
            school_name,
            department,
            location,
            degree,
            start_date,
            end_date
        ];

        db.query('INSERT INTO education_history (intern_ID, school_name, department, location, degree, start_date, end_date) VALUES (?,?,?,?,?,?,?) ', [...data], (err, result) => {
            if(err){
                console.log("Error inserting the education data into the database!", err);
                return;
            }
            console.log("Education data inserted successfully!", result);
        });
    });

    res.send({message: "Education data inserted successfully!"});
});

//Add intern experience info
app.post("/intern/:id/work-history", (req,res) => {
    const internID = req.params.id;
    const workHistoryEntries = req.body;

    workHistoryEntries.forEach(workHistory => {
        const {
            company_name,
            location,
            position,
            description,
            start_date,
            end_date
        } = workHistory;

        const data = [
            internID,
            company_name,
            location,
            position,
            description,
            start_date,
            end_date
        ];

        db.query('INSERT INTO work_history (intern_ID, company_name, location, position, short_description, start_date, end_date) VALUES (?,?,?,?,?,?,?) ', [...data], (err, result) => {
            if(err){
                console.log("Error inserting the work history data into the database!", err);
                return;
            }
            console.log("Work History data inserted successfully!", result);
        });
    });

    res.send({message: "Work History data inserted successfully!"});
});

//Get intern education info to update profile info
app.get("/intern/:id/education", (req,res) => {
    const internID = req.params.id;
    db.query('SELECT * FROM education_history WHERE intern_ID = ?', [internID], (err, result) => {
        if(err){
            console.log("Error selecting the data from the database!", err);
            return;
        }
        console.log("Education data selected successfully!");
        return res.json(result);
    });
});

//Get intern experience info to update profile info
app.get("/intern/:id/work_experience", (req,res) => {
    const internID = req.params.id;
    db.query('SELECT * FROM work_history WHERE intern_ID = ?', [internID], (err, result) => {
        if(err){
            console.log("Error selecting the data from the database!", err);
            return;
        }
        console.log("Work Experience data selected successfully!");
        return res.json(result);
    });
});

//Update intern education info
app.put("/update/intern/:internID/education/:educationID", (req,res) => {
    const internID = req.params.internID;
    const educationID = req.params.educationID;
    const {
        school_name, 
        department, 
        degree, 
        end_date, 
    } = req.body;

    const data = [
        school_name, 
        department, 
        degree, 
        end_date
    ];

    db.query('UPDATE education_history SET school_name = ?, department = ?, degree = ?, end_date = ? WHERE intern_ID = ? AND education_id = ?', [...data, internID, educationID], (err, result) => {
        if(err){
            console.log("Error updating the education data in the database!", err);
            return;
        }
        console.log("Education data updated successfully!", result);
        res.send({message: "Education data updated successfully!"});
    });
});

//Update intern experience info
app.put("/update/intern/:internID/work_experience/:workExperienceID", (req,res) => {
    const internID = req.params.internID;
    const workExperienceID = req.params.workExperienceID;
    const {
        company_name, 
        position, 
        start_date, 
        end_date, 
    } = req.body;

    const data = [
        company_name, 
        position, 
        start_date, 
        end_date
    ];

    db.query('UPDATE work_history SET company_name = ?, position = ?, start_date = ?, end_date = ? WHERE intern_ID = ? AND work_id = ?', [...data, internID, workExperienceID], (err, result) => {
        if(err){
            console.log("Error updating the work history data in the database!", err);
            return;
        }
        console.log("Work Experience data updated successfully!", result);
        res.send({message: "Work Experience data updated successfully!"});
    });
});

//Delete intern education info
app.delete("/delete/intern/:internID/education/:educationID", (req,res) => {
    const internID = req.params.internID;
    const educationID = req.params.educationID;
    db.query('DELETE FROM education_history WHERE intern_ID = ? AND education_id = ?', [internID, educationID], (err, result) => {
        if(err){
            console.log("Error deleting the education data from the database!", err);
            return;
        }
        console.log("Education data deleted successfully!", result);
        res.send({message: "Education data deleted successfully!"});
    });
});

//Delete intern experience info
app.delete("/delete/intern/:internID/work_experience/:workExperienceID", (req,res) => {
    const internID = req.params.internID;
    const workExperienceID = req.params.workExperienceID;
    db.query('DELETE FROM work_history WHERE intern_ID = ? AND work_id = ?', [internID, workExperienceID], (err, result) => {
        if(err){
            console.log("Error deleting the work history data from the database!", err);
            return;
        }
        console.log("Work Experience data deleted successfully!", result);
        res.send({message: "Work Experience data deleted successfully!"});
    });
});

//Get intern info to apply for internship
app.get("/intern/info/:internID", (req,res) => {

    const internID = req.params.internID;
    console.log(internID);

    db.query('SELECT * FROM interns WHERE intern_ID = ?', [internID], (err, result) => {

        if(err){

            console.log("Error selecting the data from the database!", err);
            return;

        }

        console.log("Intern data selected successfully!");
        return res.json(result);

    });
    
});

//Route for applying to an internship
app.post('/internship/:id/apply', upload.single('resume'), (req, res) => {

    // Save file metadata to the database
    const filename = req.file.originalname;
    const resume = req.file.path;
    const fileType = req.file.mimetype;
    const fileSize = req.file.size;

    const id = req.params.id;

    const {
        internID, 
        companyID, 
        fullName, 
        email, 
        phone,
        coverletter,
        applicationStatus
    } = req.body;

    const data = [
        internID, 
        companyID,
        id, 
        fullName, 
        email, 
        phone,
        coverletter,
        resume,
        applicationStatus,
        new Date() // Date of application
    ];

    db.query('INSERT INTO applications (intern_ID, company_ID, internship_ID, full_name, email, phone, cover_letter, resume, application_status, date_applied) VALUES (?,?,?,?,?,?,?,?,?,?) ', [...data], (err, result) => {
        
        if(err){

            console.log("Error inserting the data into the database!", err);
            return;

        }

        console.log("Application data inserted successfully!", result);
        res.send({message: "Application data inserted successfully!"});

    });
   
    const sql = 'INSERT INTO documents (document_name, document_type, document_size, document_path, intern_ID) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [filename, fileType, fileSize, resume, internID ], (err, result) => {
        if (err) throw err;
        console.log('File uploaded to the database', result);
        res.send('File uploaded successfully');
    });
});

//Route to retrieve and get a file
app.get('/document/:internID', (req, res) => {
    const internID = req.params.internID;
    const sql = 'SELECT document_path FROM documents WHERE intern_ID = ?';
    db.query(sql, [internID], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const filepath = result[0].document_path;
            res.download(filepath); // Serve the file
        } else {
            res.status(404).send('File not found');
        }
    });
});

app.post("/intern/:id/saved-internships", (req,res) => {
    
    const internID = req.params.id;
    const {internship_ID} = req.body;

    db.query('INSERT INTO saved_internships (internship_ID, intern_ID) VALUES (?,?) ', [internship_ID, internID], (err, result) => {

        if(err){

            console.log("Error inserting the data into the database!", err);
            return;

        }

        console.log("Saved internship data inserted successfully!", result);
        res.send({message: "Saved internship data inserted successfully!"});

    });
    
});

app.get("/intern/:id/saved-internships", (req,res) => {

    const internID = req.params.id;

    //Join internships and saved_internships tables to get the saved internships

    const query = `
        SELECT internships.* FROM saved_internships
        INNER JOIN internships ON saved_internships.internship_ID = internships.internship_ID
        WHERE saved_internships.intern_ID = ?
    `;

    db.query(query, [internID], (err, result) => {

        if(err){

            console.log("Error selecting the data from the database!", err);
            return;

        }

        console.log("Saved internships data selected successfully!", result);
        return res.json(result);

    });

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});