# Google OAuth Setup and Troubleshooting Guide

## Issue Description
The Google Sign-In popup shows "Choose an account to continue to Udemy" instead of your application name, and doesn't redirect properly after authentication.

## Root Causes
1. **Incorrect Application Name**: Google OAuth consent screen shows "Udemy" instead of your app name
2. **OAuth Consent Screen Configuration**: Missing or incorrect app branding
3. **Redirect URI Configuration**: May need verification

## Step-by-Step Solution

### 1. Update Google Cloud Console Settings

#### A. Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" → "Credentials"

#### B. Update OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. **Application Information**:
   - **Application name**: Change from "Udemy" to "Garja" (or your preferred name)
   - **User support email**: Your email address
   - **Application logo**: Upload your app logo (optional but recommended)
   - **Application home page**: `https://mygarja.com` (for development)
   - **Application privacy policy link**: Add if you have one
   - **Application terms of service link**: Add if you have one

3. **Authorized domains**: Add your domains
   - For development: `localhost`
   - For production: `yourdomain.com`

4. **Developer contact information**: Add your email

#### C. Update OAuth 2.0 Client ID
1. Go to "APIs & Services" → "Credentials"
2. Find your OAuth 2.0 Client ID: `606555135455-pc77hp4d76nrt9op7noskv55b2joe453.apps.googleusercontent.com`
3. Click the edit (pencil) icon
4. **Authorized JavaScript origins**:
   ```
   https://mygarja.com
   https://api.mygarja.com
   ```
5. **Authorized redirect URIs**:
   ```
   https://api.mygarja.com/login/oauth2/code/google
   https://mygarja.com/auth/callback
   ```

### 2. Backend Configuration (Already Correct)

Your `application.properties` file is correctly configured:
```properties
spring.security.oauth2.client.registration.google.client-id=606555135455-pc77hp4d76nrt9op7noskv55b2joe453.apps.googleusercontent.com
spring.security.oauth2.client.registration.google.client-secret=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
spring.security.oauth2.client.registration.google.scope=openid,profile,email
spring.security.oauth2.client.registration.google.redirect-uri=https://api.mygarja.com/login/oauth2/code/google
```

### 3. Frontend Configuration (Updated)

The frontend has been updated with:
- Environment-based configuration
- Better error handling
- Improved user feedback
- Proper redirect handling

### 4. Testing the OAuth Flow

1. **Start your backend server**:
   ```bash
   cd GARJA_NEW_BACKEND
   mvn spring-boot:run
   ```

2. **Start your frontend server**:
   ```bash
   cd GARJA_FRONTEND
   npm run dev
   ```

3. **Test the flow**:
   - Click "Continue with Google"
   - Should show "Choose an account to continue to Garja" (not Udemy)
   - Select your Google account
   - Should redirect to callback page with success message
   - Should automatically redirect to home page after 1.5 seconds

### 5. Common Issues and Solutions

#### Issue: Still shows "Udemy"
**Solution**: 
- Clear browser cache and cookies
- Wait 5-10 minutes for Google's changes to propagate
- Try in incognito/private browsing mode

#### Issue: "redirect_uri_mismatch" error
**Solution**: 
- Verify redirect URIs in Google Cloud Console match exactly
- Ensure no trailing slashes
- Check both development and production URLs

#### Issue: Token not received
**Solution**: 
- Check browser console for errors
- Verify backend is running on port 8085
- Check network tab for failed requests

#### Issue: Infinite redirect loop
**Solution**: 
- Clear localStorage: `localStorage.clear()`
- Check for conflicting auth tokens
- Restart both frontend and backend

### 6. Environment Variables

Make sure your `.env.local` file contains:
```env
NEXT_PUBLIC_FRONTEND_URL=https://mygarja.com
NEXT_PUBLIC_BACKEND_URL=https://api.mygarja.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=365994825852-2qgkgd1p28pag5i9f1dgbpo5sdm3gn6p.apps.googleusercontent.com
```

### 7. Production Deployment

For production:
1. Update Google Cloud Console with production URLs
2. Update environment variables
3. Ensure HTTPS is used for production URLs
4. Test thoroughly in production environment

## Verification Checklist

- [ ] Google Cloud Console shows correct app name
- [ ] OAuth consent screen configured
- [ ] Redirect URIs match exactly
- [ ] Backend server running on port 8085
- [ ] Frontend server running on port 3000
- [ ] Environment variables set correctly
- [ ] Browser cache cleared
- [ ] Test in incognito mode

## Support

If you continue to experience issues:
1. Check browser console for errors
2. Check backend logs for OAuth errors
3. Verify all URLs match exactly
4. Test with a different Google account
5. Try in different browsers

The OAuth flow should now work correctly with proper branding and automatic redirection!
