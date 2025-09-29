import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import './App.css';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './index.css';
import CardComponent from './cardcomponent';
import StockQuote from './StockQuote';
import { PriceProvider } from './PriceContext';
import DiscountedPriceDisplay from './DiscountedPriceDisplay';
import Slideshow from './Slideshow';

function App() {
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [number1, setnumber1] = useState(null);
  const [number2, setnumber2] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSearch = () => {
    setSearchResult(searchInput);
  };

  const getluckysearch = () => {
    setSearchResult("I'm Feeling Lucky because i got " + searchInput + " " + searchInput + " " + searchInput + " ");
  };

  const multiplytwonumbers = () => {
    setSearchResult("if you multiply " + number1 + " by " + number2 + " the result is " + (number1 * number2));
  };

  return (
    <PriceProvider>
      <div>
        <nav className="navbar items-center" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
          <div className="flex items-center">
            <img className='w-30 h-9 ml-2' src="./bora.jpeg" alt="" />
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <span style={{ marginRight: '10px' }}>Logged in as: {user.email}</span>
                <Link to="/dashboard" style={{ marginRight: '10px' }}>Dashboard</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
                <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="app">
                <img
                  src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
                  alt="Google"
                  className="logo"
                />
                <input
                  type="text"
                  className="search-box"
                  placeholder="Search Google or type a URL"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <input
                  type="number"
                  className="search-box"
                  placeholder="input number"
                  value={number1}
                  onChange={(e) => setnumber1(e.target.value)}
                />
                <input
                  type="number"
                  className="search-box"
                  placeholder="input number"
                  value={number2}
                  onChange={(e) => setnumber2(e.target.value)}
                />

                <div className="buttons">
                  <button className="bg-red-500" onClick={handleSearch}>Google Search</button>
                  <button onClick={getluckysearch}>I'm Feeling Lucky</button>
                  <button onClick={multiplytwonumbers}>Multiply two numbers </button>
                </div>


                {searchResult && (
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <h3>Search Results:</h3>
                    <p>{searchResult}</p>
                  </div>
                )}

                <div className='mb-20'>
                  <Slideshow />
                </div>


      <video width="600" controls>
        <source src="video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div>
  <h1>My YouTube Video</h1>
  <iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/qjNjrGWLgds"
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
</div>


                <>
                  <input
                    type="text"
                    className="search-box2"
                    placeholder="Search Google or type a URL"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button onClick={multiplytwonumbers}>New Function </button>
                </>

                <div className='flex flex-wrap w-full h-[120px] bg-blue-500 justify-center items-center mt-10 mb-10'>
                  <div className="stock-card">
                    <StockQuote symbol="TSLA" />
                  </div>
                  <div className="stock-card">
                    <StockQuote symbol="GOOG" />
                  </div>
                  <div className="stock-card">
                    <StockQuote symbol="AVGO" />
                  </div>
                  <div className="stock-card">
                    <StockQuote symbol="AMZN" />
                  </div>
                  
                  <DiscountedPriceDisplay />
                  <DiscountedPriceDisplay />

                  <CardComponent title="the option premium for the discount at 4%  in 5 weeks out is  " description=" optionaskpricefetcher (stock, 4%discount, 5 weeks))  " />
                  <CardComponent title="Card 4" description="This is the fourth card" />
                </div>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </PriceProvider>
  );
}

export default App;
