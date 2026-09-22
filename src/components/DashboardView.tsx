import React, { useState, useEffect, useRef } from 'react';
import { User, Device, LocationRecord, GPSStatus, TelemetryPacket } from '../types';
import { StorageService } from '../services/store';
import { calculateDistance, formatDistance, getRelativeTime } from '../utils/geo';
import LeafletMap from './LeafletMap';
import {
  Navigation,
  Play,
  Square,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  MapPin,
  Send,
  Smartphone,
  Layers,
  Sparkles,
  Wifi,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Maximize2,
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  onNavigateToMap: () => void;
  onNavigateToHistory: () => void;
}

export default function DashboardView({
  currentUser,
  onNavigateToMap,
  onNavigateToHistory,
}: DashboardViewProps) {
  const [device, setDevice] = useState<Device>(() =>
    StorageService.getCurrentDevice(currentUser)
  );

  const [history, setHistory] = useState<LocationRecord[]>(() =>
    StorageService.getLocationsForDevice(device.id)
  );

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
    speed?: number | null;
  } | null>(() => {
    const latest = StorageService.getLatestLocationForDevice(device.id);
    if (!latest) return null;
    return {
      latitude: latest.latitude,
      longitude: latest.longitude,
      accuracy: latest.accuracy,
      timestamp: latest.timestamp,
      speed: latest.speed,
    };
  });

  const [gpsStatus, setGpsStatus] = useState<GPSStatus>('idle');
  const [isSharing, setIsSharing] = useState(false);
  const [trackingMode, setTrackingMode] = useState<'live' | 'simulation'>('live');
  const [recentPackets, setRecentPackets] = useState<TelemetryPacket[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Ready. Click "Start Location Sharing" to initiate GPS session.'
  );

  const watchIdRef = useRef<number | null>(null);
  const simTimerRef = useRef<any>(null);

  // Sync latest location from store on mount
  useEffect(() => {
    const dev = StorageService.getCurrentDevice(currentUser);
    setDevice(dev);
    const locs = StorageService.getLocationsForDevice(dev.id);
    setHistory(locs);
    if (locs.length > 0) {
      const last = locs[locs.length - 1];
      setCurrentLocation({
        latitude: last.latitude,
        longitude: last.longitude,
        accuracy: last.accuracy,
        timestamp: last.timestamp,
        speed: last.speed,
      });
    }
  }, [currentUser]);

  // Clean up watchers on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (simTimerRef.current !== null) {
        clearInterval(simTimerRef.current);
      }
    };
  }, []);

  // Total distance covered in history
  const totalDistance = React.useMemo(() => {
    if (history.length < 2) return 0;
    let dist = 0;
    for (let i = 1; i < history.length; i++) {
      dist += calculateDistance(
        history[i - 1].latitude,
        history[i - 1].longitude,
        history[i].latitude,
        history[i].longitude
      );
    }
    return dist;
  }, [history]);

  // Transmit location to storage / simulated PHP backend
  const handleLocationUpdate = (
    latitude: number,
    longitude: number,
    accuracy: number,
    speed?: number | null,
    heading?: number | null,
    altitude?: number | null
  ) => {
    const res = StorageService.saveLocation({
      userId: currentUser.id,
      deviceId: device.id,
      latitude,
      longitude,
      accuracy,
      speed,
      heading,
      altitude,
    });

    if (res.success) {
      setCurrentLocation({
        latitude: res.record.latitude,
        longitude: res.record.longitude,
        accuracy: res.record.accuracy,
        timestamp: res.record.timestamp,
        speed: res.record.speed,
      });

      setHistory((prev) => [...prev, res.record]);
      setRecentPackets((prev) => [res.packet, ...prev.slice(0, 9)]);
      setStatusMessage(`Coordinates transmitted successfully via HTTP POST (${res.packet.id})`);
    }
  };

  // Start Location Sharing (Real GPS Browser API)
  const startLiveTracking = () => {
    if (!navigator.geolocation) {
      setGpsStatus('unavailable');
      setStatusMessage('Error: Geolocation API is not supported in this browser.');
      return;
    }

    setGpsStatus('requesting');
    setStatusMessage('Requesting GPS location permission from mobile browser...');

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    // First do a quick getCurrentPosition to trigger browser consent modal and verify
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsStatus('active');
        setIsSharing(true);
        setStatusMessage('GPS lock acquired. Continuous real-time location stream active.');

        handleLocationUpdate(
          pos.coords.latitude,
          pos.coords.longitude,
          pos.coords.accuracy,
          pos.coords.speed,
          pos.coords.heading,
          pos.coords.altitude
        );

        // Start watchPosition for continuous updates
        const id = navigator.geolocation.watchPosition(
          (watchPos) => {
            handleLocationUpdate(
              watchPos.coords.latitude,
              watchPos.coords.longitude,
              watchPos.coords.accuracy,
              watchPos.coords.speed,
              watchPos.coords.heading,
              watchPos.coords.altitude
            );
          },
          (err) => {
            handleGeoError(err);
          },
          geoOptions
        );
        watchIdRef.current = id;
      },
      (err) => {
        handleGeoError(err);
      },
      geoOptions
    );
  };

  // Simulated Campus Walk / Drive (moves coordinates step by step)
  const startSimulatedTracking = () => {
    setGpsStatus('active');
    setIsSharing(true);
    setStatusMessage('Campus Walk simulation active (generating GPS coordinates at 3s intervals).');

    // Starting coordinate (campus area or current point)
    let currentLat = currentLocation ? currentLocation.latitude : 28.545;
    let currentLng = currentLocation ? currentLocation.longitude : 77.1926;

    simTimerRef.current = setInterval(() => {
      // Small realistic walking delta (~10 to 20 meters step)
      const latDelta = (Math.random() - 0.3) * 0.00035;
      const lngDelta = (Math.random() - 0.2) * 0.00045;
      currentLat += latDelta;
      currentLng += lngDelta;
      const accuracy = 6 + Math.random() * 8; // high accuracy 6-14 meters
      const speed = 1.2 + Math.random() * 0.8;

      handleLocationUpdate(currentLat, currentLng, accuracy, speed, 75, 220);
    }, 3500);
  };

  const handleStartSharing = () => {
    if (trackingMode === 'live') {
      startLiveTracking();
    } else {
      startSimulatedTracking();
    }
  };

  const handleStopSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (simTimerRef.current !== null) {
      clearInterval(simTimerRef.current);
      simTimerRef.current = null;
    }
    setIsSharing(false);
    setGpsStatus('stopped');
    StorageService.updateDeviceStatus(device.id, 'offline');
    setStatusMessage('Location sharing halted. Device is now Offline.');
  };

  const handleGeoError = (err: GeolocationPositionError) => {
    setIsSharing(false);
    if (err.code === err.PERMISSION_DENIED) {
      setGpsStatus('denied');
      setStatusMessage(
        'Permission Denied: User did not grant browser location access. Please allow location in browser settings, or switch to "Simulated Campus Walk" to test.'
      );
    } else if (err.code === err.POSITION_UNAVAILABLE) {
      setGpsStatus('unavailable');
      setStatusMessage(
        'Location Unavailable: GPS hardware or network positioning could not get a satellite fix.'
      );
    } else {
      setGpsStatus('unavailable');
      setStatusMessage('GPS Acquisition Timeout: Fix took too long.');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome & Device Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back, {currentUser.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              User ID #{currentUser.id}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <Smartphone className="w-3.5 h-3.5 text-blue-500" />
              {device.deviceName} ({device.deviceIdentifier})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              IP: {device.ipAddress || '192.168.1.45'}
            </span>
          </div>
        </div>

        {/* Device Status Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              isSharing
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isSharing ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span>Tracking Status: {isSharing ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
        </div>
      </div>

      {/* Main Location Sharing Control Card */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-3xl border border-blue-200/80 dark:border-blue-950/80 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-600 text-white">
                Consent-Based Telemetry Control
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                W3C Geolocation Handshake
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {isSharing ? 'Transmitting Live Coordinates' : 'Start Sharing Device Location'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When activated, your device acquires geographical coordinates via GPS/Wi-Fi/Cellular services and sends HTTP POST packets to the PHP backend every few seconds to record in MySQL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {!isSharing ? (
              <button
                id="btn-start-location-sharing"
                onClick={handleStartSharing}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Location Sharing</span>
              </button>
            ) : (
              <button
                id="btn-stop-location-sharing"
                onClick={handleStopSharing}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Square className="w-5 h-5 fill-current" />
                <span>Stop Location Sharing</span>
              </button>
            )}
          </div>
        </div>

        {/* Mode Selector & Status Notice */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Input Source:
            </span>
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setTrackingMode('live')}
                disabled={isSharing}
                className={`text-xs font-medium px-3 py-1 rounded-lg transition ${
                  trackingMode === 'live'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                } ${isSharing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Live Device GPS (Browser)
              </button>
              <button
                onClick={() => setTrackingMode('simulation')}
                disabled={isSharing}
                className={`text-xs font-medium px-3 py-1 rounded-lg transition ${
                  trackingMode === 'simulation'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                } ${isSharing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Simulated Campus Walk
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            {isSharing ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Active ({trackingMode === 'live' ? 'Real Hardware GPS' : 'Campus Walk Simulation'})</span>
              </span>
            ) : gpsStatus === 'denied' ? (
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Permission Denied by User</span>
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">
                Ready for user trigger
              </span>
            )}
          </div>
        </div>

        {/* Status Message Alert */}
        <div className="p-3 bg-white/80 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="truncate">{statusMessage}</span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latitude Card */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Current Latitude
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {currentLocation ? `${currentLocation.latitude.toFixed(6)}°` : '— — —'}
          </div>
          <span className="text-[10px] text-slate-400">
            {currentLocation ? (currentLocation.latitude >= 0 ? 'North (+)' : 'South (-)') : 'Awaiting fix'}
          </span>
        </div>

        {/* Longitude Card */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Current Longitude
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {currentLocation ? `${currentLocation.longitude.toFixed(6)}°` : '— — —'}
          </div>
          <span className="text-[10px] text-slate-400">
            {currentLocation ? (currentLocation.longitude >= 0 ? 'East (+)' : 'West (-)') : 'Awaiting fix'}
          </span>
        </div>

        {/* Accuracy Card */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Location Accuracy
          </span>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
            <span>{currentLocation ? `±${Math.round(currentLocation.accuracy)}` : '— —'}</span>
            <span className="text-xs font-normal text-slate-500">meters</span>
          </div>
          <span
            className={`text-[10px] font-semibold ${
              currentLocation && currentLocation.accuracy <= 15
                ? 'text-emerald-600'
                : 'text-amber-500'
            }`}
          >
            {currentLocation
              ? currentLocation.accuracy <= 15
                ? 'High Accuracy Fix'
                : 'Medium Accuracy Fix'
              : 'Unknown accuracy'}
          </span>
        </div>

        {/* Last Updated Time */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Last Updated
          </span>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {currentLocation ? getRelativeTime(currentLocation.timestamp) : 'Never'}
          </div>
          <span className="text-[10px] text-slate-400 truncate block">
            {currentLocation
              ? new Date(currentLocation.timestamp).toLocaleTimeString()
              : 'Session inactive'}
          </span>
        </div>
      </div>

      {/* Interactive Map & Telemetry Packet Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map Preview (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Interactive Tracking Map
              </h3>
              <span className="text-xs text-slate-500">Leaflet.js + OpenStreetMap</span>
            </div>
            <button
              onClick={onNavigateToMap}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Full Screen View</span>
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <LeafletMap
            currentLocation={currentLocation}
            history={history}
            isTrackingActive={isSharing}
            height="420px"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>Trail Points Recorded: {history.length}</span>
            <span>Estimated Distance: {formatDistance(totalDistance)}</span>
          </div>
        </div>

        {/* Live Network Telemetry Inspector (1 col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Network Telemetry Log
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">HTTP/1.1 POST</span>
          </div>

          <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 font-mono text-xs space-y-3 h-[420px] overflow-y-auto">
            <div className="text-[11px] text-slate-400 pb-2 border-b border-slate-800">
              // Live HTTP Request & MySQL Transmission Monitor
            </div>

            {recentPackets.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No telemetry packets transmitted yet.
                <br />
                Click "Start Location Sharing" to dispatch HTTP POST packets.
              </div>
            ) : (
              recentPackets.map((pkt) => (
                <div
                  key={pkt.id}
                  className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold">200 OK</span>
                    <span className="text-indigo-300 font-bold">{pkt.id}</span>
                    <span className="text-slate-400">{pkt.durationMs}ms</span>
                  </div>
                  <div className="text-slate-300 truncate">
                    POST {pkt.endpoint}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Lat: {pkt.payload.latitude.toFixed(5)}° | Lng: {pkt.payload.longitude.toFixed(5)}°
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Accuracy: ±{pkt.payload.accuracy}m | Device: #{pkt.payload.deviceId}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
