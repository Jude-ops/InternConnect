import React, {useState, useEffect} from 'react'
import Header from './Header'
import Footer from './Footer'
import SubHeader from './SubHeader'
import CompanyProfileNavbar from '../Profile_Updates/CompanyProfileNavbar'
import io from 'socket.io-client'
import queryString from 'query-string'
import {useLocation} from 'react-router-dom'
import axios from 'axios'

let socket;

function ChatSection(props) {

    const location = useLocation();
    const [chatUsers, setChatUsers] = useState({});
    const [userType, setUserType] = useState('');
    const [companyID, setCompanyID] = useState(null);
    const [internID, setInternID] = useState(null);
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState(''); //Message to be sent
    const [messages, setMessages] = useState([]); //Array of messages
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        const {companyID, internID} = queryString.parse(location.search);
        setCompanyID(companyID);
        setInternID(internID);
        const userType = localStorage.getItem('userType');
        setUserType(userType);

        socket = io(ENDPOINT)
        socket.connect();

        async function getUserData(){
            try {
                const response = userType === 'company' ? 
                    await axios.get(`http://localhost:5000/users/company/${companyID}`) : 
                    await axios.get(`http://localhost:5000/users/intern/${internID}`);
                setName(response.data[0].username);
                const room = `chat_${companyID}_${internID}`;
                setRoom(room);
                socket.emit('join', {name: response.data[0].username , room}, () => {
                    console.log('Joined chat room');
                });
            } catch (error) {
                console.log('Error fetching user data:', error);
            }
        }
        getUserData();    

        return () => {
            
            socket.disconnect();
            socket.off();
            
        }

    }, [location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

    }, [messages]);

    //Fetch messages from the database
    useEffect(() => {
        async function fetchMessages(){
            try {
                const response = await axios.get(`http://localhost:5000/chat/${room}`);
                setMessages(response.data);
            } catch (error) {
                console.log('Error fetching messages:', error);
            }
        }

        //Fetch intern and company names
        async function fetchNames(){
            try {
                const response = await axios.get(`http://localhost:5000/chat_users/${internID}/${companyID}`);
                setChatUsers(response.data);
            } catch (error) {
                console.log('Error fetching intern name:', error);
            }
        }

        fetchNames();

        fetchMessages();
    }, [room, internID, companyID]);

    const sendMessage = (event) => {
        event.preventDefault();

        if(message){
            socket.emit('sendMessage', {message, userType, internID, companyID, name, room}, () => setMessage(''));
        }
    }

    console.log(message, messages);

    function toggleActiveHeading(event){
        const allChats = document.querySelector('.title-all');
        const unreadChats = document.querySelector('.title-unread');

        if(event.target === allChats){
            allChats.classList.add('active-chat-heading');
            unreadChats.classList.remove('active-chat-heading');
        } else {
            unreadChats.classList.add('active-chat-heading');
            allChats.classList.remove('active-chat-heading');
        }
    }

    function handleFileChange(event){
        setFile(event.target.files[0]);
    }

  return (
    <div>
        <Header isAuthenticated = {props.isAuthenticated}/>
        <SubHeader
            title = "Chat Section"
        />
        <div className = "container my-5">
            <div className = "row mt-5">
                <div className = "col-12 col-md-4 col-lg-3 mx-auto">
                    <CompanyProfileNavbar logout = {props.logout} />
                </div>
                <div className="col-12 col-md-8 col-lg-9 mx-auto">
                    <div className = "chat-section w-100 mt-4 mt-md-0">
                        <div className = "chat-heading">
                            <h3 className = "fw-bold">Chat Section</h3>
                        </div>
                        <div className = "row">
                            <div className = "col-lg-4 col-md-12">
                                <div className = "chat-list-left">
                                    <div className = "chat-search-form">
                                        <div className = "input-group">
                                            <input type = "text" className = "form-control" placeholder = "Search for a chat"/>
                                            <button className = "btn btn-outline-secondary">
                                                <i className = "bi bi-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className = "chat-list-body mt-3">
                                        <div className = "chat-list-heading d-flex">
                                            <div className = "title-all" onClick={toggleActiveHeading}>All Chats</div>
                                            <div className = "title-unread" onClick = {toggleActiveHeading}>Unread</div>
                                        </div>
                                        <ul className = "chat-list">
                                            <li className = "chat-list-item">
                                                <a href = "#" className = "chat-list-link">
                                                    <div className = "d-flex">
                                                        <div className = "chat-avatar-img">
                                                            <img 
                                                                src = {
                                                                    userType === 'company' ? 
                                                                    chatUsers.intern && `http://localhost:5000/uploads/${chatUsers.intern.profile_image}` 
                                                                    : chatUsers.company && `http://localhost:5000/uploads/${chatUsers.company.profile_image}` 
                                                                } 
                                                                alt = "Avatar" 
                                                                className = "img-fluid rounded"
                                                            />
                                                        </div>
                                                        <div className = " ms-3 d-flex flex-column w-100 justify-content-between">
                                                            <div className = "d-flex justify-content-between">
                                                                <h6 className = "chat-name fw-bold">
                                                                    {   
                                                                        //If the user is a company, show the intern's name, else show the company's name
                                                                        userType === 'company' ?
                                                                        chatUsers.intern && chatUsers.intern.first_name + ' ' + chatUsers.intern.last_name
                                                                        : chatUsers.company && chatUsers.company.company_name
                                                                    }
                                                                </h6>
                                                                <span className = "chat-time">
                                                                    {   
                                                                        //If there are messages, show the time of the last message
                                                                        messages && messages.length > 0 && 

                                                                        //Ensure that the message is not empty before accessing the content
                                                                        messages[messages.length - 1].content &&
                                                                        new Date(messages[messages.length - 1].timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className = "chat-message">
                                                                <span>
                                                                    {   
                                                                        //If the message is greater than 20 characters, show the first 20 characters
                                                                        messages && messages.length > 0 && 

                                                                        //Ensure that the message is not empty before accessing the content
                                                                        messages[messages.length - 1].content &&
                                                                        messages[messages.length - 1].content.length > 20 ?
                                                                        messages[messages.length - 1].content.slice(0, 20) + '...'
                                                                        : messages && messages.length > 0 && messages[messages.length - 1].content && messages[messages.length - 1].content
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className = "col-lg-8 col-md-12">
                                <div className = "chat-board-right w-100">
                                    <div className = "chat-board-header">
                                        <div className = "d-flex justify-content-between align-items-center">
                                            <div className = "user-details d-flex">
                                                <div className = "chat-avatar-image d-flex justify-content-center align-items-center">
                                                    <img 
                                                        src = {
                                                            userType === 'company' ? 
                                                            chatUsers.intern && `http://localhost:5000/uploads/${chatUsers.intern.profile_image}` 
                                                            : chatUsers.company && `http://localhost:5000/uploads/${chatUsers.company.profile_image}`
                                                        } 
                                                        alt = "Avatar" 
                                                        className = "img-fluid"
                                                    />
                                                </div>
                                                <div className = "ms-3 d-flex flex-column">
                                                    <h5 className = "chat-name">
                                                        {   
                                                            //If the user is a company, show the intern's name, else show the company's name
                                                            userType === 'company' ?
                                                            //Ensure that chatUsers is not empty before accessing the intern's name
                                                            chatUsers.intern && chatUsers.intern.first_name + ' ' + chatUsers.intern.last_name
                                                            : chatUsers.company && chatUsers.company.company_name
                                                        }
                                                    </h5>
                                                    <small className = "chat-status">
                                                        {
                                                            //If the user is a company, show the intern's professional title, else show the company's location
                                                            userType === 'company' ?
                                                            chatUsers.intern && chatUsers.intern.professional_title
                                                            : chatUsers.company && chatUsers.company.location_city
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                            <div className = "chat-actions d-flex">
                                                <div className="dropdown">
                                                    <button className="btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className = "bi bi-three-dots-vertical"></i>
                                                    </button>
                                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                        <li><a className="dropdown-item" href="#">Mark as unread</a></li>
                                                        {   
                                                            //If the user is a company, show the following options
                                                            userType === 'company' ?
                                                            <div>
                                                                <li><a className="dropdown-item" href={`/intern/${internID}/public_profile`}>View intern details</a></li>
                                                                <li><a className="dropdown-item" href="#">Shortlist intern</a></li>
                                                            </div>
                                                            : 
                                                            <div>
                                                                <li><a className="dropdown-item" href={`/company/${companyID}/public_profile`}>View company details</a></li>
                                                            </div>
                                                        }
                                                        <li><a className="dropdown-item" href="#">Block Chat</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className = "chat-board-body">
                                        <div className = "chat-messages">
                                            <ul className = "chat-messages-list">

                                                {messages && messages.map((message, index) => {
                                                    
                                                    const isSentByCurrentUser = message.user === name;
                                                    return (
                                                        <li key = {index} className = {`d-flex ${isSentByCurrentUser ? 'chat-content-right justify-content-end' : ''}`}>
                                                            <div className = "chat-img">
                                                                <img 
                                                                    src = {
                                                                        userType === 'company' ? 
                                                                        chatUsers.intern && `http://localhost:5000/uploads/${chatUsers.intern.profile_image}` 
                                                                        : chatUsers.company && `http://localhost:5000/uploads/${chatUsers.company.profile_image}`
                                                                    } 
                                                                    alt = "Avatar" 
                                                                    className = "img-fluid"
                                                                />
                                                            </div>
                                                            <div className = "chat-content">
                                                                <div className = "chat-text">{message.content}</div>
                                                                <div className = "chat-time">
                                                                {
                                                                    //Remove the seconds from the time
                                                                    new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                                                }</div>
                                                            </div>
                                                        </li>
                                                    )
                                                })}

                                            </ul>
                                        </div>
                                    </div>
                                    <div className = "chat-board-footer">
                                        {file && 
                                            <div className = "attachment-frames d-flex">
                                                <div className = "frame-container d-flex flex-column">
                                                    <span>
                                                        {file.name}
                                                    </span>
                                                    <small className = "text-muted">
                                                        {   
                                                            //If the file size is greater than 1MB, convert it to MB, else convert it to KB
                                                            file.size > 1000000 ?
                                                            `${(file.size / 1000000).toFixed(2)} MB`
                                                            : `${(file.size / 1000).toFixed(2)} KB`
                                                        }
                                                    </small>
                                                </div>
                                                <div className = "frame-actions ms-3"> 
                                                    <i className = "bi bi-x-lg" onClick = {() => setFile(null)}></i>  
                                                </div>
                                            </div>
                                        }
                                        <div className = "message-input d-flex justify-content-between">
                                            <div className = "d-flex w-100">
                                                <label htmlFor = "additionalDocuments" className = " fw-bold additional-documents">
                                                    <i className = "bi bi-paperclip h4"></i>
                                                </label>
                                                <input 
                                                    type = "file" 
                                                    id = "additionalDocuments" 
                                                    className = "form-control"
                                                    name = "additionalDocuments"
                                                    onChange={handleFileChange}
                                                />
                                                <input 
                                                    type = "text"
                                                    value = {message}
                                                    onChange = {(event) => setMessage(event.target.value)}
                                                    onKeyDown = {event => event.key === 'Enter' ? sendMessage(event) : null}
                                                    placeholder = "Write a Message here..."
                                                    className = "form-control"
                                                />
                                            </div>
                                            <button 
                                                className = "btn"
                                                onClick = {event => sendMessage(event)}
                                            ><i className = "bi bi-send h4" style = {{color: "#2980B9"}}></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default ChatSection  