import { useState, useEffect } from "react";

function TradingViewCharts({ darkMode }) {
  const [stocks, setStocks] = useState([]);
  const [newSymbol, setNewSymbol] = useState("");
  const [timeframe, setTimeframe] = useState("1D");
  const [isLoading, setIsLoading] = useState(false);

  const timeframes = [
    { value: "1m", label: "1 Minute" },
    { value: "5m", label: "5 Minutes" },
    { value: "15m", label: "15 Minutes" },
    { value: "1h", label: "1 Hour" },
    { value: "4h", label: "4 Hours" },
    { value: "1D", label: "1 Day" },
    { value: "1W", label: "1 Week" },
    { value: "1M", label: "1 Month" }
  ];

  // Load stocks from localStorage on component mount
  useEffect(() => {
    const storedStocks = localStorage.getItem('tradingViewStocks');
    if (storedStocks) {
      setStocks(JSON.parse(storedStocks));
    } else {
      // Initialize with default stocks
      const defaultStocks = [
        { id: 1, symbol: 'OPM', name: 'Open Corp', addedAt: new Date().toISOString() },
        { id: 2, symbol: 'COST', name: 'Costco Wholesale', addedAt: new Date().toISOString() }
      ];
      setStocks(defaultStocks);
      localStorage.setItem('tradingViewStocks', JSON.stringify(defaultStocks));
    }
  }, []);

  // Save stocks to localStorage whenever stocks change
  useEffect(() => {
    localStorage.setItem('tradingViewStocks', JSON.stringify(stocks));
  }, [stocks]);

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;

    const symbol = newSymbol.trim().toUpperCase();
    
    // Check if stock already exists
    if (stocks.some(stock => stock.symbol === symbol)) {
      alert('This stock symbol is already added!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create new stock entry
      const newStock = {
        id: Date.now(),
        symbol: symbol,
        name: symbol, // In a real app, you'd fetch the company name
        addedAt: new Date().toISOString()
      };

      setStocks(prev => [...prev, newStock]);
      setNewSymbol("");
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('Error adding stock. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStock = (stockId) => {
    setStocks(prev => prev.filter(stock => stock.id !== stockId));
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const getTradingViewWidget = (stock) => {
    const widgetId = `tradingview_${stock.id}`;
    
    return {
      id: widgetId,
      symbol: stock.symbol,
      timeframe: timeframe,
      theme: darkMode ? 'dark' : 'light'
    };
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 transition-colors duration-300`}>
      {/* Header */}
      <div className={`mb-6 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
        <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          📈 TradingView Charts
        </h2>
        <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Track your favorite stocks with real-time charts and customizable timeframes.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* Add Stock Form */}
        <form onSubmit={handleAddStock} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL, TSLA, MSFT)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-800'
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !newSymbol.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Adding...' : 'Add Stock'}
          </button>
        </form>

        {/* Timeframe Selector */}
        <div className="flex flex-wrap gap-2">
          <span className={`text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Timeframe:
          </span>
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => handleTimeframeChange(tf.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                timeframe === tf.value
                  ? 'bg-blue-500 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      {stocks.length === 0 ? (
        <div className="text-center py-12">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <span className="text-2xl">📊</span>
          </div>
          <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            No stocks added yet
          </h3>
          <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Add your first stock symbol above to start tracking charts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stocks.map((stock) => (
            <div key={stock.id} className={`relative rounded-xl overflow-hidden transition-colors duration-300 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              {/* Remove Button */}
              <button
                onClick={() => handleRemoveStock(stock.id)}
                className="absolute top-2 right-2 z-10 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold"
                title="Remove chart"
              >
                ×
              </button>

              {/* Chart Header */}
              <div className={`p-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} transition-colors duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {stock.symbol}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stock.name}
                    </p>
                  </div>
                  <div className={`text-xs transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {timeframe}
                  </div>
                </div>
              </div>

              {/* TradingView Widget Container */}
              <div className="h-96 relative">
                <iframe
                  src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${stock.id}&symbol=${stock.symbol}&interval=${timeframe}&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=${darkMode ? 'dark' : 'light'}&style=1&timezone=Etc%2FUTC&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${stock.symbol}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '0 0 12px 12px'
                  }}
                  title={`${stock.symbol} Chart`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stock List Summary */}
      {stocks.length > 0 && (
        <div className={`mt-6 p-4 rounded-xl transition-colors duration-300 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`text-sm font-semibold mb-3 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            📋 Your Watchlist ({stocks.length} stocks)
          </h3>
          <div className="flex flex-wrap gap-2">
            {stocks.map((stock) => (
              <div
                key={stock.id}
                className={`px-3 py-1 rounded-full text-sm transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {stock.symbol}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className={`mt-6 p-4 rounded-xl transition-colors duration-300 ${
        darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50'
      }`}>
        <h3 className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
          darkMode ? 'text-blue-300' : 'text-blue-800'
        }`}>
          💡 How to Use
        </h3>
        <ul className={`space-y-1 text-sm transition-colors duration-300 ${
          darkMode ? 'text-blue-200' : 'text-blue-700'
        }`}>
          <li>• Enter any stock symbol (e.g., AAPL, TSLA, MSFT) to add it to your watchlist</li>
          <li>• Use the timeframe buttons to switch between different chart periods</li>
          <li>• Click the × button to remove any chart from your watchlist</li>
          <li>• Charts update in real-time with live market data</li>
          <li>• All your stocks are saved locally and will persist between sessions</li>
        </ul>
      </div>
    </div>
  );
}

export default TradingViewCharts;
