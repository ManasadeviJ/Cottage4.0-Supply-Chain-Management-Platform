import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebase'; // your firebase config file
import { Link, useNavigate } from 'react-router-dom'; // For navigation
// import "../../components/Auth/AuthLayout.css";


// Import your CSS file for styling (create LoginPage.css if you don't have one)
import './LoginPage.css'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // To disable button during async ops
  const [resetMessage, setResetMessage] = useState(''); // For password reset feedback

  const navigate = useNavigate(); // Hook for programmatic navigation

  const errorMessageMap = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-not-found": "No user found with this email. Please check your email or register.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/too-many-requests": "Too many failed login attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Please check your internet connection."
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true); // Disable button
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to dashboard upon successful login
      navigate('/dashboard'); // Change '/dashboard' to your actual dashboard route
    } catch (err) {
      console.error("Login Error:", err.code, err.message); // Log full error for debugging
      setError(errorMessageMap[err.code] || "Failed to log in. Please try again.");
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    setError('');
    setResetMessage('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      console.error("Password Reset Error:", err.code, err.message);
      setError(errorMessageMap[err.code] || "Failed to send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back!</h2>
      {error && <p className="error">{error}</p>}
      {resetMessage && <p className="success">{resetMessage}</p>} {/* Added success styling */}

      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email"
            placeholder="your@example.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            aria-describedby="email-error" // For accessibility
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password"
            placeholder="Enter your password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            aria-describedby="password-error" // For accessibility
          />
        </div>
        
        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>

      <div className="login-links">
        <button 
          onClick={handleForgotPassword} 
          disabled={loading}
          className="forgot-password-button"
        >
          Forgot Password?
        </button>
        
        <p>
          Don't have an account? {' '}
          <Link to="/register" className="register-link">Register Here</Link> {/* Link to your RegistrationPage */}
        </p>
      </div>

      <p className="app-description">
        Connecting farmers, cottagers, and buyers efficiently.
      </p>

    </div>
  );
}

export default LoginPage;