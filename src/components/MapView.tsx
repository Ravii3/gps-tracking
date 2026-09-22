import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/store';
import { Device, LocationRecord } from '../types';
import LeafletMap from './LeafletMap';
import { calculateDistance, formatDistance, getRelativeTime } from '../utils/geo';
import {
  MapPin,
  Smartphone,
  Compass,
  Navigation,
  RefreshCw,
  Layers,
  Radio,
  Clock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function MapView() {
  const [devices, setDevices] = useState<Device[]>(() => StorageService.getDevices());
  const [selectedDeviceId, setSelectedDeviceId] = useState<number>(() => {
    const list = StorageService.getDevices();
    return list.length > 0 ? list[0].id : 101;
  });

  const [locationHistory, setLocationHistory] = useState<LocationRecord[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
    speed?: number | null;
  } | null>(null);

  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadDeviceLocationData = (devId: number) => {
    const locs = StorageService.getLocationsForDevice(devId);
    setLocationHistory(locs);
    if (locs.length > 0) {
      const last = locs[locs.length - 1];
      setCurrentLocation({
        latitude: last.latitude,
        longitude: last.longitude,
        accuracy: last.accuracy,
        timestamp: last.timestamp,
        speed: last.speed,
      });
    } else {
      setCurrentLocation(null);
    }
  };

  useEffect(() => {
    loadDeviceLocationData(selectedDeviceId);
  }, [selectedDeviceId]);

  // Periodic refresh when auto-refresh enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadDeviceLocationData(selectedDeviceId);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedDeviceId, autoRefresh]);

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);

  const distanceTotal = React.useMemo(() => {
    if (locationHistory.length < 2) return 0;
    let dist = 0;
    for (let i = 1; i < locationHistory.length; i++) {
      dist += calculateDistance(
        locationHistory[i - 1].latitude,
        locationHistory[i - 1].longitude,
        locationHistory[i].latitude,
        locationHistory[i].longitude
      );
    }
    return dist;
  }, [locationHistory]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Device Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Dedicated Map Visualizer
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              OpenStreetMap + Leaflet.js real-time device coordinate plotting
            </p>
          </div>
        </div>

        {/* Device Select & Refresh control */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Active Device:
            </label>
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.deviceName} ({d.trackingStatus.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => loadDeviceLocationData(selectedDeviceId)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className="space-y-4">
        <LeafletMap
          currentLocation={currentLocation}
          history={locationHistory}
          isTrackingActive={selectedDevice?.trackingStatus === 'online'}
          height="620px"
          zoom={16}
        />
      </div>

      {/* Coordinates & Telemetry Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Latitude</span>
          <span className="text-sm sm:text-base font-bold font-mono text-slate-800 dark:text-slate-200">
            {currentLocation ? `${currentLocation.latitude.toFixed(6)}°` : '—'}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Longitude</span>
          <span className="text-sm sm:text-base font-bold font-mono text-slate-800 dark:text-slate-200">
            {currentLocation ? `${currentLocation.longitude.toFixed(6)}°` : '—'}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
          <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
            {currentLocation ? `±${Math.round(currentLocation.accuracy)}m` : '—'}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Trail Length</span>
          <span className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">
            {formatDistance(distanceTotal)}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-left col-span-2 md:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Last Update</span>
          <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
            {currentLocation ? getRelativeTime(currentLocation.timestamp) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
