# 🕵️ CodeCase Detective Academy

[![Website](https://img.shields.io/badge/Website-codecase.rutwikdev.com-blue)](https://codecase.rutwikdev.com)
[![Build Status](https://img.shields.io/badge/Build-Passing-green)](#)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen)](#)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#)

> **Learn HTML & CSS by solving interactive detective mysteries!** 🔍

CodeCase Detective Academy is an innovative gamified learning platform that teaches web development through engaging detective cases. Master HTML, CSS, and JavaScript while solving mysteries and earning achievements.

## 🌟 Features

### 🎮 Interactive Learning
- **Detective Cases**: Solve mysteries while learning HTML/CSS
- **Code Playground**: Live code editor with instant preview
- **Progressive Difficulty**: From beginner to advanced concepts
- **Achievement System**: Unlock badges and track progress

### 🔐 User Management
- **Secure Authentication**: Firebase-powered user accounts
- **Profile System**: Track learning progress and achievements
- **Referral Program**: Invite friends and earn rewards
- **Daily Login Rewards**: Gamified engagement system

### 🇮🇳 India-Focused
- **Currency**: Indian Rupee (INR) support
- **Timezone**: Asia/Kolkata optimization
- **Language**: English (India) - en-IN
- **SEO**: India-targeted search optimization

### 🚀 Modern Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Appwrite + Firebase (migration ready)
- **Analytics**: Google Analytics 4
- **Deployment**: GitHub Actions + Appwrite Cloud

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/codecase-detective-academy.git
cd codecase-detective-academy

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Setup

1. **Create Appwrite Project**: [Get started with Appwrite](https://appwrite.io)
2. **Update Environment**: Edit `.env.local` with your credentials
3. **Validate Setup**: Run `npm run validate-env`

## 🎯 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment & Validation
```bash
npm run validate-env    # Validate environment variables
npm run setup-domain    # Validate domain configuration
```

### Testing & Debugging
```bash
npm run test:referrals  # Test referral system
npm run debug:users     # Debug user data
npm run debug:referrals # Debug referral data
```

### Deployment
```bash
npm run build:prod     # Production build with optimizations
npm run deploy         # Deploy to Appwrite
```

## 📁 Project Structure

```
codecase-detective-academy/
├── 📂 src/                    # Source code
│   ├── 📂 components/         # React components
│   ├── 📂 contexts/          # React contexts
│   ├── 📂 hooks/             # Custom hooks
│   ├── 📂 utils/             # Utility functions
│   └── 📂 config/            # Configuration files
├── 📂 public/                # Static assets
├── 📂 docs/                  # Documentation
│   ├── 📂 deployment/        # Deployment guides
│   ├── 📂 development/       # Development docs
│   ├── 📂 features/          # Feature documentation
│   └── 📂 bug-fixes/         # Bug fix reports
├── 📂 tools/                 # Development tools
│   ├── 📂 debug/             # Debug scripts
│   └── 📂 testing/           # Test utilities
└── 📂 scripts/               # Build scripts
```

## 🌐 Live Website

Visit the live application: **[codecase.rutwikdev.com](https://codecase.rutwikdev.com)**

## 🔧 Configuration

### Environment Variables
See `.env.example` for all required environment variables.

Key configurations:
- `VITE_APP_URL`: Your domain (codecase.rutwikdev.com)
- `VITE_APPWRITE_PROJECT_ID`: Appwrite project ID
- `VITE_FIREBASE_*`: Firebase configuration
- `VITE_GOOGLE_ANALYTICS_ID`: GA4 tracking ID

### Domain Setup
The project is configured for the custom domain `codecase.rutwikdev.com`. See `docs/deployment/CUSTOM_DOMAIN_SETUP.md` for detailed setup instructions.

## 📚 Documentation

- **📋 [Project Overview](docs/PROJECT_SUMMARY.md)** - Complete project summary
- **🚀 [Deployment Guide](docs/deployment/)** - Deployment instructions
- **🔧 [Development Guide](docs/development/)** - Development setup
- **✨ [Features](docs/features/)** - Feature documentation
- **🐛 [Bug Fixes](docs/bug-fixes/)** - Bug fix reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Analytics & Monitoring

- **Google Analytics 4**: India-targeted tracking
- **Performance Monitoring**: Core Web Vitals
- **Error Tracking**: Console error monitoring
- **User Analytics**: Learning progress tracking

## 🔒 Security

- Environment variables for all sensitive data
- Firebase security rules implemented
- Input validation and sanitization
- HTTPS-only in production

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase**: Authentication and database
- **Appwrite**: Modern backend platform
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React**: UI library

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/codecase-detective-academy/issues)
- **Documentation**: [Project Docs](docs/)
- **Email**: support@rutwikdev.com

---

**Made with ❤️ for the Indian developer community**

*Learn to code by solving mysteries! 🕵️‍♂️*
