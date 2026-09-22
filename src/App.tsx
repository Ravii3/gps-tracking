import React, { useState, useEffect } from 'react';
import { ActiveTab, User } from './types';
import { StorageService } from './services/store';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import DashboardView from './components/DashboardView';
import MapView from './components/MapView';
import HistoryView from './components/HistoryView';
import NetworkingConceptView from './components/NetworkingConceptView';
import AdminView from './components/AdminView';
import ProjectDocsView from './components/ProjectDocsView';
import SourceCodeView from './components/SourceCodeView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import {
  ShieldCheck,
  Radio,
  MapPin,
  ExternalLink,
  Layers,
  Heart,
  BookOpen,
  Code2,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    StorageService.getCurrentUser()
  );
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Check tracking active status across devices
  const isTrackingActive = React.useMemo(() => {
    const devices = StorageService.getDevices();
    return devices.some((d) => d.trackingStatus === 'online');
  }, [activeTab]);

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        isTrackingActive={isTrackingActive}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'home' && (
          <HomeView
            onStartTracking={() => setActiveTab('dashboard')}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={
              currentUser || {
                id: 1,
                name: 'Guest Student',
                mobile: '+91 98765 43210',
                email: 'rahul@college.edu',
                username: 'rahul_sharma',
                role: 'user',
                createdAt: new Date().toISOString(),
              }
            }
            onNavigateToMap={() => setActiveTab('map')}
            onNavigateToHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'map' && <MapView />}

        {activeTab === 'history' && <HistoryView />}

        {activeTab === 'networking' && <NetworkingConceptView />}

        {activeTab === 'admin' && <AdminView />}

        {activeTab === 'docs' && <ProjectDocsView />}

        {activeTab === 'sourcecode' && <SourceCodeView />}

        {activeTab === 'login' && (
          <LoginView
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setActiveTab('dashboard');
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'register' && (
          <RegisterView
            onRegisterSuccess={(user) => {
              setCurrentUser(user);
              setActiveTab('dashboard');
            }}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Academic Project Footer */}
      <footer className="mt-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Project Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-base">
                  GPS Mobile Tracking
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                BTech Networking and Computer Science Academic Project demonstrating GPS trilateration, W3C Geolocation API, OpenStreetMap, and Apache/PHP/MySQL on XAMPP.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Strict User Consent Model</span>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Application Pages
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="hover:text-blue-600 transition"
                  >
                    Home Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="hover:text-blue-600 transition"
                  >
                    Live Telemetry Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="hover:text-blue-600 transition"
                  >
                    Dedicated Leaflet Map
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="hover:text-blue-600 transition"
                  >
                    Historical Waypoint Records
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="hover:text-blue-600 transition"
                  >
                    Admin Console Plane
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Academic & Networking Modules */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Technical Syllabus
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button
                    onClick={() => setActiveTab('networking')}
                    className="hover:text-blue-600 transition flex items-center gap-1"
                  >
                    <span>How GPS Tracking Works</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('docs')}
                    className="hover:text-blue-600 transition flex items-center gap-1"
                  >
                    <span>Project Documentation & DFD</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('sourcecode')}
                    className="hover:text-blue-600 transition flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold"
                  >
                    <span>XAMPP, PHP & SQL Code</span>
                  </button>
                </li>
                <li>
                  <span className="text-slate-400">Haversine Distance Algorithm</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Technology Badges */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Stack Components
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                  OpenStreetMap
                </span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                  Leaflet.js 1.9
                </span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                  PHP 8.x PDO
                </span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                  MySQL 8 / InnoDB
                </span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                  W3C Geolocation
                </span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                  XAMPP Localhost
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              GPS Mobile Phone Tracking System • BTech Networking Academic Project
            </div>
            <div className="flex items-center gap-4">
              <span>Licensed for Academic Defense & Evaluation</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
