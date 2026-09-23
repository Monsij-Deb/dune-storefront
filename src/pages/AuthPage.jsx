import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LOGIN_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
      }
      customerUserErrors {
        message
      }
    }
  }
`;

const SIGNUP_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        message
      }
    }
  }
`;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  // We added customerEmail and logout here
  const { login, logout, customerEmail } = useAuth(); 

  const shopifyFetch = async (query, variables) => {
    const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
    const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });
    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const data = await shopifyFetch(LOGIN_MUTATION, { input: { email, password } });
        const errors = data.data?.customerAccessTokenCreate?.customerUserErrors;
        if (errors && errors.length > 0) throw new Error(errors[0].message);

        const token = data.data.customerAccessTokenCreate.customerAccessToken.accessToken;
        login(token, email);
        navigate('/');
      } else {
        const data = await shopifyFetch(SIGNUP_MUTATION, { input: { email, password } });
        const errors = data.data?.customerCreate?.customerUserErrors;
        if (errors && errors.length > 0) throw new Error(errors[0].message);

        const loginData = await shopifyFetch(LOGIN_MUTATION, { input: { email, password } });
        const token = loginData.data.customerAccessTokenCreate.customerAccessToken.accessToken;
        login(token, email);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: THE LOGGED-IN VIEW ---
  // If customerEmail exists, intercept the render and show their profile instead of the form
  if (customerEmail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-md p-8 border border-gray-200 text-center">
          <h1 className="text-2xl font-bold tracking-widest uppercase mb-4">My Account</h1>
          
          <div className="bg-neutral-50 py-6 mb-8 border border-neutral-100">
            <p className="text-xs tracking-wider uppercase text-gray-500 mb-1">Logged in as</p>
            <p className="text-lg font-medium">{customerEmail}</p>
          </div>

          <button
            onClick={() => {
              logout(); // Clears the context and local storage
              navigate('/'); // Sends them back to the homepage
            }}
            className="w-full bg-black text-white font-bold tracking-widest uppercase py-4 hover:bg-gray-800 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // --- EXISTING LOGIC: THE SIGN IN / SIGN UP FORM ---
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md p-8 border border-gray-200">
        <h1 className="text-2xl font-bold tracking-widest text-center uppercase mb-8">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <label className="block text-xs font-bold tracking-wider uppercase mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider uppercase mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-bold tracking-widest uppercase py-4 mt-4 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-sm tracking-wide text-gray-500 hover:text-black underline transition-colors"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}