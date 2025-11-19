import React, { useState, useEffect } from 'react';
import { DriveImporter } from './components/DriveImporter';
import { FileExplorer } from './components/FileExplorer';
import { Stats } from './components/Stats';
import { AIChat } from './components/AIChat';
import { db } from './services/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { LayoutDashboard, Database, FolderSearch } from 'lucide-react';
import { FileItem } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'explorer'>('dashboard');
  
  const drives = useLiveQuery(() => db.drives.toArray(), []);
  // Get a small sample for stats/AI to avoid heavy load on first render if DB is huge
  const filesSample = useLiveQuery(() => db.files.limit(1000).toArray(), []); 
  // Note: In a real production app with millions of rows, we would aggregate counts using db.files.count() separately.
  
  // We need all files for accurate charts, but let's limit to 5000 for performance in this demo structure
  // or fetch them when the stats component mounts.
  const allFilesForStats = useLiveQuery(() => db.files.toArray(), []);

  const handleImportComplete = () => {
    // Trigger any necessary refreshes
    // Dexie useLiveQuery handles this automatically
  };

  const totalSize = drives?.reduce((acc, curr) => acc + curr.totalSize, 0) || 0;
  const totalFiles = drives?.reduce((acc, curr) => acc + curr.totalFiles, 0) || 0;

  const formatTotalSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb > 1000) return (gb / 1024).toFixed(2) + ' TB';
    return gb.toFixed(2) + ' GB';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                HD Catalog
              </span>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button 
                 onClick={() => setActiveTab('explorer')}
                 className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${activeTab === 'explorer' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                <FolderSearch className="w-4 h-4" />
                <span className="hidden sm:inline">Explorar Arquivos</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Discos Catalogados</p>
                  <h3 className="text-4xl font-bold text-white">{drives?.length || 0}</h3>
               </div>
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Armazenado</p>
                  <h3 className="text-4xl font-bold text-white">{formatTotalSize(totalSize)}</h3>
               </div>
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"></div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Arquivos Indexados</p>
                  <h3 className="text-4xl font-bold text-white">{totalFiles.toLocaleString()}</h3>
               </div>
            </div>

            <DriveImporter onImportComplete={handleImportComplete} />
            
            {allFilesForStats && drives && (
               <>
                 <Stats files={allFilesForStats} drives={drives} />
                 <AIChat filesSample={allFilesForStats.slice(0, 200)} />
               </>
            )}
          </div>
        )}

        {activeTab === 'explorer' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 h-full">
            <FileExplorer drives={drives || []} />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
