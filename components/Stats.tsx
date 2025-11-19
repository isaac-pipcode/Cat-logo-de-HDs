import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { FileItem, Drive } from '../types';

interface StatsProps {
  files: FileItem[];
  drives: Drive[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#ef4444'];

export const Stats: React.FC<StatsProps> = ({ files, drives }) => {
  
  // Process Data for Types Pie Chart
  const typeCount: Record<string, number> = {};
  let totalSize = 0;

  files.forEach(f => {
    typeCount[f.type] = (typeCount[f.type] || 0) + f.size;
    totalSize += f.size;
  });

  const typeData = Object.entries(typeCount).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value, // bytes
    displayValue: (value / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  })).sort((a, b) => b.value - a.value);

  // Process Data for Drives Bar Chart
  const driveData = drives.map(d => ({
    name: d.name,
    sizeGB: parseFloat((d.totalSize / (1024 * 1024 * 1024)).toFixed(2)),
    files: d.totalFiles
  }));

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (files.length === 0) return <div className="text-center text-slate-500 py-10">Nenhum dado para exibir.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Usage by Type */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Uso por Tipo de Arquivo</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                formatter={(value: number) => formatSize(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Usage by Drive */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Tamanho por Disco (GB)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={driveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                cursor={{fill: '#334155', opacity: 0.4}}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
              />
              <Bar dataKey="sizeGB" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tamanho (GB)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
