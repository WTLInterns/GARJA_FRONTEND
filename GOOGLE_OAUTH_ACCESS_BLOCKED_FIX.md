# 🚨 URGENT: Fix "Access blocked: Garja's request is invalid"

## The Problem
You're getting "Access blocked: Garja's request is invalid" when trying to use Google OAuth.

## Root Cause
This error occurs when Google OAuth configuration doesn't match between:
1. Your Google Cloud Console settings
2. Your application configuration

## ✅ STEP-BY-STEP FIX

### Step 1: Update Google Cloud Console (CRITICAL)

#### A. Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Select your project
3. Navigate to `APIs & Services` → `Credentials`

#### B. Edit OAuth 2.0 Client ID
1. Find your OAuth 2.0 Client ID: `606555135455-pc77hp4d76nrt9op7noskv55b2joe453.apps.googleusercontent.com`
2. Click the **edit (pencil) icon**

#### C. Update Authorized JavaScript Origins
```
https://mygarja.com
https://api.mygarja.com
```

#### D. Update Authorized Redirect URIs (CRITICAL)
```
https://api.mygarja.com/login/oauth2/code/google
```

**IMPORTANT**: Make sure there are NO extra spaces or characters!

#### E. Save Changes
Click **SAVE** button

### Step 2: Update OAuth Consent Screen

#### A. Go to OAuth Consent Screen
1. Navigate to `APIs & Services` → `OAuth consent screen`
2. Click **EDIT APP**

#### B. Update Application Information
```
Application name: Garja
User support email: your-email@gmail.com
Application home page: https://mygarja.com
```

#### C. Add Test Users (If in Testing Mode)
1. Scroll down to "Test users"
2. Click **ADD USERS**
3. Add your Gmail address: `mhalajaywantdev@gmail.com`
4. Click **SAVE**

#### D. Authorized Domains
```
localhost
```

### Step 3: Verify Backend Configuration

Your `application.properties` should have:
```properties
spring.security.oauth2.client.registration.google.client-id=606555135455-pc77hp4d76nrt9op7noskv55b2joe453.apps.googleusercontent.com
spring.security.oauth2.client.registration.google.client-secret=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
spring.security.oauth2.client.registration.google.scope=openid,profile,email
spring.security.oauth2.client.registration.google.redirect-uri=https://api.mygarja.com/login/oauth2/code/google
```

### Step 4: Test the Fixed Implementation

#### A. Restart Both Servers
```bash
# Terminal 1 - Backend
cd GARJA_NEW_BACKEND
mvn spring-boot:run

# Terminal 2 - Frontend
cd GARJA_FRONTEND
npm run dev
```

#### B. Test OAuth Flow
1. Go to: `https://mygarja.com/test-oauth`
2. Click "Continue with Google"
3. Should redirect to Google OAuth screen
4. Should show "Choose an account to continue to Garja"

### Step 5: Alternative Fix - Create New OAuth Client

If the error persists, create a fresh OAuth client:

#### A. Create New OAuth 2.0 Client ID
1. In Google Cloud Console → `APIs & Services` → `Credentials`
2. Click `+ CREATE CREDENTIALS` → `OAuth 2.0 Client ID`
3. Application type: **Web application**
4. Name: `Garja OAuth Client`
5. Authorized JavaScript origins:
   ```
   https://mygarja.com
   https://api.mygarja.com
   ```
6. Authorized redirect URIs:
   ```
   https://api.mygarja.com/login/oauth2/code/google
   ```
7. Click **CREATE**

#### B. Update Backend Configuration
Replace the client ID and secret in `application.properties`:
```properties
spring.security.oauth2.client.registration.google.client-id=NEW_CLIENT_ID_HERE
spring.security.oauth2.client.registration.google.client-secret=NEW_CLIENT_SECRET_HERE
```

## 🔍 Common Issues and Solutions

### Issue 1: "redirect_uri_mismatch"
**Solution**: Ensure redirect URI matches exactly:
- `https://api.mygarja.com/login/oauth2/code/google`
- No trailing slashes
- Correct port number

### Issue 2: "unauthorized_client"
**Solution**: 
- Verify client ID is correct
- Check OAuth consent screen is published
- Add your email as test user

### Issue 3: "access_denied"
**Solution**:
- Check if app is in testing mode
- Add your email to test users
- Verify scopes are correct

## 🧪 Testing Checklist

- [ ] Google Cloud Console updated
- [ ] Redirect URIs match exactly
- [ ] OAuth consent screen configured
- [ ] Test user added (if in testing mode)
- [ ] Backend server running on port 8085
- [ ] Frontend server running on port 3000
- [ ] Browser cache cleared

## 🎯 Expected Result

After these fixes:
1. Click "Continue with Google"
2. Redirects to Google OAuth screen
3. Shows "Choose an account to continue to Garja"
4. Select your account
5. Completes authentication
6. Redirects back to your app

## 🆘 Still Having Issues?

1. **Check browser console** for specific error messages
2. **Try incognito mode** to avoid cache issues
3. **Wait 5-10 minutes** for Google changes to propagate
4. **Verify all URLs** match exactly (no typos)
5. **Check backend logs** for OAuth processing errors

The "Access blocked" error should be resolved after updating the Google Cloud Console configuration! 🎉
