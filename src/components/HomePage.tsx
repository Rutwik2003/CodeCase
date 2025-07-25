import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Hero } from './Hero';
import { CasesSection } from './CasesSection';
import { Footer } from './Footer';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const availableHints = userData?.hints || 0;

  const handleCaseSelect = (caseId: string) => {
    // Check if user is authenticated before starting investigation
    if (!currentUser) {
      const shouldLogin = window.confirm(
        "You need to login or register to start an investigation. Would you like to go to the login page?"
      );
      if (shouldLogin) {
        navigate('/signin');
      }
      return;
    }

    // Navigate to appropriate case route dynamically
    switch (caseId) {
      case 'case-vanishing-blogger':
        navigate('/tutorialcase');
        break;
      case 'visual-vanishing-blogger':
        navigate('/vanishingblogger');
        break;
      default:
        // For future cases, use dynamic routing
        navigate(`/case/${caseId}`);
        break;
    }
  };

  const handleShowLearnPage = () => {
    navigate('/training');
  };

  const handleShowAuthPage = () => {
    navigate('/signin');
  };

  const handleShowProfilePage = () => {
    navigate('/profile');
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header 
        availableHints={availableHints}
        onHomeClick={handleHomeClick}
        onLearnClick={handleShowLearnPage} 
        onAuthClick={handleShowAuthPage}
        onProfileClick={handleShowProfilePage}
      />
      <Hero onLearnClick={handleShowLearnPage} />
      <CasesSection onCaseSelect={handleCaseSelect} onLearnClick={handleShowLearnPage} />
      <Footer onLearnClick={handleShowLearnPage} />
    </div>
  );
};
