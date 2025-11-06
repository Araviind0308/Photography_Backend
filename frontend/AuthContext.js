import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('harshavardhan_user');
    const savedToken = localStorage.getItem('harshavardhan_token');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('harshavardhan_user');
        localStorage.removeItem('harshavardhan_token');
      }
    }
  }, []);

  const login = async (email, code) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // The login is handled in the Login component
      // This function just updates the context from localStorage
      const savedUser = localStorage.getItem('harshavardhan_user');
      const savedToken = localStorage.getItem('harshavardhan_token');
      
      if (savedUser && savedToken) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        return { success: true, user: userData };
      } else {
        setError('Login failed. Please try again.');
        return { success: false, error: 'Login failed. Please try again.' };
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('harshavardhan_user');
    localStorage.removeItem('harshavardhan_token');
    setError(null);
  };

  const isAuthenticated = () => {
    const savedToken = localStorage.getItem('harshavardhan_token');
    return user !== null && savedToken !== null;
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const updateUser = (updatedData) => {
    if (user) {
      const newUserData = { ...user, ...updatedData };
      setUser(newUserData);
      localStorage.setItem('harshavardhan_user', JSON.stringify(newUserData));
    }
  };

  // Get auth token for API requests
  const getToken = () => {
    return localStorage.getItem('harshavardhan_token');
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    updateUser,
    setError,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

