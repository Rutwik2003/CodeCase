# 🚀 CodeBuster Custom Domain Deployment Guide
## Domain: codebuster.rutwikdev.com

### ✅ SETUP COMPLETE

Your CodeBuster Detective Academy is now configured for your custom domain **codebuster.rutwikdev.com** with all credentials secured in environment variables.

---

## 📁 Files Created/Updated

### 🔐 Environment Configuration
- **`.env`** - Contains all your actual credentials (Firebase, Appwrite, Analytics)
- **`src/config/environment.ts`** - Updated with your domain as default
- **`src/config/firebase.ts`** - Now uses environment variables instead of hardcoded credentials

### 🌐 Domain-Specific Files
- **`public/sitemap.xml`** - Updated with codebuster.rutwikdev.com URLs
- **`.github/workflows/deploy.yml`** - Configured for your domain deployment

---

## 🔧 Appwrite Setup Required

### 1. Create Appwrite Project
```bash
# Install Appwrite CLI
npm install -g appwrite-cli

# Login to Appwrite
appwrite login

# Create project
appwrite projects create --project-id codebuster-rutwik --name "CodeBuster Detective Academy"
```

### 2. Update Your .env File
Replace these placeholders in your `.env` file:
```env
VITE_APPWRITE_PROJECT_ID=your-actual-appwrite-project-id-here
```

### 3. Configure Custom Domain in Appwrite
1. Go to Appwrite Console → Your Project → Settings → Domains
2. Add custom domain: `codebuster.rutwikdev.com`
3. Follow DNS configuration instructions
4. Enable SSL certificate

---

## 🌍 DNS Configuration for rutwikdev.com

Add these DNS records to your domain provider:

```dns
Type: CNAME
Name: codebuster
Value: your-appwrite-project.appwrite.global
TTL: 300

Type: TXT (for verification)
Name: _appwrite-challenge.codebuster
Value: [provided by Appwrite]
TTL: 300
```

---

## 🔑 GitHub Secrets Setup

Add these secrets to your GitHub repository:

### Required Secrets
```yaml
# Appwrite
APPWRITE_ENDPOINT: https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID: your-actual-project-id
APPWRITE_API_KEY: your-appwrite-api-key

# Firebase (Current credentials)
FIREBASE_API_KEY: [your-firebase-api-key-from-.env]
FIREBASE_AUTH_DOMAIN: codebuster-82940.firebaseapp.com
FIREBASE_PROJECT_ID: codebuster-82940
FIREBASE_STORAGE_BUCKET: codebuster-82940.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID: [your-messaging-sender-id]
FIREBASE_APP_ID: [your-firebase-app-id]
FIREBASE_MEASUREMENT_ID: [your-measurement-id]

# Analytics
GOOGLE_ANALYTICS_ID: [your-analytics-id]
```

---

## 🚀 Deployment Process

### 1. Local Development
```bash
# Copy environment file
cp .env .env.local

# Install dependencies
npm install

# Start development server
npm run dev
# Visit: http://localhost:5173
```

### 2. Production Deployment
```bash
# Push to main branch triggers auto-deployment
git add .
git commit -m "Deploy to codebuster.rutwikdev.com"
git push origin main

# Monitor deployment in GitHub Actions
```

---

## 🔍 SEO & Analytics Setup

### Google Search Console
1. Add property: `https://codebuster.rutwikdev.com`
2. Submit sitemap: `https://codebuster.rutwikdev.com/sitemap.xml`
3. Verify ownership using Google Analytics tag

### Google Analytics 4
- **Tracking ID**: `[your-analytics-id]` (configure in your project)
- **Enhanced Ecommerce**: Enabled for India market
- **Currency**: INR
- **Timezone**: Asia/Kolkata

---

## 🇮🇳 India-Specific Features

### Configured Settings
- **Country**: India (IN)
- **Language**: English India (en-IN)
- **Currency**: INR
- **Timezone**: Asia/Kolkata
- **Phone Code**: +91

### SEO Targeting
- India-specific keywords
- Local search optimization
- Regional meta tags
- Hindi language support ready

---

## 🛡️ Security Features

### Environment Variables
- All credentials moved to `.env`
- Type-safe validation in `environment.ts`
- Build-time replacement for production
- Git ignored for security

### Firebase Security
- Authentication rules configured
- Firestore security rules active
- API key restrictions in place

---

## 📊 Monitoring & Analytics

### Performance Tracking
- Google Analytics 4 (India-targeted)
- Core Web Vitals monitoring
- User journey tracking
- Achievement completion rates

### Error Monitoring
- Console error tracking
- Failed authentication attempts
- API failure monitoring

---

## 🎯 Next Steps

### 1. Immediate Actions
- [ ] Create Appwrite project and get Project ID
- [ ] Update `.env` with actual Appwrite Project ID
- [ ] Configure DNS records for codebuster.rutwikdev.com
- [ ] Add GitHub secrets for deployment

### 2. Optional Enhancements
- [ ] Add Razorpay integration for Indian payments
- [ ] Configure Hotjar for user behavior analytics
- [ ] Set up email notifications with EmailJS
- [ ] Add reCAPTCHA for security

### 3. Launch Checklist
- [ ] Test all authentication flows
- [ ] Verify all detective cases work
- [ ] Check achievement system
- [ ] Test referral system
- [ ] Confirm analytics tracking
- [ ] Validate SEO meta tags

---

## 🆘 Troubleshooting

### Common Issues

**Domain not resolving:**
- Check DNS propagation (can take 24-48 hours)
- Verify CNAME record is correct
- Ensure Appwrite domain is verified

**Build failing:**
- Check all environment variables are set
- Verify Appwrite project ID is correct
- Ensure Node.js version is 18+

**Authentication not working:**
- Verify Firebase credentials in GitHub secrets
- Check Appwrite authentication settings
- Confirm environment variables are loaded

---

## 📞 Support

- **Domain Issues**: Contact your DNS provider
- **Appwrite Support**: [Appwrite Discord](https://discord.gg/appwrite)
- **GitHub Actions**: Check workflow logs
- **Firebase**: [Firebase Console](https://console.firebase.google.com/)

---

### 🎉 Congratulations!

Your CodeBuster Detective Academy is ready for deployment at **codebuster.rutwikdev.com**!

Just update the Appwrite Project ID in your `.env` file and push to deploy! 🚀
