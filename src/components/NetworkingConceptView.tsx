import React, { useState } from 'react';
import {
  Network,
  Radio,
  Smartphone,
  Globe,
  Server,
  Database,
  MapPin,
  ShieldCheck,
  Cpu,
  Wifi,
  TowerControl,
  ArrowRight,
  Code2,
  FileCode,
  Layers,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';

export default function NetworkingConceptView() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const pipelineSteps = [
    {
      id: 1,
      name: '1. GPS Orbit & Satellite Trilateration',
      subtitle: 'Space Segment to Mobile Hardware',
      icon: Radio,
      color: 'blue',
      summary:
        'A constellation of 31 active GPS satellites orbiting Earth at an altitude of ~20,200 km emit atomic-clock synchronized radio signals at 1575.42 MHz (L1 band).',
      detail:
        'The mobile phone contains an integrated GNSS chip. By calculating the Time of Arrival (ToA) of radio signals from at least 4 visible satellites, the device solves four simultaneous sphere equations to compute its precise 3D geographical position: Latitude, Longitude, Altitude, and Receiver Clock Bias.',
      protocol: 'Radio Frequency (L1 / L5 GNSS Signals @ 1.575 GHz)',
      codeSnippet: `// Satellite NMEA-0183 Sentence parsed by GNSS receiver chip:
$GPGGA,123519,2832.7000,N,07711.5560,E,1,08,0.9,218.0,M,46.9,M,,*47
// Computed coordinates:
// Latitude: 28.545000° N
// Longitude: 77.192600° E
// Accuracy: ~8.5 meters (HDOP 0.9)`,
    },
    {
      id: 2,
      name: '2. Mobile Browser W3C Geolocation API',
      subtitle: 'Operating System to Web Application Handshake',
      icon: Smartphone,
      color: 'indigo',
      summary:
        'The web browser bridges the hardware GPS subsystem with the web application through the standardized W3C Geolocation API.',
      detail:
        'Before accessing coordinates, modern browsers enforce strict privacy rules: the website MUST run over HTTPS (or localhost) and the mobile user must tap "Allow". In High Accuracy mode (enableHighAccuracy: true), the browser uses Assisted GPS (A-GPS), leveraging cellular base stations and Wi-Fi SSID trilateration to speed up Time to First Fix (TTFF) from minutes to milliseconds.',
      protocol: 'W3C Geolocation API (HTML5 Navigator Interface)',
      codeSnippet: `navigator.geolocation.watchPosition(
  (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    console.log("GPS Fix Acquired:", latitude, longitude, "±" + accuracy + "m");
    sendLocationToServer(latitude, longitude, accuracy);
  },
  (error) => console.error("GPS Error:", error.message),
  { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
);`,
    },
    {
      id: 3,
      name: '3. Internet Transmission & TCP/IP Protocol Stack',
      subtitle: 'Client Device to Web Server via TCP/IP',
      icon: Globe,
      color: 'sky',
      summary:
        'Coordinates are serialized into a JSON payload and transmitted across the public Internet through physical cellular towers (4G/5G) or Wi-Fi routers.',
      detail:
        'Networking layers involved:\n• Application Layer: HTTP/1.1 or HTTP/2 POST over TLS 1.3 encryption (HTTPS port 443)\n• Transport Layer: TCP (Transmission Control Protocol) guarantees reliable, in-order packet delivery using 3-Way Handshake (SYN -> SYN-ACK -> ACK)\n• Network Layer: IP (Internet Protocol v4/v6) handles logical packet routing across autonomous ISP backbones\n• Data Link & Physical Layer: LTE/5G NR radio frames or 802.11 Wi-Fi frames.',
      protocol: 'HTTPS / TLS 1.3 / TCP / IPv4 / IPv6',
      codeSnippet: `POST /api/save_location.php HTTP/1.1
Host: your-college-server.edu
Content-Type: application/json
Authorization: Bearer session_token_secure_hash
User-Agent: Mozilla/5.0 (Linux; Android 14; Mobile)

{
  "device_id": 101,
  "latitude": 28.545000,
  "longitude": 77.192600,
  "accuracy": 8.5,
  "timestamp": "2026-09-22T04:30:00Z"
}`,
    },
    {
      id: 4,
      name: '4. Web Server & PHP REST Processing',
      subtitle: 'Apache HTTPD & PHP 8.x Runtime',
      icon: Server,
      color: 'amber',
      summary:
        'The Apache web server listens on TCP port 80/443, passes the incoming request to the PHP interpreter, and invokes save_location.php.',
      detail:
        'The PHP script extracts the JSON payload from php://input, checks session authentication to ensure the sender owns the device, validates coordinate boundaries (-90 to +90 lat, -180 to +180 lng), sanitizes numerical values, and prepares an SQL parameterized query to prevent SQL Injection attacks.',
      protocol: 'FastCGI / PHP 8.x PDO Engine',
      codeSnippet: `<?php
// save_location.php
require_once 'db.php';
session_start();

$data = json_decode(file_get_contents('php://input'), true);
$userId = $_SESSION['user_id'];
$deviceId = intval($data['device_id']);
$lat = floatval($data['latitude']);
$lng = floatval($data['longitude']);
$acc = floatval($data['accuracy']);

// Secure Prepared Statement Insertion:
$stmt = $pdo->prepare("INSERT INTO locations (user_id, device_id, latitude, longitude, accuracy) 
                       VALUES (?, ?, ?, ?, ?)");
$stmt->execute([$userId, $deviceId, $lat, $lng, $acc]);
echo json_encode(['status' => 'success', 'code' => 200]);
?>`,
    },
    {
      id: 5,
      name: '5. MySQL Relational Database Persistence',
      subtitle: 'ACID Relational Storage Engine (InnoDB)',
      icon: Database,
      color: 'emerald',
      summary:
        'MySQL securely writes the telemetry record into the `locations` table with an auto-incrementing primary key and foreign-key link to `devices`.',
      detail:
        'Coordinates are stored with DECIMAL(10, 8) precision, providing spatial resolution down to approximately 1.1 millimeters on Earth surface. B-tree indexes on (device_id, timestamp) allow instantaneous lookups when retrieving recent trails or historical playback.',
      protocol: 'MySQL Client/Server Binary Protocol (TCP port 3306)',
      codeSnippet: `-- MySQL Schema and Indexed Lookup:
SELECT id, latitude, longitude, accuracy, timestamp 
FROM locations 
WHERE device_id = 101 
ORDER BY timestamp DESC 
LIMIT 1;

-- Returns latest record in ~1.2ms using B-Tree index:
-- 4, 28.545000, 77.192600, 8.5, '2026-09-22 04:30:00'`,
    },
    {
      id: 6,
      name: '6. Dashboard Retrieval & Leaflet Map Rendering',
      subtitle: 'Client Display & Vector Cartography',
      icon: MapPin,
      color: 'violet',
      summary:
        'The tracking dashboard polls or streams new coordinates via AJAX, rendering the live position on OpenStreetMap using Leaflet.js.',
      detail:
        'Leaflet requests raster map tiles from OpenStreetMap tile servers (e.g. 256x256 PNGs based on Web Mercator projection EPSG:3857). It places a custom SVG radar marker and draws a dynamic SVG circle representing the accuracy radius in meters, then connects waypoints into a polyline breadcrumb trail.',
      protocol: 'HTTP GET Tile Requests + DOM Vector Rendering',
      codeSnippet: `// Leaflet coordinate update in dashboard.html:
const newLatLng = new L.LatLng(lat, lng);
marker.setLatLng(newLatLng);
accuracyCircle.setLatLng(newLatLng).setRadius(accuracy);
map.panTo(newLatLng);
trailPolyline.addLatLng(newLatLng);`,
    },
  ];

  const glossaryItems = [
    {
      term: 'GPS (Global Positioning System)',
      icon: Radio,
      category: 'Satellite Telemetry',
      definition:
        'A satellite-based radio navigation system owned by the United States government (and operated by the US Space Force). It uses atomic clock time differences from 24+ orbiting satellites to determine device latitude, longitude, altitude, and velocity without requiring any cellular data.',
      roleInProject:
        'Generates raw geographical coordinates on the mobile phone hardware.',
    },
    {
      term: 'IP Address (Internet Protocol Address)',
      icon: Globe,
      category: 'Logical Addressing',
      definition:
        'A unique numerical label (e.g. 192.168.1.45 or 142.250.190.46) assigned to every device connected to a computer network. IP addresses route data packets across the Internet. IP Geolocation is coarse (city/ISP level, ~5-20km error) and CANNOT provide exact phone street coordinates.',
      roleInProject:
        'Routes HTTP packets between mobile phone and server. Demonstrates why GPS (high precision) is needed instead of IP lookup.',
    },
    {
      term: 'Mobile Network (Cellular / 4G / 5G)',
      icon: TowerControl,
      category: 'Wireless WAN',
      definition:
        'A radio communication network distributed over land areas called cells, each served by at least one fixed-location transceiver known as a cell site or base station (eNodeB / gNodeB).',
      roleInProject:
        'Provides Internet connectivity when the user is outdoors away from Wi-Fi, and provides Cell-ID assistance for A-GPS.',
    },
    {
      term: 'Wi-Fi (IEEE 802.11)',
      icon: Wifi,
      category: 'Wireless LAN',
      definition:
        'A family of wireless network protocols based on IEEE 802.11 standards, commonly used for local area networking of devices and Internet access via a wireless router.',
      roleInProject:
        'Provides fast local network connection to transmit JSON telemetry packets to the server. Wi-Fi BSSID scanning also assists indoor positioning where GPS satellite signals are blocked by roofs.',
    },
    {
      term: 'The Internet',
      icon: Network,
      category: 'Global Network of Networks',
      definition:
        'The global system of interconnected computer networks that uses the Internet protocol suite (TCP/IP) to link billions of devices worldwide. It consists of private, public, academic, business, and government networks.',
      roleInProject:
        'The transmission medium that transports HTTP POST coordinate packets from the mobile user to the tracking server.',
    },
    {
      term: 'Web Server (Apache / Nginx)',
      icon: Server,
      category: 'Software Daemon',
      definition:
        'Server software that satisfies client requests on the World Wide Web. In XAMPP, Apache HTTPD listens on TCP port 80/443, handles incoming HTTP connections, and executes PHP server-side scripts.',
      roleInProject:
        'Accepts incoming location telemetry API requests and serves the HTML, CSS, JS frontend assets.',
    },
    {
      term: 'Database (MySQL)',
      icon: Database,
      category: 'Relational Storage',
      definition:
        'An organized collection of data stored and accessed electronically from a computer system. MySQL is an open-source relational database management system (RDBMS) utilizing Structured Query Language (SQL).',
      roleInProject:
        'Persistently stores user authentication credentials, registered device IDs, and time-stamped geographical coordinates for historical trail analysis.',
    },
  ];

  const currentStepData = pipelineSteps.find((s) => s.id === activeStep) || pipelineSteps[0];
  const StepIcon = currentStepData.icon;

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
          <Network className="w-3.5 h-3.5 text-blue-600" />
          BTech Networking Syllabus Section
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How GPS Mobile Tracking Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          An interactive, step-by-step engineering walkthrough of the entire networking pipeline:
          from satellite trilateration in orbit down through TCP/IP sockets to Apache, PHP, and MySQL.
        </p>
      </div>

      {/* Visual Pipeline Navigator */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            const isSelected = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold opacity-80">Step {step.id}</span>
                </div>
                <div className="font-semibold text-xs truncate">{step.name.split('. ')[1]}</div>
              </button>
            );
          })}
        </div>

        {/* Detailed Step Explainer Box */}
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <StepIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentStepData.name}
                </h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  {currentStepData.subtitle}
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono">
              Protocol: {currentStepData.protocol}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/60 text-xs sm:text-sm text-blue-950 dark:text-blue-200 leading-relaxed font-medium">
                {currentStepData.summary}
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {currentStepData.detail}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Implementation Code / Packet View:</span>
                <span className="font-mono text-[10px]">Source Inspection</span>
              </div>
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto leading-relaxed max-h-[300px]">
                {currentStepData.codeSnippet}
              </pre>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                activeStep === 1
                  ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700'
              }`}
            >
              Previous Phase
            </button>
            <span className="text-xs text-slate-500">
              Step {activeStep} of {pipelineSteps.length}
            </span>
            <button
              onClick={() => setActiveStep((prev) => Math.min(pipelineSteps.length, prev + 1))}
              disabled={activeStep === pipelineSteps.length}
              className={`px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition ${
                activeStep === pipelineSteps.length ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              Next Phase
            </button>
          </div>
        </div>
      </div>

      {/* Networking Glossary / Fundamental Differences Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Core Networking Concept Comparisons
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Vital distinctions required for BTech Networking viva, exams, and project evaluation:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {glossaryItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.term}
                    </h3>
                    <span className="text-[10px] font-semibold uppercase text-slate-400">
                      {item.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.definition}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:divide-slate-800 text-xs">
                  <strong className="text-blue-600 dark:text-blue-400 font-semibold block mb-0.5">
                    Role in This Project:
                  </strong>
                  <span className="text-slate-500 dark:text-slate-400">{item.roleInProject}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
