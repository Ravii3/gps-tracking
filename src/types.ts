export interface User {
  id: number;
  name: string;
  mobile: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Device {
  id: number;
  userId: number;
  deviceName: string;
  deviceIdentifier: string;
  trackingStatus: 'online' | 'offline';
  lastSeen: string;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LocationRecord {
  id: number;
  userId: number;
  deviceId: number;
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  timestamp: string; // ISO string
  speed?: number | null; // meters per second
  heading?: number | null; // degrees
  altitude?: number | null; // meters
}

export type GPSStatus = 'idle' | 'requesting' | 'active' | 'denied' | 'unavailable' | 'stopped';

export interface TelemetryPacket {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  payload: {
    deviceId: number;
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
  };
  headers: Record<string, string>;
  durationMs: number;
}

export type ActiveTab =
  | 'home'
  | 'dashboard'
  | 'map'
  | 'history'
  | 'networking'
  | 'admin'
  | 'docs'
  | 'sourcecode'
  | 'login'
  | 'register';
