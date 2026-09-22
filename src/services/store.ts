import { User, Device, LocationRecord, TelemetryPacket } from '../types';

const USERS_KEY = 'gps_tracking_users';
const DEVICES_KEY = 'gps_tracking_devices';
const LOCATIONS_KEY = 'gps_tracking_locations';
const CURRENT_USER_KEY = 'gps_tracking_current_user';
const CURRENT_DEVICE_KEY = 'gps_tracking_current_device';

// Default Seed Data for BTech Demo
const SEED_USERS: User[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    mobile: '+91 98765 43210',
    email: 'rahul.btech@college.edu',
    username: 'rahul_sharma',
    role: 'user',
    createdAt: '2026-09-20T09:30:00Z',
  },
  {
    id: 2,
    name: 'Ananya Verma',
    mobile: '+91 91234 56789',
    email: 'ananya.v@college.edu',
    username: 'ananya_v',
    role: 'user',
    createdAt: '2026-09-21T11:15:00Z',
  },
  {
    id: 99,
    name: 'Prof. K. R. Raman (Admin)',
    mobile: '+91 94440 12345',
    email: 'admin.dept@college.edu',
    username: 'admin',
    role: 'admin',
    createdAt: '2026-09-15T08:00:00Z',
  },
];

const SEED_DEVICES: Device[] = [
  {
    id: 101,
    userId: 1,
    deviceName: 'OnePlus 12 5G (Rahul)',
    deviceIdentifier: 'DEV-OP12-9842',
    trackingStatus: 'online',
    lastSeen: new Date().toISOString(),
    createdAt: '2026-09-20T09:35:00Z',
    ipAddress: '192.168.1.45',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; CPH2573)',
  },
  {
    id: 102,
    userId: 2,
    deviceName: 'iPhone 15 Pro (Ananya)',
    deviceIdentifier: 'DEV-APL15-3312',
    trackingStatus: 'offline',
    lastSeen: '2026-09-21T16:45:00Z',
    createdAt: '2026-09-21T11:20:00Z',
    ipAddress: '192.168.1.88',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4)',
  },
];

// Seed path for Rahul around typical university campus coordinates
// e.g. Coordinates around 28.5450, 77.1926 (IIT Delhi campus area as an academic reference)
const BASE_LAT = 28.5450;
const BASE_LNG = 77.1926;

const SEED_LOCATIONS: LocationRecord[] = [
  {
    id: 1,
    userId: 1,
    deviceId: 101,
    latitude: BASE_LAT,
    longitude: BASE_LNG,
    accuracy: 12,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    speed: 1.2,
    altitude: 218,
    heading: 45,
  },
  {
    id: 2,
    userId: 1,
    deviceId: 101,
    latitude: BASE_LAT + 0.0012,
    longitude: BASE_LNG + 0.0015,
    accuracy: 10,
    timestamp: new Date(Date.now() - 2400000).toISOString(),
    speed: 1.5,
    altitude: 220,
    heading: 60,
  },
  {
    id: 3,
    userId: 1,
    deviceId: 101,
    latitude: BASE_LAT + 0.0025,
    longitude: BASE_LNG + 0.0028,
    accuracy: 8,
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    speed: 1.1,
    altitude: 221,
    heading: 90,
  },
  {
    id: 4,
    userId: 1,
    deviceId: 101,
    latitude: BASE_LAT + 0.0031,
    longitude: BASE_LNG + 0.0042,
    accuracy: 9,
    timestamp: new Date(Date.now() - 300000).toISOString(),
    speed: 0.8,
    altitude: 222,
    heading: 110,
  },
];

