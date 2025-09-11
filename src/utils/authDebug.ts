import { authStorage } from './authStorage';

/**
 * Authentication Debug Utility
 * This utility helps diagnose authentication issues by providing detailed information
 * about the current authentication state
 */
export const authDebug = {
  /**
   * Display full authentication state in console
   */
  showAuthState: () => {
    console.group('🔐 Authentication State Debug');
    
    // Check all tokens
    const token = localStorage.getItem('garja_token');
    const adminToken = localStorage.getItem('garja_admin_token');
    const user = localStorage.getItem('garja_user');
    const adminUser = localStorage.getItem('garja_admin');
    
    console.log('📦 LocalStorage Keys:');
    console.log('  - garja_token:', token ? '✅ Present' : '❌ Missing');
    console.log('  - garja_admin_token:', adminToken ? '✅ Present' : '❌ Missing');
    console.log('  - garja_user:', user ? '✅ Present' : '❌ Missing');
    console.log('  - garja_admin:', adminUser ? '✅ Present' : '❌ Missing');
    
    // Decode and display token info
    if (token) {
      console.log('\n🎫 Regular Token Info:');
      const decoded = authStorage.decodeToken(token);
      if (decoded) {
        console.log('  - Decoded payload:', decoded);
        console.log('  - Extracted role:', authStorage.getUserRole());
        console.log('  - Is expired:', authStorage.isTokenExpired(token));
        if (decoded.exp) {
          const expDate = new Date(decoded.exp * 1000);
          console.log('  - Expires at:', expDate.toLocaleString());
        }
      }
    }
    
    if (adminToken && adminToken !== token) {
      console.log('\n🎫 Admin Token Info:');
      const decoded = authStorage.decodeToken(adminToken);
      if (decoded) {
        console.log('  - Decoded payload:', decoded);
        console.log('  - Is expired:', authStorage.isTokenExpired(adminToken));
        if (decoded.exp) {
          const expDate = new Date(decoded.exp * 1000);
          console.log('  - Expires at:', expDate.toLocaleString());
        }
      }
    }
    
    // Display user info
    if (user) {
      console.log('\n👤 User Info:');
      try {
        const userData = JSON.parse(user);
        console.log('  - Email:', userData.email);
        console.log('  - Name:', `${userData.firstName} ${userData.lastName}`);
        console.log('  - Role:', userData.role);
        console.log('  - ID:', userData.id);
      } catch (e) {
        console.error('  - Error parsing user data:', e);
      }
    }
    
    if (adminUser && adminUser !== user) {
      console.log('\n👤 Admin User Info:');
      try {
        const adminData = JSON.parse(adminUser);
        console.log('  - Email:', adminData.email);
        console.log('  - Name:', `${adminData.firstName} ${adminData.lastName}`);
        console.log('  - Role:', adminData.role);
        console.log('  - ID:', adminData.id);
      } catch (e) {
        console.error('  - Error parsing admin data:', e);
      }
    }
    
    // Check authentication status
    console.log('\n✅ Authentication Checks:');
    console.log('  - Is authenticated:', authStorage.isAuthenticated());
    console.log('  - Is admin authenticated:', authStorage.isAdminAuthenticated());
    
    console.groupEnd();
  },
  
  /**
   * Clear all authentication data (useful for testing)
   */
  clearAll: () => {
    console.log('🧹 Clearing all authentication data...');
    localStorage.removeItem('garja_token');
    localStorage.removeItem('garja_admin_token');
    localStorage.removeItem('garja_user');
    localStorage.removeItem('garja_admin');
    console.log('✅ All authentication data cleared');
  },
  
  /**
   * Test admin authentication with a sample token
   * This helps verify the token parsing logic
   */
  testTokenParsing: (token: string) => {
    console.group('🧪 Testing Token Parsing');
    
    try {
      // Decode the token
      const decoded = authStorage.decodeToken(token);
      console.log('Decoded token:', decoded);
      
      // Try to extract role
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      
      console.log('Token payload structure:');
      console.log(JSON.stringify(payload, null, 2));
      
      // Test role extraction with this token
      localStorage.setItem('garja_token', token);
      const extractedRole = authStorage.getUserRole();
      console.log('Extracted role:', extractedRole);
      
      // Clean up
      localStorage.removeItem('garja_token');
      
    } catch (error) {
      console.error('Error testing token:', error);
    }
    
    console.groupEnd();
  },
  
  /**
   * Simulate admin login for testing
   */
  simulateAdminLogin: (token: string, email: string = 'admin@test.com') => {
    console.log('🔐 Simulating admin login...');
    
    const adminUser = {
      id: 1,
      email: email,
      firstName: 'Test',
      lastName: 'Admin',
      role: 'ADMIN' as const,
      token: token
    };
    
    const saved = authStorage.saveAdminAuth({ token, user: adminUser });
    
    if (saved) {
      console.log('✅ Admin login simulated successfully');
      authDebug.showAuthState();
    } else {
      console.error('❌ Failed to simulate admin login');
    }
  }
};

// Make it available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).authDebug = authDebug;
  console.log('🔧 Auth debug utility available. Use window.authDebug.showAuthState() to debug authentication.');
}

export default authDebug;
