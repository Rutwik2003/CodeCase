// 🔐 Environment Configuration Utility for CodeCase (India)
// Secure environment variable management with validation

interface EnvironmentConfig {
  // App Configuration
  app: {
    name: string;
    description: string;
    version: string;
    country: string;
    timezone: string;
    language: string;
    url: string;
  };
  
  // Firebase Configuration
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  
  // Analytics Configuration
  analytics: {
    gaTrackingId: string;
    gaMeasurementId: string;
    enabled: boolean;
  };
  
  // Security Configuration
  security: {
    encryptionKey: string;
    jwtSecret: string;
    corsOrigin: string;
  };
  
  // India-specific Configuration
  india: {
    currency: string;
    currencySymbol: string;
    phoneCountryCode: string;
    defaultCity: string;
    defaultState: string;
    enableHindi: boolean;
    enableRegionalLanguages: boolean;
  };
  
  // Feature Flags
  features: {
    analytics: boolean;
    pwa: boolean;
    darkMode: boolean;
    animations: boolean;
  };
  
  // SEO Configuration
  seo: {
    keywords: string;
    author: string;
    publisher: string;
    ogImageUrl: string;
    twitterImageUrl: string;
    twitterHandle: string;
  };
  
  // Contact Information
  contact: {
    supportEmail: string;
    adminEmail: string;
    twitterUrl: string;
    githubUrl: string;
    linkedinUrl: string;
  };
  
  // Gamification Settings
  gamification: {
    defaultHints: number;
    pointsPerMission: number;
    referralBonus: number;
  };
}

// Environment variable validation
const validateEnvironmentVariable = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  
  if (!value && !defaultValue) {
    console.warn(`⚠️ Environment variable ${key} is not set`);
    return '';
  }
  
  return value;
};

// Convert string to boolean
const getBooleanEnv = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

