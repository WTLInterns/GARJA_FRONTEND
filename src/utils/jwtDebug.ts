// JWT debugging utilities

export const debugJWT = (token: string) => {
  try {
    console.log('=== JWT Debug Information ===');
    console.log('Full token:', token);
    console.log('Token length:', token.length);
    
    const parts = token.split('.');
    console.log('Token parts count:', parts.length);
    
    if (parts.length !== 3) {
      console.error('Invalid JWT format - should have 3 parts separated by dots');
      return null;
    }
    
    // Decode header
    try {
      const header = JSON.parse(atob(parts[0]));
      console.log('JWT Header:', header);
    } catch (e) {
      console.error('Failed to decode JWT header:', e);
    }
    
    // Decode payload
    try {
      const payload = JSON.parse(atob(parts[1]));
      console.log('JWT Payload:', payload);
      console.log('Available fields:', Object.keys(payload));
      
      // Check for common fields
      const commonFields = ['sub', 'email', 'id', 'firstName', 'lastName', 'role', 'exp', 'iat'];
      commonFields.forEach(field => {
        if (payload[field] !== undefined) {
          console.log(`  ${field}:`, payload[field]);
        } else {
          console.log(`  ${field}: NOT FOUND`);
        }
      });
      
      return payload;
    } catch (e) {
      console.error('Failed to decode JWT payload:', e);
      return null;
    }
  } catch (error) {
    console.error('JWT debug error:', error);
    return null;
  }
};

export const validateJWTStructure = (token: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!token) {
    errors.push('Token is empty or null');
    return { isValid: false, errors };
  }
  
  const parts = token.split('.');
  if (parts.length !== 3) {
    errors.push(`Invalid JWT format - has ${parts.length} parts, should have 3`);
    return { isValid: false, errors };
  }
  
  try {
    const payload = JSON.parse(atob(parts[1]));
    
    // Check required fields for our application
    if (!payload.sub && !payload.email) {
      errors.push('Missing email/subject field');
    }
    
    if (!payload.id) {
      errors.push('Missing user ID field');
    }
    
    if (!payload.exp) {
      errors.push('Missing expiration field');
    }
    
    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      errors.push('Token is expired');
    }
    
  } catch (e) {
    errors.push('Failed to parse JWT payload');
  }
  
  return { isValid: errors.length === 0, errors };
};
