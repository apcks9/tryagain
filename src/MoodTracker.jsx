import { useState, useEffect } from "react";

function MoodTracker({ darkMode }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-400' },
    { id: 'tired', emoji: '😴', label: 'Tired', color: 'bg-gray-400' },
    { id: 'sleepy', emoji: '😪', label: 'Sleepy', color: 'bg-blue-400' },
    { id: 'angry', emoji: '😠', label: 'Angry', color: 'bg-red-500' },
    { id: 'frustrated', emoji: '😤', label: 'Frustrated', color: 'bg-orange-500' },
    { id: 'hopeless', emoji: '😔', label: 'Hopeless', color: 'bg-purple-500' },
    { id: 'bored', emoji: '😑', label: 'Bored', color: 'bg-gray-500' },
    { id: 'content', emoji: '😌', label: 'Content', color: 'bg-green-400' },
    { id: 'thankful', emoji: '🙏', label: 'Thankful', color: 'bg-emerald-400' },
    { id: 'bitter', emoji: '😒', label: 'Bitter', color: 'bg-amber-600' },
    { id: 'confused', emoji: '😕', label: 'Confused', color: 'bg-indigo-400' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: 'bg-blue-500' }
  ];

  const moodSuggestions = {
    happy: [
      "Share your joy with someone special! 💕",
      "Take a walk and enjoy the sunshine ☀️",
      "Listen to your favorite upbeat music 🎵",
      "Do something creative like drawing or writing ✨",
      "Call a friend and spread the happiness 📞"
    ],
    tired: [
      "Take a 20-minute power nap 😴",
      "Drink some water and have a healthy snack 💧",
      "Do some gentle stretching or yoga 🧘‍♀️",
      "Step outside for fresh air 🌿",
      "Listen to calming music and rest your eyes 🎶"
    ],
    sleepy: [
      "Go to bed early tonight 🌙",
      "Avoid caffeine and screens before bed 📱",
      "Create a relaxing bedtime routine 🛁",
      "Try meditation or deep breathing exercises 🧘",
      "Make sure your room is cool and dark 🌃"
    ],
    angry: [
      "Write in your journal to express your feelings 📝",
      "Take 10 deep breaths and count to 10 🫁",
      "Go for a brisk walk or run 🏃‍♀️",
      "Listen to heavy music and let it out 🎸",
      "Talk to someone you trust about what's bothering you 💬"
    ],
    frustrated: [
      "Take a break and do something completely different ⏸️",
      "Break the problem into smaller, manageable pieces 🧩",
      "Ask for help from someone who might understand 🤝",
      "Do some physical activity to release tension 💪",
      "Practice patience and remind yourself this too shall pass ⏰"
    ],
    hopeless: [
      "Reach out to a trusted friend or family member 🤗",
      "Write down 3 things you're grateful for today 📋",
      "Consider talking to a professional counselor 💼",
      "Do one small thing that makes you feel accomplished ✅",
      "Remember that feelings are temporary and you're stronger than you think 💪"
    ],
    bored: [
      "Try a new hobby or learn something new 🎨",
      "Read a book or watch an educational video 📚",
      "Call a friend and plan something fun together 📞",
      "Go explore a new place in your city 🗺️",
      "Start a creative project you've been putting off 🎭"
    ],
    content: [
      "Savor this peaceful moment and be present 🧘‍♀️",
      "Share your contentment with someone you care about 💕",
      "Do something kind for someone else 🤝",
      "Take a moment to appreciate the little things 🌸",
      "Continue doing what's working for you ✨"
    ],
    thankful: [
      "Write a thank you note to someone special 💌",
      "Share your gratitude on social media 📱",
      "Do something nice for someone without expecting anything back 🤲",
      "Keep a gratitude journal and write daily 📖",
      "Express your thanks directly to the people you appreciate 🙏"
    ],
    bitter: [
      "Practice forgiveness, even if it's just for yourself 💚",
      "Write down your feelings and then let them go 📝",
      "Focus on what you can control and let go of the rest 🎯",
      "Do something kind for yourself today 🛍️",
      "Consider talking to someone about what's making you bitter 💬"
    ],
    confused: [
      "Take time to think through your options without pressure 🤔",
      "Write down your thoughts to organize them better 📝",
      "Ask questions and seek clarification from reliable sources ❓",
      "Talk to someone you trust about your confusion 💬",
      "Give yourself permission to not have all the answers right now ⏳"
    ],
    sad: [
      "Take a warm shower or bath to comfort yourself 🛁",
      "Eat your favorite comfort food 🍕",
      "Watch a funny movie or TV show 😄",
      "Call someone who makes you laugh 📞",
      "Do something gentle and nurturing for yourself 🤗"
    ]
  };

  // Load mood history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('moodHistory');
    if (storedHistory) {
      setMoodHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save mood history to localStorage
  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
  }, [moodHistory]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setSuggestions(moodSuggestions[mood.id] || []);
    
    // Add to mood history
    const newEntry = {
      id: Date.now(),
      mood: mood,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };
    
    setMoodHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
  };

  const getMoodStats = () => {
    if (moodHistory.length === 0) return null;
    
    const moodCounts = {};
    moodHistory.forEach(entry => {
      const moodId = entry.mood.id;
      moodCounts[moodId] = (moodCounts[moodId] || 0) + 1;
    });
    
    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );
    
    return {
      totalEntries: moodHistory.length,
      mostCommonMood: moods.find(m => m.id === mostCommonMood),
      moodCounts
    };
  };

  const stats = getMoodStats();

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 transition-colors duration-300`}>
      {/* Header */}
      <div className={`mb-6 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
        <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          😊 Mood Tracker
        </h2>
        <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          How are you feeling right now? Select your mood and get personalized suggestions.
        </p>
      </div>

      {/* Mood Selection */}
      <div className="mb-8">
        <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Select Your Current Mood:
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                selectedMood?.id === mood.id
                  ? `${mood.color} text-white shadow-lg transform scale-105`
                  : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-xs font-medium text-center">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {selectedMood && suggestions.length > 0 && (
        <div className={`mb-8 p-6 rounded-xl transition-colors duration-300 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            💡 Suggestions for feeling {selectedMood.label.toLowerCase()}:
          </h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className={`flex items-start space-x-3 transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-sm">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mood History & Stats */}
      {moodHistory.length > 0 && (
        <div className="space-y-6">
          {/* Statistics */}
          {stats && (
            <div className={`p-4 rounded-xl transition-colors duration-300 ${
              darkMode ? 'bg-gray-700' : 'bg-blue-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                📊 Your Mood Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold transition-colors duration-300 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {stats.totalEntries}
                  </div>
                  <div className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Total Entries
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">{stats.mostCommonMood?.emoji}</div>
                  <div className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Most Common: {stats.mostCommonMood?.label}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold transition-colors duration-300 ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {Math.round((stats.moodCounts.happy || 0) / stats.totalEntries * 100)}%
                  </div>
                  <div className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Happy Days
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Mood History */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              📅 Recent Mood History
            </h3>
            <div className="space-y-2">
              {moodHistory.slice(0, 5).map((entry) => (
                <div key={entry.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-300 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{entry.mood.emoji}</span>
                    <div>
                      <div className={`font-medium transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {entry.mood.label}
                      </div>
                      <div className={`text-sm transition-colors duration-300 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {entry.date}
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
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
          <li>• Click on any mood circle to select how you're feeling</li>
          <li>• Get personalized suggestions based on your mood</li>
          <li>• Track your mood history over time</li>
          <li>• View statistics about your emotional patterns</li>
        </ul>
      </div>
    </div>
  );
}

export default MoodTracker;
