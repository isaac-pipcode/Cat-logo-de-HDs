import React, { useRef, useState } from 'react';
import { HardDrive, Loader2, FolderInput } from 'lucide-react';
import { addDriveAndFiles } from '../services/db';

interface DriveImporterProps {
  onImportComplete: () => void;
}

export const DriveImporter: React.FC<DriveImporterProps> = ({ onImportComplete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [driveName, setDriveName] = useState('');

  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!driveName) {
        alert("Por favor, dê um nome ao disco antes de importar.");
        return;
    }

    setLoading(true);
    try {
      await addDriveAndFiles(driveName, files);
      setDriveName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      onImportComplete();
    } catch (error) {
      console.error("Error importing drive:", error);
      alert("Erro ao importar arquivos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
        <HardDrive className="w-6 h-6 text-blue-400" />
        Adicionar Novo Disco
      </h2>
      <p className="text-slate-400 mb-4 text-sm">
        Selecione a pasta raiz de um HD externo, Pen Drive ou uma pasta do sistema para catalogar.
        Os metadados serão salvos no seu navegador.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-1/3">
          <label className="block text-xs font-medium text-slate-400 mb-1">Nome do Disco / Rótulo</label>
          <input 
            type="text" 
            value={driveName}
            onChange={(e) => setDriveName(e.target.value)}
            placeholder="Ex: HD Externo Backup, Pen Drive 32GB..."
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="w-full sm:w-auto">
           <input
            type="file"
            ref={fileInputRef}
            // @ts-ignore: webkitdirectory is not standard React HTML attribute but works
            webkitdirectory=""
            directory=""
            multiple
            className="hidden"
            onChange={handleFolderSelect}
            id="folder-input"
          />
          <label 
            htmlFor="folder-input"
            className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
              loading 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            style={{pointerEvents: loading || !driveName ? 'none' : 'auto', opacity: loading || !driveName ? 0.5 : 1}}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FolderInput className="w-5 h-5" />}
            {loading ? 'Catalogando...' : 'Selecionar Pasta/Drive'}
          </label>
        </div>
      </div>
      {loading && (
        <p className="text-xs text-yellow-500 mt-2 animate-pulse">
          Isso pode levar alguns minutos dependendo da quantidade de arquivos. Por favor, não feche a aba.
        </p>
      )}
    </div>
  );
};
