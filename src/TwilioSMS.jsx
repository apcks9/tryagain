import { useState, useEffect } from "react";

function TwilioSMS({ darkMode }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [fromNumber, setFromNumber] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState({});

  // Load configuration and message history from localStorage
  useEffect(() => {
    const storedConfig = localStorage.getItem('twilioConfig');
    const storedHistory = localStorage.getItem('twilioMessageHistory');
    const storedContacts = localStorage.getItem('twilioContacts');
    const storedConversations = localStorage.getItem('twilioConversations');
    
    // Check if current user is u@u.com and pre-fill with credentials
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isUAtUCom = currentUser.email === 'u@u.com';
    
    if (isUAtUCom) {
      // Pre-fill with credentials for u@u.com (user should enter their own)
      setApiKey('');
      setApiSecret('');
      setFromNumber('');
    } else if (storedConfig) {
      // Load user's own credentials for other users
      const config = JSON.parse(storedConfig);
      setApiKey(config.apiKey || '');
      setApiSecret(config.apiSecret || '');
      setFromNumber(config.fromNumber || '');
    }
    
    if (storedHistory) {
      setMessageHistory(JSON.parse(storedHistory));
    }
    
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
    
    if (storedConversations) {
      setConversations(JSON.parse(storedConversations));
    }
  }, []);

  // Save configuration and message history to localStorage
  useEffect(() => {
    // Only save config for non-u@u.com users
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isUAtUCom = currentUser.email === 'u@u.com';
    
    if (!isUAtUCom && (apiKey || apiSecret || fromNumber)) {
      localStorage.setItem('twilioConfig', JSON.stringify({
        apiKey,
        apiSecret,
        fromNumber
      }));
    }
  }, [apiKey, apiSecret, fromNumber]);

  useEffect(() => {
    localStorage.setItem('twilioMessageHistory', JSON.stringify(messageHistory));
  }, [messageHistory]);

  useEffect(() => {
    localStorage.setItem('twilioContacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('twilioConversations', JSON.stringify(conversations));
  }, [conversations]);

  const formatPhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `+1${digits}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `+${digits}`;
    }
    return `+${digits}`;
  };

  const validatePhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 || (digits.length === 11 && digits[0] === '1');
  };

  const addContact = (phoneNumber) => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const existingContact = contacts.find(c => c.phone === formattedPhone);
    
    if (!existingContact) {
      const newContact = {
        id: Date.now(),
        phone: formattedPhone,
        name: `Contact ${contacts.length + 1}`,
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0
      };
      setContacts(prev => [...prev, newContact]);
      return newContact;
    }
    return existingContact;
  };

  const addMessageToConversation = (phoneNumber, message, isOutgoing = true) => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const messageObj = {
      id: Date.now(),
      text: message,
      isOutgoing,
      timestamp: new Date().toISOString(),
      status: isOutgoing ? 'sent' : 'received'
    };

    setConversations(prev => ({
      ...prev,
      [formattedPhone]: [
        ...(prev[formattedPhone] || []),
        messageObj
      ]
    }));

    // Update contact's last message
    setContacts(prev => prev.map(contact => 
      contact.phone === formattedPhone 
        ? { 
            ...contact, 
            lastMessage: message.length > 30 ? message.substring(0, 30) + '...' : message,
            lastMessageTime: new Date().toISOString(),
            unreadCount: isOutgoing ? contact.unreadCount : contact.unreadCount + 1
          }
        : contact
    ));

    return messageObj;
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
    setPhoneNumber(contact.phone);
    
    // Mark messages as read
    setContacts(prev => prev.map(c => 
      c.phone === contact.phone ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleSendSMS = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.trim() || !message.trim()) {
      setStatus('Please enter both phone number and message');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setStatus('Please enter a valid 10-digit phone number');
      return;
    }

    if (!apiKey || !apiSecret || !fromNumber) {
      setStatus('Please configure your Twilio credentials first');
      setShowConfig(true);
      return;
    }

    setIsLoading(true);
    setStatus('Sending SMS...');

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Create the request body for Twilio API
      const requestBody = new URLSearchParams({
        To: formattedPhone,
        From: fromNumber,
        Body: message
      });

      // Create Basic Auth header
      const credentials = btoa(`${apiKey}:${apiSecret}`);
      
      const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + apiKey + '/Messages.json', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody
      });

      const result = await response.json();

      if (response.ok) {
        // Success
        const newMessage = {
          id: result.sid,
          phoneNumber: formattedPhone,
          message: message,
          timestamp: new Date().toISOString(),
          status: result.status,
          sid: result.sid,
          price: result.price,
          direction: result.direction
        };

        // Add to message history
        setMessageHistory(prev => [newMessage, ...prev.slice(0, 49)]);
        
        // Add contact if it doesn't exist
        const contact = addContact(formattedPhone);
        
        // Add to conversation
        addMessageToConversation(formattedPhone, message, true);
        
        // Select the contact if not already selected
        if (!selectedContact || selectedContact.phone !== formattedPhone) {
          selectContact(contact);
        }
        
        setMessage("");
        setStatus(`SMS sent successfully! SID: ${result.sid}`);
        
        // Clear status after 5 seconds
        setTimeout(() => setStatus(''), 5000);
      } else {
        // Error
        setStatus(`Error: ${result.message || 'Failed to send SMS'}`);
        console.error('Twilio API Error:', result);
      }
      
    } catch (error) {
      console.error('Error sending SMS:', error);
      setStatus(`Network error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all message history?')) {
      setMessageHistory([]);
    }
  };

  const clearConfig = () => {
    if (window.confirm('Are you sure you want to clear your Twilio configuration?')) {
      setApiKey('');
      setApiSecret('');
      setFromNumber('');
      localStorage.removeItem('twilioConfig');
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden transition-colors duration-300`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
        <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          📱 Twilio SMS (Real SMS)
        </h2>
        <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Send real SMS messages using Twilio API. Requires Twilio account and credentials.
        </p>
      </div>

      {/* iMessage-style Interface */}
      <div className="flex h-96">
        {/* Left Panel - Contacts */}
        <div className={`w-1/3 border-r ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} transition-colors duration-300`}>
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search contacts..."
                className={`w-full px-4 py-2 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-800'
                }`}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Contacts List */}
          <div className="overflow-y-auto h-80">
            {contacts.length === 0 ? (
              <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No contacts yet. Send a message to start a conversation!
              </div>
            ) : (
              contacts
                .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
                .map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => selectContact(contact)}
                    className={`p-4 border-b cursor-pointer hover:bg-opacity-50 transition-colors duration-300 ${
                      selectedContact?.id === contact.id
                        ? darkMode 
                          ? 'bg-blue-600 bg-opacity-20 border-blue-500' 
                          : 'bg-blue-100 border-blue-300'
                        : darkMode 
                          ? 'border-gray-700 hover:bg-gray-700' 
                          : 'border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          darkMode ? 'bg-blue-600' : 'bg-blue-500'
                        }`}>
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {contact.name}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {contact.phone}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {contact.unreadCount > 0 && (
                          <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center text-white ${
                            darkMode ? 'bg-red-500' : 'bg-red-500'
                          }`}>
                            {contact.unreadCount}
                          </div>
                        )}
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    {contact.lastMessage && (
                      <div className={`text-sm mt-1 truncate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {contact.lastMessage}
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Right Panel - Messages */}
        <div className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
          {selectedContact ? (
            <>
              {/* Contact Header with To: address bar */}
              <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      darkMode ? 'bg-blue-600' : 'bg-blue-500'
                    }`}>
                      {selectedContact.name.charAt(0)}
                    </div>
                    <div>
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        To: {selectedContact.name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedContact.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className={`p-2 rounded-full hover:bg-opacity-20 transition-colors duration-300 ${
                      darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                    }`}>
                      📹
                    </button>
                    <button className={`p-2 rounded-full hover:bg-opacity-20 transition-colors duration-300 ${
                      darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                    }`}>
                      ℹ️
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {conversations[selectedContact.phone]?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOutgoing ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.isOutgoing
                          ? darkMode 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-500 text-white'
                          : darkMode 
                            ? 'bg-gray-700 text-white' 
                            : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="text-sm">{msg.text}</div>
                      <div className={`text-xs mt-1 ${
                        msg.isOutgoing 
                          ? 'text-blue-100' 
                          : darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {msg.isOutgoing && (
                          <span className="ml-1">
                            {msg.status === 'sent' ? '✓' : msg.status === 'delivered' ? '✓✓' : '⏳'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {(!conversations[selectedContact.phone] || conversations[selectedContact.phone].length === 0) && (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No messages yet. Start the conversation!
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
                <form onSubmit={handleSendSMS} className="flex space-x-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={`flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-800'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !message.trim()}
                    className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
                      isLoading || !message.trim()
                        ? darkMode 
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : darkMode 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isLoading ? '⏳' : '📤'}
                  </button>
                </form>
                {status && (
                  <div className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {status}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* No Contact Selected - Show New Message Form */
            <div className="flex-1 flex flex-col">
              {/* New Message Header */}
              <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                    darkMode ? 'bg-gray-600' : 'bg-gray-400'
                  }`}>
                    +
                  </div>
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      New Message
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Enter phone number to start conversation
                    </div>
                  </div>
                </div>
              </div>

              {/* New Message Form */}
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      To: Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1234567890"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-800'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-800'
                      }`}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    onClick={handleSendSMS}
                    disabled={isLoading || !phoneNumber.trim() || !message.trim()}
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                      isLoading || !phoneNumber.trim() || !message.trim()
                        ? darkMode 
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : darkMode 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isLoading ? '⏳ Sending...' : '📤 Send Message'}
                  </button>
                </div>
                
                {status && (
                  <div className={`text-sm mt-4 p-3 rounded-lg max-w-md ${
                    status.includes('Error') 
                      ? darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'
                      : darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'
                  }`}>
                    {status}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Section */}
      <div className={`p-6 border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} transition-colors duration-300`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            🔧 Twilio Configuration
          </h3>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showConfig ? 'Hide' : 'Show'} Config
          </button>
        </div>

        {showConfig && (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Account SID
              </label>
              <input
                type="text"
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-800'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Auth Token
              </label>
              <input
                type="password"
                placeholder="Your Twilio Auth Token"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-800'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                From Number (Twilio Phone Number)
              </label>
              <input
                type="tel"
                placeholder="+1234567890"
                value={fromNumber}
                onChange={(e) => setFromNumber(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-800'
                }`}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearConfig}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Clear Config
              </button>
              <a
                href="https://console.twilio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Open Twilio Console
              </a>
            </div>
          </div>
        )}

        {/* Configuration Status */}
        <div className={`mt-4 p-3 rounded-lg transition-colors duration-300 ${
          apiKey && apiSecret && fromNumber
            ? darkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50'
            : darkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50'
        }`}>
          <div className={`text-xs mt-1 transition-colors duration-300 ${
            apiKey && apiSecret && fromNumber
              ? darkMode ? 'text-green-200' : 'text-green-700'
              : darkMode ? 'text-yellow-200' : 'text-yellow-700'
          }`}>
            {(() => {
              const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
              const isUAtUCom = currentUser.email === 'u@u.com';
              
              if (apiKey && apiSecret && fromNumber) {
                return 'Ready to send SMS messages';
              } else {
                return 'Please configure your Twilio credentials to send SMS';
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwilioSMS;
