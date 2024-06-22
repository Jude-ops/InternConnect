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
import { createServer } from "http";
import { Server } from "socket.io";

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

//Create HTTP server and attach socket.io to it
const server = createServer(app);
//Create an instance of the socket.io server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

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

//function to check if user is online or not
function updateUserStatus(name, isOnline){
    console.log(`User ${name} is ${isOnline ? "online" : "offline"}`);
    io.emit("userStatus", {name, isOnline});
}

//function to insert a new room into the database
function insertRoom(roomName){
    db.query('INSERT INTO chat_rooms (room_name) VALUES (?)', [roomName], (err, result) => {
        if(err){
            console.log("Error adding the room to the database!", err);
            return;
        }
        console.log("Room inserted successfully!", result);
        return result.insertId;
    });
}

//function to check if a room exists in the database
function checkRoom(roomName){
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM chat_rooms WHERE room_name = ?', [roomName], (err, result) => {
            if(err){
                console.log('Error selecting data', err)
                reject(err);
            } else {
                resolve(result.length > 0);
            }
            
        });    
    });
}

//Listen for connection event
io.on("connection", async (socket) => {
    console.log("A user connected!", socket.id);
    const name = socket.handshake.query.name;
    updateUserStatus(name, true);

    //Listen for the "join" event from the client
    socket.on("join", async ({name, room}, callback) => {  

       const roomExists = await checkRoom(room);
       if(!roomExists){
        insertRoom(room);
       }

        console.log(`${name} joined room ${room}`);
        socket.join(room);

        callback();
    });

    //Listen for the "message" event from the client
    socket.on("sendMessage", ({message, userType, companyID, internID, name, room}, callback) => {
        console.log(`Message from ${name} in room ${room} received: ${message}`);

        //Check if the message is empty
        if(message.trim() === ""){
            return callback("Message cannot be empty!");
        }

        //Check if the user is an intern or a company
        let senderID, receiverID;
        if(userType === "intern"){
            senderID = internID;
            receiverID = companyID;
        }else{
            senderID = companyID;
            receiverID = internID;
        }

        //Save the message to the database
        db.query('INSERT INTO messages (senders_id, user, receivers_id, content, chat_room) VALUES (?,?,?,?,?) ', [senderID, name, receiverID, message, room], (err, result) => {
            if(err){
                console.log("Error storing message in database:", err);
                return;
            }
            console.log("Message stored in database!");
        });

        io.to(room).emit("message", {user: name, content: message});
        //Emit an event for a new message notification
        io.to(room).emit("newMessageNotification", {user: name, content: message});
        callback();
    });

    //Listen for the "disconnect" event
    socket.on("disconnect", () => {
        console.log("A user disconnected!", socket.id);
        updateUserStatus(name, false);
    });
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

            db.query('INSERT INTO users (username,email,password,user_type,is_Active,intern_ID) VALUES (?,?,?,?,?,?) ', [firstName + " " + lastName,emailAddress,hash,userType,isActive,internID], (err, result) => {

                if(err){
    
                    console.log("Error inserting the data into the database!", err);
                    return;    
    
                }
    
                console.log("User data inserted successfully!", result);
                const token = jwt.sign({userId: result.insertId}, JWT_SECRET,{expiresIn: '8760h'});  //Generate token which will be used for authentication
                const userId = result.insertId;
                res.status(200).json({token, userType, firstName, internID, userId}); 
    
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

        db.query('INSERT INTO companies (company_name,company_email,founded_date,website,password,location_city,address,telephone,is_Active, company_description, registration_date) VALUES (?,?,?,?,?,?,?,?,?,?,?) ', [fullName, emailAddress, dateFounded, website, hash, location, address, parseInt(telephone), isActive, description, new Date()], (err, result) => {
            
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
                const userId = result.insertId;
                res.status(200).json({token, userType, companyID, fullName, userId});
    
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
                    const userId = result[0].user_ID;
                    res.status(200).json({token, userType: result[0].user_type, companyID, internID, userId});

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

//Get corresponding user info from users table based on the companyID
app.get("/users/company/:companyID", (req,res) => {
    const companyID = req.params.companyID;

    //
    db.query('SELECT * FROM users WHERE company_ID = ?', [companyID], (err, result) => {
        if(err){
            console.log("Error selecting the data from the database!", err);
            return;
        }
        console.log("User data selected successfully!");
        return res.json(result);
    });
});

//Get corresponding user info from users table based on the internID
app.get("/users/intern/:internID", (req,res) => {
    const internID = req.params.internID;
    db.query('SELECT * FROM users WHERE intern_ID = ?', [internID], (err, result) => {
        if(err){
            console.log("Error selecting the data from the database!", err);
            return;
        }
        console.log("User data selected successfully!");
        return res.json(result);
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

//Get company info to update profile info
app.get("/company/:id", (req,res) => {
    const companyID = req.params.id;
    db.query('SELECT * FROM companies WHERE company_ID = ?', [companyID], (err, result) => {
        if(err){
            console.log("Error selecting the data from the database!", err);
            return;
        }
        console.log("Company data selected successfully!");
        return res.json(result);
    });
});

//Update company information
app.put("/update/company/:id", upload.single("profileImage"), (req, res) => {

    const id = req.params.id;
    let profileImage;
    if(req.file){
        profileImage = req.file.originalname;
    };

    const {
        fullName,
        emailAddress,
        foundedDate,
        website,
        password,
        location,
        address,
        telephone,
        description
    } = req.body;

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

                const data = [
                    fullName,
                    emailAddress,
                    foundedDate,
                    website, 
                    hash,
                    location,
                    address, 
                    parseInt(telephone),
                    description
                ];

                if(profileImage){
                    data.push(profileImage);
                }
            
                db.query(`UPDATE companies SET company_name = ?, company_email = ?, founded_date = ?, website = ?, password = ?, location_city = ?, address = ?, telephone = ?, company_description = ?${profileImage ? ', profile_image = ?' : ''} WHERE company_ID = ?`, [...data, companyID], (err, result) => {
        
                    if(err){
        
                        console.log("Error updating the company data in the database!", err);
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

//Get all internships
app.get("/internships", (req,res) => {
    //Join the internships table with the companies table to get the company profile image
    db.query('SELECT internships.*, companies.profile_image FROM internships INNER JOIN companies ON internships.company_ID = companies.company_ID', (err, result) => {
        if(err){
            console.log("Error selecting all the internships from the database!", err);
            return;
        }
        console.log("All Internships selected successfully!");
        return res.json(result);
    });
});

//Get details of a specific internship
app.get("/internship/:id", (req,res) => {
    const id = req.params.id;
    //Join the internships table with the companies table to get the company profile image
    db.query('SELECT internships.*, companies.profile_image FROM internships INNER JOIN companies ON internships.company_ID = companies.company_ID WHERE internship_ID = ?', [id], (err, result) => {           
        if(err){
            console.log("Error selecting the data from the database!", err);
            return;
        }
        console.log("Internship data selected successfully!");
        return res.json(result);  
    });
});

//Update internship information
app.put("/internship/:id", (req,res) => {

    const id = req.params.id;
    const {
        internshipName,
        internshipDescription,
        location,
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

    const data = [
        internshipName,
        internshipDescription,
        location,
        internshipStartDate,
        internshipEndDate,
        internshipStatus,
        category,
        applyBy,
        availablePositions,
        whoCanApply,
        perksOfInternship,
        skillsRequired,
    ];

    db.query('UPDATE internships SET internship_name = ?, internship_description = ?, location_city = ?, start_date = ?, end_date = ?, internship_status = ?, category = ?, apply_by = ?, available_positions = ?, who_can_apply = ?, perks = ?, skills_required = ? WHERE internship_ID = ?', [...data, id], (err, result) => {
            
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

//Get applications for a specific intern
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

//Join applications table with internships table to get internship name only
app.get("/company/:id/applications", (req,res) => {
    const id = req.params.id;
    db.query('SELECT applications.*, internships.internship_name FROM applications INNER JOIN internships ON applications.internship_ID = internships.internship_ID WHERE applications.company_ID = ?', [id], (err, result) => {
        if(err){
            console.log("Error selecting the data from the database!", err);
            return;
        }
        console.log("Application data selected successfully!");
        return res.json(result);
    });
});

//Get applications for a specific internship
app.get("/internship/:internshipID/applications", (req,res) => {
    const id = req.params.internshipID;

    //Join the applications table with the interns and internships table to get the intern name, profile image, and internship name
    db.query('SELECT applications.*, interns.profile_image, interns.professional_title, internships.internship_name FROM applications INNER JOIN interns ON applications.intern_ID = interns.intern_ID INNER JOIN internships ON applications.internship_ID = internships.internship_ID WHERE applications.internship_ID = ?', [id], (err, result) => {
        if(err){
            console.log("Error selecting the data from the database!", err);
            return;
        }
        console.log("Application data selected successfully!");
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

//Route to save an internship
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

//Route to get saved internships
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

//Route to delete a saved internship
app.delete("/intern/:id/saved-internship/:internshipID", (req,res) => {
    const internID = req.params.id;
    const internshipID = req.params.internshipID;
    db.query('DELETE FROM saved_internships WHERE intern_ID = ? AND internship_ID = ?', [internID, internshipID], (err, result) => {
        if(err){
            console.log("Error deleting the saved internship from the database!", err);
            return;
        }
        console.log("Saved internship data deleted successfully!", result);
        res.send({message: "Saved internship data deleted successfully!"});
    });
});

//Route to shortlist an intern
app.post("/company/:id/shortlist", (req,res) => {
    const companyID = req.params.id;
    const {internID} = req.body;
    db.query('INSERT INTO shortlisted_interns (company_ID, intern_ID) VALUES (?,?) ', [companyID, internID], (err, result) => {
        if(err){
            console.log("Error inserting the data into the database!", err);
            return;
        }
        console.log("Shortlisted intern data inserted successfully!");
        res.send({message: "Shortlisted intern data inserted successfully!"});
    }); 
});

//Route to get shortlisted interns
app.get("/company/:companyID/shortlist", (req,res) => {
    const companyID = req.params.companyID;

    //Join shortlisted_interns, interns, and companies tables  to get the shortlisted interns and company name
    const query = `
        SELECT interns.*, companies.company_name FROM shortlisted_interns
        INNER JOIN interns ON shortlisted_interns.intern_ID = interns.intern_ID
        INNER JOIN companies ON shortlisted_interns.company_ID = companies.company_ID
        WHERE shortlisted_interns.company_ID = ?
    `;
    db.query(query, [companyID], (err, result) => {
        if(err){
            console.log("Error selecting the data from the database!", err);
            return;
        }
        console.log("Shortlisted interns data selected successfully!");
        return res.json(result);
    });
});

//Delete shortlisted intern
app.delete("/company/:companyID/shortlist/:internID", (req,res) => {
    const companyID = req.params.companyID;
    const internID = req.params.internID;
    db.query('DELETE FROM shortlisted_interns WHERE company_ID = ? AND intern_ID = ?', [companyID, internID], (err, result) => {
        if(err){
            console.log("Error deleting the shortlisted intern from the database!", err);
            return;
        }
        console.log("Shortlisted intern data deleted successfully!");
        res.send({message: "Shortlisted intern data deleted successfully!"});
    });
});

//Fetch chat messages
app.get("/chat/:id", (req,res) => {
    const id = req.params.id;
    db.query('SELECT * FROM messages WHERE chat_room = ? ORDER BY timestamp ASC', [id], (err, result) => {
        if(err){
            console.log("Error selecting the messages from the database!", err);
            return;
        }
        console.log("Chats selected successfully!");
        return res.json(result);
    });
});

//Fetch users in a chat room
app.get("/chat_users/:internID/:companyID", (req,res) => {
    const internID = req.params.internID;
    const companyID = req.params.companyID;

    //Select interns and companies from their respective tables
    db.query('SELECT * FROM interns WHERE intern_ID = ?', [internID], (err, internResult) => {
        if(err){
            console.log("Error selecting the intern from the database!", err);
            return;
        }
        db.query('SELECT * FROM companies WHERE company_ID = ?', [companyID], (err, companyResult) => {
            if(err){
                console.log("Error selecting the company from the database!", err);
                return;
            }
            console.log("Chat users selected successfully!");
            return res.json({intern: internResult[0], company: companyResult[0]});
        });
    });

});

//Get chat rooms for a specific user
app.get("/chat_rooms/:id", (req,res) => {
    const id = req.params.id;
    console.log(id);

    //Join chat rooms, chat room users, and users tables to get the chat rooms for a specific user
    const query = `
        SELECT chat_rooms.*, users.username, users.user_type, users.intern_ID, users.company_ID FROM chat_rooms
        INNER JOIN chat_room_users ON chat_rooms.room_name = chat_room_users.room_name
        INNER JOIN users ON chat_room_users.user_ID = users.user_ID
        WHERE chat_room_users.user_ID = ?
    `;
    db.query(query, [id], (err, result) => {
        if(err){
            console.log("Error selecting the chat rooms from the database!", err);
            return;
        }
        console.log("Chat rooms selected successfully!");
        
        //Get other user in the chat room
       const chatRooms = result.map(room => room.room_name);
        db.query(`
            SELECT 
                chat_room_users.*, 
                users.username, 
                users.user_type, 
                users.intern_ID, 
                users.company_ID, 
                CASE
                    WHEN users.user_type = 'intern' THEN interns.profile_image
                    WHEN users.user_type = 'company' THEN companies.profile_image
                END AS profile_image,
                last_message.content AS last_message,
                last_message.timestamp AS last_message_timestamp
            FROM chat_room_users
            JOIN users ON chat_room_users.user_ID = users.user_ID
            LEFT JOIN companies ON users.user_type = 'company' AND users.company_ID = companies.company_ID
            LEFT JOIN interns ON users.user_type = 'intern' AND users.intern_ID = interns.intern_ID
            LEFT JOIN (
                SELECT 
                    messages.content,
                    messages.chat_room,
                    messages.timestamp
                FROM messages
                INNER JOIN (
                    SELECT 
                        chat_room,
                        MAX(timestamp) AS timestamp
                    FROM messages
                    GROUP BY chat_room
                ) AS latest_messages ON messages.chat_room = latest_messages.chat_room AND messages.timestamp = latest_messages.timestamp
            ) AS last_message ON chat_room_users.room_name = last_message.chat_room
            WHERE chat_room_users.room_name IN (?)
            AND chat_room_users.user_ID != ?
        `, [chatRooms, id], (err, otherUserResult) => {
            if(err){
                console.log("Error selecting the other user from the database!", err);
                return;
            }
            console.log("Other user selected successfully!");
            const roomsWithUsers = result.map(room => ({
                ...room,
                users: otherUserResult.filter(user => user.room_name === room.room_name)
        }));

        return res.json(roomsWithUsers);
        });

    });

});

//Listen to the port and start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});