import React, {useState, useEffect, useRef} from 'react';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import io from 'socket.io-client';
import Peer from 'simple-peer';
//import CopyToClipboard from 'react-copy-to-clipboard';
import { useLocation } from 'react-router-dom';

let socket;

function VideoChat(props) {
    const location = useLocation();

    //const [callNotification, setCallNotification] = useState(false);  // Call notification
    const [chatRoom, setChatRoom] = useState('');  // Chat room ID
    const [stream, setStream] = useState(null);
    const [userType, setUserType] = useState('');  // User type [company/intern
    const [me, setMe] = useState('');  // User's ID
    const [call, setCall] = useState({});  // Call object
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
    const [idToCall, setIdToCall] = useState('');  // ID of the user to call

    const myVideo = useRef();  // Reference to my video
    const userVideo = useRef(); // Reference to the user's video
    const connectionRef = useRef();  // Reference to the connection

    useEffect(() => {
        const chatRoom = location.state?.chatRoom;
        if(chatRoom){
            console.log('Chat room:', chatRoom);
            setChatRoom(chatRoom);
            setName(chatRoom.username);
            setIdToCall(chatRoom.users[0].user_ID);
        }
    }, [location.state]);


    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if(userId){
            setMe(String(userId));
        }
        const userType = localStorage.getItem('userType');
        if(userType){
            setUserType(userType);
        }
        socket = io('http://localhost:5000');
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(currentStream => {
            setStream(currentStream);
            if(myVideo.current){
                myVideo.current.srcObject = currentStream;  // Display the user's video
            }
        })
        .catch(error => {
            console.log('Error accessing media devices:', error);
        })

        /*socket.on('me', (id) => {
            setMe(id);
        });*/

        socket.on('callEnded', () => {
            setCallEnded(true);
            if(connectionRef.current){
                connectionRef.current.destroy();
                connectionRef.current = null;
            }
            window.location.reload();
        });

        return () => {
            socket.disconnect();
        }

    }, []);

    useEffect(() => {
        if(chatRoom){
            const room = chatRoom.room_id;
            socket.emit('joinVideoRoom', {name: chatRoom.username, room}, () => {
                console.log('Joined video room:', room);
            });
        }
    }, [chatRoom]);

    useEffect(() => {
        socket.on('callUser', ({callerID, callerName, signal}) => {
            setCall({isReceivedCall: true, callerID, name: callerName, signal});
            console.log('Call:', call);
            //setCallNotification(true);  // Display call notification
        });
    }, [call]);

    function answerCall(){
        setCallAccepted(true);
        const peer = new Peer({initiator: false, trickle: false, stream});

        peer.on('signal', (data) => {
            socket.emit('answerCall', {signal: data, to: chatRoom.room_id});
        });

        peer.on('stream', (currentStream) => {  
            if(userVideo.current){
                userVideo.current.srcObject = currentStream;
            }
        });

        peer.signal(call.signal);

        if(connectionRef.current){
            connectionRef.current = peer;
        }

        //setCallNotification(false);  //Hide call notification after answering the call
    };

    function callUser(id){
        const receiverId = String(id);
        console.log('Calling user:', receiverId);
        console.log('My ID:', me);
        console.log('My Name:', name);
        const peer = new Peer({initiator: true, trickle: false, stream});

        peer.on('signal', (data) => {
            socket.emit('callUser', {userToCall: receiverId, signalData: data, callerID: me, callerName: name, room: chatRoom.room_id});
        });

        peer.on('stream', (currentStream) => {
            if(userVideo.current){
                userVideo.current.srcObject = currentStream;
            }
        });

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        if(connectionRef.current){
            connectionRef.current = peer;
        }
    };

    function leaveCall(){
        setCallEnded(true);
        if(connectionRef.current){
            connectionRef.current.destroy();
            connectionRef.current = null;
        }
        socket.emit('endCall', {room: chatRoom.room_id});
        window.location.reload();
    };

  return (
    <div>
        <Header isAuthenticated = {props.isAuthenticated} />
        <div className = "container my-5">
            <div className = "row mt-5">
                <div className = "col-12">
                    <h1 className = "text-center">Video Chat</h1>
                    <div className = "row mt-5 video-container">
                        {stream && (
                            <div className = "col-12 col-md-6">
                                <div className = "card p-3">
                                    <h3>
                                        {
                                            userType === 'company' ? name : chatRoom && chatRoom.username
                                        }
                                    </h3>
                                    <video playsInline id = "company-video" className = "w-100" muted ref = {myVideo} autoPlay></video>
                                </div>
                            </div>
                        )}
                        {callAccepted && !callEnded && (
                            <div className = "col-12 col-md-6">
                                <div className = "card p-3">
                                    <h3>
                                        {
                                            userType === 'intern' ? call.name : chatRoom && chatRoom.users[0].username
                                        }
                                    </h3>
                                    <video playsInline id = "intern-video" className = "w-100" ref = {userVideo} autoPlay></video>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className = "row mt-5 video-options">
                {/*<div className = "col-12 col-md-4">
                    <h3>Intern Info</h3>
                    <input type = "text" placeholder = "Enter name" value = {name} onChange = {(e) => setName(e.target.value)} />
                    <CopyToClipboard text = {me}>
                        <button>Copy ID</button>
                    </CopyToClipboard>
                </div>*/}

                <div className = "col-12 col-md-4">
                    {/*<h3>Make a call</h3>
                    <input type = "text" placeholder = "Enter ID to call" value = {idToCall} onChange = {(e) => setIdToCall(e.target.value)} />*/}
                    {callAccepted && !callEnded ? (
                        <button onClick = {leaveCall}>End call</button>
                    ) : (
                        userType === 'company' &&
                        <button onClick = {() => callUser(idToCall)}>Call {
                            //Get the intern Name from the chat room
                            chatRoom && chatRoom.users && chatRoom.users[0].username
                        }</button>
                    )}
                </div>
                
                {userType === 'intern' && 
                    call && call.isReceivedCall && !callAccepted && ( 
                        <div className = "col-12 col-md-4">
                            <div>
                                <h4>{call.name} is calling...</h4>
                                <button onClick = {answerCall}>Answer</button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default VideoChat