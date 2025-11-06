import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, login, setError } = useAuth();
  const [validationErrors, setValidationErrors] = useState({});
  
  // Flow state: 'email' | 'code'
  const [flowStep, setFlowStep] = useState('email');
  
  // Email state
  const [email, setEmail] = useState('');
  
  // 6-digit code state
  const [code, setCode] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Enter a valid email';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCode = () => {
    const errors = {};
    if (!code.trim()) {
      errors.code = 'Code is required';
    } else if (!/^\d{6}$/.test(code)) {
      errors.code = 'Enter a 6-digit code';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle email submission - send code
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setError(null);
    setValidationErrors({});

    try {
      // Call backend API to send verification code
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to send code');
        return;
      }

      // Code sent successfully, move to code step
      setFlowStep('code');
      setValidationErrors({});
      
      // In development, you might see the code in console
      if (data.code) {
        console.log('Verification code:', data.code); // Remove in production
      }
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    }
  };

  // Handle code verification
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!validateCode()) return;

    setError(null);
    setValidationErrors({});

    try {
      // Call backend API to verify code and login
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid code');
        return;
      }

      // Login successful - save token and user data
      if (data.token && data.user) {
        localStorage.setItem('harshavardhan_token', data.token);
        localStorage.setItem('harshavardhan_user', JSON.stringify(data.user));
        
        // Update auth context
        await login(email, code); // This will trigger context update
        
        // Navigate to home
        navigate('/');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
      <div className="bg-white rounded-lg shadow-sm w-full max-w-md p-8 md:p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-2xl font-bold tracking-wide text-black mb-1">
            HARSHAVARDHAN PHOTOGRAPHY
          </div>
          <div className="text-sm text-gray-500">— Accounts</div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Email Step */}
        {flowStep === 'email' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black mb-2">Sign in</h2>
              <p className="text-sm text-gray-700">Enter your email to receive a verification code</p>
            </div>

            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                    validationErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-200 text-black py-3 rounded-md text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Continue'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-blue-600 hover:underline">Privacy policy</a>
            </div>
          </div>
        )}

        {/* Code Step */}
        {flowStep === 'code' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black mb-2">Enter code</h2>
              <p className="text-sm text-gray-700">Sent to {email}</p>
            </div>

            <form onSubmit={handleCodeSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(value);
                  }}
                  maxLength={6}
                  className={`w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-center text-lg tracking-widest ${
                    validationErrors.code ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.code && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.code}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Submit'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setFlowStep('email');
                  setCode('');
                  setValidationErrors({});
                  setError(null);
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Sign in with a different email
              </button>
            </div>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-blue-600 hover:underline">Privacy policy</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

