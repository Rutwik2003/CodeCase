# 🚀 Appwrite Deployment Guide for CodeBuster

This guide will help you deploy CodeBuster Detective Academy to Appwrite with automatic GitHub integration.

## 📋 Prerequisites

1. **Appwrite Cloud Account**: Sign up at [cloud.appwrite.io](https://cloud.appwrite.io)
2. **GitHub Repository**: Your CodeBuster project repository
3. **Node.js**: Version 18 or higher
4. **Appwrite CLI**: Install globally with `npm install -g appwrite-cli`

## 🔧 Step 1: Appwrite Project Setup

### 1.1 Create New Project
```bash
# Login to Appwrite
appwrite login

# Create new project
appwrite init project
# Follow prompts to create your project
```

### 1.2 Configure Project Settings
```bash
# Set project ID in appwrite.json
{
  "projectId": "your-actual-project-id",
  "projectName": "CodeBuster Detective Academy"
}
```

## 🗄️ Step 2: Database Configuration

### 2.1 Create Database
```bash
# Create database
appwrite databases create \
  --databaseId "codebuster-db" \
  --name "CodeBuster Database"
```

### 2.2 Create Collections
```bash
# Users collection
appwrite databases createCollection \
  --databaseId "codebuster-db" \
  --collectionId "users" \
  --name "Users" \
  --permissions "read(\"any\")" \
  --documentSecurity true

# Add user attributes
appwrite databases createStringAttribute \
  --databaseId "codebuster-db" \
  --collectionId "users" \
  --key "email" \
  --size 255 \
  --required true

appwrite databases createStringAttribute \
  --databaseId "codebuster-db" \
  --collectionId "users" \
  --key "displayName" \
  --size 100 \
  --required false

appwrite databases createIntegerAttribute \
  --databaseId "codebuster-db" \
  --collectionId "users" \
  --key "points" \
  --required false \
  --default 0

appwrite databases createIntegerAttribute \
  --databaseId "codebuster-db" \
  --collectionId "users" \
  --key "hints" \
  --required false \
  --default 3
```

## 🔐 Step 3: Authentication Setup

### 3.1 Configure Auth Providers
```bash
# Enable email/password auth
appwrite projects updateAuthEmailPassword \
  --projectId "your-project-id" \
  --enabled true

# Enable Google OAuth (optional)
appwrite projects updateAuthOAuth2Google \
  --projectId "your-project-id" \
  --enabled true \
  --appId "your-google-client-id" \
  --secret "your-google-client-secret"
```

## 📁 Step 4: Storage Configuration

### 4.1 Create Storage Bucket
```bash
# Create assets bucket
appwrite storage createBucket \
  --bucketId "assets" \
  --name "Assets" \
  --permissions "read(\"any\")" \
  --fileSecurity false \
  --enabled true \
  --maximumFileSize 10485760 \
  --allowedFileExtensions "jpg,jpeg,png,gif,webp,svg"
```

## 🌐 Step 5: Hosting Configuration

### 5.1 Enable Web Hosting
1. Go to your Appwrite Console
2. Navigate to **Hosting** in the sidebar
3. Click **Enable Hosting**
4. Configure custom domain (optional)

### 5.2 Update URLs in Project
Replace all instances of `your-appwrite-domain.appwrite.io` with your actual domain:

```bash
# In index.html, sitemap.xml, robots.txt, etc.
# Use your actual Appwrite hosting URL
```

## 🔄 Step 6: GitHub Integration

### 6.1 GitHub Secrets Configuration
Add these secrets to your GitHub repository:

```
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DOMAIN=your-actual-domain.appwrite.io
```

### 6.2 API Key Generation
1. Go to Appwrite Console → **Settings** → **API Keys**
2. Create new API key with these scopes:
   - `databases.read`
   - `databases.write`
   - `files.read`
   - `files.write`
   - `functions.read`
   - `functions.write`

## 🔨 Step 7: Build Configuration

### 7.1 Update vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'ui-vendor': ['framer-motion', 'lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000
  }
})
```

## 🚀 Step 8: Deployment

### 8.1 Manual Deployment
```bash
# Build the project
npm run build

# Deploy to Appwrite
appwrite deploy
```

### 8.2 Automatic Deployment
Push to your `main` branch to trigger automatic deployment via GitHub Actions.

## 🔍 Step 9: SEO Configuration

### 9.1 Update Meta Tags
Update all URLs in the following files:
- `public/sitemap.xml`
- `public/robots.txt`
- `src/components/SEO.tsx`
- `index.html`

### 9.2 Google Analytics Setup
1. Create Google Analytics 4 property
2. Update `GA_TRACKING_ID` in `src/utils/analytics.ts`
3. Add tracking code to your domain

## 📊 Step 10: Monitoring & Analytics

### 10.1 Appwrite Console Monitoring
- Database usage
- Authentication metrics
- Storage usage
- Function executions

### 10.2 Performance Monitoring
- Google Analytics 4
- Core Web Vitals
- Page load times
- User engagement metrics

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules dist
   npm install
   npm run build
   ```

2. **CORS Issues**
   - Add your domain to Appwrite Console → **Settings** → **Platforms**
   - Configure web platform with your domain

3. **Authentication Issues**
   - Verify auth providers are enabled
   - Check API keys and permissions
   - Ensure correct project ID in config

4. **Database Connection Issues**
   - Verify database ID matches configuration
   - Check collection permissions
   - Ensure API key has database access

## 📝 Environment Variables

Create `.env.production` for production deployment:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

## 🎯 Performance Optimization

### 8.1 Asset Optimization
```bash
# Install compression tools
npm install --save-dev vite-plugin-compression

# Add to vite.config.ts
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    compression()
  ]
})
```

### 8.2 CDN Configuration
- Enable Appwrite CDN for static assets
- Configure cache headers for optimal performance
- Use WebP images where possible

## ✅ Deployment Checklist

- [ ] Appwrite project created and configured
- [ ] Database collections and attributes set up
- [ ] Authentication providers enabled
- [ ] Storage buckets configured
- [ ] GitHub secrets configured
- [ ] All URLs updated with actual domain
- [ ] Google Analytics configured
- [ ] Performance monitoring enabled
- [ ] SSL certificate active
- [ ] Custom domain configured (optional)
- [ ] SEO meta tags updated
- [ ] Sitemap and robots.txt updated

## 🔗 Useful Links

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Cloud Console](https://cloud.appwrite.io)
- [GitHub Actions Marketplace](https://github.com/marketplace/actions/appwrite)
- [Web Performance Best Practices](https://web.dev/fast/)

## 🆘 Support

If you encounter issues:
1. Check Appwrite Console logs
2. Review GitHub Actions output
3. Verify all configuration files
4. Check browser console for errors
5. Contact Appwrite support if needed

Happy Coding! 🕵️‍♂️💻
