import { useState, useEffect } from "react";

function TailwindDemo({ darkMode }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [formData2, setFormData2] = useState({
    name: "",
    email: "",
    password: ""
  });

const myvariable = "Hello World";
const myvariable3 = 3;
const myvariable4 = 4;
const sum =()=>{
  return myvariable3 + myvariable4;
}
console.log("my variable 3 plus my variable 4 is ", sum());


const [users, setUsers] = useState([]);


const [myvariable2, setMyvariable2] = useState("Hello World 2");

// Use useEffect to avoid infinite re-renders
useEffect(() => {
  console.log("original state is hello world ", myvariable);
  console.log(myvariable);
  console.log("Current myvariable2:", myvariable2);
  setMyvariable2("Hello World 3");
  console.log("myvariable3:", myvariable3);
  console.log("myvariable4:", myvariable4);
  console.log("Sum result:", sum());
}, []); // Empty dependency array means this runs once on mount

useEffect(() => {
  console.log("formData2: Hello ", formData2.name);
}, [formData2.name]);

  const [selectedBgColor, setSelectedBgColor] = useState("bg-red-100");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const backgroundColors = [
    { name: "Blue", class: "bg-blue-500", hover: "hover:bg-blue-600" },
    { name: "Green", class: "bg-green-500", hover: "hover:bg-green-600" },
    { name: "Purple", class: "bg-purple-500", hover: "hover:bg-purple-600" },
    { name: "Red", class: "bg-red-500", hover: "hover:bg-red-600" },
    { name: "Yellow", class: "bg-yellow-500", hover: "hover:bg-yellow-600" },
    { name: "Pink", class: "bg-pink-500", hover: "hover:bg-pink-600" },
    { name: "Indigo", class: "bg-indigo-500", hover: "hover:bg-indigo-600" },
    { name: "Teal", class: "bg-teal-500", hover: "hover:bg-teal-600" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputChange2 = (f) => {
    const { name, value } = f.target;
    setFormData2(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      alert(`Form submitted successfully!\nName: ${formData.name}\nEmail: ${formData.email}`);
      setFormData({ name: "", email: "", password: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setTimeout(() => {
      alert('Password reset link sent to your email!');
      setShowForgotPassword(false);
    }, 1000);
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    console.log(formData);
    setUsers([...users, formData2]);
localStorage.setItem("formData", JSON.stringify(formData2));
    
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-colors duration-300`}>
      <div className={`p-6 border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🎨 Tailwind CSS Demo</h2>
        <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Explore Tailwind CSS features, dynamic backgrounds, and interactive forms
        </p>
      </div>

      <div className="p-6">
        {/* Background Color Demo */}
        <div className={`mb-8 p-6 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            🌈 Dynamic Background Colors
          </h3>
          <p className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Click any color to see Tailwind's utility classes in action:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {backgroundColors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedBgColor(color.class)}
                className={`${color.class} ${color.hover} text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
              >
                {color.name}
              </button>
            ))}
          </div>

          {/* Dynamic Background Display */}
          <div className={`${selectedBgColor} p-6 rounded-lg text-white text-center transition-all duration-500`}>
            <h4 className="text-lg font-semibold mb-2">Selected Background</h4>
            <p className="text-sm opacity-90">Class: <code className="bg-black bg-opacity-20 px-2 py-1 rounded">{selectedBgColor}</code></p>
            <p className="text-sm mt-2 opacity-75">This demonstrates Tailwind's dynamic class application!</p>
          </div>
        </div>

        {/* Tailwind Features Showcase */}
        <div className={`mb-8 p-6 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ⚡ Tailwind CSS Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Spacing */}
            <div className={`p-4 rounded-lg border transition-colors duration-300 ${darkMode ? 'border-gray-600 bg-gray-600' : 'border-gray-200 bg-white'
              }`}>
              <h4 className={`font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📏 Spacing Utilities
              </h4>
              <div className="space-y-2">
                <div className="bg-blue-100 text-blue-800 text-xs p-1 rounded">p-1 (padding: 0.25rem)</div>
                <div className="bg-green-100 text-green-800 text-xs p-2 rounded">p-2 (padding: 0.5rem)</div>
                <div className="bg-purple-100 text-purple-800 text-xs p-3 rounded">p-3 (padding: 0.75rem)</div>
                <div className="bg-red-100 text-red-800 text-xs p-4 rounded">p-4 (padding: 1rem)</div>
              </div>
            </div>

            {/* Colors */}
            <div className={`p-4 rounded-lg border transition-colors duration-300 ${darkMode ? 'border-gray-600 bg-gray-600' : 'border-gray-200 bg-white'
              }`}>
              <h4 className={`font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🎨 Color System
              </h4>
              <div className="space-y-2">
                <div className="bg-red-500 text-white text-xs p-2 rounded">bg-red-500</div>
                <div className="bg-green-500 text-white text-xs p-2 rounded">bg-green-500</div>
                <div className="bg-blue-500 text-white text-xs p-2 rounded">bg-blue-500</div>
                <div className="bg-yellow-500 text-white text-xs p-2 rounded">bg-yellow-500</div>
              </div>
            </div>

            {/* Typography */}
            <div className={`p-4 rounded-lg border transition-colors duration-300 ${darkMode ? 'border-gray-600 bg-gray-600' : 'border-gray-200 bg-white'
              }`}>
              <h4 className={`font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                ✍️ Typography
              </h4>
              <div className="space-y-2">
                <div className="text-xs text-gray-600">text-xs (0.75rem)</div>
                <div className="text-sm text-gray-600">text-sm (0.875rem)</div>
                <div className="text-base text-gray-600">text-base (1rem)</div>
                <div className="text-lg text-gray-600">text-lg (1.125rem)</div>
              </div>
            </div>

            {/* Flexbox */}
            <div className={`p-4 rounded-lg border transition-colors duration-300 ${darkMode ? 'border-gray-600 bg-gray-600' : 'border-gray-200 bg-white'
              }`}>
              <h4 className={`font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📐 Flexbox & Grid
              </h4>
              <div className="flex space-x-2">
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">flex</div>
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">grid</div>
                <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded">space-x</div>
              </div>
            </div>

            {/* Transitions */}
            <div className={`p-4 rounded-lg border transition-colors duration-300 ${darkMode ? 'border-gray-600 bg-gray-600' : 'border-gray-200 bg-white'
              }`}>
              <h4 className={`font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🔄 Transitions
              </h4>
              <div className="space-y-2">
                <div className="bg-blue-500 text-white text-xs p-2 rounded transition-all duration-300 hover:scale-110 hover:bg-blue-600">
                  Hover me!
                </div>
                <div className="bg-green-500 text-white text-xs p-2 rounded transition-colors duration-300 hover:bg-green-600">
                  Smooth color change
                </div>
              </div>
            </div>

            {/* Responsive */}
            <div className={`p-4 rounded-lg border transition-colors duration-300 ${darkMode ? 'border-gray-600 bg-gray-600' : 'border-gray-200 bg-white'
              }`}>
              <h4 className={`font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📱 Responsive Design
              </h4>
              <div className="space-y-2">
                <div className="bg-blue-500 text-white text-xs p-2 rounded md:bg-green-500 lg:bg-purple-500">
                  Responsive colors
                </div>
                <div className="text-xs text-gray-600 md:text-sm lg:text-base">
                  Responsive text size
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Form */}
        <div className={`p-6 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            📝 Interactive Form Demo
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${darkMode
                    ? 'border-gray-600 bg-gray-600 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
                  }`}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${darkMode
                    ? 'border-gray-600 bg-gray-600 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
                  }`}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${darkMode
                    ? 'border-gray-600 bg-gray-600 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
                  }`}
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg'
                  } text-white`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Form'
                )}
              </button>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={showForgotPassword}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${showForgotPassword
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-500 hover:bg-gray-600 hover:shadow-lg'
                  } text-white`}
              >
                {showForgotPassword ? 'Sending...' : 'Forgot Password?'}
              </button>
            </div>
          </form>

          {/* Form Status */}
          {Object.values(formData).some(value => value) && (
            <div className={`mt-4 p-3 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-600' : 'bg-gray-100'
              }`}>
              <h4 className={`text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Form Data Preview:
              </h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Name:</span> {formData.name || 'Not entered'}</p>
                <p><span className="font-medium">Email:</span> {formData.email || 'Not entered'}</p>
                <p><span className="font-medium">Password:</span> {formData.password ? '••••••••' : 'Not entered'}</p>
              </div>
            </div>
          )}
        </div>


        {/* MY FORM */}
        {/* _________________________________________________________________________________________ */}

        <div className="p-6 flex flex-col items-start justify-left w-full text-gray-500">
          <form onSubmit={handleSubmit2} className="flex flex-col items-start justify-center w-full">
            <label htmlFor="name" className="text-sm font-medium mb-2 transition-colors duration-300 text-gray-700">
              Name
              <input name="name" id="name" type="text" placeholder="Name" value={formData2.name} onChange={handleInputChange2} className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
            </label>
            <label htmlFor="email" className="text-sm font-medium mb-2 transition-colors duration-300 text-gray-700"> 
              Email 
              <input name="email" id="email" type="email" placeholder="Email" value={formData2.email} onChange={handleInputChange2} className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
              </label>
            <label htmlFor="password" className="text-sm font-medium mb-2 transition-colors duration-300 text-gray-700"> 
              Password <input name="password" id="password" type="password" placeholder="Password" value={formData2.password} onChange={handleInputChange2} className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" /></label>
            <button type="submit" className="px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-blue-500 hover:bg-blue-600 hover:shadow-lg">Submit</button>
          </form>
{users.map((user, index) => (
  <div key={index} className="text-gray-500 mt-8">
    <h1>User {index + 1}</h1>
    <p>{user.name}</p>
    <p>{user.email}</p>
    <p>{user.password}</p>
  </div>
))}
{/* 
<h1>Form Data</h1>
<p>{JSON.stringify(formData2)}</p>
<p>"outside the bracket"{"hello " + formData2.name}</p>
<p>{formData2.email}</p>
<p>{formData2.password}</p> */}

          {/* MY FORM */}
          {/* _________________________________________________________________________________________ */}

        </div>

        {/* Tailwind Benefits */}
        <div className={`mt-8 rounded-lg p-4 transition-colors duration-300 ${darkMode
            ? 'bg-blue-900/30 border border-blue-700'
            : 'bg-blue-50'
          }`}>
          <h4 className={`text-sm font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-blue-300' : 'text-blue-800'
            }`}>Why Tailwind CSS?</h4>
          <ul className={`text-sm space-y-1 transition-colors duration-300 ${darkMode ? 'text-blue-200' : 'text-blue-700'
            }`}>
            <li>• Utility-first approach for rapid development</li>
            <li>• Consistent spacing, colors, and typography scales</li>
            <li>• Responsive design utilities built-in</li>
            <li>• Dark mode support with conditional classes</li>
            <li>• Hover, focus, and transition states</li>
            <li>• No need to write custom CSS for common patterns</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TailwindDemo;
