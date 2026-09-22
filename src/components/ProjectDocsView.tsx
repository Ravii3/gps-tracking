import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Layers,
  Database,
  Globe,
  Radio,
  ShieldCheck,
  Cpu,
  Bookmark,
  Award,
} from 'lucide-react';

export default function ProjectDocsView() {
  const [activeSection, setActiveSection] = useState<string>('intro');

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { id: 'intro', title: '1. Introduction & Abstract' },
    { id: 'problem', title: '2. Problem Statement' },
    { id: 'objectives', title: '3. Objectives of the Project' },
    { id: 'technologies', title: '4. Technologies Used' },
    { id: 'architecture', title: '5. System Architecture & DFD' },
    { id: 'gps_working', title: '6. GPS Working Principle' },
    { id: 'networking', title: '7. Networking Concept' },
    { id: 'db_design', title: '8. Database Design & ER Diagram' },
    { id: 'modules', title: '9. System Modules' },
    { id: 'advantages', title: '10. Advantages & Limitations' },
    { id: 'future', title: '11. Future Scope' },
    { id: 'conclusion', title: '12. Conclusion' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[11px] font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            BTech Project Report & Viva Reference
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Project Information & Academic Documentation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comprehensive system documentation for academic evaluation, project defense, and viva voce
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xs transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Main Documentation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 sticky top-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 block">
            Table of Contents
          </span>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSection(s.id);
                document.getElementById(`doc-sec-${s.id}`)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeSection === s.id
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Content Sheet */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-10 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {/* 1. Introduction */}
          <section id="doc-sec-intro" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800">
              1. Introduction & Abstract
            </h2>
            <p>
              In contemporary telecommunications and distributed software architectures, Location-Based Services (LBS) form the core of emergency response systems, logistics tracking, public transit telemetry, and navigation.
            </p>
            <p>
              The <strong>GPS Mobile Phone Tracking System</strong> is an end-to-end web engineering project designed for BTech Networking and Computer Science curriculum. It demonstrates how modern handheld devices acquire precise orbital satellite positioning coordinates, establish authenticated socket/HTTP sessions across the public Internet, and transmit telemetry records to an Apache web server executing PHP and MySQL.
            </p>
            <p>
              Crucially, this system operates on a <strong>strict consent-based model</strong> compliant with international data privacy guidelines (GDPR, IT Act 2000 Section 43A). Tracking is active exclusively when the mobile phone holder grants explicit browser permission.
            </p>
          </section>

          {/* 2. Problem Statement */}
          <section id="doc-sec-problem" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800">
              2. Problem Statement
            </h2>
            <p>
              Traditional hardware GPS tracking devices (OBD trackers, vehicle transponders) require dedicated GSM SIM modules, proprietary firmware, and costly infrastructure. On the other hand, non-technical users often fall victim to fraudulent claims that a phone can be traced solely by its telephone number or through covert spyware.
            </p>
            <p>
              There is an academic need for a transparent, educational, and robust system that:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>Demonstrates real-time client-to-server coordinate transmission without proprietary native apps.</li>
              <li>Educates students on the difference between Satellite GPS, IP Geolocation, Cellular Towers, and Wi-Fi SSID trilateration.</li>
              <li>Enforces ethical transparency, showing users when their coordinates are being transmitted and providing instantaneous termination controls.</li>
            </ul>
          </section>

          {/* 3. Objectives */}
          <section id="doc-sec-objectives" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800">
              3. Objectives of the Project
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="block text-slate-900 dark:text-white mb-1">1. High-Precision Acquisition</strong>
                Extract device latitude, longitude, and accuracy radius via browser Geolocation API.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="block text-slate-900 dark:text-white mb-1">2. Network Packet Transmission</strong>
                Serialize coordinate packets into JSON payloads and send via asynchronous Fetch/AJAX HTTP POST requests.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="block text-slate-900 dark:text-white mb-1">3. Relational Storage</strong>
                Persist telemetry in normalized MySQL tables with foreign keys and bcrypt password encryption.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="block text-slate-900 dark:text-white mb-1">4. Interactive Map Plotting</strong>
                Plot live radar positions and historic breadcrumb trails on OpenStreetMap using Leaflet.js.
              </div>
            </div>
          </section>

          {/* 4. Technologies Used */}
          <section id="doc-sec-technologies" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800">
              4. Technologies Used
            </h2>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                <span><strong>Frontend Presentation:</strong> HTML5, CSS3, JavaScript (ES6+), Tailwind CSS</span>
                <span className="font-mono text-slate-500">Client-Side</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                <span><strong>Mapping & Cartography:</strong> Leaflet.js v1.9.4 with OpenStreetMap raster tiles</span>
                <span className="font-mono text-slate-500">GIS Engine</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                <span><strong>Backend Runtime:</strong> PHP 8.x with PDO (PHP Data Objects) and prepared statements</span>
                <span className="font-mono text-slate-500">Server API</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                <span><strong>Database Engine:</strong> MySQL 5.7+ / 8.0+ / MariaDB with InnoDB engine</span>
                <span className="font-mono text-slate-500">RDBMS</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                <span><strong>Development Environment:</strong> XAMPP Stack (Apache, MySQL, PHP, phpMyAdmin)</span>
                <span className="font-mono text-slate-500">Localhost</span>
              </div>
            </div>
          </section>

          {/* 5. System Architecture */}
          <section id="doc-sec-architecture" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800">
              5. System Architecture & Data Flow Diagram (DFD)
            </h2>
            <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono text-xs overflow-x-auto">
{`+-----------------------+       +-------------------------+       +------------------------+
| 31 GPS Satellites     | ===== | Mobile GNSS Hardware    | ===== | Mobile Web Browser     |
| (Orbit Alt: 20,200km) |  RF   | (NMEA Sentence Decoder) |  API  | (W3C Geolocation Spec) |
+-----------------------+       +-------------------------+       +------------------------+
                                                                               ||
                                                                               || HTTP POST (JSON)
                                                                               \\/
+-----------------------+       +-------------------------+       +------------------------+
| Leaflet.js & OSM Map  | <==== | PHP REST Controller     | <==== | Public Internet        |
| (Dashboard UI Screen) | Polling| (save_location.php)    |       | (TCP/IP & TLS 1.3)     |
+-----------------------+       +-------------------------+       +------------------------+
                                            ||
                                            || PDO Prepared SQL
                                            \\/
                                +-------------------------+
                                | MySQL Database (InnoDB) |
                                | (gps_tracking_system)   |
                                +-------------------------+`}
            </div>
          </section>

          {/* 6. GPS Working */}
          <section id="doc-sec-gps_working" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800">
              6. GPS Working Principle
            </h2>
            <p>
              The Global Positioning System relies on <strong>Trilateration</strong>. Each satellite continuously broadcasts its orbital position (ephemeris) and current time derived from onboard cesium/rubidium atomic clocks.
            </p>
            <p>
              When a receiver captures signals from 4 or more satellites:
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200">
              Distance (di) = Speed of Light (c) × (Time_Received - Time_Sent)
            </div>
            <p className="text-xs">
              Because 4 unknowns exist (Latitude x, Longitude y, Altitude z, and Clock Error Δt), receiving at least 4 satellite signals allows solving 4 simultaneous quadratic equations to fix the mobile's exact location.
            </p>
          </section>

          {/* 7. Networking Concept */}
          <section id="doc-sec-networking" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800">
              7. Networking Concept
            </h2>
            <p>
              The transmission of coordinate packets follows the classic 5-Layer Internet Protocol Suite:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Application Layer:</strong> HTTP/1.1 POST /api/save_location.php with Content-Type: application/json.</li>
              <li><strong>Transport Layer:</strong> TCP (Transmission Control Protocol) establishes a reliable connection via 3-way handshake (SYN, SYN-ACK, ACK), guaranteeing zero packet loss.</li>
              <li><strong>Network Layer:</strong> IPv4/IPv6 packetizes data into datagrams with source/destination addresses.</li>
              <li><strong>Data Link / Physical Layer:</strong> IEEE 802.11 (Wi-Fi) or 3GPP 4G LTE/5G NR radio frequency frames.</li>
            </ul>
          </section>

          {/* 8. Database Design */}
          <section id="doc-sec-db_design" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800">
              8. Database Design & Relational Tables
            </h2>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <strong className="text-blue-600 block mb-1">Table: users</strong>
                <code>id (PK), name, mobile, email, username, password_hash, created_at</code>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <strong className="text-blue-600 block mb-1">Table: devices</strong>
                <code>id (PK), user_id (FK), device_name, device_identifier, tracking_status, last_seen, created_at</code>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <strong className="text-blue-600 block mb-1">Table: locations</strong>
                <code>id (PK), user_id (FK), device_id (FK), latitude, longitude, accuracy, timestamp</code>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <strong className="text-blue-600 block mb-1">Table: admins</strong>
                <code>id (PK), username, password_hash, created_at</code>
              </div>
            </div>
          </section>

          {/* 9. Modules */}
          <section id="doc-sec-modules" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800">
              9. System Modules
            </h2>
            <ol className="list-decimal pl-5 space-y-1 text-xs">
              <li><strong>Authentication & Security Module:</strong> Registration with bcrypt password hashing and session authorization.</li>
              <li><strong>Telemetry Harvester Module:</strong> W3C Geolocation polling with highAccuracy option and permission error dispatchers.</li>
              <li><strong>REST API Gateway:</strong> PHP scripts handling coordinate ingestion, validation, and JSON serialization.</li>
              <li><strong>GIS Visualizer:</strong> Leaflet.js engine with custom pulsing radar markers and accuracy circles.</li>
              <li><strong>Historical Playback & Analytics:</strong> Historical coordinate table with CSV export and Haversine distance calculator.</li>
              <li><strong>Administrator Dashboard:</strong> Central telemetry console for device status and audit records.</li>
            </ol>
          </section>

          {/* 10. Advantages & Limitations */}
          <section id="doc-sec-advantages" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800">
              10. Advantages & Limitations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <strong className="text-emerald-800 dark:text-emerald-300 block mb-1">Key Advantages:</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-emerald-900 dark:text-emerald-200">
                  <li>Zero app installation required (runs across Chrome, Safari, Firefox).</li>
                  <li>Complete transparency with ethical consent-first privacy.</li>
                  <li>Lightweight OpenStreetMap integration with no recurring commercial map API billing.</li>
                  <li>Open-source XAMPP architecture (PHP & MySQL).</li>
                </ul>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <strong className="text-amber-800 dark:text-amber-300 block mb-1">System Limitations:</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-amber-900 dark:text-amber-200">
                  <li>Indoor GPS reception is degraded by concrete and metal roofs.</li>
                  <li>Browser tab must remain active or backgrounded without being purged by mobile OS battery saver.</li>
                  <li>Requires HTTPS in production as modern browsers block Geolocation on plain HTTP (except localhost).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 11. Future Scope */}
          <section id="doc-sec-future" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800">
              11. Future Scope
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Geofencing Alerts:</strong> Triggering automated SMS/Email alerts when a device leaves a defined circular boundary.</li>
              <li><strong>WebSocket Duplex Streaming:</strong> Replacing AJAX polling with Socket.io / Ratchet WebSockets for sub-100ms latency.</li>
              <li><strong>Progressive Web App (PWA):</strong> Installing as an offline-first mobile app with Background Sync service workers.</li>
              <li><strong>Speed & Heading Analytics:</strong> Integrating Kalman filter algorithms to smooth coordinate jitter.</li>
            </ul>
          </section>

          {/* 12. Conclusion */}
          <section id="doc-sec-conclusion" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800">
              12. Conclusion
            </h2>
            <p>
              The <strong>GPS Mobile Phone Tracking System</strong> successfully achieves all design goals outlined in the BTech networking project curriculum. By integrating browser Geolocation APIs, TCP/IP networking, RESTful PHP backend endpoints, MySQL persistence, and Leaflet vector mapping, it demonstrates a complete, secure, and production-ready telemetry pipeline.
            </p>
            <p>
              The system reinforces critical engineering values: user consent, privacy compliance, prepared query defense against SQL Injection, and responsive UI design across desktop, tablet, and mobile displays.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
