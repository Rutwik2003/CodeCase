# 🚀 CodeCase Appwrite Environment Variables

## For Appwrite Console → Settings → Environment Variables

Copy and paste these exact values into your Appwrite project:

```bash
# App Configuration
VITE_APP_NAME=CodeCase Detective Academy
VITE_APP_DESCRIPTION=Learn HTML & CSS by solving detective mysteries in India
VITE_APP_VERSION=1.0.0
VITE_APP_COUNTRY=IN
VITE_APP_TIMEZONE=Asia/Kolkata
VITE_APP_LANGUAGE=en-IN
VITE_APP_CURRENCY=INR
VITE_APP_URL=https://codecase.appwrite.network

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

# Analytics & Security
VITE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_JWT_SECRET=codecase_jwt_secret_2025_secure_key_min_32_chars
```

## 📋 Step-by-Step Instructions

### 1. Go to Appwrite Console
- Open: https://cloud.appwrite.io
- Navigate to your CodeCase project
- Go to Settings → Environment Variables

### 2. Add Each Variable
For each variable above:
1. Click "Add Variable"
2. Enter the Key (e.g., `VITE_APP_NAME`)
3. Enter the Value (e.g., `CodeCase Detective Academy`)
4. Click Save

### 3. Deploy Your Built Files
Upload the contents of your `dist/` folder to Appwrite.

### 4. Test the Deployment
- Visit: https://codecase.appwrite.network
- Open browser dev tools
- Check console - no more module errors!

## 🔄 When You Switch to Custom Domain

Later, when you connect `codecase.rutwikdev.com`:

1. Update `VITE_APP_URL=https://codecase.rutwikdev.com`
2. Rebuild: `npm run build`
3. Redeploy the new `dist/` folder

## ✅ Expected Results

After setting these environment variables:
- ✅ No more "Failed to load module script" errors
- ✅ No more manifest syntax errors
- ✅ Authentication will work properly
- ✅ Firebase connection established
- ✅ All features functional

---

**Important**: Make sure to set ALL these variables in Appwrite Console before deploying!
