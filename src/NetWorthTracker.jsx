import { useState, useEffect } from "react";

function NetWorthTracker({ darkMode }) {
  const [balance, setBalance] = useState(1000000000); // 1 billion dollars
  const [assets, setAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetAmount, setNewAssetAmount] = useState("");
  const [newTransactionName, setNewTransactionName] = useState("");
  const [newTransactionAmount, setNewTransactionAmount] = useState("");

  // Calculate total net worth
  const totalNetWorth = balance + assets.reduce((sum, asset) => sum + asset.amount, 0);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedAssets = localStorage.getItem('netWorthAssets');
    const storedTransactions = localStorage.getItem('netWorthTransactions');
    
    if (storedAssets) {
      setAssets(JSON.parse(storedAssets));
    }
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  // Save data to localStorage whenever assets or transactions change
  useEffect(() => {
    localStorage.setItem('netWorthAssets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('netWorthTransactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!newAssetName.trim() || !newAssetAmount.trim()) return;

    const amount = parseFloat(newAssetAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive amount for the asset.');
      return;
    }

    const newAsset = {
      id: Date.now().toString(),
      name: newAssetName.trim(),
      amount: amount,
      addedAt: new Date().toISOString()
    };

    setAssets(prevAssets => [newAsset, ...prevAssets]);
    setNewAssetName("");
    setNewAssetAmount("");
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTransactionName.trim() || !newTransactionAmount.trim()) return;

    const amount = parseFloat(newTransactionAmount);
    if (isNaN(amount)) {
      alert('Please enter a valid amount for the transaction.');
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      name: newTransactionName.trim(),
      amount: amount,
      type: amount >= 0 ? 'income' : 'expense',
      timestamp: new Date().toISOString()
    };

    // Update balance
    setBalance(prevBalance => prevBalance + amount);
    
    // Add to transactions
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    
    setNewTransactionName("");
    setNewTransactionAmount("");
  };

  const handleRemoveAsset = (assetId) => {
    if (window.confirm('Are you sure you want to remove this asset?')) {
      setAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetId));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-colors duration-300`}>
      <div className={`p-6 border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>💰 Net Worth Tracker</h2>
        <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Monitor your financial portfolio, assets, and transactions in real-time
        </p>
      </div>

      <div className="p-6">
        {/* Current Balance Display */}
        <div className={`text-center mb-8 p-8 rounded-2xl transition-colors duration-300 ${
          darkMode ? 'bg-gradient-to-r from-green-900 to-blue-900' : 'bg-gradient-to-r from-green-100 to-blue-100'
        }`}>
          <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${
            darkMode ? 'text-green-200' : 'text-green-700'
          }`}>
            Current Bank Balance
          </h3>
          <div className={`text-5xl font-bold transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {formatCurrency(balance)}
          </div>
          <p className={`text-sm mt-2 transition-colors duration-300 ${
            darkMode ? 'text-green-200' : 'text-green-600'
          }`}>
            💰 Billionaire Status Achieved! 🎉
          </p>
        </div>

        {/* Net Worth Summary */}
        <div className={`mb-8 p-6 rounded-lg transition-colors duration-300 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Net Worth Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                {formatCurrency(balance)}
              </div>
              <div className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Cash Balance
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {formatCurrency(assets.reduce((sum, asset) => sum + asset.amount, 0))}
              </div>
              <div className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Assets
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {formatCurrency(totalNetWorth)}
              </div>
              <div className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Net Worth
              </div>
            </div>
          </div>
        </div>

        {/* Add Asset Form */}
        <div className={`mb-8 p-6 rounded-lg transition-colors duration-300 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ➕ Add New Asset
          </h3>
          <form onSubmit={handleAddAsset} className="flex gap-4">
            <input
              type="text"
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
              placeholder="Asset name (e.g., House, Car, Stocks)"
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
              }`}
            />
            <input
              type="number"
              value={newAssetAmount}
              onChange={(e) => setNewAssetAmount(e.target.value)}
              placeholder="Amount ($)"
              step="0.01"
              min="0"
              className={`w-32 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
              }`}
            />
            <button
              type="submit"
              disabled={!newAssetName.trim() || !newAssetAmount.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Add Asset
            </button>
          </form>
        </div>

        {/* Add Transaction Form */}
        <div className={`mb-8 p-6 rounded-lg transition-colors duration-300 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            💸 Add Transaction (Income/Expense)
          </h3>
          <p className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Use positive numbers for income, negative numbers for expenses
          </p>
          <form onSubmit={handleAddTransaction} className="flex gap-4">
            <input
              type="text"
              value={newTransactionName}
              onChange={(e) => setNewTransactionName(e.target.value)}
              placeholder="Transaction name (e.g., Salary, Groceries, Car Repair)"
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
              }`}
            />
            <input
              type="number"
              value={newTransactionAmount}
              onChange={(e) => setNewTransactionAmount(e.target.value)}
              placeholder="Amount (+ or -)"
              step="0.01"
              className={`w-32 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
              }`}
            />
            <button
              type="submit"
              disabled={!newTransactionName.trim() || !newTransactionAmount.trim()}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Add Transaction
            </button>
          </form>
        </div>

        {/* Assets List */}
        <div className="mb-8">
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            📊 Your Assets
          </h3>
          {assets.length === 0 ? (
            <div className={`text-center py-8 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>No assets added yet. Start building your portfolio!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors duration-300 ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                      💰
                    </div>
                    <div>
                      <h4 className={`font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {asset.name}
                      </h4>
                      <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Added {formatDate(asset.addedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-lg font-bold transition-colors duration-300 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {formatCurrency(asset.amount)}
                    </span>
                    <button
                      onClick={() => handleRemoveAsset(asset.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 hover:scale-110 ${
                        darkMode 
                          ? 'text-red-400 hover:bg-red-900 hover:text-red-300' 
                          : 'text-red-500 hover:bg-red-100 hover:text-red-700'
                      }`}
                      title="Remove asset"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            📝 Recent Transactions
          </h3>
          {transactions.length === 0 ? (
            <div className={`text-center py-8 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>No transactions yet. Start tracking your income and expenses!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors duration-300 ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                      transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {transaction.type === 'income' ? '📈' : '📉'}
                    </div>
                    <div>
                      <h4 className={`font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {transaction.name}
                      </h4>
                      <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {formatDate(transaction.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className={`text-lg font-bold transition-colors duration-300 ${
                    transaction.type === 'income' 
                      ? darkMode ? 'text-green-400' : 'text-green-600'
                      : darkMode ? 'text-red-400' : 'text-red-600'
                  }`}>
                    {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NetWorthTracker;
