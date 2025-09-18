// Authentication configuration
export const authConfig = {
  // Backend OAuth endpoints with prompt=select_account to force account selection
  googleOAuthUrl: process.env.NEXT_PUBLIC_BACKEND_URL 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`
    : 'http://localhost:8085/auth/google',
  
  // Frontend callback URL
  callbackUrl: process.env.NEXT_PUBLIC_FRONTEND_URL
    ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback`
    : 'http://localhost:3000/auth/callback',
  
  // Home page redirect
  homeUrl: process.env.NEXT_PUBLIC_FRONTEND_URL
    ? process.env.NEXT_PUBLIC_FRONTEND_URL
    : 'http://localhost:3000',
  
  // OAuth provider settings
  providers: {
    google: {
      name: 'Google',
      buttonText: 'Continue with Google',
      loadingText: 'Connecting to Google...'
    }
  }
};

// Helper function to get the current environment
export const getEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

// Helper function to check if we're in development
export const isDevelopment = () => {
  return getEnvironment() === 'development';
};
