import { AuthUser } from './api';

// Storage keys (kept simple and stable)
const TOKEN_KEY = 'userToken';
const USER_KEY = 'user';
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
  
  // Optional debug removed to reduce noise
  
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
    // No role info present; return null
    return null;
  }
  
  // No role field found
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
      if (!data.token || typeof data.token !== 'string') return false;

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
      
      return storedToken === data.token && storedUser === userString;
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

  // Save admin authentication data (do not touch regular user storage on error)
  saveAdminAuth: (data: { token: string; user: AuthUser }) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      if (data.user.role !== 'ADMIN') return false;

      // Store admin token and user
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      const userWithoutPassword: any = { ...data.user };
      delete userWithoutPassword.password;
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(userWithoutPassword));

      // Also store in regular auth storage for unified access (non-destructive)
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      // Keep existing tokens intact on failure
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

  // Clear admin authentication data (does NOT clear regular user session)
  clearAdminAuth: () => {
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
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
      return false;
    }
    
    if (isTokenExpired(token)) {
      return false;
    }
    
    // Check if we have a stored admin user with ADMIN role
    const adminUserStr = localStorage.getItem(ADMIN_USER_KEY);
    if (adminUserStr) {
      try {
        const adminUser = JSON.parse(adminUserStr);
        if (adminUser.role === 'ADMIN') {
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
          return true;
        }
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    
    // Finally, try to extract role from token
    const role = getUserRoleFromToken(token);
    return role === 'ADMIN';
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
