import { useState, useRef, useEffect } from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import EmailComponent from "./EmailComponent";
import MovieFavorites from "./MovieFavorites";
import CloneOfMyself from "./CloneOfMyself";
import NetWorthTracker from "./NetWorthTracker";
import EmployeeManager from "./EmployeeManager";
import ShoppingList from "./ShoppingList";
import TailwindDemo from "./TailwindDemo";
import MoodTracker from "./MoodTracker";
import TradingViewCharts from "./TradingViewCharts";
import SMSMessenger from "./SMSMessenger";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      // Check localStorage for saved preference, default to true (dark mode)
      const saved = localStorage.getItem('darkMode');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (error) {
      // If localStorage fails, default to dark mode
      console.warn('Failed to load dark mode preference from localStorage:', error);
      return true;
    }
  });
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Hardcoded users for testing
  const hardcodedUsers = [
    { id: "1", uid: "user1", email: "john@example.com", name: "John Doe" },
    { id: "2", uid: "user2", email: "jane@example.com", name: "Jane Smith" },
    { id: "3", uid: "user3", email: "bob@example.com", name: "Bob Johnson" },
    { id: "4", uid: "user4", email: "alice@example.com", name: "Alice Brown" },
    { id: "5", uid: "user5", email: "mike@example.com", name: "Mike Wilson" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleSearch = () => {
    if (!searchEmail.trim()) {
      alert("Please enter an email address to search for");
      return;
    }

    console.log("Searching for email:", searchEmail.trim());
    console.log("Current user email:", user.email);

    // Search in hardcoded users
    const found = hardcodedUsers.filter(userData => 
      userData.email.toLowerCase().includes(searchEmail.trim().toLowerCase()) &&
      userData.email !== user.email
    );
    
    console.log("Search results:", found);
    setResults(found);
    
    if (found.length === 0) {
      alert("No user found with that email address");
    }
  };

  const handleShowAllUsers = () => {
    console.log("Show All Users button clicked");
    console.log("Current user:", user);
    
    // Show all hardcoded users except current user
    const found = hardcodedUsers.filter(userData => userData.email !== user.email);
    
    console.log("All users found:", found);
    setResults(found);
    
    if (found.length === 0) {
      alert("No other users found in the system");
    } else {
      console.log(`Found ${found.length} other users`);
    }
  };

  const addMoreUsers = () => {
    alert("You can add more users by editing the hardcodedUsers array in the code!");
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all local data? This will delete all photos and chat messages.')) {
      localStorage.clear();
      setPhotos([]);
      setMessages([]);
      setResults([]);
      alert('All local data cleared!');
    }
  };

  const getChatId = (uid1, uid2) => {
    return [uid1, uid2].sort().join("_");
  };

  const handleUserSelect = (otherUser) => {
    setSelectedUser(otherUser);
    
    // Load messages from localStorage
    const chatId = getChatId(user.uid, otherUser.uid);
    const storedMessages = localStorage.getItem(`chat_${chatId}`);
    
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      setMessages([]);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const chatId = getChatId(user.uid, selectedUser.uid);
    
    // Create new message
    const newMsg = {
      text: newMessage.trim(),
      senderId: user.uid,
      senderEmail: user.email,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    // Add to messages
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);

    // Save to localStorage
    localStorage.setItem(`chat_${chatId}`, JSON.stringify(updatedMessages));

    setNewMessage("");
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !photoTitle.trim()) {
      alert('Please select a file and enter a title');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Create file URL for preview
    const fileURL = URL.createObjectURL(selectedFile);

    // Create photo object
    const newPhoto = {
      id: Date.now().toString(),
      title: photoTitle,
      description: photoDescription,
      fileName: selectedFile.name,
      downloadURL: fileURL,
      uploadedAt: new Date().toISOString(),
      fileSize: selectedFile.size,
      fileType: selectedFile.type
    };

    // Add to photos array
    const updatedPhotos = [newPhoto, ...photos];
    setPhotos(updatedPhotos);

    // Save to localStorage
    localStorage.setItem('photos', JSON.stringify(updatedPhotos));

    // Reset form
    setSelectedFile(null);
    setPhotoTitle('');
    setPhotoDescription('');
    setUploadProgress(100);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
      alert('Photo uploaded successfully!');
    }, 500);
  };

  // Load photos from localStorage
  useEffect(() => {
    const storedPhotos = localStorage.getItem('photos');
    if (storedPhotos) {
      setPhotos(JSON.parse(storedPhotos));
    }
    setLoadingPhotos(false);
  }, []);

  // Load recent chats from localStorage
  useEffect(() => {
    if (!user) return;

    // Load recent chats from localStorage
    const storedChats = localStorage.getItem('recentChats');
    if (storedChats) {
      setRecentChats(JSON.parse(storedChats));
    }
  }, [user]);

  // Delete photo function
  const handleDeletePhoto = (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      // Update local state
      const updatedPhotos = photos.filter(photo => photo.id !== photoId);
      setPhotos(updatedPhotos);
      
      // Update localStorage
      localStorage.setItem('photos', JSON.stringify(updatedPhotos));
      
      alert('Photo deleted successfully!');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Save preference to localStorage with error handling
    try {
      localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    } catch (error) {
      console.warn('Failed to save dark mode preference to localStorage:', error);
    }
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location.';
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 mt-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Welcome, {user?.email}</span>
            <button
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                darkMode 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Chat Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg mb-8 transition-colors duration-300`}>
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
            <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>💬 Real-time Chat</h2>
            <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Search for users by email and start chatting instantly</p>
          </div>
          
          <div className="flex">
            {/* User Search Sidebar */}
            <div className={`w-1/3 p-6 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
              <h3 className={`text-lg font-medium mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Find Users</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Enter user's email address"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-800'
                    }`}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                
                <button
                  onClick={handleSearch}
                  className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  🔍 Search Users
                </button>
                
                <button
                  onClick={handleShowAllUsers}
                  className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  👥 Show All Users
                </button>
                
                <button
                  onClick={addMoreUsers}
                  className="w-full bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  👤 Add More Users
                </button>
                
                <button
                  onClick={clearAllData}
                  className="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  🗑️ Clear All Data
                </button>

                                 <div className="mt-6">
                   <h4 className={`text-sm font-medium mb-3 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Search Results:</h4>
                   <div className="space-y-2">
                     {results.length === 0 ? (
                       <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No users found. Try searching for a valid email address.</p>
                     ) : (
                       results.map((u) => (
                         <div
                           key={u.id}
                           onClick={() => handleUserSelect(u)}
                           className={`p-3 rounded-lg cursor-pointer transition-colors ${
                             selectedUser?.uid === u.uid 
                               ? darkMode 
                                 ? "bg-blue-900 border-2 border-blue-600" 
                                 : "bg-blue-100 border-2 border-blue-300"
                               : darkMode
                                 ? "bg-gray-700 hover:bg-gray-600 border-2 border-transparent"
                                 : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                           }`}
                         >
                           <div className="flex items-center space-x-3">
                             <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                               <span className="text-white text-sm font-medium">
                                 {u.email.charAt(0).toUpperCase()}
                               </span>
                             </div>
                             <span className={`font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{u.email}</span>
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                 </div>

                 {/* Recent Chats Section */}
                 {recentChats.length > 0 && (
                   <div className="mt-8">
                     <h4 className={`text-sm font-medium mb-3 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Recent Chats:</h4>
                     <div className="space-y-2">
                       {recentChats.map((chat) => (
                         <div
                           key={chat.id}
                           onClick={() => handleUserSelect(chat.user)}
                           className={`p-3 rounded-lg cursor-pointer transition-colors ${
                             darkMode 
                               ? 'bg-gray-700 hover:bg-gray-600' 
                               : 'bg-gray-50 hover:bg-gray-100'
                           }`}
                         >
                           <div className="flex items-center space-x-3">
                             <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                               <span className="text-white text-sm font-medium">
                                 {chat.user.email.charAt(0).toUpperCase()}
                               </span>
                             </div>
                             <div className="flex-1">
                               <span className={`font-medium text-sm transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{chat.user.email}</span>
                               <p className={`text-xs transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{chat.lastMessage}</p>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
              </div>
            </div>

            {/* Chat Panel */}
            <div className="w-2/3 p-6">
              {selectedUser ? (
                <div className="h-full flex flex-col">
                  {/* Chat Header */}
                  <div className={`flex items-center space-x-3 mb-4 pb-4 border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {selectedUser.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Chat with {selectedUser.email}
                      </h3>
                      <p className="text-sm text-green-600">● Online</p>
                    </div>
                  </div>

                                     {/* Messages */}
                   <div className={`flex-1 h-96 overflow-y-auto border rounded-lg p-4 mb-4 transition-colors duration-300 ${
                     darkMode 
                       ? 'border-gray-700 bg-gray-900' 
                       : 'border-gray-200 bg-gray-50'
                   }`}>
                     {messages.length === 0 ? (
                       <div className={`text-center mt-8 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                         <p>No messages yet. Start the conversation!</p>
                       </div>
                     ) : (
                       messages.map((msg, idx) => (
                         <div
                           key={idx}
                           className={`mb-3 flex ${
                             msg.senderId === user.uid ? "justify-end" : "justify-start"
                           }`}
                         >
                           <div
                             className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                               msg.senderId === user.uid
                                 ? "bg-blue-500 text-white"
                                 : darkMode
                                   ? "bg-gray-700 text-white border border-gray-600"
                                   : "bg-white text-gray-800 border border-gray-200"
                             }`}
                           >
                             <p className="text-sm">{msg.text}</p>
                             <p className={`text-xs mt-1 ${
                               msg.senderId === user.uid ? "text-blue-100" : darkMode ? "text-gray-400" : "text-gray-500"
                             }`}>
                               {new Date(msg.timestamp).toLocaleTimeString()}
                             </p>
                           </div>
                         </div>
                       ))
                     )}
                     
                     {/* Typing Indicator */}
                     {isTyping && (
                       <div className="flex justify-start mb-3">
                         <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg">
                           <div className="flex space-x-1">
                             <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                             <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                             <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                           </div>
                         </div>
                       </div>
                     )}
                     
                     <div ref={messagesEndRef} />
                   </div>

                  {/* Message Input */}
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Type your message here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-800'
                      }`}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <span className="text-2xl">💬</span>
                    </div>
                    <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Select a user to start chatting</h3>
                    <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Search for users by their email address to begin a conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

                {/* Photo Upload Section */}
        <div className="mt-8">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg mb-8 transition-colors duration-300`}>
            <div className={`p-6 border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📸 Photo Upload</h2>
              <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Upload and manage your photos</p>
            </div>
            <div className="p-6">
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Upload New Photo</h3>
            
            {/* File Selection */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Select Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className={`block w-full text-sm transition-colors duration-300 ${
                  darkMode 
                    ? 'text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600' 
                    : 'text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                }`}
              />
            </div>

            {/* Photo Preview */}
            {selectedFile && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="max-w-xs rounded-lg shadow-sm"
                />
              </div>
            )}

            {/* Title Input */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Photo Title *
              </label>
              <input
                type="text"
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                placeholder="Enter photo title"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-800'
                }`}
              />
            </div>

            {/* Description Input */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                value={photoDescription}
                onChange={(e) => setPhotoDescription(e.target.value)}
                placeholder="Enter photo description"
                rows="3"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-800'
                }`}
              />
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile || !photoTitle.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="mt-12">
            <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Photo Gallery</h2>
            
            {loadingPhotos ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className={`mt-4 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading photos...</p>
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-8">
                <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>No photos uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {photos.map((photo) => (
                  <div key={photo.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300`}>
                    <div className="relative">
                      <img
                        src={photo.downloadURL}
                        alt={photo.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Delete photo"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <h3 className={`font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{photo.title}</h3>
                      {photo.description && (
                        <p className={`text-sm mb-3 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{photo.description}</p>
                      )}
                      
                      <div className={`text-xs space-y-1 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <p>Uploaded: {new Date(photo.uploadedAt).toLocaleDateString()}</p>
                        <p>Size: {(photo.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                        <p>Type: {photo.fileType}</p>
                      </div>
                      
                      <div className="mt-3">
                        <a
                          href={photo.downloadURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Full Size
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className={`mt-8 rounded-lg p-4 transition-colors duration-300 ${
            darkMode 
              ? 'bg-blue-900/30 border border-blue-700' 
              : 'bg-blue-50'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
              darkMode ? 'text-blue-300' : 'text-blue-800'
            }`}>Gallery Features</h3>
            <ul className={`space-y-1 transition-colors duration-300 ${
              darkMode ? 'text-blue-200' : 'text-blue-700'
            }`}>
              <li>• Photos are displayed in a responsive grid layout</li>
              <li>• Click the × button to delete photos</li>
              <li>• Click "View Full Size" to open photos in a new tab</li>
              <li>• Photos are sorted by upload date (newest first)</li>
              <li>• File information is displayed for each photo</li>
            </ul>
          </div>
        </div>

        {/* Email Component */}
        <EmailComponent darkMode={darkMode} />

        {/* Location Map Section */}
        <div className="mt-8">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg mb-8 transition-colors duration-300`}>
            <div className={`p-6 border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📍 Current Location</h2>
              <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>View your current location on the map</p>
            </div>
            
            <div className="p-6">
              {!location && !locationError && !isLoadingLocation && (
                <div className="text-center py-8">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <span className="text-2xl">📍</span>
                  </div>
                  <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Get Your Location</h3>
                  <p className={`mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Click the button below to get your current location and view it on the map.
                  </p>
                  <button
                    onClick={getCurrentLocation}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    📍 Get My Location
                  </button>
                </div>
              )}

              {isLoadingLocation && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className={`mt-4 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Getting your location...
                  </p>
                </div>
              )}

              {locationError && (
                <div className="text-center py-8">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                    darkMode ? 'bg-red-900' : 'bg-red-100'
                  }`}>
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Location Error</h3>
                  <p className={`mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {locationError}
                  </p>
                  <button
                    onClick={getCurrentLocation}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    🔄 Try Again
                  </button>
                </div>
              )}

              {location && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg transition-colors duration-300 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className={`font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Location Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Latitude</p>
                        <p className={`font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {location.latitude.toFixed(6)}°
                        </p>
                      </div>
                      <div>
                        <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Longitude</p>
                        <p className={`font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {location.longitude.toFixed(6)}°
                        </p>
                      </div>
                      <div>
                        <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</p>
                        <p className={`font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          ±{Math.round(location.accuracy)} meters
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Map Container */}
                  <div className={`border rounded-lg overflow-hidden transition-colors duration-300 ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="h-96 w-full bg-gray-100 flex items-center justify-center relative">
                      {/* Map using OpenStreetMap */}
                      <iframe
                        title="Current Location Map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude-0.01},${location.latitude-0.01},${location.longitude+0.01},${location.latitude+0.01}&layer=mapnik&marker=${location.latitude},${location.longitude}`}
                        allowFullScreen
                      />
                      
                      {/* Custom Location Dot Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative">
                          {/* Outer ring */}
                          <div className="w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-pulse"></div>
                          {/* Inner dot */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                        </div>
                      </div>
                      
                      {/* Location Label */}
                      <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-lg shadow-md">
                        <p className="text-sm font-medium text-gray-800">📍 You are here</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={getCurrentLocation}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      🔄 Refresh Location
                    </button>
                    <a
                      href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      🗺️ Open in Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Movie Favorites Section */}
        <div className="mt-8">
          <MovieFavorites darkMode={darkMode} />
        </div>

        {/* Clone of Myself Section */}
        <div className="mt-8">
          <CloneOfMyself darkMode={darkMode} />
        </div>

        {/* Net Worth Tracker Section */}
        <div className="mt-8">
          <NetWorthTracker darkMode={darkMode} />
        </div>

        {/* Employee Management Section */}
        <div className="mt-8">
          <EmployeeManager darkMode={darkMode} />
        </div>

        {/* Shopping List Section */}
        <div className="mt-8">
          <ShoppingList darkMode={darkMode} />
        </div>

        {/* Tailwind CSS Demo Section */}
        <div className="mt-8">
          <TailwindDemo darkMode={darkMode} />
        </div>

        {/* Mood Tracker Section */}
        <div className="mt-8">
          <MoodTracker darkMode={darkMode} />
        </div>

        {/* TradingView Charts Section */}
        <div className="mt-8">
          <TradingViewCharts darkMode={darkMode} />
        </div>

        {/* SMS Messenger Section */}
        <div className="mt-8">
          <SMSMessenger darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
