import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axiosInstance from '../../api/axios';
import { Send, ArrowLeft } from 'lucide-react'; // Import ArrowLeft for the back button

const MyChat = ({ bookings, onChatSelect, activeSession }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const studentInfo = JSON.parse(localStorage.getItem('studentInfo'));
    const API_URL = process.env.REACT_APP_API_URL;

    // State to manage visibility of chat list vs chat window on small screens
    // true means show chat list, false means show chat window
    const [showChatListOnMobile, setShowChatListOnMobile] = useState(true);

    // Function to format UTC date to IST
    const formatToIST = (dateString) => {
        const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(dateString).toLocaleTimeString('en-IN', options);
    };

    // useEffect for socket connection
    useEffect(() => {
        socketRef.current = io(API_URL);
        socketRef.current.on('receiveMessage', (message) => {
            if (message.session === activeSession?._id) {
                setMessages(prev => [...prev, message]);
            }
        });
        return () => { if (socketRef.current) socketRef.current.disconnect(); };
    }, [API_URL, activeSession]);

    // useEffect for fetching messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (activeSession) {
                socketRef.current.emit('joinRoom', { sessionId: activeSession._id });
                try {
                    const { token } = studentInfo;
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await axiosInstance.get(`/api/chat/messages/${activeSession._id}`, config);
                    setMessages(data);
                } catch (error) {
                    console.error("Failed to fetch messages");
                    setMessages([]);
                }
                // When an active session is set, automatically switch to chat window view on mobile
                setShowChatListOnMobile(false);
            } else {
                // If no active session, ensure chat list is visible on mobile
                setShowChatListOnMobile(true);
            }
        };
        fetchMessages();
    }, [activeSession, API_URL, studentInfo.token]);
    
    // useEffect for scrolling to the bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Function to send a message
    const sendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && activeSession) {
            const messageData = {
                session: activeSession._id,
                sender: studentInfo._id,
                senderModel: 'Student',
                content: newMessage,
            };
            socketRef.current.emit('sendMessage', messageData);
            setNewMessage('');
        }
    };

    // Find the full booking object that corresponds to the active session
    const activeBookingInfo = bookings.find(b => b._id === activeSession?.booking);

    // New handler for chat selection to manage mobile view state
    const handleChatSelect = (booking) => {
        onChatSelect(booking); // Propagate the selection
        setShowChatListOnMobile(false); // Switch to chat window view on mobile
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header section to match faculty UI, adjusted font size for mobile */}
            <header className="mb-8">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">My Chats</h1>
                <p className="text-gray-500 mt-1">Review your conversations with mentors.</p>
            </header>
            
            {/* Main Chat Container: Stack vertically on small screens, side-by-side on larger screens */}
            <div className="bg-white rounded-2xl shadow-lg p-4 h-[70vh] flex flex-col sm:flex-row">
                {/* Left Panel: Active Chats */}
                {/* On small screens: visible only if showChatListOnMobile is true */}
                {/* On larger screens: always visible (sm:block) */}
                {/* Added flex-grow and min-h-0 for proper scrolling on mobile */}
                <div className={`w-full sm:w-1/3 border-r sm:pr-4 overflow-y-auto ${showChatListOnMobile ? 'block flex-grow min-h-0' : 'hidden'} sm:block`}>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Active Chats</h2>
                    <p className="text-s text-gray-500 mb-3">* These chats are active for 30 Days</p>
                    {bookings.length > 0 ? (
                        bookings.map(booking => (
                            <div key={booking._id} onClick={() => handleChatSelect(booking)} // Use the new handler
                                 className={`p-3 rounded-lg cursor-pointer mb-2 ${activeSession?.booking === booking._id ? 'bg-indigo-100' : 'hover:bg-gray-50'}`}>
                                <p className="font-semibold text-gray-800">{booking.faculty.fullName}</p>
                                <p className="text-sm text-gray-500 truncate">{booking.service.title}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center mt-8">No active chat bookings.</p>
                    )}
                </div>

                {/* Right Panel: Chat Window */}
                {/* On small screens: visible only if showChatListOnMobile is false */}
                {/* On larger screens: always visible (sm:flex) */}
               <div className={`w-full sm:w-2/3 sm:pl-4 flex flex-col relative h-full ${!showChatListOnMobile ? 'flex' : 'hidden'} sm:flex`}>
                    {activeSession && activeBookingInfo ? (
                        <>
                            {/* Header for the chat window, includes a back button for mobile */}
                            <div className="border-b pb-2 mb-4 flex items-center">
                                {/* Back button: visible only on small screens */}
                                <button
                                    onClick={() => setShowChatListOnMobile(true)} // Go back to chat list
                                    className="sm:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
                                    aria-label="Back to chats"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <h3 className="font-bold text-lg">Chat with {activeBookingInfo.faculty.fullName}</h3>
                            </div>
                            {/* Message display area - Added min-h-0 and px-4 for proper layout and scrolling */}
                            <div className="flex-grow overflow-y-auto px-4 min-h-0 pb-20 sm:pb-0 sm:mb-4">
                                {messages.map((msg) => (
                                    <div key={msg._id} className={`flex ${msg.sender === studentInfo._id ? 'justify-end' : 'justify-start'}`}>
                                        {/* Message bubble - Changed max-w-xs to max-w-[80%] */}
                                        <div className={`max-w-[80%] p-3 rounded-lg mb-2 ${msg.sender === studentInfo._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                            <p>{msg.content}</p>
                                            <p className={`text-xs mt-1 text-right ${msg.sender === studentInfo._id ? 'text-blue-200' : 'text-gray-500'}`}>
                                                {formatToIST(msg.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={sendMessage} className="flex items-center absolute bottom-0 left-0 right-0 p-4 bg-white border-t sm:relative sm:p-0 sm:bg-transparent sm:border-t-0">
                                <input 
                                    type="text" 
                                    value={newMessage} 
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                />
                                <button type="submit" className="bg-indigo-600 text-white p-3 rounded-r-lg hover:bg-indigo-700">
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Select a chat from the left to start messaging.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default MyChat;