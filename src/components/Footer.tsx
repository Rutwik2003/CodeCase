import React from 'react';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

interface FooterProps {
  onLearnClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onLearnClick }) => {
  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-t border-slate-700/50">
      {/* Detective atmosphere overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Detective Agency Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🕵️</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-100">Code<span className="text-amber-400">Case</span></h3>
                <p className="text-sm text-slate-400 font-mono uppercase tracking-wider">Detective Academy</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed max-w-md">
              Master HTML & CSS through elite detective training. Investigate digital crime scenes, 
              decode web mysteries, and become a certified forensic web developer.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => openExternalLink('https://github.com')}
                className="text-slate-400 hover:text-amber-400 transition-colors p-3 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 hover:border-amber-400/50"
                title="GitHub Repository"
              >
                <Github className="w-6 h-6" />
              </button>
              <button 
                onClick={() => openExternalLink('https://twitter.com')}
                className="text-slate-400 hover:text-blue-400 transition-colors p-3 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 hover:border-blue-400/50"
                title="Twitter Updates"
              >
                <Twitter className="w-6 h-6" />
              </button>
              <button 
                onClick={() => openExternalLink('mailto:detective@codecase.dev')}
                className="text-slate-400 hover:text-emerald-400 transition-colors p-3 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 hover:border-emerald-400/50"
                title="Contact Detective HQ"
              >
                <Mail className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Investigation Training */}
          <div>
            <h4 className="text-lg font-bold text-slate-100 mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span>Training</span>
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={onLearnClick}
                  className="text-slate-400 hover:text-amber-300 transition-colors text-left font-medium"
                >
                  HTML Forensics
                </button>
              </li>
              <li>
                <button 
                  onClick={onLearnClick}
                  className="text-slate-400 hover:text-amber-300 transition-colors text-left font-medium"
                >
                  CSS Investigation
                </button>
              </li>
              <li>
                <button 
                  onClick={onLearnClick}
                  className="text-slate-400 hover:text-amber-300 transition-colors text-left font-medium"
                >
                  Responsive Analysis
                </button>
              </li>
              <li>
                <button 
                  onClick={onLearnClick}
                  className="text-slate-400 hover:text-amber-300 transition-colors text-left font-medium"
                >
                  Animation Decoding
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 theme-text-primary">Support</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => alert('Help Center: Visit our learning documentation or ask questions in the community!')}
                  className="theme-text-secondary hover:theme-accent-text transition-colors text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openExternalLink('https://discord.gg/codecase')}
                  className="theme-text-secondary hover:theme-accent-text transition-colors text-left"
                >
                  Community
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openExternalLink('mailto:support@codecase.dev')}
                  className="theme-text-secondary hover:theme-accent-text transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openExternalLink('https://github.com/codecase/issues')}
                  className="text-slate-400 hover:text-blue-300 transition-colors text-left font-medium"
                >
                  Report Evidence
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Detective Badge Footer */}
        <div className="border-t border-slate-700/50 pt-8">
          <div className="bg-gradient-to-r from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-400/30 rounded-xl flex items-center justify-center">
                  <Heart className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-slate-300 text-sm">
                  <span className="font-medium">Built with </span>
                  <span className="text-amber-400 font-mono">detective passion</span>
                  <span className="font-medium"> by <a href="https://github.com/rutwik2003" target="_blank" rel="noopener noreferrer">Rutwik Butani</a></span>
                </p>
              </div>
              <p className="text-slate-400 text-sm font-mono">
                © 2024 CodeCase Detective Academy. All evidence secured.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};