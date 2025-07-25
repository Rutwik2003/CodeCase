import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HomePage } from './HomePage';
import { TutorialCase } from './TutorialCase';
import { VanishingBloggerCase } from './VanishingBloggerCase';
import { LearnPage } from './LearnPage';
import { AuthPage } from './AuthPage';
import { ProfilePage } from './ProfilePage';
import { CaseInterface } from './CaseInterface';
import { DetectiveCaseInterface } from './DetectiveCaseInterface';
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

function ProfilePageWrapper({ initialTab }: { initialTab?: string }) {
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
function CaseRouteHandler({ availableHints, addToast, onCaseComplete }: Omit<AppRouterProps, 'availableHints'> & { availableHints: number }) {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  
  if (!caseId) {
    return <Navigate to="/" replace />;
  }

  const handleBack = () => navigate('/');

  // Handle different case types
  // For now, just redirect to home for unhandled cases
  return <Navigate to="/" replace />;
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
              availableHints={availableHints}
              addToast={addToast}
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
            <ProfilePageWrapper initialTab="referral" /> : 
            <Navigate to="/signin" replace />
          } 
        />
        <Route 
          path="/profile/achievements" 
          element={
            currentUser ? 
            <ProfilePageWrapper initialTab="achievements" /> : 
            <Navigate to="/signin" replace />
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
