// src/App.js

import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// --- 1. Create a Context ---
const GlobalContext = createContext();

// --- 2. Create a Provider Component ---
// eslint-disable-next-line no-unused-vars
const GlobalContextProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    user: null,
    theme: 'light', // Initial theme state
    message: 'Welcome to the SPA!',
  });

  const updateGlobalState = (newState) => {
    setGlobalState(prevState => ({ ...prevState, ...newState }));
  };

  return (
    <GlobalContext.Provider value={{ globalState, updateGlobalState }}>
      {children}
    </GlobalContext.Provider>
  );
};

// --- 3. Example Pages (for React Router) ---

const HomePage = () => {
  const { globalState } = useContext(GlobalContext);
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>Home Page</h2>
      <p>{globalState.message}</p>
      <p>Current Theme from Global Context: **{globalState.theme}**</p>
      {globalState.user && <p>Logged in as: **{globalState.user.name}**</p>}
    </div>
  );
};

const AboutPage = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>About Page</h2>
      <p>This is an example SPA built with React Router and `useContext`.</p>
    </div>
  );
};

const ContactPage = () => {
  const { globalState, updateGlobalState } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateGlobalState({ message: `Thank you for your feedback: "${feedback}"!` });
    alert('Feedback submitted!');
    setFeedback('');
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>Contact Page</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Your Feedback:
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="5"
            cols="30"
            style={{ display: 'block', marginBottom: '10px' }}
          />
        </label>
        <button type="submit">Submit Feedback</button>
      </form>
      <p>Current Global Message: {globalState.message}</p>
    </div>
  );
};

const UserProfilePage = () => {
  const { globalState, updateGlobalState } = useContext(GlobalContext);
  const [userName, setUserName] = useState('');

  const handleLogin = () => {
    if (userName.trim()) {
      updateGlobalState({ user: { name: userName.trim() } });
    } else {
      updateGlobalState({ user: null });
    }
    setUserName('');
  };

  const handleLogout = () => {
    updateGlobalState({ user: null });
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>User Profile</h2>
      {globalState.user ? (
        <>
          <p>Welcome, **{globalState.user.name}**!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <p>You are not logged in.</p>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <button onClick={handleLogin}>Login</button>
        </>
      )}
    </div>
  );
};

// Component for global controls that consumes the context
const GlobalControls = () => {
  const { globalState, updateGlobalState } = useContext(GlobalContext);

  const toggleTheme = () => {
    updateGlobalState({ theme: globalState.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <div style={{ marginBottom: '20px', padding: '10px', background: '#f9f9f9', border: '1px dashed #ddd' }}>
      <h3>Global Controls</h3>
      <p>Current Theme: **{globalState.theme}**</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      {globalState.user && <p>User: **{globalState.user.name}**</p>}
    </div>
  );
};


// --- Main App Component ---
// This component now *also* consumes the context to apply the theme to its main container.
function App() {
  const { globalState } = useContext(GlobalContext); // <--- App now consumes the context

  // Define theme styles
  const themeStyles = {
    light: {
      backgroundColor: '#ffffff',
      color: '#333333',
    },
    dark: {
      backgroundColor: '#333333',
      color: '#f0f0f0',
    }
  };

  // Get the current theme style based on globalState.theme
  const currentTheme = themeStyles[globalState.theme];

  return (
    // Apply the theme styles to the outermost div of the application
    <Router>
      <div style={{ ...currentTheme, fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '20px auto', border: '2px solid #333', padding: '20px', minHeight: 'calc(100vh - 40px)' }}> {/* Adjusted minHeight for margin */}
        <h1>My SPA with Global State</h1>

        <nav style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '15px' }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </nav>

        <GlobalControls />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="*" element={<div style={{ padding: '20px', color: 'red' }}><h2>404 - Page Not Found</h2></div>} />
        </Routes>
      </div>
    </Router>
  );
}

// --- Wrapper component for rendering (now only contains the Provider) ---
// This component is now solely responsible for providing the context to App and its children.
const AppWrapper = () => (
  <GlobalContextProvider>
    {/* App is now a direct child of GlobalContextProvider, so it can consume the context */}
    <App />
  </GlobalContextProvider>
);
export default AppWrapper;