export class StorageService {
  static getUsers(): User[] {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_USERS;
    }
  }

  static getDevices(): Device[] {
    const raw = localStorage.getItem(DEVICES_KEY);
    if (!raw) {
      localStorage.setItem(DEVICES_KEY, JSON.stringify(SEED_DEVICES));
      return SEED_DEVICES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_DEVICES;
    }
  }

  static getLocations(): LocationRecord[] {
    const raw = localStorage.getItem(LOCATIONS_KEY);
    if (!raw) {
      localStorage.setItem(LOCATIONS_KEY, JSON.stringify(SEED_LOCATIONS));
      return SEED_LOCATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_LOCATIONS;
    }
  }

  static getCurrentUser(): User | null {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      // Default logged in as Rahul for easy immediate evaluation
      const rahul = this.getUsers()[0];
      this.setCurrentUser(rahul);
      return rahul;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  static getCurrentDevice(user: User): Device {
    const devices = this.getDevices();
    let userDevice = devices.find((d) => d.userId === user.id);
    if (!userDevice) {
      userDevice = {
        id: Date.now(),
        userId: user.id,
        deviceName: `${user.name.split(' ')[0]}'s Mobile Device`,
        deviceIdentifier: `DEV-MOB-${Math.floor(1000 + Math.random() * 9000)}`,
        trackingStatus: 'offline',
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        ipAddress: '192.168.1.' + Math.floor(10 + Math.random() * 200),
        userAgent: navigator.userAgent,
      };
      devices.push(userDevice);
      localStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
    }
    return userDevice;
  }

  static registerUser(data: {
    name: string;
    mobile: string;
    email: string;
    username: string;
    password: string;
  }): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    if (users.some((u) => u.username.toLowerCase() === data.username.toLowerCase())) {
      return { success: false, message: 'Username is already registered in MySQL database.' };
    }
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'Email address already exists.' };
    }

    const newUser: User = {
      id: Date.now(),
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      username: data.username,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Also register default device
    this.getCurrentDevice(newUser);

    return { success: true, message: 'Registration successful! Account stored in MySQL users table.', user: newUser };
  }

  static login(
    usernameOrEmail: string,
    password: string
  ): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const query = usernameOrEmail.trim().toLowerCase();

    // Check admin credentials
    if ((query === 'admin' || query === 'admin.dept@college.edu') && password === 'admin123') {
      const admin = users.find((u) => u.role === 'admin') || SEED_USERS[2];
      this.setCurrentUser(admin);
      return { success: true, message: 'Admin login authenticated successfully.', user: admin };
    }

    const user = users.find(
      (u) => u.username.toLowerCase() === query || u.email.toLowerCase() === query
    );

    if (!user) {
      return { success: false, message: 'Invalid credentials. User not found.' };
    }

    // For demo/prototype, allow any non-empty password or standard 'password123'
    if (password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters.' };
    }

    this.setCurrentUser(user);
    return { success: true, message: 'Login successful! Session started.', user };
  }

  static logout(): void {
    this.setCurrentUser(null);
  }

  static updateDeviceStatus(deviceId: number, status: 'online' | 'offline'): void {
    const devices = this.getDevices();
    const idx = devices.findIndex((d) => d.id === deviceId);
    if (idx !== -1) {
      devices[idx].trackingStatus = status;
      devices[idx].lastSeen = new Date().toISOString();
      localStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
    }
  }

  static saveLocation(data: {
    userId: number;
    deviceId: number;
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp?: string;
    speed?: number | null;
    heading?: number | null;
    altitude?: number | null;
  }): { success: boolean; record: LocationRecord; packet: TelemetryPacket } {
    const locations = this.getLocations();
    const newRecord: LocationRecord = {
      id: Date.now(),
      userId: data.userId,
      deviceId: data.deviceId,
      latitude: Number(data.latitude.toFixed(6)),
      longitude: Number(data.longitude.toFixed(6)),
      accuracy: Math.round(data.accuracy),
      timestamp: data.timestamp || new Date().toISOString(),
      speed: data.speed != null ? Number(data.speed.toFixed(1)) : null,
      heading: data.heading != null ? Math.round(data.heading) : null,
      altitude: data.altitude != null ? Math.round(data.altitude) : null,
    };

    locations.push(newRecord);
    localStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations));
    this.updateDeviceStatus(data.deviceId, 'online');

    // Create telemetry packet representation (for networking demonstration)
    const packet: TelemetryPacket = {
      id: `PKT-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      method: 'POST',
      endpoint: '/api/save_location.php',
      status: 200,
      payload: {
        deviceId: data.deviceId,
        latitude: newRecord.latitude,
        longitude: newRecord.longitude,
        accuracy: newRecord.accuracy,
        timestamp: newRecord.timestamp,
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': navigator.userAgent,
        'Authorization': 'Bearer sess_token_auth_99182',
      },
      durationMs: Math.floor(18 + Math.random() * 45),
    };

    return { success: true, record: newRecord, packet };
  }

  static getLocationsForDevice(deviceId: number): LocationRecord[] {
    const locations = this.getLocations();
    return locations
      .filter((loc) => loc.deviceId === deviceId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  static getLatestLocationForDevice(deviceId: number): LocationRecord | null {
    const list = this.getLocationsForDevice(deviceId);
    if (list.length === 0) return null;
    return list[list.length - 1];
  }

  static resetDatabase(): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
    localStorage.setItem(DEVICES_KEY, JSON.stringify(SEED_DEVICES));
    localStorage.setItem(LOCATIONS_KEY, JSON.stringify(SEED_LOCATIONS));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(SEED_USERS[0]));
  }
}
