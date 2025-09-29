import { useState, useEffect } from "react";

function EmployeeManager({ darkMode }) {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Maid",
      role: "Housekeeping & Cleaning",
      icon: "🧹",
      color: "bg-blue-500",
      tasks: [],
      currentTask: "",
      status: "available" // available, busy, completed
    },
    {
      id: 2,
      name: "Chef",
      role: "Culinary & Meal Preparation",
      icon: "👨‍🍳",
      color: "bg-orange-500",
      tasks: [],
      currentTask: "",
      status: "available"
    },
    {
      id: 3,
      name: "Personal Assistant",
      role: "Errands & Personal Tasks",
      icon: "💼",
      color: "bg-purple-500",
      tasks: [],
      currentTask: "",
      status: "available"
    },
    {
      id: 4,
      name: "Orthodontic Assistant",
      role: "Dental & Medical Support",
      icon: "🦷",
      color: "bg-teal-500",
      tasks: [],
      currentTask: "",
      status: "available"
    },
    {
      id: 5,
      name: "Office Manager",
      role: "Business & Administrative",
      icon: "📊",
      color: "bg-green-500",
      tasks: [],
      currentTask: "",
      status: "available"
    },
    {
      id: 6,
      name: "Model & Dog Caretaker",
      role: "Pet Care & Modeling Support",
      icon: "🐕",
      color: "bg-pink-500",
      tasks: [],
      currentTask: "",
      status: "available"
    }
  ]);

  // Load employee data from localStorage on component mount
  useEffect(() => {
    const storedEmployees = localStorage.getItem('employeeManagerData');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  // Save employee data to localStorage whenever employees change
  useEffect(() => {
    localStorage.setItem('employeeManagerData', JSON.stringify(employees));
  }, [employees]);

  const handleTaskSubmit = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee || !employee.currentTask.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      description: employee.currentTask.trim(),
      status: 'pending',
      assignedAt: new Date().toISOString(),
      completedAt: null
    };

    // Update employee with new task and status
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => 
        emp.id === employeeId 
          ? { 
              ...emp, 
              tasks: [newTask, ...emp.tasks],
              currentTask: "",
              status: 'busy'
            }
          : emp
      )
    );

    // Simulate task completion after 3-8 seconds
    const completionTime = Math.random() * 5000 + 3000; // 3-8 seconds
    setTimeout(() => {
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp.id === employeeId 
            ? { 
                ...emp, 
                tasks: emp.tasks.map(task => 
                  task.id === newTask.id 
                    ? { ...task, status: 'completed', completedAt: new Date().toISOString() }
                    : task
                ),
                status: 'completed'
              }
            : emp
        )
      );

      // Reset status to available after showing completion
      setTimeout(() => {
        setEmployees(prevEmployees => 
          prevEmployees.map(emp => 
            emp.id === employeeId 
              ? { ...emp, status: 'available' }
              : emp
          )
        );
      }, 2000);
    }, completionTime);
  };

  const handleInputChange = (employeeId, value) => {
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => 
        emp.id === employeeId 
          ? { ...emp, currentTask: value }
          : emp
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return darkMode ? 'bg-green-600' : 'bg-green-500';
      case 'busy':
        return darkMode ? 'bg-yellow-600' : 'bg-yellow-500';
      case 'completed':
        return darkMode ? 'bg-blue-600' : 'bg-blue-500';
      default:
        return darkMode ? 'bg-gray-600' : 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'completed':
        return 'Task Complete!';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalTasks = () => {
    return employees.reduce((total, emp) => total + emp.tasks.length, 0);
  };

  const getCompletedTasks = () => {
    return employees.reduce((total, emp) => 
      total + emp.tasks.filter(task => task.status === 'completed').length, 0
    );
  };

  const getPendingTasks = () => {
    return employees.reduce((total, emp) => 
      total + emp.tasks.filter(task => task.status === 'pending').length, 0
    );
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-colors duration-300`}>
      <div className={`p-6 border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>👥 Employee Management</h2>
        <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage your personal staff and assign tasks to each team member
        </p>
      </div>

      <div className="p-6">
        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 hover:border-gray-500' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Employee Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-16 h-16 ${employee.color} rounded-full flex items-center justify-center text-3xl text-white`}>
                  {employee.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {employee.name}
                  </h3>
                  <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {employee.role}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(employee.status)}`}>
                  {getStatusText(employee.status)}
                </div>
              </div>

              {/* Task Input */}
              <div className="mb-4">
                <textarea
                  value={employee.currentTask}
                  onChange={(e) => handleInputChange(employee.id, e.target.value)}
                  placeholder={`Send task to ${employee.name}...`}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
                  }`}
                  disabled={employee.status === 'busy'}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={() => handleTaskSubmit(employee.id)}
                disabled={!employee.currentTask.trim() || employee.status === 'busy'}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                  !employee.currentTask.trim() || employee.status === 'busy'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : `${employee.color} hover:scale-105 text-white`
                }`}
              >
                {employee.status === 'busy' ? '⏳ Working...' : '📤 Send Task'}
              </button>

              {/* Recent Tasks */}
              {employee.tasks.length > 0 && (
                <div className="mt-4">
                  <h4 className={`text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Recent Tasks:
                  </h4>
                  <div className="space-y-2">
                    {employee.tasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={`text-xs p-2 rounded transition-colors duration-300 ${
                          task.status === 'completed'
                            ? darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
                            : darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{task.description}</span>
                          <span className="ml-2">
                            {task.status === 'completed' ? '✅' : '⏳'}
                          </span>
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          {task.status === 'completed' 
                            ? `Completed at ${formatDate(task.completedAt)}`
                            : `Assigned at ${formatDate(task.assignedAt)}`
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Statistics Dashboard */}
        <div className={`p-6 rounded-lg transition-colors duration-300 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            📊 Team Performance Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {employees.length}
              </div>
              <div className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Employees
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                {getTotalTasks()}
              </div>
              <div className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Tasks
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`}>
                {getPendingTasks()}
              </div>
              <div className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Pending Tasks
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {getCompletedTasks()}
              </div>
              <div className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Completed Tasks
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className={`mt-6 rounded-lg p-4 transition-colors duration-300 ${
          darkMode 
            ? 'bg-blue-900/30 border border-blue-700' 
            : 'bg-blue-50'
        }`}>
          <h4 className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
            darkMode ? 'text-blue-300' : 'text-blue-800'
          }`}>How to Use Employee Management</h4>
          <ul className={`text-sm space-y-1 transition-colors duration-300 ${
            darkMode ? 'text-blue-200' : 'text-blue-700'
          }`}>
            <li>• Type a task description in the text box next to each employee</li>
            <li>• Click "Send Task" to assign the task to that employee</li>
            <li>• Employees show status: Available, Busy, or Task Complete!</li>
            <li>• Tasks are automatically completed after 3-8 seconds</li>
            <li>• View recent task history for each employee</li>
            <li>• Monitor overall team performance in the statistics dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EmployeeManager;
