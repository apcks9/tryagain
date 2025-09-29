import { useState } from "react";

function CloneOfMyself({ darkMode }) {
  const [activeTask, setActiveTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState({});

  const tasks = [
    {
      id: 1,
      title: "Trade Options and Stocks",
      description: "Analyze market trends, execute trades, and manage portfolio",
      icon: "📈",
      color: "bg-green-500 hover:bg-green-600",
      category: "Finance"
    },
    {
      id: 2,
      title: "Clean the House",
      description: "Organize, dust, vacuum, and maintain household cleanliness",
      icon: "🏠",
      color: "bg-blue-500 hover:bg-blue-600",
      category: "Home"
    },
    {
      id: 3,
      title: "Cook Food for the Day",
      description: "Plan meals, prepare ingredients, and cook nutritious dishes",
      icon: "🍳",
      color: "bg-orange-500 hover:bg-orange-600",
      category: "Food"
    },
    {
      id: 4,
      title: "Do Orthodontics",
      description: "Handle dental procedures, consultations, and treatments",
      icon: "🦷",
      color: "bg-teal-500 hover:bg-teal-600",
      category: "Health"
    },
    {
      id: 5,
      title: "Innovate and Create Startup Business",
      description: "Brainstorm ideas, develop business plans, and launch ventures",
      icon: "🚀",
      color: "bg-purple-500 hover:bg-purple-600",
      category: "Business"
    },
    {
      id: 6,
      title: "Manage and Organize All Finances",
      description: "Track expenses, create budgets, and optimize financial health",
      icon: "💰",
      color: "bg-yellow-500 hover:bg-yellow-600",
      category: "Finance"
    },
    {
      id: 7,
      title: "Meet New People",
      description: "Network, socialize, and build meaningful connections",
      icon: "🤝",
      color: "bg-pink-500 hover:bg-pink-600",
      category: "Social"
    },
    {
      id: 8,
      title: "Drive and Fix Car or Run Errands",
      description: "Maintain vehicle, handle repairs, and complete daily tasks",
      icon: "🚗",
      color: "bg-red-500 hover:bg-red-600",
      category: "Transport"
    }
  ];

  const handleTaskClick = (taskId) => {
    setActiveTask(taskId);
    
    // Simulate task execution
    setTaskStatus(prev => ({
      ...prev,
      [taskId]: 'in-progress'
    }));

    // Simulate task completion after 2 seconds
    setTimeout(() => {
      setTaskStatus(prev => ({
        ...prev,
        [taskId]: 'completed'
      }));
      
      // Reset status after showing completion
      setTimeout(() => {
        setTaskStatus(prev => ({
          ...prev,
          [taskId]: null
        }));
        setActiveTask(null);
      }, 2000);
    }, 2000);
  };

  const getStatusIcon = (taskId) => {
    const status = taskStatus[taskId];
    if (status === 'in-progress') {
      return (
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      );
    } else if (status === 'completed') {
      return (
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <span className="text-green-600 text-sm">✓</span>
        </div>
      );
    }
    return null;
  };

  const getStatusText = (taskId) => {
    const status = taskStatus[taskId];
    if (status === 'in-progress') {
      return 'In Progress...';
    } else if (status === 'completed') {
      return 'Completed!';
    }
    return '';
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-colors duration-300`}>
      <div className={`p-6 border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🤖 Clone of Myself</h2>
        <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Your personal AI assistant ready to handle 8 essential life tasks
        </p>
      </div>

      <div className="p-6">
        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
              } rounded-lg border-2 border-transparent hover:border-gray-300`}
            >
              <button
                onClick={() => handleTaskClick(task.id)}
                disabled={taskStatus[task.id] === 'in-progress'}
                className={`w-full p-4 text-left transition-all duration-300 ${
                  taskStatus[task.id] === 'in-progress' ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {/* Task Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 ${task.color} rounded-lg flex items-center justify-center text-2xl`}>
                    {task.icon}
                  </div>
                  {getStatusIcon(task.id)}
                </div>

                {/* Task Content */}
                <div>
                  <h3 className={`font-semibold text-sm mb-2 transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {task.title}
                  </h3>
                  <p className={`text-xs transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                  
                  {/* Category Badge */}
                  <div className="mt-3">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full transition-colors duration-300 ${
                      darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {task.category}
                    </span>
                  </div>
                </div>

                {/* Status Text */}
                {taskStatus[task.id] && (
                  <div className={`mt-3 text-center text-sm font-medium transition-colors duration-300 ${
                    taskStatus[task.id] === 'completed' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {getStatusText(task.id)}
                  </div>
                )}
              </button>

              {/* Hover Effect Overlay */}
              <div className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
                darkMode ? 'bg-blue-900/20' : 'bg-blue-50/50'
              } opacity-0 group-hover:opacity-100 pointer-events-none`}></div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className={`mt-8 rounded-lg p-4 transition-colors duration-300 ${
          darkMode 
            ? 'bg-blue-900/30 border border-blue-700' 
            : 'bg-blue-50'
        }`}>
          <h4 className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
            darkMode ? 'text-blue-300' : 'text-blue-800'
          }`}>How to Use Your Clone</h4>
          <ul className={`text-sm space-y-1 transition-colors duration-300 ${
            darkMode ? 'text-blue-200' : 'text-blue-700'
          }`}>
            <li>• Click any task button to activate your clone</li>
            <li>• Each task simulates real-world execution</li>
            <li>• Tasks are categorized by type for easy organization</li>
            <li>• Visual feedback shows progress and completion status</li>
            <li>• Perfect for delegating daily responsibilities</li>
          </ul>
        </div>

        {/* Task Statistics */}
        <div className={`mt-6 p-4 rounded-lg transition-colors duration-300 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {tasks.length}
              </div>
              <div className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Total Tasks
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                {Object.values(taskStatus).filter(status => status === 'completed').length}
              </div>
              <div className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Completed
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`}>
                {Object.values(taskStatus).filter(status => status === 'in-progress').length}
              </div>
              <div className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                In Progress
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {new Set(tasks.map(task => task.category)).size}
              </div>
              <div className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Categories
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CloneOfMyself;