// Convert string to number
const getNumberEnv = (key: string, defaultValue: number = 0): number => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Main environment configuration
export const env: EnvironmentConfig = {
  app: {
    name: validateEnvironmentVariable('VITE_APP_NAME', 'CodeCase Detective Academy'),
    description: validateEnvironmentVariable('VITE_APP_DESCRIPTION', 'Learn HTML & CSS by solving detective mysteries'),
    version: validateEnvironmentVariable('VITE_APP_VERSION', '1.0.0'),
    country: validateEnvironmentVariable('VITE_APP_COUNTRY', 'IN'),
    timezone: validateEnvironmentVariable('VITE_APP_TIMEZONE', 'Asia/Kolkata'),
    language: validateEnvironmentVariable('VITE_APP_LANGUAGE', 'en-IN'),
    url: validateEnvironmentVariable('VITE_APP_URL'),
  },
  
  firebase: {
    apiKey: validateEnvironmentVariable('VITE_FIREBASE_API_KEY'),
    authDomain: validateEnvironmentVariable('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: validateEnvironmentVariable('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: validateEnvironmentVariable('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: validateEnvironmentVariable('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: validateEnvironmentVariable('VITE_FIREBASE_APP_ID'),
    measurementId: validateEnvironmentVariable('VITE_FIREBASE_MEASUREMENT_ID'),
  },
  
  analytics: {
    gaTrackingId: validateEnvironmentVariable('VITE_GA_TRACKING_ID', 'G-XXXXXXXXXX'),
    gaMeasurementId: validateEnvironmentVariable('VITE_GA_MEASUREMENT_ID', 'G-XXXXXXXXXX'),
    enabled: getBooleanEnv('VITE_GOOGLE_ANALYTICS_ENABLED', true),
  },
  
  security: {
    encryptionKey: validateEnvironmentVariable('VITE_ENCRYPTION_KEY'),
    jwtSecret: validateEnvironmentVariable('VITE_JWT_SECRET'),
    corsOrigin: validateEnvironmentVariable('VITE_CORS_ORIGIN'),
  },
  
  india: {
    currency: validateEnvironmentVariable('VITE_CURRENCY', 'INR'),
    currencySymbol: validateEnvironmentVariable('VITE_CURRENCY_SYMBOL', '₹'),
    phoneCountryCode: validateEnvironmentVariable('VITE_PHONE_COUNTRY_CODE', '+91'),
    defaultCity: validateEnvironmentVariable('VITE_DEFAULT_CITY', 'Mumbai'),
    defaultState: validateEnvironmentVariable('VITE_DEFAULT_STATE', 'Maharashtra'),
    enableHindi: getBooleanEnv('VITE_ENABLE_HINDI', false),
    enableRegionalLanguages: getBooleanEnv('VITE_ENABLE_REGIONAL_LANGUAGES', false),
  },
  
  features: {
    analytics: getBooleanEnv('VITE_ENABLE_ANALYTICS', true),
    pwa: getBooleanEnv('VITE_ENABLE_PWA', true),
    darkMode: getBooleanEnv('VITE_ENABLE_DARK_MODE', true),
    animations: getBooleanEnv('VITE_ENABLE_ANIMATIONS', true),
  },
  
  seo: {
    keywords: validateEnvironmentVariable('VITE_SEO_KEYWORDS', 'HTML tutorial India, CSS learning, coding bootcamp Mumbai, web development Delhi'),
    author: validateEnvironmentVariable('VITE_SEO_AUTHOR', 'CodeCase Academy India'),
    publisher: validateEnvironmentVariable('VITE_SEO_PUBLISHER', 'CodeCase Academy'),
    ogImageUrl: validateEnvironmentVariable('VITE_OG_IMAGE_URL', '/og-image-india.png'),
    twitterImageUrl: validateEnvironmentVariable('VITE_TWITTER_IMAGE_URL', '/twitter-card-india.png'),
    twitterHandle: validateEnvironmentVariable('VITE_TWITTER_HANDLE', '@CodeCaseIN'),
  },
  
  contact: {
    supportEmail: validateEnvironmentVariable('VITE_CONTACT_EMAIL', 'support@codecase.in'),
    adminEmail: validateEnvironmentVariable('VITE_ADMIN_EMAIL', 'admin@codecase.in'),
    twitterUrl: validateEnvironmentVariable('VITE_TWITTER_URL', 'https://twitter.com/CodeCaseIN'),
    githubUrl: validateEnvironmentVariable('VITE_GITHUB_URL', 'https://github.com/your-username/codecase-detective-academy'),
    linkedinUrl: validateEnvironmentVariable('VITE_LINKEDIN_URL', 'https://linkedin.com/company/codecase-academy'),
  },
  
  gamification: {
    defaultHints: getNumberEnv('VITE_DEFAULT_HINTS', 3),
    pointsPerMission: getNumberEnv('VITE_POINTS_PER_MISSION', 100),
    referralBonus: getNumberEnv('VITE_REFERRAL_BONUS', 100),
  },
};

// Development mode checker
export const isDevelopment = import.meta.env.MODE === 'development';
export const isProduction = import.meta.env.MODE === 'production';
export const isTest = import.meta.env.MODE === 'test';

// Environment validation function
export const validateEnvironment = (): boolean => {
  const requiredVars = [
    'VITE_GA_TRACKING_ID'
  ];
  
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    return false;
  }
  
  console.log('✅ Environment validation passed');
  return true;
};

// Debug function to log environment (only in development)
export const debugEnvironment = (): void => {
  if (isDevelopment) {
    console.log('🌍 Environment Configuration (India):', {
      country: env.app.country,
      timezone: env.app.timezone,
      language: env.app.language,
      currency: env.india.currency,
      defaultCity: env.india.defaultCity,
      features: env.features,
    });
  }
};

// Export individual configurations for easier access
export const appConfig = env.app;
export const firebaseConfig = env.firebase;
export const analyticsConfig = env.analytics;
export const securityConfig = env.security;
export const indiaConfig = env.india;
export const featureFlags = env.features;
export const seoConfig = env.seo;
export const contactConfig = env.contact;
export const gamificationConfig = env.gamification;

export default env;
