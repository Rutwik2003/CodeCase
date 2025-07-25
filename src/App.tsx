import { useEffect, useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { AppRouter } from './components/AppRouter';
import { ToastManager } from './components/Toast';
import { SEO, seoConfigs } from './components/SEO';
import { GoogleAnalytics } from './utils/analytics';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UnlockSystemProvider } from './contexts/UnlockSystemContext';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

function AppContent() {
  const { resolvedTheme } = useTheme();
  const { userData, completeCase } = useAuth();
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

  const handleCaseComplete = async (caseId: string, score: number, timeSpent: number, hintsUsed: number) => {
    // Update points using the auth context function
    if (completeCase) {
      const result = await completeCase(caseId, score, timeSpent);
      
      // Provide different feedback based on whether points were awarded
      if (result.isRepeat && caseId === 'case-vanishing-blogger') {
        addToast(`Tutorial completed again! No points awarded - complete other cases to earn points.`, 'info');
      } else {
        addToast(`Case ${caseId} completed! Earned ${result.pointsAwarded} points.`, 'success');
      }
    } else {
      addToast(`Case ${caseId} completed! Earned ${score} points.`, 'success');
    }
  };

  return (
    <>
      <SEO {...seoConfigs.home} />
      <GoogleAnalytics />
      <AppRouter 
        availableHints={availableHints}
        addToast={addToast}
        onCaseComplete={handleCaseComplete}
      />
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