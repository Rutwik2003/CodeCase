#!/bin/bash

# CodeCase Appwrite Deployment Script
# This script deploys your project to Appwrite with proper environment variables

echo "🚀 Starting CodeCase deployment to Appwrite..."

# Check if Appwrite CLI is installed
if ! command -v appwrite &> /dev/null; then
    echo "❌ Appwrite CLI not found. Installing..."
    npm install -g appwrite-cli
fi

# Login to Appwrite (if not already logged in)
echo "🔐 Checking Appwrite authentication..."
appwrite login

# Set project context
echo "📁 Setting project context..."
appwrite init project --project-id 68839182000e7f7bc644

# Build the project
echo "🏗️ Building project..."
npm run build

# Create deployment package
echo "📦 Creating deployment package..."
cd dist
zip -r ../codecase-deployment.zip .
cd ..

# Deploy to Appwrite as a static site
echo "🌐 Deploying to Appwrite..."

# Create or update the static site function
appwrite functions create \
  --function-id codecase-static \
  --name "CodeCase Static Site" \
  --runtime "static" \
  --execute "any" \
  --events "" \
  --schedule "" \
  --timeout 15 \
  --enabled true

# Set environment variables
echo "⚙️ Setting environment variables..."

appwrite functions updateVar \
  --function-id codecase-static \
  --key VITE_APP_NAME \
  --value "CodeCase Detective Academy"

appwrite functions updateVar \
  --function-id codecase-static \
  --key VITE_APP_URL \
  --value "https://codecase.appwrite.network"

appwrite functions updateVar \
  --function-id codecase-static \
  --key VITE_APPWRITE_PROJECT_ID \
  --value "68839182000e7f7bc644"

appwrite functions updateVar \
  --function-id codecase-static \
  --key VITE_FIREBASE_API_KEY \
  --value "AIzaSyADaTIt-LtRo3NQNxVskWOj5412B0VvA9U"

# Deploy the built files
appwrite functions createDeployment \
  --function-id codecase-static \
  --code ./codecase-deployment.zip \
  --activate true

echo "✅ Deployment complete!"
echo "🌐 Your site should be available at: https://codecase.appwrite.network"
echo ""
echo "📋 Next steps:"
echo "1. Go to Appwrite Console → Functions → codecase-static"
echo "2. Set up custom domain if needed"
echo "3. Configure any additional environment variables"

# Cleanup
rm codecase-deployment.zip

echo "🎉 CodeCase is now live on Appwrite!"
