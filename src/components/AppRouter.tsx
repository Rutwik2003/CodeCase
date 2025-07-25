import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HomePage } from './HomePage';
import { TutorialCase } from './TutorialCase';
import { VanishingBloggerCase } from './VanishingBloggerCase';
import { LearnPage } from './LearnPage';
import { AuthPage } from './AuthPage';
import { ProfilePage } from './ProfilePage';
import { NotFoundPage } from './NotFoundPage';

interface AppRouterProps {
  availableHints: number;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onCaseComplete: (caseId: string, score: number, timeSpent: number, hintsUsed: number) => void;
}

// Create wrapper components that provide navigate function
function AuthPageWrapper() {
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  
  return <AuthPage onBack={handleBack} />;
}

function LearnPageWrapper() {
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  
  return <LearnPage onBack={handleBack} />;
}

function ProfilePageWrapper() {
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  
  return <ProfilePage onBack={handleBack} />;
}

function TutorialCaseWrapper({ onCaseComplete }: { onCaseComplete: (caseId: string, score: number, timeSpent: number, hintsUsed: number) => void }) {
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  
  const handleComplete = (points: number) => {
    onCaseComplete('case-tutorial', points, 0, 0);
  };
  
  return (
    <TutorialCase 
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
}

function VanishingBloggerWrapper({ onCaseComplete }: { onCaseComplete: (caseId: string, score: number, timeSpent: number, hintsUsed: number) => void }) {
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  
  const handleComplete = (points: number) => {
    onCaseComplete('case-vanishing-blogger', points, 0, 0);
  };
  
  return (
    <VanishingBloggerCase 
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
}

// Helper component to handle dynamic case routes
function CaseRouteHandler({ onCaseComplete }: { onCaseComplete: (caseId: string, score: number, timeSpent: number, hintsUsed: number) => void }) {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  
  if (!caseId) {
    return <Navigate to="/" replace />;
  }

  const handleBack = () => navigate('/');

  // Handle different case types dynamically
  switch (caseId) {
    case 'case-vanishing-blogger':
      return (
        <TutorialCaseWrapper 
          onCaseComplete={onCaseComplete}
        />
      );
    case 'visual-vanishing-blogger':
      return (
        <VanishingBloggerWrapper 
          onCaseComplete={onCaseComplete}
        />
      );
    case 'case-2':
    case 'case-3':
    case 'case-4':
    case 'case-5':
      // For future cases, you can add specific components here
      // For now, show a "Coming Soon" message
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-white mb-4">Case Coming Soon!</h1>
            <p className="text-slate-300 mb-6">This case is under development.</p>
            <button 
              onClick={handleBack}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
            >
              Return to Cases
            </button>
          </div>
        </div>
      );
    default:
      return <Navigate to="/" replace />;
  }
}

export function AppRouter({ availableHints, addToast, onCaseComplete }: AppRouterProps) {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/training" element={<LearnPageWrapper />} />
        
        {/* Auth Routes */}
        <Route 
          path="/signin" 
          element={
            currentUser ? 
            <Navigate to="/profile" replace /> : 
            <AuthPageWrapper />
          } 
        />
        <Route 
          path="/signup" 
          element={
            currentUser ? 
            <Navigate to="/profile" replace /> : 
            <AuthPageWrapper />
          } 
        />

        {/* Case Routes */}
        <Route 
          path="/tutorialcase" 
          element={
            <TutorialCaseWrapper 
              onCaseComplete={onCaseComplete}
            />
          } 
        />
        <Route 
          path="/vanishingblogger" 
          element={
            <VanishingBloggerWrapper 
              onCaseComplete={onCaseComplete}
            />
          } 
        />
        <Route 
          path="/case/:caseId" 
          element={
            <CaseRouteHandler 
              onCaseComplete={onCaseComplete}
            />
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/profile" 
          element={
            currentUser ? 
            <ProfilePageWrapper /> : 
            <Navigate to="/signin" replace />
          } 
        />
        <Route 
          path="/profile/referral" 
          element={
            currentUser ? 
            <ProfilePageWrapper /> : 
            <Navigate to="/signin" replace />
          } 
        />
        <Route 
          path="/profile/achievements" 
          element={
            currentUser ? 
            <ProfilePageWrapper /> : 
            <Navigate to="/signin" replace />
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
