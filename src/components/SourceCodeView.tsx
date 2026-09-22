import React, { useState } from 'react';
import { SOURCE_FILES, SourceFile } from '../data/sourceFiles';
import {
  FileCode,
  Copy,
  Check,
  Download,
  FolderArchive,
  Terminal,
  Server,
  Database,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function SourceCodeView() {
  const [selectedFile, setSelectedFile] = useState<SourceFile>(SOURCE_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Frontend (HTML/CSS/JS)', 'Backend (PHP)', 'Database (MySQL)', 'Documentation'];

  const filteredFiles =
    activeCategory === 'All'
      ? SOURCE_FILES
      : SOURCE_FILES.filter((f) => f.category === activeCategory);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllText = () => {
    // Generate a single consolidated bundle file containing all files separated by headers
    let bundle = `================================================================================\n`;
    bundle += `BTECH NETWORKING PROJECT: GPS MOBILE PHONE TRACKING SYSTEM\n`;
    bundle += `PROJECT ARCHIVE BUNDLE - COMPLETE SEPARATED FILES\n`;
    bundle += `================================================================================\n\n`;

    SOURCE_FILES.forEach((f) => {
      bundle += `\n################################################################################\n`;
      bundle += `### FILE: ${f.name} [${f.category}]\n`;
      bundle += `### DESC: ${f.description}\n`;
      bundle += `################################################################################\n\n`;
      bundle += f.code;
      bundle += `\n\n`;
    });

    const blob = new Blob([bundle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gps_mobile_tracking_system_full_source.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[11px] font-semibold uppercase tracking-wider">
            <FolderArchive className="w-3.5 h-3.5 text-blue-600" />
            Complete Project Files & Source Code
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            XAMPP Backend & Standalone Source Files
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            All 18 standalone project files required for the BTech submission: PHP scripts, MySQL schema, HTML pages, CSS, and JS
          </p>
        </div>

        <button
          onClick={handleDownloadAllText}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
        >
          <Download className="w-4 h-4" />
          <span>Download All Files (.txt Bundle)</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeCategory === cat
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: File List + Code Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: File Explorer */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Project Explorer ({filteredFiles.length})</span>
            <span>Type</span>
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 dark:border-blue-700 shadow-2xs'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileCode
                        className={`w-4 h-4 ${
                          isSelected
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      />
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {file.name}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                        file.name.endsWith('.php')
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : file.name.endsWith('.sql')
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : file.name.endsWith('.html')
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : file.name.endsWith('.css')
                          ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {file.name.split('.').pop()?.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 pl-6">
                    {file.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Code Viewer & Actions */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl border border-slate-800 shadow-md overflow-hidden flex flex-col">
          {/* Top Code Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-xs font-bold text-slate-200">
                {selectedFile.name}
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                ({selectedFile.code.split('\n').length} lines)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownloadSingle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save File</span>
              </button>
            </div>
          </div>

          {/* Description snippet */}
          <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800 text-xs text-slate-400">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider mr-2">Purpose:</span>
            {selectedFile.description}
          </div>

          {/* Code Viewer Body */}
          <div className="p-5 font-mono text-xs text-slate-200 overflow-x-auto max-h-[600px] leading-relaxed">
            <pre>
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* XAMPP Deployment Instructions Guide */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              How to Deploy in XAMPP (Localhost Evaluation)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Step-by-step instructions for running this project on Windows, macOS, or Linux using XAMPP
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              1
            </span>
            <strong className="block text-slate-900 dark:text-white">Folder Setup</strong>
            <p className="text-slate-600 dark:text-slate-400">
              Create folder: <br />
              <code className="bg-slate-200 dark:bg-slate-900 px-1 py-0.5 rounded text-[11px]">
                C:\xampp\htdocs\gps_tracking_system\
              </code>
              <br />
              Save the HTML, CSS, JS, and PHP files into this folder.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              2
            </span>
            <strong className="block text-slate-900 dark:text-white">Start Services</strong>
            <p className="text-slate-600 dark:text-slate-400">
              Open <strong>XAMPP Control Panel</strong>. Click <strong>Start</strong> next to both <strong>Apache</strong> and <strong>MySQL</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              3
            </span>
            <strong className="block text-slate-900 dark:text-white">Import MySQL Database</strong>
            <p className="text-slate-600 dark:text-slate-400">
              Visit <code className="bg-slate-200 dark:bg-slate-900 px-1 py-0.5 rounded">http://localhost/phpmyadmin</code>, click <strong>Import</strong>, select <code className="bg-slate-200 dark:bg-slate-900 px-1 py-0.5 rounded">schema.sql</code>, and click <strong>Go</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              4
            </span>
            <strong className="block text-slate-900 dark:text-white">Launch & Track</strong>
            <p className="text-slate-600 dark:text-slate-400">
              Open your browser and visit: <br />
              <code className="text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                http://localhost/gps_tracking_system/index.html
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
