import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axiosInstance from '../../api/axios';
import { Send, ArrowLeft } from 'lucide-react';

const MyChatF = ({ bookings, onChatSelect, activeSession }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const facultyInfo = JSON.parse(localStorage.getItem('facultyInfo'));
    const API_URL = process.env.REACT_APP_API_URL;

    const [showChatListOnMobile, setShowChatListOnMobile] = useState(true);

    const formatToIST = (dateString) => {
        const options = {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Date(dateString).toLocaleTimeString('en-IN', options);
    };

    useEffect(() => {
        socketRef.current = io(API_URL);
        socketRef.current.on('receiveMessage', (message) => {
            if (message.session === activeSession?._id) {
                setMessages(prev => [...prev, message]);
            }
        });
        return () => socketRef.current.disconnect();
    }, [API_URL, activeSession]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (activeSession) {
                socketRef.current.emit('joinRoom', { sessionId: activeSession._id });
                try {
                    const { token } = facultyInfo;
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await axiosInstance.get(`/api/chat/messages/${activeSession._id}`, config);
                    setMessages(data);
                } catch (error) {
                    console.error("Failed to fetch messages");
                    setMessages([]);
                }
                setShowChatListOnMobile(false);
            } else {
                setShowChatListOnMobile(true);
            }
        };
        fetchMessages();
    }, [activeSession, API_URL, facultyInfo.token]);

    useEffect(() => {
        // Ensure scrollIntoView only runs when messages change and the ref is available
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && activeSession) {
            const messageData = {
                session: activeSession._id,
                sender: facultyInfo._id,
                senderModel: 'Faculty',
                content: newMessage,
            };
            socketRef.current.emit('sendMessage', messageData);
            setNewMessage('');
        }
    };
    const activeBookingInfo = bookings.find(b => b._id === activeSession?.booking);

    const handleChatSelect = (booking) => {
        onChatSelect(booking);
        setShowChatListOnMobile(false);
    };

    return  (
        <div>
            <header className="mb-8">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">Live Chat Support</h1>
                <p className="text-gray-500 mt-1">Respond to user queries in real-time.</p>
            </header>
            <div className="bg-white rounded-2xl shadow-lg p-4 h-[70vh] flex flex-col sm:flex-row">
                {/* Chat List Panel - flex-grow for vertical expansion on mobile */}
                <div className={`w-full sm:w-1/3 border-r sm:pr-4 overflow-y-auto ${showChatListOnMobile ? 'block flex-grow' : 'hidden'} sm:block`}>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Active Chats</h2>
                    <p className="text-s text-gray-500 mb-3">* These chats are active for 30 Days</p>

                    {bookings.length > 0 ? (
                        bookings.map(booking => (
                            <div key={booking._id} onClick={() => handleChatSelect(booking)}
                                 className={`p-3 rounded-lg cursor-pointer mb-2 ${activeSession?.booking === booking._id ? 'bg-indigo-100' : 'hover:bg-gray-50'}`}>
                                <p className="font-semibold text-gray-800">{booking.student.fullName}</p>
                                <p className="text-sm text-gray-500 truncate">{booking.service.title}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center mt-8">No active chat bookings.</p>
                    )}
                </div>

                {/* Chat Window Panel */}
                {/* This flex-col wrapper helps manage the height distribution for its children */}
                <div className={`w-full sm:w-2/3 sm:pl-4 flex flex-col relative h-full ${!showChatListOnMobile ? 'flex' : 'hidden'} sm:flex`}>
                    {activeSession && activeBookingInfo ? (
                        <>
                            <div className="border-b pb-2 mb-4 flex items-center">
                                <button
                                    onClick={() => setShowChatListOnMobile(true)}
                                    className="sm:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
                                    aria-label="Back to chats"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <h3 className="font-bold text-lg">Chat with {activeBookingInfo.student.fullName}</h3>
                            </div>
                            {/* Message display area - Added min-h-0 to ensure flex-grow works correctly */}
                            <div className="flex-grow overflow-y-auto px-4 min-h-0 pb-20 sm:pb-0 sm:mb-4">
                                {messages.map((msg) => (
                                    <div key={msg._id} className={`flex ${msg.sender === facultyInfo._id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-lg mb-2 ${msg.sender === facultyInfo._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                            <p>{msg.content}</p>
                                            <p className={`text-xs mt-1 text-right ${msg.sender === facultyInfo._id ? 'text-blue-200' : 'text-gray-500'}`}>
                                                {formatToIST(msg.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            {/* Message input form */}
                           <form onSubmit={sendMessage} className="flex items-center absolute bottom-0 left-0 right-0 p-4 bg-white border-t sm:relative sm:p-0 sm:bg-transparent sm:border-t-0">
                                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                                       placeholder="Type your reply..."
                                       className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
export default MyChatF;