import React, { useState } from 'react';
import { Search, Badge, Terminal, BookOpen, Menu, X, Home, User, LogOut, Star, Users, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyLoginModal } from './DailyLoginModal';
import { EnhancedReferralModal } from './EnhancedReferralModal';

interface HeaderProps {
  onLearnClick?: () => void;
  onHomeClick?: () => void;
  onAuthClick?: () => void;
  onProfileClick?: () => void;
  availableHints?: number; // Add hints prop
}

export const Header: React.FC<HeaderProps> = ({ 
  onLearnClick, 
  onHomeClick,
  onAuthClick,
  onProfileClick,
  availableHints = 0 // Default to 0 hints
}) => {
  const { currentUser, userData, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDailyLoginModalOpen, setIsDailyLoginModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleMobileNavClick = (action?: () => void) => {
    if (action) action();
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Detective Command Bar Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 backdrop-blur-xl border-b border-slate-700/50"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-blue-500/5"></div>
      
      <div className="relative z-10 max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="flex items-center justify-between w-full">
          {/* CodeCase Icon + Title - Left Side */}
          <div className="flex items-center space-x-4 flex-shrink-0 min-w-[280px]">
            <motion.div 
              className="flex items-center cursor-pointer group" 
              onClick={handleLogoClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <motion.div
                  className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-3"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="w-8 h-8 text-amber-400 drop-shadow-lg" />
                </motion.div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50"></div>
                <Terminal className="w-5 h-5 text-blue-400 absolute -bottom-1 -right-1 drop-shadow-lg" />
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col cursor-pointer group" 
              onClick={handleLogoClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h1 className="text-xl md:text-2xl font-bold text-slate-100 group-hover:text-amber-100 transition-colors">
                Code<span className="text-amber-400">Case</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-400 font-mono uppercase tracking-wider">Detective Academy</p>
            </motion.div>
          </div>
          
          {/* Center Navigation Menu - Full width and equal buttons */}
          <nav className="hidden lg:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-5">
              <motion.button 
                onClick={onHomeClick}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-3 text-slate-300 hover:text-amber-300 transition-colors font-medium px-10 py-3 rounded-lg hover:bg-slate-800/30 border border-transparent hover:border-amber-400/20 w-[200px] h-[48px] whitespace-nowrap"
              >
                <Home className="w-4 h-4 flex-shrink-0" />
                <span>Command Center</span>
              </motion.button>
              <motion.button 
                onClick={() => scrollToSection('cases')}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-3 text-slate-300 hover:text-amber-300 transition-colors font-medium px-10 py-3 rounded-lg hover:bg-slate-800/30 border border-transparent hover:border-amber-400/20 w-[200px] h-[48px] whitespace-nowrap"
              >
                <Terminal className="w-4 h-4" />
                <span>Active Cases</span>
              </motion.button>
              <motion.button 
                onClick={onLearnClick}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-3 text-slate-300 hover:text-amber-300 transition-colors font-medium px-10 py-3 rounded-lg hover:bg-slate-800/30 border border-transparent hover:border-amber-400/20 w-[200px] h-[48px] whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4" />
                <span>Training</span>
              </motion.button>
            </div>
          </nav>
          
          {/* Right Side - Detective Status & Action Buttons - Full width usage */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0 min-w-[420px] justify-end">
            {/* Detective Status Panel - Only show if user is logged in */}
            {currentUser && (
              <div className="flex items-center space-x-2">
                {/* Investigation Points */}
                <motion.div 
                  className="flex items-center justify-center space-x-2 bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-lg w-[90px] h-[44px]"
                  whileHover={{ scale: 1.05, y: -1 }}
                >
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-mono text-slate-300">
                    {userData?.totalPoints?.toLocaleString() || '0'}
                  </span>
                </motion.div>

                {/* Available Hints */}
                <motion.div 
                  className="flex items-center justify-center space-x-2 bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-lg w-[70px] h-[44px]"
                  whileHover={{ scale: 1.05, y: -1 }}
                >
                  <Badge className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-mono text-slate-300">
                    {userData?.hints || '0'}
                  </span>
                </motion.div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pl-3 border-l border-slate-600/30">
              {/* Daily Login Streak Button */}
              {currentUser && (
                <motion.button
                  onClick={() => setIsDailyLoginModalOpen(true)}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 hover:border-orange-400/50 transition-all rounded-lg w-[80px] h-[44px]"
                  title="Daily Login Streak"
                >
                  <span className="text-lg">🎯</span>
                  <span className="text-sm font-mono text-orange-300">
                    {userData?.loginStreak || '12'}
                  </span>
                </motion.button>
              )}

              {/* Referral Code Button */}
              {currentUser && (
                <motion.button
                  onClick={() => setIsReferralModalOpen(true)}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/50 transition-all rounded-lg w-[80px] h-[44px]"
                  title="Use Referral Code"
                >
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-purple-300">Refer</span>
                </motion.button>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center border-l border-slate-600/30 pl-3">
              {currentUser ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 150)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-amber-400/30 backdrop-blur-sm rounded-lg w-[160px] h-[44px] px-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center border border-amber-400/30">
                      <User className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-left flex-1">
                      <span className="text-sm font-medium text-slate-100 block truncate">
                        {userData?.displayName || currentUser.displayName || 'test'}
                      </span>
                      <span className="text-xs text-slate-400">Detective</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                
                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="py-2">
                        <motion.button
                          onClick={() => {
                            onProfileClick?.();
                            setIsProfileDropdownOpen(false);
                          }}
                          whileHover={{ backgroundColor: 'rgba(148, 163, 184, 0.1)' }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-slate-300 hover:text-amber-300 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>View Profile</span>
                        </motion.button>
                        
                        <div className="h-px bg-slate-600/30 mx-2"></div>
                        
                        <motion.button
                          onClick={() => {
                            logout();
                            setIsProfileDropdownOpen(false);
                          }}
                          whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-400 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  onClick={onAuthClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all w-[160px] h-[44px]"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              whileTap={{ scale: 0.95 }}
              className="theme-text-primary focus:outline-none p-2 theme-hover-bg rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu with animations */}
        <motion.div
          initial={false}
          animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-2 space-y-2 theme-border-t mt-4">
            {onHomeClick && (
              <button 
                onClick={() => handleMobileNavClick(onHomeClick)}
                className="flex items-center space-x-2 w-full text-left theme-text-secondary hover:theme-accent-text transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
            )}
            <button 
              onClick={() => handleMobileNavClick(onHomeClick)}
              className="block w-full text-left theme-text-secondary hover:theme-accent-text transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover"
            >
              Cases
            </button>
            <button 
              onClick={() => handleMobileNavClick(onLearnClick)}
              className="flex items-center space-x-2 w-full text-left theme-text-secondary hover:theme-accent-text transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover"
            >
              <BookOpen className="w-4 h-4" />
              <span>Learn</span>
            </button>
            
            {/* Mobile Profile Button */}
            {currentUser && (
              <button 
                onClick={() => handleMobileNavClick(onProfileClick)}
                className="flex items-center space-x-2 w-full text-left theme-text-secondary hover:theme-accent-text transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            )}
            
            {/* Mobile Auth Button */}
            {!currentUser && (
              <button 
                onClick={() => handleMobileNavClick(onAuthClick)}
                className="flex items-center space-x-2 w-full text-left theme-text-secondary hover:theme-accent-text transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
            
            {/* Mobile Daily Login Button */}
            {currentUser && (
              <button 
                onClick={() => {
                  setIsDailyLoginModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full text-left theme-text-secondary hover:theme-accent-text transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover"
              >
                <span className="text-lg">🎯</span>
                <span>Daily Login ({userData?.loginStreak || 0} days)</span>
              </button>
            )}
            
            {/* Mobile Referral Button */}
            {currentUser && (
              <button 
                onClick={() => {
                  setIsReferralModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full text-left theme-text-secondary hover:theme-accent-text transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover"
              >
                <Users className="w-4 h-4" />
                <span>Use Referral Code</span>
              </button>
            )}
            
            {/* Mobile Hints Display - Only show if user is logged in */}
            {currentUser && (
              <div className="flex items-center justify-center pt-2 theme-border-t">
                <div className="flex items-center space-x-2">
                  <Badge className="w-5 h-5 theme-accent-text" />
                  <span className="text-sm font-medium theme-text-secondary">{userData?.hints || 0} Hints</span>
                </div>
              </div>
            )}
            
            {/* Mobile Logout Button - At Bottom */}
            {currentUser && (
              <div className="pt-4 mt-4 border-t border-slate-600/30">
                <button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left text-red-400 hover:text-red-300 transition-colors py-3 px-2 rounded-lg hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Modals */}
      <DailyLoginModal 
        isOpen={isDailyLoginModalOpen}
        onClose={() => setIsDailyLoginModalOpen(false)}
      />
      
      <EnhancedReferralModal 
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />
    </header>
  );
};