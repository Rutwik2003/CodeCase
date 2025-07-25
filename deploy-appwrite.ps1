# CodeCase Appwrite Deployment Script (PowerShell)
# This script deploys your project to Appwrite with proper environment variables

Write-Host "🚀 Starting CodeCase deployment to Appwrite..." -ForegroundColor Green

# Check if Appwrite CLI is installed
try {
    appwrite --version | Out-Null
    Write-Host "✅ Appwrite CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Appwrite CLI not found. Installing..." -ForegroundColor Red
    npm install -g appwrite-cli
}

# Build the project
Write-Host "🏗️ Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Create a simple index.js file for Appwrite Functions
$indexJs = @"
const path = require('path');
const { readFileSync } = require('fs');

// Simple static file server for Appwrite Functions
module.exports = async ({ req, res }) => {
  const filePath = req.path === '/' ? '/index.html' : req.path;
  
  try {
    const file = readFileSync(path.join(__dirname, 'dist', filePath));
    
    // Set appropriate content type
    const ext = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.ico': 'image/x-icon'
    };
    
    res.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
    return res.send(file);
  } catch (error) {
    return res.status(404).send('File not found');
  }
};
"@

$indexJs | Out-File -FilePath "index.js" -Encoding UTF8

# Create package.json for the function
$packageJson = @{
    name = "codecase-static"
    version = "1.0.0"
    description = "CodeCase Static Site"
    main = "index.js"
    dependencies = @{}
} | ConvertTo-Json -Depth 3

$packageJson | Out-File -FilePath "package.json" -Encoding UTF8

Write-Host "📦 Created Appwrite Function files" -ForegroundColor Yellow

Write-Host "🌐 Deployment files ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Manual deployment steps:" -ForegroundColor Cyan
Write-Host "1. Go to Appwrite Console: https://cloud.appwrite.io"
Write-Host "2. Navigate to Functions → Create Function"
Write-Host "3. Choose Node.js 18.0 runtime"
Write-Host "4. Upload the following files:"
Write-Host "   - index.js (created)"
Write-Host "   - package.json (created)"
Write-Host "   - dist/ folder (your built app)"
Write-Host "5. Set environment variables in Function settings"
Write-Host "6. Enable Function execution"
Write-Host ""
Write-Host "🔧 Environment Variables to set in Appwrite Console:"
Write-Host "VITE_APP_URL=https://codecase.appwrite.network"
Write-Host "VITE_APPWRITE_PROJECT_ID=68839182000e7f7bc644"
Write-Host "VITE_FIREBASE_API_KEY=AIzaSyADaTIt-LtRo3NQNxVskWOj5412B0VvA9U"
Write-Host "(Copy from your .env file for complete list)"

Write-Host ""
Write-Host "Ready for manual deployment to Appwrite!" -ForegroundColor Green
