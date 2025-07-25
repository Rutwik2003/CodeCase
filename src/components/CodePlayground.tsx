import React, { useState, useMemo } from 'react';
import { Copy, Check, ExternalLink, Code, Monitor, SplitSquareHorizontal } from 'lucide-react';

interface CodePlaygroundProps {
  title: string;
  html: string;
  css: string;
  copyToClipboard: (code: string, id: string) => void;
  copiedCode: string | null;
}

type ViewMode = 'code' | 'preview' | 'split';

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  title,
  html,
  css,
  copyToClipboard,
  copiedCode
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  const currentCode = activeTab === 'html' ? html : css;
  const codeId = `${title}-${activeTab}`;

  // Calculate dynamic height based on code content
  const dynamicHeight = useMemo(() => {
    const lines = currentCode.split('\n').length;
    const minHeight = 400; // Minimum height in pixels
    const maxHeight = 800; // Maximum height in pixels
    const lineHeight = 20; // Approximate height per line in pixels
    
    const calculatedHeight = Math.max(minHeight, Math.min(maxHeight, lines * lineHeight + 32)); // +32 for padding
    return calculatedHeight;
  }, [currentCode]);

  const openInNewTab = () => {
    const previewContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - Preview</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            ${css}
          </style>
        </head>
        <body>${html}</body>
      </html>
    `;
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(previewContent);
      newWindow.document.close();
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-lg overflow-hidden shadow-2xl">
      {/* Header - Detective style */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center space-x-4">
          <h4 className="font-semibold text-white text-lg">{title}</h4>
          <div className="flex items-center space-x-1 bg-slate-700/50 backdrop-blur-sm rounded-lg p-1 border border-slate-600/30">
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center space-x-1 ${
                activeTab === 'html'
                  ? 'bg-gradient-to-r from-orange-600/80 to-orange-500/80 text-white shadow-lg shadow-orange-500/25'
                  : 'text-slate-300 hover:bg-slate-600/50 backdrop-blur-sm'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>HTML</span>
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center space-x-1 ${
                activeTab === 'css'
                  ? 'bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-300 hover:bg-slate-600/50 backdrop-blur-sm'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>CSS</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 bg-slate-700/50 backdrop-blur-sm px-2 py-1 rounded border border-slate-600/30">
            {currentCode.split('\n').length} lines
          </span>
          
          {/* View Mode Selector */}
          <div className="flex items-center space-x-1 bg-slate-700/50 backdrop-blur-sm rounded-lg p-1 border border-slate-600/30">
            <button
              onClick={() => setViewMode('code')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'code'
                  ? 'bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:bg-slate-600/50 backdrop-blur-sm'
              }`}
              title="Code Only"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'preview'
                  ? 'bg-gradient-to-r from-emerald-600/80 to-emerald-500/80 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:bg-slate-600/50 backdrop-blur-sm'
              }`}
              title="Preview Only"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'split'
                  ? 'bg-gradient-to-r from-purple-600/80 to-purple-500/80 text-white shadow-lg shadow-purple-500/25'
                  : 'text-slate-400 hover:bg-slate-600/50 backdrop-blur-sm'
              }`}
              title="Split View"
            >
              <SplitSquareHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={openInNewTab}
            className="p-2 bg-slate-700/50 backdrop-blur-sm text-slate-300 rounded-md hover:bg-slate-600/60 transition-colors border border-slate-600/30"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => copyToClipboard(currentCode, codeId)}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white rounded-md hover:from-blue-500/90 hover:to-blue-400/90 transition-all shadow-lg shadow-blue-500/25 backdrop-blur-sm"
          >
            {copiedCode === codeId ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-sm">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-sm">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div 
        className="flex bg-slate-800/20 backdrop-blur-lg border border-slate-600/30 rounded-lg overflow-hidden shadow-xl shadow-slate-900/20"
        style={{ height: `${dynamicHeight}px` }}
      >
        {/* Code Editor */}
        {(viewMode === 'code' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} border-r border-slate-600/30 overflow-hidden`}>
            <div className="h-full overflow-auto custom-scrollbar bg-slate-900/70 backdrop-blur-sm">
              <pre className="p-4 text-slate-100 text-sm leading-6 min-h-full m-0 whitespace-pre font-mono">
                <code className="block">{currentCode}</code>
              </pre>
            </div>
          </div>
        )}
        
        {/* Live Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} bg-white/90 backdrop-blur-sm`}>
            <div className="p-2 bg-slate-700/60 backdrop-blur-sm text-xs text-slate-300 font-medium border-b border-slate-600/30 flex items-center justify-between">
              <span>Live Preview</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400/70 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400/70 rounded-full"></div>
                <div className="w-2 h-2 bg-green-400/70 rounded-full"></div>
              </div>
            </div>
            <div className="overflow-auto custom-scrollbar bg-white/95 backdrop-blur-sm" style={{ height: `${dynamicHeight - 32}px` }}>
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                        ${css}
                      </style>
                    </head>
                    <body>${html}</body>
                  </html>
                `}
                className="w-full h-full border-none"
                title="Code Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};