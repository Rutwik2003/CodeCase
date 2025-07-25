# 🚀 Code Buster - Vercel Deployment Guide

## Overview
This guide covers deploying Code Buster to Vercel with the custom subdomain `codebuster.rutwikdev.com`.

## 📋 Pre-deployment Checklist

### 1. Repository Setup
- [ ] Push all code to GitHub repository
- [ ] Ensure all dependencies are in `package.json`
- [ ] Verify Firebase configuration is correct
- [ ] Test build locally: `npm run build`

### 2. Environment Variables
Create these environment variables in Vercel dashboard:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# App Configuration
VITE_APP_URL=https://codebuster.rutwikdev.com
```

### 3. Firebase Configuration
Update Firebase project settings:
- Add `codebuster.rutwikdev.com` to authorized domains
- Update CORS settings if needed
- Verify Firestore security rules are production-ready

## 🔧 Vercel Deployment Steps

### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository containing Code Buster

### Step 2: Configure Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### Step 3: Add Environment Variables
In Vercel dashboard → Project Settings → Environment Variables:
- Add all Firebase config variables
- Add `VITE_APP_URL=https://codebuster.rutwikdev.com`

### Step 4: Custom Domain Setup
1. Go to Project Settings → Domains
2. Add custom domain: `codebuster.rutwikdev.com`
3. Follow Vercel's DNS configuration instructions
4. Update your DNS provider (where rutwikdev.com is hosted):

**Add CNAME Record:**
```
Name: codebuster
Target: cname.vercel-dns.com
TTL: 300 (or Auto)
```

### Step 5: Build & Deploy
1. Click "Deploy" 
2. Wait for build to complete
3. Verify deployment at temporary Vercel URL
4. Once DNS propagates, verify at `codebuster.rutwikdev.com`

## 🔒 Security Configuration

### Firebase Security Rules
Update `firestore.rules` for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow reading user data for referral validation
    match /users/{userId} {
      allow read: if request.auth != null && 
        resource.data.referralCode is string;
    }
  }
}
```

### Firebase Authentication
Update authorized domains in Firebase Console:
- `codebuster.rutwikdev.com`
- `localhost` (for development)

## 📱 PWA Configuration (Optional)

### Add PWA Support
1. Install PWA plugin: `npm install vite-plugin-pwa`
2. Update `vite.config.ts`:

```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Code Buster',
        short_name: 'CodeBuster',
        description: 'Master coding skills with detective missions',
        theme_color: '#1e293b',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

## 🚦 Post-Deployment Testing

### Test Checklist
- [ ] Homepage loads correctly
- [ ] User registration/login works
- [ ] Referral links work: `https://codebuster.rutwikdev.com/signup?ref=ABC123`
- [ ] Profile system functions
- [ ] Case interface loads
- [ ] Firebase data syncs
- [ ] Referral rewards distribute correctly

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

## 🔧 Troubleshooting

### Common Issues

**Build Fails:**
- Check environment variables are set
- Verify all dependencies in package.json
- Check TypeScript errors

**Firebase Connection Issues:**
- Verify environment variables
- Check authorized domains
- Validate Firebase config

**Referral Links Not Working:**
- Verify URL parameter parsing
- Check Firebase referral validation
- Test with different browsers

**Domain Not Resolving:**
- Wait for DNS propagation (up to 48 hours)
- Verify CNAME record is correct
- Check with DNS propagation checker

## 📊 Analytics & Monitoring

### Vercel Analytics
Enable in Vercel dashboard for:
- Page views
- Performance metrics
- User engagement
- Error tracking

### Firebase Analytics
Verify analytics events:
- User registration
- Referral usage
- Case completion
- Achievement unlocks

## 🔄 Continuous Deployment

### Auto-deployment Setup
- Vercel automatically deploys on git push to main branch
- Preview deployments for pull requests
- Environment-specific builds

### Branch Configuration
```
main → Production (codebuster.rutwikdev.com)
develop → Preview (preview-url.vercel.app)
feature/* → Preview deployments
```

---

## ✅ Deployment Complete!

Once deployed, your Code Buster application will be live at:
**https://codebuster.rutwikdev.com**

### Next Steps:
1. Test all functionality
2. Monitor performance metrics
3. Set up error tracking
4. Plan future feature deployments
5. Share with users and gather feedback

### Support Resources:
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
