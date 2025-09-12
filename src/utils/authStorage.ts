import { AuthUser } from './api';

// Storage keys
const TOKEN_KEY = 'userToken'; // Changed to match cartService and other services
const USER_KEY = 'user'; // Simplified key name
const ADMIN_TOKEN_KEY = 'garja_admin_token';
const ADMIN_USER_KEY = 'garja_admin';

// Helper to decode JWT token without external library
function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

// Check if token is expired
function isTokenExpired(token: string): boolean {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  // exp is in seconds, Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now();
}

// Get user role from token
function getUserRoleFromToken(token: string): string | null {
  const decoded = parseJwt(token);
  if (!decoded) {
    console.error('Failed to decode token');
    return null;
  }
  
  // Log the decoded token structure for debugging
  console.log('Decoded JWT token:', decoded);
  
  // Helper function to normalize role string (remove ROLE_ prefix)
  const normalizeRole = (roleStr: string): string => {
    if (typeof roleStr !== 'string') return roleStr;
    return roleStr.replace(/^ROLE_/, '').toUpperCase();
  };
  
  // Helper function to find admin role in array
  const findAdminInArray = (arr: any[]): string | null => {
    if (!Array.isArray(arr)) return null;
    const adminItem = arr.find((item: any) => {
      const str = String(item).toUpperCase();
      return str === 'ADMIN' || str === 'ROLE_ADMIN' || str.includes('ADMIN');
    });
    return adminItem ? normalizeRole(String(adminItem)) : null;
  };
  
  // Try different possible locations for role in JWT token
  // Spring Security can put roles in various places depending on configuration
  
  // 1. Direct role field
  if (decoded.role) {
    return normalizeRole(String(decoded.role));
  }
  
  // 2. Authorities array (Spring Security default)
  if (decoded.authorities) {
    const role = findAdminInArray(decoded.authorities);
    if (role) return role;
  }
  
  // 3. Single authority string
  if (decoded.authority) {
    return normalizeRole(String(decoded.authority));
  }
  
  // 4. Roles array
  if (decoded.roles) {
    const role = findAdminInArray(decoded.roles);
    if (role) return role;
  }
  
  // 5. User info embedded in token subject
  if (decoded.sub && typeof decoded.sub === 'object' && decoded.sub.role) {
    return normalizeRole(String(decoded.sub.role));
  }
  
  // 6. Claims with different case variations
  const roleFields = ['Role', 'ROLE', 'user_role', 'userRole'];
  for (const field of roleFields) {
    if (decoded[field]) {
      const role = Array.isArray(decoded[field]) 
        ? findAdminInArray(decoded[field]) 
        : normalizeRole(String(decoded[field]));
      if (role) return role;
    }
  }
  
  // 7. Check if this is a simple JWT with email as subject and role info missing
  // In this case, we'll rely on the user object stored separately
  if (decoded.sub && typeof decoded.sub === 'string' && decoded.sub.includes('@')) {
    console.warn('JWT appears to only contain email in subject, no role info found');
    return null;
  }
  
  console.log('No role found in token. Available fields:', Object.keys(decoded));
  return null;
}

