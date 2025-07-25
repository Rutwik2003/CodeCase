import { useEffect, useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CasesSection } from './components/CasesSection';
import { Footer } from './components/Footer';
import { CaseInterface } from './components/CaseInterface';
import { DetectiveCaseInterface } from './components/DetectiveCaseInterface';
import { VanishingBloggerCase } from './components/VanishingBloggerCase';
import { TutorialCase } from './components/TutorialCase';
import { LearnPage } from './components/LearnPage';
import { ProfilePage } from './components/ProfilePage';
import { AuthPage } from './components/AuthPage';
import { SlideTransition } from './components/PageTransition';
import { ToastManager } from './components/Toast';
import { SEO, seoConfigs } from './components/SEO';
import { GoogleAnalytics } from './utils/analytics';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UnlockSystemProvider } from './contexts/UnlockSystemContext';
import { cases } from './data/cases';

type AppPage = 'home' | 'learn' | 'profile' | 'case' | 'auth';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

function AppContent() {
  const { resolvedTheme, enableAnimations } = useTheme();
  const { userData, currentUser, completeCase } = useAuth();
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [currentCase, setCurrentCase] = useState<string | null>(null);
  const [, setCompletedCases] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  // Hints system state - get from user data or default to 0
  const availableHints = userData?.hints || 0;

  // Toast management functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    // Apply theme class and detective atmosphere
    document.documentElement.className = resolvedTheme;
    document.body.className = 'detective-atmosphere';
  }, [resolvedTheme]);

  // Redirect from auth page if user is already logged in
  useEffect(() => {
    if (currentUser && currentPage === 'auth') {
      setCurrentPage('home');
    }
  }, [currentUser, currentPage]);

  const handleCaseSelect = (caseId: string) => {
    setCurrentCase(caseId);
    setCurrentPage('case');
    // Smooth scroll to top with animation consideration
    window.scrollTo({ 
      top: 0, 
      behavior: enableAnimations ? 'smooth' : 'instant' 
    });
  };

  const handleCaseComplete = async (caseId: string, points: number) => {
    setCompletedCases(prev => [...prev, caseId]);
    setCurrentCase(null);
    setCurrentPage('home');
    
    // Update points using the auth context function
    if (completeCase) {
      const result = await completeCase(caseId, points, 0); // timeSpent can be tracked later if needed
      
      // Provide different feedback based on whether points were awarded
      if (result.isRepeat && caseId === 'case-vanishing-blogger') {
        addToast(`Tutorial completed again! No points awarded - complete other cases to earn points.`, 'info');
      } else {
        addToast(`Case ${caseId} completed! Earned ${result.pointsAwarded} points.`, 'success');
      }
    } else {
      addToast(`Case ${caseId} completed! Earned ${points} points.`, 'success');
    }
  };

  const handleBackToHome = () => {
    setCurrentCase(null);
    setCurrentPage('home');
    // Smooth scroll to top with animation consideration
    window.scrollTo({ 
      top: 0, 
      behavior: enableAnimations ? 'smooth' : 'instant' 
    });
  };

  const handleShowLearnPage = () => {
    setCurrentPage('learn');
    // Smooth scroll to top with animation consideration
    window.scrollTo({ 
      top: 0, 
      behavior: enableAnimations ? 'smooth' : 'instant' 
    });
  };

  const handleShowAuthPage = () => {
    // Don't show auth page if user is already logged in
    if (currentUser) {
      return;
    }
    setCurrentPage('auth');
    window.scrollTo({ 
      top: 0, 
      behavior: enableAnimations ? 'smooth' : 'instant' 
    });
  };

  const handleShowProfilePage = () => {
    setCurrentPage('profile');
    window.scrollTo({ 
      top: 0, 
      behavior: enableAnimations ? 'smooth' : 'instant' 
    });
  };

  const getPageKey = () => {
    switch (currentPage) {
      case 'case':
        return `case-${currentCase}`;
      case 'learn':
        return 'learn';
      case 'profile':
        return 'profile';
      default:
        return 'home';
    }
  };

  // Render page content based on current page
  const renderPageContent = () => {
    switch (currentPage) {
      case 'case':
        if (currentCase) {
          // Special case for the tutorial
          if (currentCase === 'case-vanishing-blogger') {
            return (
              <TutorialCase
                onBack={handleBackToHome}
                onComplete={(points) => handleCaseComplete(currentCase, points)}
              />
            );
          }

          // Special case for the visual investigation game
          if (currentCase === 'visual-vanishing-blogger') {
            return (
              <VanishingBloggerCase
                onBack={handleBackToHome}
                onComplete={(points) => handleCaseComplete(currentCase, points)}
              />
            );
          }

          const caseData = cases.find(c => c.id === currentCase);
          if (caseData) {
            // Check if this is a detective mission
            if (caseData.isDetectiveMission && caseData.cinematicSlides && caseData.missions) {
              return (
                <DetectiveCaseInterface
                  caseData={caseData as any}
                  onBack={handleBackToHome}
                  onComplete={(points) => handleCaseComplete(currentCase, points)}
                />
              );
            } else {
              return (
                <CaseInterface
                  caseData={caseData}
                  onBack={handleBackToHome}
                  onComplete={(points) => handleCaseComplete(currentCase, points)}
                />
              );
            }
          }
        }
        // Fallback to home if case not found
        setCurrentPage('home');
        return null;

      case 'learn':
        return <LearnPage onBack={handleBackToHome} />;

      case 'profile':
        return <ProfilePage onBack={handleBackToHome} />;

      case 'auth':
        return <AuthPage onBack={handleBackToHome} />;

      default:
        return (
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Header 
              availableHints={availableHints}
              onHomeClick={handleBackToHome}
              onLearnClick={handleShowLearnPage} 
              onAuthClick={handleShowAuthPage}
              onProfileClick={handleShowProfilePage}
            />
            <Hero onLearnClick={handleShowLearnPage} />
            <CasesSection onCaseSelect={handleCaseSelect} onLearnClick={handleShowLearnPage} />
            <Footer onLearnClick={handleShowLearnPage} />
          </div>
        );
    }
  };

  // Get SEO config based on current page
  const getSEOConfig = () => {
    switch (currentPage) {
      case 'learn':
        return seoConfigs.learn;
      case 'profile':
        return seoConfigs.profile;
      case 'case':
        switch (currentCase) {
          case 'mission1':
            return seoConfigs.mission1;
          case 'mission2':
            return seoConfigs.mission2;
          case 'vanishing-blogger':
            return seoConfigs.vanishingBlogger;
          default:
            return seoConfigs.cases;
        }
      default:
        return seoConfigs.home;
    }
  };

  const seoConfig = getSEOConfig();

  // Apply motion wrapper if animations are enabled
  if (enableAnimations) {
    return (
      <>
        <SEO {...seoConfig} />
        <GoogleAnalytics />
        <SlideTransition key={getPageKey()}>
          {renderPageContent()}
        </SlideTransition>
        <ToastManager toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  // Return without animations if disabled
  return (
    <>
      <SEO {...seoConfig} />
      <GoogleAnalytics />
      {renderPageContent()}
      <ToastManager toasts={toasts} removeToast={removeToast} />
    </>
  );
}

// Main App component with AuthProvider wrapper
function App() {
  return (
    <AuthProvider>
      <UnlockSystemProvider>
        <AppContent />
      </UnlockSystemProvider>
    </AuthProvider>
  );
}

export default App;