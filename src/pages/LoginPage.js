import React from 'react';
import Body from '../components/Body';
import { useState, useEffect } from 'react';

// API
const backend_api = 'http://localhost:5000/api/parent'; 

export default function LoginPage() {
  // Set the title of the page
  useEffect(() => {
    document.title = 'Dreamify | Login';
}, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted for:', email, password);
    // Reset fields after submission for demonstration purposes
    setEmail('');
    setPassword('');
  };

  return (
    <Body>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
     <div>
     <p>
       Don't have an account? <a href="/sign-up">Sign up</a>
     </p>
   </div>
    </Body>
  );
}
