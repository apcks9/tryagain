import { useState, useEffect } from "react";

function MovieFavorites({ darkMode }) {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load movies from localStorage on component mount
  useEffect(() => {
    const storedMovies = localStorage.getItem('favoriteMovies');
    if (storedMovies) {
      setMovies(JSON.parse(storedMovies));
    }
  }, []);

  // Save movies to localStorage whenever movies array changes
  useEffect(() => {
    localStorage.setItem('favoriteMovies', JSON.stringify(movies));
  }, [movies]);

  const handleAddMovie = (e) => {
    e.preventDefault();
    if (!newMovie.trim()) return;

    setIsLoading(true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      const movieToAdd = {
        id: Date.now().toString(),
        title: newMovie.trim(),
        addedAt: new Date().toISOString(),
        rating: null
      };

      setMovies(prevMovies => [movieToAdd, ...prevMovies]);
      setNewMovie("");
      setIsLoading(false);
    }, 300);
  };

  const handleDeleteMovie = (movieId) => {
    if (window.confirm('Are you sure you want to remove this movie from your favorites?')) {
      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    }
  };

  const handleRatingChange = (movieId, rating) => {
    setMovies(prevMovies => 
      prevMovies.map(movie => 
        movie.id === movieId ? { ...movie, rating } : movie
      )
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-colors duration-300`}>
      <div className={`p-6 border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🎬 My Favorite Movies</h2>
        <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Keep track of your favorite movies and add new ones to your collection
        </p>
      </div>

      <div className="p-6">
        {/* Add Movie Form */}
        <form onSubmit={handleAddMovie} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMovie}
              onChange={(e) => setNewMovie(e.target.value)}
              placeholder="Enter movie title..."
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
              }`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!newMovie.trim() || isLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                isLoading || !newMovie.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-500 hover:bg-purple-600 hover:scale-105'
              } text-white`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                'Add Movie'
              )}
            </button>
          </div>
        </form>

        {/* Movies List */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Your Collection ({movies.length} {movies.length === 1 ? 'movie' : 'movies'})
          </h3>

          {movies.length === 0 ? (
            <div className={`text-center py-12 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <span className="text-3xl">🎬</span>
              </div>
              <p className="text-lg font-medium mb-2">No movies yet!</p>
              <p>Start building your collection by adding your favorite movies above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                    darkMode 
                      ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' 
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className={`font-semibold text-lg transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {movie.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-300 ${
                          darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                        }`}>
                          Added {formatDate(movie.addedAt)}
                        </span>
                      </div>
                      
                      {/* Rating System */}
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Rating:
                        </span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRatingChange(movie.id, star)}
                              className={`text-lg transition-all duration-200 hover:scale-110 ${
                                movie.rating && movie.rating >= star
                                  ? 'text-yellow-400'
                                  : darkMode
                                    ? 'text-gray-600 hover:text-yellow-400'
                                    : 'text-gray-300 hover:text-yellow-400'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        {movie.rating && (
                          <span className={`text-sm font-medium transition-colors duration-300 ${
                            darkMode ? 'text-yellow-400' : 'text-yellow-600'
                          }`}>
                            ({movie.rating}/5)
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      className={`ml-4 p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                        darkMode 
                          ? 'text-red-400 hover:bg-red-900 hover:text-red-300' 
                          : 'text-red-500 hover:bg-red-100 hover:text-red-700'
                      }`}
                      title="Remove from favorites"
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

        {/* Features Info */}
        {movies.length > 0 && (
          <div className={`mt-8 rounded-lg p-4 transition-colors duration-300 ${
            darkMode 
              ? 'bg-purple-900/30 border border-purple-700' 
              : 'bg-purple-50'
          }`}>
            <h4 className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
              darkMode ? 'text-purple-300' : 'text-purple-800'
            }`}>Features</h4>
            <ul className={`text-sm space-y-1 transition-colors duration-300 ${
              darkMode ? 'text-purple-200' : 'text-purple-700'
            }`}>
              <li>• Click the stars to rate your movies (1-5 stars)</li>
              <li>• Movies are automatically saved to your browser</li>
              <li>• Click the trash icon to remove movies</li>
              <li>• Movies are sorted by when you added them (newest first)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieFavorites;
