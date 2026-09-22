import React from 'react';
import {
  Navigation,
  ShieldCheck,
  Radio,
  MapPin,
  ArrowRight,
  Database,
  Server,
  Smartphone,
  Globe,
  Compass,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  Code2,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HomeViewProps {
  onStartTracking: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function HomeView({ onStartTracking, setActiveTab }: HomeViewProps) {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 bg-gradient-to-b from-blue-50/70 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 px-6 sm:px-12 shadow-sm">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
            <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
            BTech Networking & Web Systems Capstone Project
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            GPS Mobile Phone <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">
              Tracking System
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A real-time, consent-based telemetry system demonstrating how{' '}
            <strong className="text-slate-900 dark:text-white font-semibold">
              GPS, browser Geolocation, TCP/IP networking, PHP REST services, and MySQL
            </strong>{' '}
            collaborate to capture, transmit, and plot live mobile coordinates onto interactive Leaflet maps.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="hero-btn-start-tracking"
              onClick={onStartTracking}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Navigation className="w-5 h-5" />
              <span>Start Tracking Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              id="hero-btn-how-it-works"
              onClick={() => setActiveTab('networking')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base border border-slate-300 dark:border-slate-700 shadow-sm transition"
            >
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>How It Works (Networking)</span>
            </button>

            <button
              id="hero-btn-view-code"
              onClick={() => setActiveTab('sourcecode')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm border border-slate-200 dark:border-slate-800 transition"
            >
              <Code2 className="w-4 h-4 text-amber-500" />
              <span>XAMPP / PHP Source Code</span>
            </button>
          </div>

          {/* Technical Specs Pill Grid */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-3 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Geolocation
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                W3C Geolocation API
              </span>
            </div>
            <div className="p-3 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Mapping Engine
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Leaflet.js + OSM
              </span>
            </div>
            <div className="p-3 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Backend Services
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                PHP 8.x PDO REST
              </span>
            </div>
            <div className="p-3 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Storage
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                MySQL Relational DB
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Networking & Telemetry Flow Overview */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            End-to-End Networking Architecture
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            How mobile coordinates travel from orbital satellites across the Internet into MySQL and your screen:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <Smartphone className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            <h3 className="font-semibold text-xs text-slate-900 dark:text-white">Mobile Device</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              GPS receiver trilaterates orbital signals to compute (Lat, Lng).
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <ShieldCheck className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            <h3 className="font-semibold text-xs text-slate-900 dark:text-white">User Consent</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Browser Geolocation API asks user for explicit location permission.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-300 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <Globe className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            <h3 className="font-semibold text-xs text-slate-900 dark:text-white">Internet & TCP/IP</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              AJAX / Fetch API dispatches HTTP POST payload over cellular / Wi-Fi.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <Server className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            <h3 className="font-semibold text-xs text-slate-900 dark:text-white">PHP Backend</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Apache/PHP receives payload, validates tokens, and executes PDO queries.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
              5
            </div>
            <Database className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            <h3 className="font-semibold text-xs text-slate-900 dark:text-white">MySQL Storage</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Indexed tables record device timestamp, accuracy, speed, and coordinates.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 flex items-center justify-center font-bold text-sm">
              6
            </div>
            <MapPin className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            <h3 className="font-semibold text-xs text-slate-900 dark:text-white">Leaflet Map</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Dashboard plots live pulsing radar pins and historical breadcrumb paths.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Key Academic & Engineering Features
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Engineered strictly for college project syllabus requirements, security guidelines, and viva defense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-blue-400 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Real-Time High-Accuracy GPS
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Leverages <code className="text-xs bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">navigator.geolocation.watchPosition</code> with <code className="text-xs bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">enableHighAccuracy: true</code>. Calculates confidence radius in meters.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-blue-400 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              OpenStreetMap + Leaflet Engine
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Interactive vector rendering with radar pulse animations, dynamic accuracy boundaries, layer switching (Street, Voyager, Satellite), and trail history.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-blue-400 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Strict Consent & Privacy Ethics
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Zero covert spyware or SIM snooping. Tracking starts exclusively when the mobile owner taps "Start Location Sharing" and can be stopped instantly with 1-click.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-blue-400 transition">
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Haversine Distance Calculation
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Calculates great-circle distance between coordinate waypoints using spherical trigonometry, measuring total route length and point-to-point intervals.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-blue-400 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Relational MySQL Database
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Complete foreign-key relational schema (<code className="text-xs">users</code>, <code className="text-xs">devices</code>, <code className="text-xs">locations</code>, <code className="text-xs">admins</code>) with bcrypt password hashing and CSV export.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-blue-400 transition">
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Role-Based Admin Dashboard
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Dedicated administrator portal to inspect registered devices, active telemetry streams, total stored records, and audit logs.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy and Ethics Commitment Banner */}
      <section className="p-6 sm:p-8 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded-xl shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-amber-900 dark:text-amber-200">
              Ethical & Consent-Based Project Design Notice
            </h4>
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/90 leading-relaxed">
              This application strictly follows W3C privacy mandates and networking ethics. It does <strong>not</strong> implement illicit SIM tracking, IMEI interception, or silent background spyware. Location coordinates are acquired only when the device user explicitly grants browser permission.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
