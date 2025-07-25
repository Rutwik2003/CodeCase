# 🚀 CodeCase Appwrite Deployment Fix Guide

## Issue Analysis
Based on your browser console errors:
1. **ERR_BLOCKED_BY_CLIENT** - Ad blocker blocking resources
2. **Module script loading failed** - Environment variables not set in Appwrite
3. **Manifest syntax error** - Environment variable placeholders not replaced

## ✅ Quick Fix Steps

### 1. Set Environment Variables in Appwrite Console

Go to your Appwrite Console → Your Project → Settings → Environment Variables

Add these variables:

```bash
# App Configuration
VITE_APP_NAME=CodeCase Detective Academy
VITE_APP_DESCRIPTION=Learn HTML & CSS by solving detective mysteries in India
VITE_APP_VERSION=1.0.0
VITE_APP_COUNTRY=IN
VITE_APP_TIMEZONE=Asia/Kolkata
VITE_APP_LANGUAGE=en-IN
VITE_APP_CURRENCY=INR
VITE_APP_URL=https://YOUR_APPWRITE_DOMAIN.appwrite.global

# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=68839182000e7f7bc644
VITE_APPWRITE_DATABASE_ID=codecase-db
VITE_APPWRITE_USERS_COLLECTION_ID=users
VITE_APPWRITE_ACHIEVEMENTS_COLLECTION_ID=achievements
VITE_APPWRITE_PROGRESS_COLLECTION_ID=progress
VITE_APPWRITE_REFERRALS_COLLECTION_ID=referrals
VITE_APPWRITE_STORAGE_BUCKET_ID=assets

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyADaTIt-LtRo3NQNxVskWOj5412B0VvA9U
VITE_FIREBASE_AUTH_DOMAIN=codebuster-82940.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=codebuster-82940
VITE_FIREBASE_STORAGE_BUCKET=codebuster-82940.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=723934530435
VITE_FIREBASE_APP_ID=1:723934530435:web:7e36ac09290873e5b5c4b6

# Analytics & Features
VITE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_JWT_SECRET=your_jwt_secret_here_min_32_chars
```

### 2. Replace YOUR_APPWRITE_DOMAIN

Replace `YOUR_APPWRITE_DOMAIN` with your actual Appwrite domain (from the URL where you're accessing the site).

### 3. Redeploy

After setting environment variables:
1. In Appwrite Console → Functions → Deployments
2. Redeploy your function/static site
3. Wait for deployment to complete

### 4. Browser Troubleshooting

**Disable Ad Blocker temporarily:**
1. Click on your ad blocker extension
2. Disable it for this site
3. Refresh the page

**Clear Browser Cache:**
1. Press Ctrl+Shift+R (force refresh)
2. Or open Dev Tools → Application → Storage → Clear storage

### 5. Test Environment Variables

To verify environment variables are working, check in browser console:
```javascript
// This should show your environment variables
console.log(import.meta.env)
```

## 🔧 Alternative Deployment Method

If issues persist, try using Appwrite CLI:

```bash
# Install Appwrite CLI
npm install -g appwrite-cli

# Login to Appwrite
appwrite login

# Deploy with environment variables
appwrite functions createDeployment \
  --functionId=your-function-id \
  --entrypoint="dist/index.html" \
  --code="./dist"
```

## 🚨 Common Issues & Solutions

### Issue: Module not found
**Solution**: Ensure all environment variables are set in Appwrite Console

### Issue: Manifest error
**Solution**: Environment variables must be set before build replacement

### Issue: Firebase connection fails
**Solution**: Verify Firebase credentials in environment variables

### Issue: Blank page
**Solution**: Check browser console for specific error messages

## 📝 Environment Variable Checklist

- [ ] All VITE_ variables set in Appwrite Console
- [ ] VITE_APP_URL matches your deployed domain
- [ ] Firebase credentials are correct
- [ ] Appwrite project ID matches your actual project
- [ ] Redeployed after setting variables
- [ ] Browser cache cleared
- [ ] Ad blocker disabled for testing

## 🌐 Expected Result

After fixing, you should see:
- ✅ Site loads without console errors
- ✅ Authentication works
- ✅ Firebase connection established
- ✅ Appwrite database accessible
- ✅ All features functional

---

**Need help?** Check your actual Appwrite domain and replace all placeholder values with your real configuration.
