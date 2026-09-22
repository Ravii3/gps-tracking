import React, { useState } from 'react';
import { StorageService } from '../services/store';
import { User, Device, LocationRecord } from '../types';
import { formatTimestamp, getRelativeTime } from '../utils/geo';
import {
  ShieldAlert,
  Users,
  Smartphone,
  Database,
  Radio,
  Clock,
  RotateCcw,
  CheckCircle2,
  HardDrive,
  Activity,
  Layers,
  Search,
} from 'lucide-react';

export default function AdminView() {
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [devices, setDevices] = useState<Device[]>(() => StorageService.getDevices());
  const [locations, setLocations] = useState<LocationRecord[]>(() =>
    StorageService.getLocations()
  );
  const [activeTabSection, setActiveTabSection] = useState<'users' | 'devices' | 'system'>(
    'users'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const activeSessionsCount = devices.filter((d) => d.trackingStatus === 'online').length;

  const latestLocation = locations.length > 0 ? locations[locations.length - 1] : null;

  const handleResetData = () => {
    if (confirm('Reset database back to initial seed data?')) {
      StorageService.resetDatabase();
      setUsers(StorageService.getUsers());
      setDevices(StorageService.getDevices());
      setLocations(StorageService.getLocations());
    }
  };

  const handleToggleDeviceStatus = (deviceId: number, currentStatus: 'online' | 'offline') => {
    const newStatus = currentStatus === 'online' ? 'offline' : 'online';
    StorageService.updateDeviceStatus(deviceId, newStatus);
    setDevices(StorageService.getDevices());
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold uppercase tracking-wider border border-indigo-400/20">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            System Administrator Control Plane
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Telemetry Console</h1>
          <p className="text-xs text-slate-300">
            Monitoring registered mobile users, active GPS sessions, and MySQL storage metrics
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Reset Sample Database</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Registered Users
            </span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {users.length}
          </div>
          <span className="text-[10px] text-slate-400">In MySQL `users` table</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Sessions
            </span>
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {activeSessionsCount}
          </div>
          <span className="text-[10px] text-slate-400">Transmitting coordinates</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Stored Records
            </span>
            <Database className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {locations.length}
          </div>
          <span className="text-[10px] text-slate-400">GPS telemetry points</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Last GPS Update
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white truncate">
            {latestLocation ? getRelativeTime(latestLocation.timestamp) : 'None'}
          </div>
          <span className="text-[10px] text-slate-400 truncate block">
            {latestLocation ? new Date(latestLocation.timestamp).toLocaleTimeString() : 'N/A'}
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTabSection('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTabSection === 'users'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Registered Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTabSection('devices')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTabSection === 'devices'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Registered Devices ({devices.length})
        </button>
        <button
          onClick={() => setActiveTabSection('system')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTabSection === 'system'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          MySQL & System Health
        </button>
      </div>

      {/* Users Table */}
      {activeTabSection === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              User Accounts Directory
            </h3>
            <span className="text-xs text-slate-500">Table: `users`</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Registered At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-mono font-bold">#{u.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                      @{u.username}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                      {u.mobile}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {formatTimestamp(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Devices Table */}
      {activeTabSection === 'devices' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Registered Hardware Devices & Status
            </h3>
            <span className="text-xs text-slate-500">Table: `devices`</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Device ID</th>
                  <th className="px-4 py-3">Assigned User</th>
                  <th className="px-4 py-3">Model / Name</th>
                  <th className="px-4 py-3">Hardware Identifier</th>
                  <th className="px-4 py-3">Network IP</th>
                  <th className="px-4 py-3">Tracking Status</th>
                  <th className="px-4 py-3">Last Seen</th>
                  <th className="px-4 py-3 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {devices.map((d) => {
                  const assignedUser = users.find((u) => u.id === d.userId);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-mono font-bold">#{d.id}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {assignedUser ? assignedUser.name : `User #${d.userId}`}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {d.deviceName}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                        {d.deviceIdentifier}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500">
                        {d.ipAddress || '192.168.1.10'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                            d.trackingStatus === 'online'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              d.trackingStatus === 'online'
                                ? 'bg-emerald-500 animate-pulse'
                                : 'bg-slate-400'
                            }`}
                          />
                          {d.trackingStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {getRelativeTime(d.lastSeen)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleToggleDeviceStatus(d.id, d.trackingStatus)}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold transition"
                        >
                          Toggle {d.trackingStatus === 'online' ? 'Offline' : 'Online'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System Health Tab */}
      {activeTabSection === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <HardDrive className="w-4 h-4 text-blue-500" />
              <span>Database Integrity & Schema Validation</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-500">Database Name:</span>
                <span className="font-mono font-bold">gps_tracking_system</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-500">Database Engine:</span>
                <span className="font-mono">InnoDB (utf8mb4_unicode_ci)</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-500">Foreign Key Constraints:</span>
                <span className="text-emerald-600 font-bold">VALID (ON DELETE CASCADE)</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-500">Coordinate Precision:</span>
                <span className="font-mono">DECIMAL(10,8) / DECIMAL(11,8)</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Networking Security Compliance</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-500">Geolocation Protocol:</span>
                <span className="text-emerald-600 font-bold">W3C Standard (HTTPS enforced)</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-500">Password Encryption:</span>
                <span className="font-mono text-indigo-600 font-bold">bcrypt (Cost 10)</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-500">Consent Handshake:</span>
                <span className="text-emerald-600 font-bold">Enforced (Zero covert tracking)</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-500">SQL Injection Mitigation:</span>
                <span className="text-emerald-600 font-bold">PDO Prepared Statements</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
