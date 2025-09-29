import { useState } from 'react';

function EmailComponent({ darkMode = false }) {
  const [emailAddress, setEmailAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);

  const handleSendEmail = async () => {
    if (!emailAddress.trim() || !message.trim()) {
      setSendStatus({ type: 'error', message: 'Please fill in both email address and message.' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      setSendStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setIsSending(true);
    setSendStatus(null);

    try {
      // Simulate email sending for testing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSendStatus({ type: 'success', message: 'Email sent successfully!' });
      setEmailAddress('');
      setMessage('');
    } catch (error) {
      setSendStatus({ type: 'error', message: 'Failed to send email. Please try again.' });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSendEmail();
    }
  };

  return (
    <div className="mt-8">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg mb-8 transition-colors duration-300`}>
        <div className={`p-6 border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📧 Send Email</h2>
          <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Send a message to someone via email</p>
        </div>
        
        <div className="p-6">
          {/* Email Address Field */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address *
            </label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="Enter recipient's email address"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-800'
              }`}
              disabled={isSending}
            />
          </div>

          {/* Message Text Box */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              rows="6"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 resize-none ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-800'
              }`}
              disabled={isSending}
            />
            <p className={`text-xs mt-1 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Press Ctrl + Enter to send
            </p>
          </div>

          {/* Status Message */}
          {sendStatus && (
            <div className={`mb-4 p-3 rounded-md transition-colors duration-300 ${
              sendStatus.type === 'success' 
                ? darkMode 
                  ? 'bg-green-900/30 border border-green-700 text-green-300'
                  : 'bg-green-50 border border-green-200 text-green-800'
                : darkMode
                  ? 'bg-red-900/30 border border-red-700 text-red-300'
                  : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {sendStatus.message}
            </div>
          )}

          {/* Send Button */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSendEmail}
              disabled={isSending || !emailAddress.trim() || !message.trim()}
              className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                isSending || !emailAddress.trim() || !message.trim()
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isSending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>Send Email</span>
                </div>
              )}
            </button>

            {/* Character Count */}
            <div className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {message.length} characters
            </div>
          </div>

          {/* Features Info */}
          <div className={`mt-6 p-4 rounded-lg transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-700/50 border border-gray-600' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h4 className={`text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Features:
            </h4>
            <ul className={`text-xs space-y-1 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Email validation to ensure correct format</li>
              <li>• Press Ctrl + Enter to send quickly</li>
              <li>• Character counter to track message length</li>
              <li>• Loading state while sending</li>
              <li>• Success/error feedback</li>
            </ul>
            
            {/* Test Info */}
            <div className={`mt-4 p-3 rounded border-l-4 ${
              darkMode 
                ? 'bg-blue-900/20 border-blue-600 text-blue-200' 
                : 'bg-blue-50 border-blue-400 text-blue-800'
            }`}>
              <h5 className="font-medium mb-1">🧪 Test Mode:</h5>
              <p className="text-xs">Currently in simulation mode. Emails are not actually sent.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailComponent; 