# OpenStreetMap OAuth2 Setup Guide

This guide explains how to set up OpenStreetMap OAuth2 authentication for the Temporary Road Closures application.

## Overview

The application supports OAuth2 authentication with OpenStreetMap (OSM), allowing users to log in using their existing OSM accounts. This is the recommended authentication method for contributors to the OpenStreetMap community.

## Prerequisites

- An OpenStreetMap account (create one at https://www.openstreetmap.org/user/new)
- Access to your application's backend configuration

## Step 1: Register Your Application with OpenStreetMap

1. Go to https://www.openstreetmap.org/oauth2/applications
2. Click "Register new application"
3. Fill in the application details:
   - **Name**: Choose a descriptive name (e.g., "OSM Road Closures - Dev" or "OSM Road Closures - Production")
   - **Redirect URIs**: Add your callback URL(s):
     - For local development: `http://localhost:8000/api/v1/auth/oauth/osm/callback`
     - For production: `https://api.yourdomain.com/api/v1/auth/oauth/osm/callback`
   - **Confidential**: Check this box (the application will use client credentials)
   - **Scopes**: Select `read_prefs` (this allows the app to read user preferences including username and email)

4. Click "Register"
5. You will receive:
   - **Client ID**: A long string that identifies your application
   - **Client Secret**: A secret key (keep this secure!)

## Step 2: Configure Your Application

### For Development (`.env` file in `backend` directory)

Create or update your `.env` file:

```bash
# Enable OAuth
OAUTH_ENABLED=true

# OpenStreetMap OAuth Configuration
OSM_CLIENT_ID=your-osm-client-id-here
OSM_CLIENT_SECRET=your-osm-client-secret-here
OSM_REDIRECT_URI=http://localhost:8000/api/v1/auth/oauth/osm/callback

# Frontend URL (where users will be redirected after login)
FRONTEND_URL=http://localhost:3000
OAUTH_SUCCESS_REDIRECT=/closures
OAUTH_ERROR_REDIRECT=/login?error=oauth_failed
```

### For Production (Environment Variables)

Set these environment variables in your production deployment:

```bash
OAUTH_ENABLED=true
OSM_CLIENT_ID=your-production-osm-client-id
OSM_CLIENT_SECRET=your-production-osm-client-secret
OSM_REDIRECT_URI=https://api.yourdomain.com/api/v1/auth/oauth/osm/callback
FRONTEND_URL=https://yourdomain.com
OAUTH_SUCCESS_REDIRECT=/closures
OAUTH_ERROR_REDIRECT=/login?error=oauth_failed
```

## Step 3: Test the OAuth Flow

1. Start your backend server
2. Start your frontend application
3. Navigate to the login page (`/login`) or register page (`/register`)
4. Click "Continue with OpenStreetMap"
5. You should be redirected to OSM to authorize the application
6. After authorization, you'll be redirected back to your application and automatically logged in

## Troubleshooting

### "authentication failed" in URL

**Possible causes:**
- OAuth is not enabled: Check `OAUTH_ENABLED=true` in your config
- Invalid client credentials: Verify `OSM_CLIENT_ID` and `OSM_CLIENT_SECRET`
- Redirect URI mismatch: Ensure the redirect URI in OSM app settings matches `OSM_REDIRECT_URI`
- Cookie issues: Check that cookies are being set correctly (requires HTTPS in production)

### "invalid_state" error

**Possible causes:**
- Cookie not being stored/retrieved properly
- Using HTTP in production (cookies require HTTPS)
- Browser blocking third-party cookies
- State expired (10-minute timeout)

### User not getting logged in after authorization

**Possible causes:**
- Frontend not handling the token correctly
- Check browser console for JavaScript errors
- Verify `FRONTEND_URL` is correct in backend config
- Ensure the redirect path exists (default is `/closures`)

## Security Considerations

1. **Keep your Client Secret secure**: Never commit it to version control
2. **Use HTTPS in production**: OAuth2 requires secure connections
3. **Validate redirect URIs**: Only whitelist your own domains
4. **Monitor OAuth usage**: Check OSM application settings for unusual activity
5. **Rotate secrets periodically**: Update client secret every 6-12 months

## Additional OAuth Providers

The application also supports:
- **Google OAuth**: Follow similar steps at Google Cloud Console
- **GitHub OAuth**: Configure at GitHub Developer Settings

See the `.env.example` file for configuration details.

## Debugging

Enable debug mode to see detailed OAuth logs:

```bash
DEBUG=true
LOG_LEVEL=DEBUG
```

Check backend logs for messages like:
- `✅ OAuth state validation successful`
- `✅ OAuth access token obtained`
- `✅ OAuth user info retrieved`
- `✅ User created/updated in database`

## Resources

- [OpenStreetMap OAuth2 Documentation](https://wiki.openstreetmap.org/wiki/OAuth)
- [OSM OAuth2 Applications](https://www.openstreetmap.org/oauth2/applications)
- [OAuth2 Specification](https://oauth.net/2/)
