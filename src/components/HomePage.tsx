import React from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { CasesSection } from './CasesSection';
import { Footer } from './Footer';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const { userData } = useAuth();
  const availableHints = userData?.hints || 0;

  const handleCaseSelect = (caseId: string) => {
    // Navigate to case using the router
    window.location.href = `/case/${caseId}`;
  };

  const handleShowLearnPage = () => {
    // Navigate to learn page using the router
    window.location.href = '/training';
  };

  const handleShowAuthPage = () => {
    // Navigate to auth page using the router
    window.location.href = '/signin';
  };

  const handleShowProfilePage = () => {
    // Navigate to profile page using the router
    window.location.href = '/profile';
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
