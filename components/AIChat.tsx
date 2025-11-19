import React, { useState } from 'react';
import { MessageSquare, Send, Bot } from 'lucide-react';
import { suggestFileOrganization } from '../services/geminiService';
import { FileItem } from '../types';

interface AIChatProps {
    filesSample: FileItem[];
}

export const AIChat: React.FC<AIChatProps> = ({ filesSample }) => {
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {
        setLoading(true);
        const names = filesSample.map(f => `${f.path} (${(f.size/1024/1024).toFixed(1)}MB)`);
        const res = await suggestFileOrganization(names);
        setResponse(res);
        setLoading(false);
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mt-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Bot className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Assistente de Organização</h2>
            </div>
            
            <p className="text-slate-400 text-sm mb-6">
                O Gemini pode analisar uma amostra dos seus arquivos recentes e sugerir como organizá-los melhor ou identificar o que pode ser lixo.
            </p>

            {!response && (
                <button 
                    onClick={handleAsk}
                    disabled={loading || filesSample.length === 0}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? 'Analisando...' : 'Analisar meus arquivos e sugerir organização'}
                    {!loading && <Send className="w-4 h-4" />}
                </button>
            )}

            {response && (
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-sm text-slate-300 whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto">
                    {response}
                </div>
            )}
        </div>
    );
};