// Auth Storage utility
export const authStorage = {
  // Save authentication data
  saveAuth: (data: { token: string; user: AuthUser }) => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || !window.localStorage) {
        console.error('localStorage is not available');
        return false;
      }

      // Validate token
      if (!data.token || typeof data.token !== 'string') {
        console.error('Invalid token provided');
        return false;
      }

      // Store token
      localStorage.setItem(TOKEN_KEY, data.token);
      
      // Remove password from user object before storing
      const { password, ...userWithoutPassword } = data.user;
      
      // Ensure we have valid user data
      if (!userWithoutPassword.email) {
        console.error('Invalid user data: missing email');
        return false;
      }
      
      // Store user data
      const userString = JSON.stringify(userWithoutPassword);
      localStorage.setItem(USER_KEY, userString);
      
      // Verify storage was successful
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      
      if (storedToken === data.token && storedUser === userString) {
        console.log('Auth data saved successfully');
        return true;
      } else {
        console.error('Failed to verify saved auth data');
        return false;
      }
    } catch (error) {
      console.error('Error saving auth data:', error);
      // Try to clean up partial saves
      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
      return false;
    }
  },

  // Save admin authentication data
  saveAdminAuth: (data: { token: string; user: AuthUser }) => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || !window.localStorage) {
        console.error('localStorage is not available');
        return false;
      }

      // First check if user role from the user object is ADMIN
      if (data.user.role !== 'ADMIN') {
        console.error('User does not have ADMIN role from user object');
        return false;
      }
      
      // Also try to verify from token (if token contains role info)
      const roleFromToken = getUserRoleFromToken(data.token);
      if (roleFromToken && roleFromToken !== 'ADMIN') {
        console.error('Token role mismatch: expected ADMIN, got', roleFromToken);
        // Continue anyway if user object has ADMIN role
      }
      
      // Store admin-specific keys
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      // Remove password from user object before storing
      const { password, ...userWithoutPassword } = data.user;
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(userWithoutPassword));
      
      // IMPORTANT: Also save in regular auth storage for API calls and fallback checks
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
      
      console.log('Admin auth data saved successfully in both admin and regular storage');
      return true;
    } catch (error) {
      console.error('Error saving admin auth data:', error);
      // Try to clean up partial saves
      try {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
      return false;
    }
  },

  // Load authentication data
  loadAuth: (): { token: string; user: AuthUser } | null => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userStr = localStorage.getItem(USER_KEY);
      
      if (!token || !userStr) {
        return null;
      }
      
      // Check if token is expired
      if (isTokenExpired(token)) {
        authStorage.clearAuth();
        return null;
      }
      
      const user = JSON.parse(userStr);
      return { token, user };
    } catch (error) {
      console.error('Error loading auth data:', error);
      return null;
    }
  },

  // Load admin authentication data
  loadAdminAuth: (): { token: string; user: AuthUser } | null => {
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      const userStr = localStorage.getItem(ADMIN_USER_KEY);
      
      if (!token || !userStr) {
        return null;
      }
      
      // Check if token is expired
      if (isTokenExpired(token)) {
        authStorage.clearAdminAuth();
        return null;
      }
      
      // Parse user data
      const user = JSON.parse(userStr);
      
      // Verify admin role from user object (primary source of truth)
      if (user.role !== 'ADMIN') {
        console.warn('Stored user does not have ADMIN role, clearing admin auth');
        authStorage.clearAdminAuth();
        return null;
      }
      
      // Optional: Also check token for role if available (secondary verification)
      const tokenRole = getUserRoleFromToken(token);
      if (tokenRole && tokenRole !== 'ADMIN') {
        console.warn('Token role mismatch with stored user role, but keeping based on user object');
      }
      
      return { token, user };
    } catch (error) {
      console.error('Error loading admin auth data:', error);
      return null;
    }
  },

  // Clear authentication data
  clearAuth: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  },

  // Clear admin authentication data
  clearAdminAuth: () => {
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      localStorage.removeItem(TOKEN_KEY); // Also clear regular token
      localStorage.removeItem(USER_KEY); // Also clear regular user data
      return true;
    } catch (error) {
      console.error('Error clearing admin auth data:', error);
      return false;
    }
  },

  // Get current token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get admin token
  getAdminToken: (): string | null => {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token && !isTokenExpired(token);
  },

  // Check if admin is authenticated
  isAdminAuthenticated: (): boolean => {
    // First check for admin-specific token
    let token = localStorage.getItem(ADMIN_TOKEN_KEY);
    
    // If no admin token, check regular token (for cases where admin logged in via regular login)
    if (!token) {
      token = localStorage.getItem(TOKEN_KEY);
    }
    
    if (!token) {
      console.log('No token found for admin authentication check');
      return false;
    }
    
    if (isTokenExpired(token)) {
      console.log('Token is expired');
      return false;
    }
    
    // Check if we have a stored admin user with ADMIN role
    const adminUserStr = localStorage.getItem(ADMIN_USER_KEY);
    if (adminUserStr) {
      try {
        const adminUser = JSON.parse(adminUserStr);
        if (adminUser.role === 'ADMIN') {
          console.log('Admin authenticated via stored user data');
          return true;
        }
      } catch (e) {
        console.error('Error parsing admin user:', e);
      }
    }
    
    // Fallback to checking regular user storage
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'ADMIN') {
          console.log('Admin authenticated via regular user data');
          return true;
        }
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    
    // Finally, try to extract role from token
    const role = getUserRoleFromToken(token);
    const isAdmin = role === 'ADMIN';
    console.log('Admin authentication check via token - role:', role, 'isAdmin:', isAdmin);
    return isAdmin;
  },

  // Decode token to get user info
  decodeToken: (token?: string): any => {
    const targetToken = token || localStorage.getItem(TOKEN_KEY);
    if (!targetToken) {
      return null;
    }
    return parseJwt(targetToken);
  },

  // Get user role
  getUserRole: (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }
    return getUserRoleFromToken(token);
  },

  // Check if token is expired
  isTokenExpired: (token?: string): boolean => {
    const targetToken = token || localStorage.getItem(TOKEN_KEY);
    if (!targetToken) {
      return true;
    }
    return isTokenExpired(targetToken);
  },
};

export default authStorage;
