import { useState, useEffect } from "react";

function ShoppingList({ darkMode }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load shopping list from localStorage on component mount
  useEffect(() => {
    const storedItems = localStorage.getItem('shoppingList');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  // Save shopping list to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    setIsLoading(true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      const itemToAdd = {
        id: Date.now().toString(),
        name: newItem.trim(),
        addedAt: new Date().toISOString(),
        priority: items.length + 1
      };

      setItems(prevItems => [...prevItems, itemToAdd]);
      setNewItem("");
      setIsLoading(false);
    }, 300);
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from your shopping list?')) {
      const updatedItems = items.filter(item => item.id !== itemId);
      // Reorder priorities after removal
      const reorderedItems = updatedItems.map((item, index) => ({
        ...item,
        priority: index + 1
      }));
      setItems(reorderedItems);
    }
  };

  const moveItemUp = (itemId) => {
    const currentIndex = items.findIndex(item => item.id === itemId);
    if (currentIndex > 0) {
      const newItems = [...items];
      // Swap items
      [newItems[currentIndex], newItems[currentIndex - 1]] = [newItems[currentIndex - 1], newItems[currentIndex]];
      // Update priorities
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        priority: index + 1
      }));
      setItems(updatedItems);
    }
  };

  const moveItemDown = (itemId) => {
    const currentIndex = items.findIndex(item => item.id === itemId);
    if (currentIndex < items.length - 1) {
      const newItems = [...items];
      // Swap items
      [newItems[currentIndex], newItems[currentIndex + 1]] = [newItems[currentIndex + 1], newItems[currentIndex]];
      // Update priorities
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        priority: index + 1
      }));
      setItems(updatedItems);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    if (priority <= 3) return darkMode ? 'text-red-400' : 'text-red-600';
    if (priority <= 6) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return darkMode ? 'text-green-400' : 'text-green-600';
  };

  const getPriorityLabel = (priority) => {
    if (priority <= 3) return 'High Priority';
    if (priority <= 6) return 'Medium Priority';
    return 'Low Priority';
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-colors duration-300`}>
      <div className={`p-6 border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🛒 Shopping List</h2>
        <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Organize your shopping priorities with a numbered, reorderable list
        </p>
      </div>

      <div className="p-6">
        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter item to buy..."
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
              }`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!newItem.trim() || isLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                isLoading || !newItem.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 hover:scale-105'
              } text-white`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                'Add Item'
              )}
            </button>
          </div>
        </form>

        {/* Shopping List */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Your Shopping List ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h3>

          {items.length === 0 ? (
            <div className={`text-center py-12 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <span className="text-3xl">🛒</span>
              </div>
              <p className="text-lg font-medium mb-2">No items yet!</p>
              <p>Start building your shopping list by adding items above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                    darkMode 
                      ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' 
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {/* Priority Number */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300 ${
                    darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {item.priority}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className={`font-semibold text-lg transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {item.name}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-300 ${
                        darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {getPriorityLabel(item.priority)}
                      </span>
                    </div>
                    <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Added {formatDate(item.addedAt)}
                    </p>
                  </div>

                  {/* Priority Color Indicator */}
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(item.priority).replace('text-', 'bg-')}`}></div>

                  {/* Move Controls */}
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveItemUp(item.id)}
                      disabled={index === 0}
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                        index === 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : darkMode 
                            ? 'text-blue-400 hover:bg-blue-900 hover:text-blue-300' 
                            : 'text-blue-500 hover:bg-blue-100 hover:text-blue-700'
                      }`}
                      title="Move up"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveItemDown(item.id)}
                      disabled={index === items.length - 1}
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                        index === items.length - 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : darkMode 
                            ? 'text-blue-400 hover:bg-blue-900 hover:text-blue-300' 
                            : 'text-blue-500 hover:bg-blue-100 hover:text-blue-700'
                      }`}
                      title="Move down"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                      darkMode 
                        ? 'text-red-400 hover:bg-red-900 hover:text-red-300' 
                        : 'text-red-500 hover:bg-red-100 hover:text-red-700'
                    }`}
                    title="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Priority Legend */}
        {items.length > 0 && (
          <div className={`mt-8 p-4 rounded-lg transition-colors duration-300 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h4 className={`text-sm font-semibold mb-3 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Priority Guide
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  High Priority (1-3)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Medium Priority (4-6)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Low Priority (7+)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Features Info */}
        {items.length > 0 && (
          <div className={`mt-6 rounded-lg p-4 transition-colors duration-300 ${
            darkMode 
              ? 'bg-green-900/30 border border-green-700' 
              : 'bg-green-50'
          }`}>
            <h4 className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
              darkMode ? 'text-green-300' : 'text-green-800'
            }`}>Shopping List Features</h4>
            <ul className={`text-sm space-y-1 transition-colors duration-300 ${
              darkMode ? 'text-green-200' : 'text-green-700'
            }`}>
              <li>• Use ↑↓ arrows to reorder items and change priorities</li>
              <li>• Items are automatically numbered by priority (1 = highest)</li>
              <li>• Color-coded priority levels for easy identification</li>
              <li>• Click the trash icon to remove items from your list</li>
              <li>• All changes are automatically saved to your browser</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingList;
