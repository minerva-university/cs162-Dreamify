import React, { useState, useEffect } from 'react';
import Body from '../components/Body';
import { useNavigate } from 'react-router-dom';

// API
const backend_api = 'http://localhost:5000/api/parent';

function SignUpPage() {
    // Set the title of the page
  useEffect(() => {
    document.title = 'Dreamify | Sign Up';
}, []);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { username, email, password };
    const navigate = useNavigate(); // This hook gives you the navigate function
  
    try {
      const response = await fetch(backend_api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const jsonResponse = await response.json(); // Don't forget to await the json() call
        navigate('/home', { state: { data: jsonResponse } });
      } else {
        // Handle HTTP errors
        console.error('HTTP Error:', response.statusText);
      }
    } catch (error) {
      // Handle fetch errors
      console.error('Fetch Error:', error.message);
    }
  };

  return (
    <Body>
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
            <div>
            <input
                type="text"
                id="username"
                placeholder="Enter your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <br />
            <input
                type="text"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <br />
            <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>
      <button type="submit">Sign Up</button>
    </form>
    <div>
        <p>
        Already have an account? <a href="/login">Sign in</a>
    </p>
    </div>
    </Body>
  );
}

export default SignUpPage;
