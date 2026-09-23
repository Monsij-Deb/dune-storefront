import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // We will store both the Shopify token and the user's email
  const [customerToken, setCustomerToken] = useState(null);
  const [customerEmail, setCustomerEmail] = useState(null);

  // On initial load, check if they are already logged in via localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('shopify_customer_token');
    const savedEmail = localStorage.getItem('shopify_customer_email');
    if (savedToken && savedEmail) {
      setCustomerToken(savedToken);
      setCustomerEmail(savedEmail);
    }
  }, []);

  // Login function to save credentials
  const login = (token, email) => {
    setCustomerToken(token);
    setCustomerEmail(email);
    localStorage.setItem('shopify_customer_token', token);
    localStorage.setItem('shopify_customer_email', email);
  };

  // Logout function to clear everything
  const logout = () => {
    setCustomerToken(null);
    setCustomerEmail(null);
    localStorage.removeItem('shopify_customer_token');
    localStorage.removeItem('shopify_customer_email');
  };

  return (
    <AuthContext.Provider value={{ customerToken, customerEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);