import React, { useState, useMemo } from 'react';
import { StorageService } from '../services/store';
import { LocationRecord, Device } from '../types';
import { calculateDistance, formatDistance, formatTimestamp } from '../utils/geo';
import LeafletMap from './LeafletMap';
import {
  History,
  Download,
  Search,
  MapPin,
  Calendar,
  Ruler,
  Trash2,
  ExternalLink,
  ChevronDown,
  Filter,
} from 'lucide-react';

interface HistoryViewProps {
  onSelectOnMap?: (record: LocationRecord) => void;
}

export default function HistoryView({ onSelectOnMap }: HistoryViewProps) {
  const [locations, setLocations] = useState<LocationRecord[]>(() =>
    StorageService.getLocations()
  );
  const [devices] = useState<Device[]>(() => StorageService.getDevices());
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPointA, setSelectedPointA] = useState<number | null>(null);
  const [selectedPointB, setSelectedPointB] = useState<number | null>(null);
  const [activePreviewRecord, setActivePreviewRecord] = useState<LocationRecord | null>(null);

  // Filtered list
  const filteredRecords = useMemo(() => {
    return locations
      .filter((rec) => {
        if (selectedDeviceId !== 'all' && rec.deviceId !== Number(selectedDeviceId)) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCoord =
            rec.latitude.toString().includes(q) ||
            rec.longitude.toString().includes(q) ||
            rec.deviceId.toString().includes(q) ||
            formatTimestamp(rec.timestamp).toLowerCase().includes(q);
          if (!matchCoord) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [locations, selectedDeviceId, searchQuery]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert('No location records available to export.');
      return;
    }

    const headers = ['ID', 'User ID', 'Device ID', 'Latitude', 'Longitude', 'Accuracy (m)', 'Speed (m/s)', 'Timestamp'];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.userId,
      r.deviceId,
      r.latitude,
      r.longitude,
      r.accuracy,
      r.speed ?? '',
      r.timestamp,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gps_telemetry_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Distance between selected point A and B
  const calculatedDistance = useMemo(() => {
    if (!selectedPointA || !selectedPointB) return null;
    const pointA = locations.find((r) => r.id === selectedPointA);
    const pointB = locations.find((r) => r.id === selectedPointB);
    if (!pointA || !pointB) return null;

    const meters = calculateDistance(
      pointA.latitude,
      pointA.longitude,
      pointB.latitude,
      pointB.longitude
    );
    return meters;
  }, [selectedPointA, selectedPointB, locations]);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to reset all recorded location points to default demo seed?')) {
      StorageService.resetDatabase();
      setLocations(StorageService.getLocations());
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Location Telemetry History
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Historical GPS coordinate logs stored in MySQL <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">locations</code> table
            </p>
          </div>
        </div>

        {/* Actions: Export CSV & Reset */}
        <div className="flex items-center gap-2">
          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-600 dark:text-slate-300 hover:text-red-600 text-xs font-semibold transition"
            title="Reset history"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        </div>
      </div>

      {/* Point-to-Point Distance Calculation Tool */}
      <div className="p-4 sm:p-5 bg-blue-50/70 dark:bg-slate-900/70 rounded-2xl border border-blue-200/80 dark:border-blue-900/40 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-300">
          <Ruler className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Haversine Distance Calculator (Permitted Waypoints)</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Select any two waypoint records from the table below to calculate the great-circle surface distance between them:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Waypoint A (Record ID)
            </label>
            <select
              value={selectedPointA || ''}
              onChange={(e) => setSelectedPointA(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="">-- Choose Point A --</option>
              {filteredRecords.map((r) => (
                <option key={`a-${r.id}`} value={r.id}>
                  #{r.id} ({r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}) - {new Date(r.timestamp).toLocaleTimeString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Waypoint B (Record ID)
            </label>
            <select
              value={selectedPointB || ''}
              onChange={(e) => setSelectedPointB(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="">-- Choose Point B --</option>
              {filteredRecords.map((r) => (
                <option key={`b-${r.id}`} value={r.id}>
                  #{r.id} ({r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}) - {new Date(r.timestamp).toLocaleTimeString()}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Calculated Distance</span>
            <span className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono">
              {calculatedDistance != null ? formatDistance(calculatedDistance) : 'Select two points'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search coordinates, dates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="all">All Devices ({devices.length})</option>
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.deviceName} (#{d.id})
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            Showing {filteredRecords.length} records
          </span>
        </div>
      </div>

      {/* Location Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Device</th>
                <th className="px-4 py-3">Latitude</th>
                <th className="px-4 py-3">Longitude</th>
                <th className="px-4 py-3">Accuracy</th>
                <th className="px-4 py-3">Recorded At</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 font-sans">
                    No location records match the current filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      #{r.id}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-sans">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">
                        DEV-{r.deviceId}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                      {r.latitude.toFixed(6)}°
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                      {r.longitude.toFixed(6)}°
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.accuracy <= 15
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        ±{r.accuracy}m
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-sans">
                      {formatTimestamp(r.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <button
                        onClick={() => setActivePreviewRecord(r)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 font-medium text-xs transition"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Preview Point</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Card for single point preview */}
      {activePreviewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Waypoint #{activePreviewRecord.id} Details
                </h3>
              </div>
              <button
                onClick={() => setActivePreviewRecord(null)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <LeafletMap
              currentLocation={activePreviewRecord}
              height="260px"
              zoom={16}
            />

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase">Latitude</span>
                <span className="font-mono font-bold">{activePreviewRecord.latitude.toFixed(6)}°</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase">Longitude</span>
                <span className="font-mono font-bold">{activePreviewRecord.longitude.toFixed(6)}°</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase">Accuracy</span>
                <span className="font-mono font-bold">±{activePreviewRecord.accuracy} meters</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase">Recorded Time</span>
                <span className="font-mono">{new Date(activePreviewRecord.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            <button
              onClick={() => setActivePreviewRecord(null)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
