import { useState, useEffect } from "react";

function SMSMessenger({ darkMode }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [carrier, setCarrier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [showCarrierHelp, setShowCarrierHelp] = useState(false);

  // Common US carriers and their email-to-SMS gateways
  const carriers = [
    { name: "AT&T", gateway: "txt.att.net", format: "5551234567@txt.att.net" },
    { name: "Verizon", gateway: "vtext.com", format: "5551234567@vtext.com" },
    { name: "T-Mobile", gateway: "tmomail.net", format: "5551234567@tmomail.net" },
    { name: "Sprint", gateway: "messaging.sprintpcs.com", format: "5551234567@messaging.sprintpcs.com" },
    { name: "US Cellular", gateway: "email.uscc.net", format: "5551234567@email.uscc.net" },
    { name: "Boost Mobile", gateway: "myboostmobile.com", format: "5551234567@myboostmobile.com" },
    { name: "Cricket", gateway: "sms.cricketwireless.net", format: "5551234567@sms.cricketwireless.net" },
    { name: "MetroPCS", gateway: "mymetropcs.com", format: "5551234567@mymetropcs.com" },
    { name: "Virgin Mobile", gateway: "vmobl.com", format: "5551234567@vmobl.com" }
  ];

  // Load message history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('smsMessageHistory');
    if (storedHistory) {
      setMessageHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save message history to localStorage
  useEffect(() => {
    localStorage.setItem('smsMessageHistory', JSON.stringify(messageHistory));
  }, [messageHistory]);

  const formatPhoneNumber = (phone) => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Format as 10-digit number
    if (digits.length === 10) {
      return digits;
    } else if (digits.length === 11 && digits[0] === '1') {
      return digits.slice(1);
    }
    
    return digits;
  };

  const validatePhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 || (digits.length === 11 && digits[0] === '1');
  };

  const handleSendSMS = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.trim() || !message.trim()) {
      alert('Please enter both phone number and message');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    if (!carrier) {
      alert('Please select a carrier');
      return;
    }

    setIsLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const selectedCarrier = carriers.find(c => c.name === carrier);
      const emailAddress = `${formattedPhone}@${selectedCarrier.gateway}`;

      // Create mailto link for email-to-SMS
      const subject = encodeURIComponent('SMS Message');
      const body = encodeURIComponent(message);
      const mailtoLink = `mailto:${emailAddress}?subject=${subject}&body=${body}`;

      // Open default email client
      window.open(mailtoLink, '_blank');

      // Add to message history
      const newMessage = {
        id: Date.now(),
        phoneNumber: formattedPhone,
        carrier: carrier,
        message: message,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };

      setMessageHistory(prev => [newMessage, ...prev.slice(0, 49)]); // Keep last 50 messages
      
      // Clear form
      setMessage("");
      
      alert(`SMS prepared! Your default email client should open with the message ready to send to ${formattedPhone} via ${carrier}.`);
      
    } catch (error) {
      console.error('Error sending SMS:', error);
      alert('Error preparing SMS. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSend = (template) => {
    setMessage(template);
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all message history?')) {
      setMessageHistory([]);
    }
  };

  const quickTemplates = [
    "Hey! How are you?",
    "Can you call me when you get a chance?",
    "Running late, be there in 10 minutes",
    "Thanks for everything!",
    "See you tomorrow",
    "Call me back when you can"
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 transition-colors duration-300`}>
      {/* Header */}
      <div className={`mb-6 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
        <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          📱 SMS Messenger
        </h2>
        <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Send text messages via email-to-SMS gateway. Select the recipient's carrier for delivery.
        </p>
      </div>

      {/* SMS Form */}
      <form onSubmit={handleSendSMS} className="space-y-4 mb-6">
        {/* Phone Number Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="(555) 123-4567 or 5551234567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
              darkMode 
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                : 'border-gray-300 bg-white text-gray-800'
            }`}
          />
        </div>

        {/* Carrier Selection */}
        <div>
          <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Carrier
          </label>
          <select
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
              darkMode 
                ? 'border-gray-600 bg-gray-700 text-white' 
                : 'border-gray-300 bg-white text-gray-800'
            }`}
          >
            <option value="">Select carrier...</option>
            {carriers.map((carrierOption) => (
              <option key={carrierOption.name} value={carrierOption.name}>
                {carrierOption.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowCarrierHelp(!showCarrierHelp)}
            className={`text-xs mt-1 transition-colors duration-300 ${
              darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            {showCarrierHelp ? 'Hide' : 'Show'} carrier help
          </button>
        </div>

        {/* Carrier Help */}
        {showCarrierHelp && (
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50'
          }`}>
            <h4 className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
              darkMode ? 'text-blue-300' : 'text-blue-800'
            }`}>
              📋 How to find the recipient's carrier:
            </h4>
            <ul className={`text-xs space-y-1 transition-colors duration-300 ${
              darkMode ? 'text-blue-200' : 'text-blue-700'
            }`}>
              <li>• Ask the recipient which carrier they use</li>
              <li>• Check their phone bill or account</li>
              <li>• Look at their phone's settings (Settings > About)</li>
              <li>• Try the most common carriers: AT&T, Verizon, T-Mobile</li>
            </ul>
          </div>
        )}

        {/* Message Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Message
          </label>
          <textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 resize-none ${
              darkMode 
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                : 'border-gray-300 bg-white text-gray-800'
            }`}
          />
          <div className={`text-xs mt-1 transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {message.length}/160 characters
          </div>
        </div>

        {/* Quick Templates */}
        <div>
          <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Quick Templates
          </label>
          <div className="flex flex-wrap gap-2">
            {quickTemplates.map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuickSend(template)}
                className={`px-3 py-1 text-xs rounded-full transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || !phoneNumber.trim() || !message.trim() || !carrier}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? 'Preparing SMS...' : '📱 Send SMS'}
        </button>
      </form>

      {/* Message History */}
      {messageHistory.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              📜 Message History ({messageHistory.length})
            </h3>
            <button
              onClick={clearHistory}
              className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
              }`}
            >
              Clear History
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {messageHistory.slice(0, 10).map((msg) => (
              <div key={msg.id} className={`p-3 rounded-lg transition-colors duration-300 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {msg.phoneNumber}
                  </div>
                  <div className={`text-xs transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className={`text-sm mb-1 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {msg.message}
                </div>
                <div className={`text-xs transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Via {msg.carrier} • {msg.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className={`mt-6 p-4 rounded-xl transition-colors duration-300 ${
        darkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50'
      }`}>
        <h3 className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
          darkMode ? 'text-yellow-300' : 'text-yellow-800'
        }`}>
          ⚠️ Important Notes
        </h3>
        <ul className={`space-y-1 text-sm transition-colors duration-300 ${
          darkMode ? 'text-yellow-200' : 'text-yellow-700'
        }`}>
          <li>• This opens your default email client to send the SMS</li>
          <li>• You need to manually send the email for the SMS to be delivered</li>
          <li>• Not all carriers support email-to-SMS (coverage varies)</li>
          <li>• Some carriers may charge for email-to-SMS messages</li>
          <li>• For reliable SMS delivery, consider using Twilio API</li>
        </ul>
      </div>
    </div>
  );
}

export default SMSMessenger;
