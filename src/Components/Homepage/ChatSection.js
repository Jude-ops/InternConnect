import React, {useState, useEffect} from 'react'
import Header from './Header'
import Footer from './Footer'
import SubHeader from './SubHeader'
import CompanyProfileNavbar from '../Profile_Updates/CompanyProfileNavbar'
import InternProfileNavbar from '../Intern_Profile/InternProfileNavbar'
import io from 'socket.io-client'
import queryString from 'query-string'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'

let socket;

function ChatSection(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const {userId} = useParams();
    const [chatRooms, setChatRooms] = useState([]);
    const [chatUsers, setChatUsers] = useState({});
    const [userID, setUserID] = useState(null);
    const [userType, setUserType] = useState('');
    const [companyID, setCompanyID] = useState(null);
    const [internID, setInternID] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState(''); //Message to be sent
    const [messages, setMessages] = useState([]); //Array of messages
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        socket = io(ENDPOINT, {
            query: {
                name: name,
            }
        });
        
        return () => {            
            socket.disconnect();
            socket.off();         
        }
    }, [name]);

    useEffect(() => {
        const {companyID, internID} = queryString.parse(location.search);
        setCompanyID(companyID);
        setInternID(internID);
        const userType = localStorage.getItem('userType');
        setUserType(userType);
        
        //Setup online/offline status
        socket.on("userStatus", ({name, isOnline}) => {
            //First check if user is company or intern
            if(userType === 'company' && chatUsers.intern){
                if(name === chatUsers.intern.first_name + ' ' + chatUsers.intern.last_name){
                    setIsOnline(isOnline);
                }
            } else if(userType === 'intern' && chatUsers.company){
                if(name === chatUsers.company.company_name){
                    setIsOnline(isOnline);
                }
            }
        });

        async function getUserData(){
            try {
                const response = userType === 'company' ? 
                    await axios.get(`http://localhost:5000/users/company/${companyID}`) : 
                    await axios.get(`http://localhost:5000/users/intern/${internID}`);
                setName(response.data[0].username);
                setUserID(response.data[0].user_ID);
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

    }, [location.search, name, chatUsers, userType]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

        //Scroll to the last message
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;

        //Handle new message notification
        socket.on('newMessageNotification', (message) => {
            console.log('New message:', message);
        });

    }, [messages]);

    //Fetch messages from the database
    useEffect(() => {
        async function fetchMessages(){
            try {
                const response = await axios.get(`http://localhost:5000/chat/${room && room}`);
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

    //Fetch chat rooms for the user
    useEffect(() => {
        async function fetchChatRooms(){
            if(userID){
                try {
                    const response = await axios.get(`http://localhost:5000/chat_rooms/${userID}`);
                    setChatRooms(response.data);
                    console.log('Chat rooms:', response.data);
                } catch (error) {
                    console.log('Error fetching chat rooms:', error);
                }
            } else {
                //If the user ID is not available, use the userId from the useParams hook
                try {
                    const response = await axios.get(`http://localhost:5000/chat_rooms/${userId}`);
                    setChatRooms(response.data);
                    console.log('Chat rooms:', response.data);
                } catch (error) {
                    console.log('Error fetching chat rooms:', error);
                }
            }
        }

        fetchChatRooms();
    }, [userID, userId]);

    const sendMessage = (event) => {
        event.preventDefault();

        if(message){
            socket.emit('sendMessage', {message, userType, internID, companyID, name, room, sendTimestamp: new Date().toISOString()}, () => setMessage(''));
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

    function navigateToVideoChat(intern_Id, userRooms){
        //Navigate to the video chat page and pass the company's user ID and the user ID of the other user in the room
        if(userRooms){
            //Get the specific chatRoom based on internID
            const internIdNumber = parseInt(intern_Id);
            const specificChatRoom = userRooms.find(userRoom => userRoom.users.some(user => userType === 'company' ? user.intern_ID : user.company_ID === internIdNumber));
            if(specificChatRoom){
                navigate('/video_chat', {state: {chatRoom: specificChatRoom}});
            } else{
                console.log("No chatRoom found for the given internID");
            }
        } else {
            console.log("chatRooms array is empty");
        } 
    }

  return (
    <div>
        <Header isAuthenticated = {props.isAuthenticated} logout = {props.logout}/>
        <SubHeader
            title = "Chat Section"
        />
        <div className = "container my-5">
            <div className = "row mt-5">
                <div className = "col-12 col-md-4 col-lg-3 mx-auto">
                    { userType === 'company' ?
                        <CompanyProfileNavbar logout = {props.logout} />
                        :
                        <InternProfileNavbar logout = {props.logout} />
                    }
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
                                            {chatRooms && chatRooms.map((chatRoom, index) => {
                                                return (
                                                    <li key = {index} className = "chat-list-item">
                                                        <a href = {`/chat/${userId}?companyID=${userType === 'company' ? chatRoom.company_ID : chatRoom.users[0].company_ID}&internID=${userType === 'intern' ? chatRoom.intern_ID : chatRoom.users[0].intern_ID}`} className = "chat-list-link">
                                                            <div className = "d-flex">
                                                                <div className = "chat-avatar-img">
                                                                    <img 
                                                                        src = {
                                                                            chatRoom.users && `http://localhost:5000/uploads/${chatRoom.users[0].profile_image}`
                                                                        } 
                                                                        alt = "Avatar" 
                                                                        className = "img-fluid rounded"
                                                                    />
                                                                </div>
                                                                <div className = " ms-3 d-flex flex-column w-100 justify-content-between">
                                                                    <div className = "d-flex justify-content-between">
                                                                        <h6 className = "chat-name">
                                                                            {chatRoom.users && chatRoom.users[0].username}
                                                                        </h6>
                                                                        <span className = "chat-time">
                                                                            {   
                                                                                //Remove the seconds from the time
                                                                                //Check if the time is the current day, if not show the date
                                                                                new Date(chatRoom.users[0].last_message_timestamp).toLocaleDateString() === new Date().toLocaleDateString() ?
                                                                                new Date(chatRoom.users[0].last_message_timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                                                                : new Date(chatRoom.users[0].last_message_timestamp).toLocaleDateString()
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className = "chat-message">
                                                                        <span>
                                                                            {   
                                                                                //If the message is greater than 20 characters, show the first 20 characters
                                                                                chatRoom.users[0].last_message.length > 20 ?
                                                                                chatRoom.users[0].last_message.substring(0, 20) + '...'
                                                                                : chatRoom.users[0].last_message
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </li>
                                                )
                                            })}
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
                                                            /*If the user is a company, show the intern's professional title, else show the company's location
                                                            userType === 'company' ?
                                                            chatUsers.intern && chatUsers.intern.professional_title
                                                            : chatUsers.company && chatUsers.company.location_city*/
                                                            //If the other user in the room is online, show the online status, else show the offline status
                                                            isOnline ? 'Online' : 'Offline'
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                            <div className = "chat-actions d-flex">
                                                
                                                <div className = "chat-action-icons d-flex">
                                                    <button className = "btn" type = "button" onClick={() => {navigateToVideoChat(userType === 'company' ? internID : companyID , chatRooms && chatRooms)}}>
                                                        <i className = "bi bi-camera-video-fill"></i>
                                                    </button>
                                                </div>
                                    
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
                                                        isSentByCurrentUser ?
                                                        <li key = {index} className = "d-flex chat-content-right justify-content-end">
                                                            <div className = "chat-img">
                                                                <img 
                                                                    src = {
                                                                        userType === 'company' ?
                                                                        chatUsers.company && `http://localhost:5000/uploads/${chatUsers.company.profile_image}`
                                                                        : chatUsers.intern && `http://localhost:5000/uploads/${chatUsers.intern.profile_image}`
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
                                                                    message.timestamp ?
                                                                    new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                                                    :
                                                                    new Date(message.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                                                }</div>
                                                            </div>
                                                        </li>
                                                        :
                                                        <li key = {index} className = "d-flex">
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
                                                                    message.timestamp ?
                                                                    new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                                                    : new Date(message.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
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