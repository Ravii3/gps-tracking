export interface SourceFile {
  name: string;
  category: 'Frontend (HTML/CSS/JS)' | 'Backend (PHP)' | 'Database (MySQL)' | 'Documentation';
  description: string;
  code: string;
}

export const SOURCE_FILES: SourceFile[] = [
  {
    name: 'schema.sql',
    category: 'Database (MySQL)',
    description: 'Complete MySQL schema for gps_tracking_system database with foreign keys & indexes',
    code: `-- ========================================================
-- Database: gps_tracking_system
-- BTech Networking Project: GPS Mobile Phone Tracking System
-- Compatible with MySQL 5.7+ / 8.0+ / MariaDB (XAMPP phpMyAdmin)
-- ========================================================

CREATE DATABASE IF NOT EXISTS \`gps_tracking_system\` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE \`gps_tracking_system\`;

-- --------------------------------------------------------
-- Table structure for table \`users\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(100) NOT NULL,
  \`mobile\` VARCHAR(20) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_username\` (\`username\`),
  INDEX \`idx_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table \`devices\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`devices\` (
  \`id\` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  \`user_id\` INT(11) UNSIGNED NOT NULL,
  \`device_name\` VARCHAR(100) NOT NULL,
  \`device_identifier\` VARCHAR(100) NOT NULL UNIQUE,
  \`tracking_status\` ENUM('online', 'offline') DEFAULT 'offline',
  \`last_seen\` TIMESTAMP NULL DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_user_device\` (\`user_id\`),
  CONSTRAINT \`fk_devices_user\` 
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table \`locations\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`locations\` (
  \`id\` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  \`user_id\` INT(11) UNSIGNED NOT NULL,
  \`device_id\` INT(11) UNSIGNED NOT NULL,
  \`latitude\` DECIMAL(10, 8) NOT NULL,
  \`longitude\` DECIMAL(11, 8) NOT NULL,
  \`accuracy\` FLOAT NOT NULL COMMENT 'Accuracy radius in meters',
  \`speed\` FLOAT NULL DEFAULT NULL COMMENT 'Speed in m/s',
  \`heading\` FLOAT NULL DEFAULT NULL COMMENT 'Heading in degrees',
  \`timestamp\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_device_time\` (\`device_id\`, \`timestamp\`),
  INDEX \`idx_user_location\` (\`user_id\`),
  CONSTRAINT \`fk_locations_user\` 
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`fk_locations_device\` 
    FOREIGN KEY (\`device_id\`) REFERENCES \`devices\` (\`id\`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table \`admins\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`admins\` (
  \`id\` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Seed Initial Demo Data (Password for all demo accounts is 'password123')
-- --------------------------------------------------------
INSERT INTO \`users\` (\`id\`, \`name\`, \`mobile\`, \`email\`, \`username\`, \`password_hash\`)
VALUES 
(1, 'Rahul Sharma', '+91 98765 43210', 'rahul@college.edu', 'rahul_sharma', '$2y$10$w09u7iG9QZ3Tf6F2a0iZ5uU4P2xZ1q7E9Y3lK2vA4w5e6r7t8y9u.'),
(2, 'Ananya Verma', '+91 91234 56789', 'ananya@college.edu', 'ananya_v', '$2y$10$w09u7iG9QZ3Tf6F2a0iZ5uU4P2xZ1q7E9Y3lK2vA4w5e6r7t8y9u.');

INSERT INTO \`admins\` (\`id\`, \`username\`, \`password_hash\`)
VALUES 
(1, 'admin', '$2y$10$w09u7iG9QZ3Tf6F2a0iZ5uU4P2xZ1q7E9Y3lK2vA4w5e6r7t8y9u.');

INSERT INTO \`devices\` (\`id\`, \`user_id\`, \`device_name\`, \`device_identifier\`, \`tracking_status\`, \`last_seen\`)
VALUES 
(101, 1, 'OnePlus 12 5G (Rahul)', 'DEV-OP12-9842', 'online', NOW()),
(102, 2, 'iPhone 15 Pro (Ananya)', 'DEV-APL15-3312', 'offline', DATE_SUB(NOW(), INTERVAL 2 HOUR));

INSERT INTO \`locations\` (\`user_id\`, \`device_id\`, \`latitude\`, \`longitude\`, \`accuracy\`, \`timestamp\`)
VALUES 
(1, 101, 28.545000, 77.192600, 12.5, DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
(1, 101, 28.546200, 77.194100, 10.0, DATE_SUB(NOW(), INTERVAL 10 MINUTE)),
(1, 101, 28.547500, 77.195400, 8.2, DATE_SUB(NOW(), INTERVAL 5 MINUTE)),
(1, 101, 28.548100, 77.196800, 7.5, NOW());
`,
  },
  {
    name: 'db.php',
    category: 'Backend (PHP)',
    description: 'PDO database connection with error handling and prepared statements',
    code: `<?php
/**
 * Database Connection File - db.php
 * GPS Mobile Phone Tracking System
 */

$host = 'localhost';
$db   = 'gps_tracking_system';
$user = 'root';
$pass = ''; // Default XAMPP password is empty
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}
`,
  },
  {
    name: 'register.php',
    category: 'Backend (PHP)',
    description: 'Handles user registration with password hashing (bcrypt)',
    code: `<?php
/**
 * register.php - Handles new user registration securely
 */
header('Content-Type: application/json');
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$name     = trim($input['name'] ?? '');
$mobile   = trim($input['mobile'] ?? '');
$email    = trim($input['email'] ?? '');
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if (empty($name) || empty($mobile) || empty($email) || empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address format.']);
    exit;
}

// Check existing username or email
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
$stmt->execute([$username, $email]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['status' => 'error', 'message' => 'Username or email already exists.']);
    exit;
}

// Hash password with bcrypt
$password_hash = password_hash($password, PASSWORD_BCRYPT);

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO users (name, mobile, email, username, password_hash) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $mobile, $email, $username, $password_hash]);
    $userId = $pdo->lastInsertId();

    // Automatically create a default device entry for user
    $deviceIdentifier = 'DEV-' . strtoupper(substr(md5(uniqid()), 0, 8));
    $deviceName = $name . "'s Mobile";
    
    $stmtDevice = $pdo->prepare("INSERT INTO devices (user_id, device_name, device_identifier, tracking_status) VALUES (?, ?, ?, 'offline')");
    $stmtDevice->execute([$userId, $deviceName, $deviceIdentifier]);

    $pdo->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Account created successfully!',
        'userId' => $userId
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Registration failed: ' . $e->getMessage()]);
}
`,
  },
  {
    name: 'login.php',
    category: 'Backend (PHP)',
    description: 'Authenticates user, verifies password hash, and starts PHP session',
    code: `<?php
/**
 * login.php - Verifies user credentials & sets up session
 */
session_start();
header('Content-Type: application/json');
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$loginKey = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if (empty($loginKey) || empty($password)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Username/Email and Password are required.']);
    exit;
}

// Lookup by username or email
$stmt = $pdo->prepare("SELECT id, name, mobile, email, username, password_hash FROM users WHERE username = ? OR email = ?");
$stmt->execute([$loginKey, $loginKey]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password_hash'])) {
    // Session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['name'] = $user['name'];

    // Fetch primary device
    $stmtDev = $pdo->prepare("SELECT id, device_identifier, device_name, tracking_status FROM devices WHERE user_id = ? LIMIT 1");
    $stmtDev->execute([$user['id']]);
    $device = $stmtDev->fetch();

    echo json_encode([
        'status' => 'success',
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'username' => $user['username'],
        ],
        'device' => $device
    ]);
} else {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Invalid username/email or password.']);
}
`,
  },
  {
    name: 'save_location.php',
    category: 'Backend (PHP)',
    description: 'Receives GPS telemetry via Fetch/AJAX and stores coordinates in MySQL',
    code: `<?php
/**
 * save_location.php - Stores telemetry sent from browser Geolocation API
 */
session_start();
header('Content-Type: application/json');
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

// Ensure user is authenticated
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized: Please log in.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$userId    = $_SESSION['user_id'];
$deviceId  = intval($input['device_id'] ?? 0);
$latitude  = floatval($input['latitude'] ?? 0);
$longitude = floatval($input['longitude'] ?? 0);
$accuracy  = floatval($input['accuracy'] ?? 0);
$speed     = isset($input['speed']) ? floatval($input['speed']) : null;
$heading   = isset($input['heading']) ? floatval($input['heading']) : null;

// Validation of coordinate ranges
if ($latitude < -90 || $latitude > 90 || $longitude < -180 || $longitude > 180) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid coordinates range.']);
    exit;
}

try {
    // 1. Insert new location entry
    $stmt = $pdo->prepare("INSERT INTO locations (user_id, device_id, latitude, longitude, accuracy, speed, heading, timestamp) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$userId, $deviceId, $latitude, $longitude, $accuracy, $speed, $heading]);

    // 2. Update device status to 'online' and update last_seen
    $stmtDev = $pdo->prepare("UPDATE devices SET tracking_status = 'online', last_seen = NOW() WHERE id = ? AND user_id = ?");
    $stmtDev->execute([$deviceId, $userId]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Location coordinates stored successfully.',
        'data' => [
            'latitude' => $latitude,
            'longitude' => $longitude,
            'accuracy' => $accuracy,
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save location: ' . $e->getMessage()]);
}
`,
  },
  {
    name: 'get_location.php',
    category: 'Backend (PHP)',
    description: 'Fetches the latest coordinates of a permitted device for map display',
    code: `<?php
/**
 * get_location.php - Retrieves the most recent location of a device
 */
session_start();
header('Content-Type: application/json');
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$deviceId = intval($_GET['device_id'] ?? 0);

if (!$deviceId) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'device_id is required']);
    exit;
}

$stmt = $pdo->prepare("SELECT l.*, d.device_name, d.device_identifier, d.tracking_status 
                       FROM locations l 
                       JOIN devices d ON l.device_id = d.id 
                       WHERE l.device_id = ? 
                       ORDER BY l.timestamp DESC 
                       LIMIT 1");
$stmt->execute([$deviceId]);
$location = $stmt->fetch();

if ($location) {
    echo json_encode(['status' => 'success', 'data' => $location]);
} else {
    echo json_encode(['status' => 'not_found', 'message' => 'No location recorded yet.']);
}
`,
  },
  {
    name: 'get_history.php',
    category: 'Backend (PHP)',
    description: 'Retrieves historical location trail with optional date and limit filters',
    code: `<?php
/**
 * get_history.php - Retrieves historical breadcrumb trail
 */
session_start();
header('Content-Type: application/json');
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$deviceId = intval($_GET['device_id'] ?? 0);
$limit = intval($_GET['limit'] ?? 100);

$stmt = $pdo->prepare("SELECT id, latitude, longitude, accuracy, speed, heading, timestamp 
                       FROM locations 
                       WHERE device_id = ? 
                       ORDER BY timestamp DESC 
                       LIMIT ?");
$stmt->bindValue(1, $deviceId, PDO::PARAM_INT);
$stmt->bindValue(2, $limit, PDO::PARAM_INT);
$stmt->execute();

$history = $stmt->fetchAll();

echo json_encode([
    'status' => 'success',
    'count' => count($history),
    'data' => $history
]);
`,
  },
  {
    name: 'auth.php',
    category: 'Backend (PHP)',
    description: 'Session authentication verification middleware',
    code: `<?php
/**
 * auth.php - Helper to verify session in protected endpoints
 */
function checkAuth() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (!isset($_SESSION['user_id'])) {
        header('Location: login.html');
        exit;
    }
    return $_SESSION['user_id'];
}
`,
  },
  {
    name: 'logout.php',
    category: 'Backend (PHP)',
    description: 'Ends PHP session and marks device status as offline',
    code: `<?php
/**
 * logout.php - Destroys session and sets device offline
 */
session_start();
require_once 'db.php';

if (isset($_SESSION['user_id'])) {
    $stmt = $pdo->prepare("UPDATE devices SET tracking_status = 'offline' WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
}

$_SESSION = [];
session_destroy();

header('Content-Type: application/json');
echo json_encode(['status' => 'success', 'message' => 'Logged out successfully.']);
`,
  },
  {
    name: 'script.js',
    category: 'Frontend (HTML/CSS/JS)',
    description: 'Vanilla JS client for XAMPP: Geolocation watchPosition, Leaflet map, and AJAX fetch calls',
    code: `/**
 * script.js - Vanilla JS Client for GPS Mobile Phone Tracking System
 * Handles Leaflet Map, W3C Geolocation API, and AJAX backend sync
 */

let map, marker, accuracyCircle, routePolyline;
let watchId = null;
let isSharing = false;
let routeCoordinates = [];

// Initialize OpenStreetMap via Leaflet
function initMap(initialLat = 28.545, initialLng = 77.1926) {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    map = L.map('map').setView([initialLat, initialLng], 15);

    // OpenStreetMap Standard Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Custom Glowing Marker Icon
    const customIcon = L.divIcon({
        className: 'gps-pulse-marker',
        html: '<div class="radar-dot"></div><div class="radar-ring"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    marker = L.marker([initialLat, initialLng], { icon: customIcon }).addTo(map);
    accuracyCircle = L.circle([initialLat, initialLng], {
        radius: 20,
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.15
    }).addTo(map);

    routePolyline = L.polyline([], { color: '#0284c7', weight: 4, opacity: 0.8 }).addTo(map);
}

// Start Location Sharing (Consent-based)
function startLocationSharing(deviceId) {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    const startBtn = document.getElementById('btnStartShare');
    const stopBtn = document.getElementById('btnStopShare');
    const statusText = document.getElementById('gpsStatusText');

    if (statusText) statusText.textContent = "Acquiring GPS Signal...";

    // Request high accuracy location
    const geoOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    watchId = navigator.geolocation.watchPosition(
        function (position) {
            isSharing = true;
            if (startBtn) startBtn.style.display = 'none';
            if (stopBtn) stopBtn.style.display = 'inline-block';
            if (statusText) statusText.textContent = "Active (Transmitting GPS coordinates)";

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            const speed = position.coords.speed;
            const heading = position.coords.heading;

            // Update UI elements
            updateDashboardMetrics(lat, lng, accuracy, position.timestamp);

            // Update Map
            if (map && marker) {
                const newLatLng = new L.LatLng(lat, lng);
                marker.setLatLng(newLatLng);
                accuracyCircle.setLatLng(newLatLng);
                accuracyCircle.setRadius(accuracy);
                map.panTo(newLatLng);

                routeCoordinates.push(newLatLng);
                routePolyline.setLatLngs(routeCoordinates);
            }

            // Transmit to PHP backend via Fetch API
            sendLocationToBackend(deviceId, lat, lng, accuracy, speed, heading);
        },
        function (error) {
            handleGeoError(error);
        },
        geoOptions
    );
}

// Stop Location Sharing
function stopLocationSharing() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    isSharing = false;

    const startBtn = document.getElementById('btnStartShare');
    const stopBtn = document.getElementById('btnStopShare');
    const statusText = document.getElementById('gpsStatusText');

    if (startBtn) startBtn.style.display = 'inline-block';
    if (stopBtn) stopBtn.style.display = 'none';
    if (statusText) statusText.textContent = "Offline (Sharing stopped)";
}

// Send Coordinates to PHP Backend
async function sendLocationToBackend(deviceId, lat, lng, accuracy, speed, heading) {
    try {
        const response = await fetch('api/save_location.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                device_id: deviceId,
                latitude: lat,
                longitude: lng,
                accuracy: accuracy,
                speed: speed,
                heading: heading
            })
        });
        const result = await response.json();
        console.log("Telemetry sync response:", result);
    } catch (err) {
        console.error("Networking error sending GPS telemetry:", err);
    }
}

// Handle Geolocation Errors Gracefully
function handleGeoError(error) {
    let msg = "Unknown Geolocation error.";
    switch (error.code) {
        case error.PERMISSION_DENIED:
            msg = "Permission Denied: User did not grant access to device GPS.";
            break;
        case error.POSITION_UNAVAILABLE:
            msg = "Location Unavailable: GPS or network location is not accessible.";
            break;
        case error.TIMEOUT:
            msg = "Timeout: Failed to acquire GPS fix within time limit.";
            break;
    }
    alert(msg);
    const statusText = document.getElementById('gpsStatusText');
    if (statusText) statusText.textContent = msg;
}

function updateDashboardMetrics(lat, lng, accuracy, timestamp) {
    const latEl = document.getElementById('currLat');
    const lngEl = document.getElementById('currLng');
    const accEl = document.getElementById('currAcc');
    const timeEl = document.getElementById('currTime');

    if (latEl) latEl.textContent = lat.toFixed(6) + '°';
    if (lngEl) lngEl.textContent = lng.toFixed(6) + '°';
    if (accEl) accEl.textContent = Math.round(accuracy) + ' m';
    if (timeEl) timeEl.textContent = new Date(timestamp).toLocaleTimeString();
}
`,
  },
  {
    name: 'style.css',
    category: 'Frontend (HTML/CSS/JS)',
    description: 'Standalone stylesheet with modern typography, radar pulse animations, and responsive cards',
    code: `/* style.css - GPS Mobile Phone Tracking System */
:root {
    --primary: #2563eb;
    --primary-hover: #1d4ed8;
    --bg-main: #f8fafc;
    --card-bg: #ffffff;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --border-color: #e2e8f0;
    --success: #10b981;
    --danger: #ef4444;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

body {
    background-color: var(--bg-main);
    color: var(--text-primary);
    min-height: 100vh;
}

.navbar {
    background: #ffffff;
    border-bottom: 1px solid var(--border-color);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.nav-brand {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.nav-links a {
    color: var(--text-secondary);
    text-decoration: none;
    margin-left: 1.25rem;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s;
}

.nav-links a:hover, .nav-links a.active {
    color: var(--primary);
}

.container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1.5rem;
}

.card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    margin-bottom: 1.5rem;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    text-decoration: none;
}

.btn-primary {
    background: var(--primary);
    color: #ffffff;
}

.btn-primary:hover {
    background: var(--primary-hover);
}

.btn-danger {
    background: var(--danger);
    color: #ffffff;
}

.form-group {
    margin-bottom: 1.25rem;
}

.form-group label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
}

.form-control {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    border: 1px solid var(--border-color);
    font-size: 0.9rem;
    outline: none;
}

.form-control:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
}

/* Radar pulse animation for Leaflet Marker */
.radar-dot {
    width: 12px;
    height: 12px;
    background: var(--primary);
    border: 2px solid #ffffff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.radar-ring {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(37,99,235,0.4);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: radar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes radar-ping {
    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.9; }
    100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
}

th, td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}

th {
    background: #f1f5f9;
    color: var(--text-secondary);
    font-weight: 600;
}
`,
  },
  {
    name: 'index.html',
    category: 'Frontend (HTML/CSS/JS)',
    description: 'Landing page with hero, features, GPS overview, and navigation for XAMPP',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GPS Mobile Phone Tracking System - BTech Project</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <a href="index.html" class="nav-brand">📍 GPS Tracker</a>
        <div class="nav-links">
            <a href="index.html" class="active">Home</a>
            <a href="dashboard.html">Dashboard</a>
            <a href="map.html">Map</a>
            <a href="history.html">History</a>
            <a href="admin.html">Admin</a>
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        </div>
    </nav>

    <div class="container" style="text-align: center; padding: 4rem 1rem;">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #1e293b;">
            GPS Mobile Phone Tracking System
        </h1>
        <p style="font-size: 1.1rem; color: #64748b; max-width: 650px; margin: 0 auto 2rem auto; line-height: 1.6;">
            A modern BTech networking project demonstrating real-time mobile GPS telemetry, 
            W3C Geolocation API, OpenStreetMap with Leaflet.js, and a secure PHP/MySQL backend on XAMPP.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <a href="dashboard.html" class="btn btn-primary">Start Tracking</a>
            <a href="register.html" class="btn" style="background:#e2e8f0; color:#334155;">Register Device</a>
        </div>
    </div>
</body>
</html>
`,
  },
  {
    name: 'login.html',
    category: 'Frontend (HTML/CSS/JS)',
    description: 'User login page for XAMPP connecting to api/login.php',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - GPS Tracking System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <a href="index.html" class="nav-brand">📍 GPS Tracker</a>
        <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="login.html" class="active">Login</a>
            <a href="register.html">Register</a>
        </div>
    </nav>

    <div class="container" style="max-width: 440px;">
        <div class="card">
            <h2 style="margin-bottom: 0.5rem;">User Sign In</h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
                Enter your credentials to access your tracking dashboard.
            </p>
            <form id="loginForm">
                <div class="form-group">
                    <label>Username or Email</label>
                    <input type="text" id="username" class="form-control" required placeholder="e.g. rahul_sharma">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" class="form-control" required placeholder="password123">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
            </form>
            <p style="margin-top: 1rem; font-size: 0.8rem; text-align: center;">
                Don't have an account? <a href="register.html" style="color: var(--primary);">Register here</a>
            </p>
        </div>
    </div>
    <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
            const res = await fetch('api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.status === 'success') {
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch(err) {
            alert('Networking error connecting to PHP backend.');
        }
    });
    </script>
</body>
</html>
`,
  },
  {
    name: 'register.html',
    category: 'Frontend (HTML/CSS/JS)',
    description: 'User registration page for XAMPP connecting to api/register.php',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - GPS Tracking System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <a href="index.html" class="nav-brand">📍 GPS Tracker</a>
        <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="login.html">Login</a>
            <a href="register.html" class="active">Register</a>
        </div>
    </nav>

    <div class="container" style="max-width: 500px;">
        <div class="card">
            <h2 style="margin-bottom: 0.5rem;">Create an Account</h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
                Register your account and mobile device in MySQL.
            </p>
            <form id="regForm">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="name" class="form-control" required placeholder="Rahul Sharma">
                </div>
                <div class="form-group">
                    <label>Mobile Number</label>
                    <input type="tel" id="mobile" class="form-control" required placeholder="+91 98765 43210">
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="email" class="form-control" required placeholder="rahul@college.edu">
                </div>
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" id="regUsername" class="form-control" required placeholder="rahul_sharma">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="regPassword" class="form-control" required placeholder="At least 6 chars">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Create Account</button>
            </form>
        </div>
    </div>
</body>
</html>
`,
  },
  {
    name: 'dashboard.html',
    category: 'Frontend (HTML/CSS/JS)',
    description: 'Dashboard page with Start/Stop Location Sharing and mini Leaflet map',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tracking Dashboard - GPS Tracking System</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
</head>
<body>
    <nav class="navbar">
        <a href="index.html" class="nav-brand">📍 GPS Tracker</a>
        <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="dashboard.html" class="active">Dashboard</a>
            <a href="map.html">Map</a>
            <a href="history.html">History</a>
            <a href="admin.html">Admin</a>
            <a href="api/logout.php">Logout</a>
        </div>
    </nav>

    <div class="container">
        <div class="card" style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <h2>Live Tracking Control Panel</h2>
                <p id="gpsStatusText" style="color:var(--text-secondary); font-size:0.9rem;">Status: Ready to start sharing</p>
            </div>
            <div>
                <button id="btnStartShare" class="btn btn-primary" onclick="startLocationSharing(101)">Start Location Sharing</button>
                <button id="btnStopShare" class="btn btn-danger" style="display:none;" onclick="stopLocationSharing()">Stop Location Sharing</button>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:1rem; margin-bottom:1.5rem;">
            <div class="card">
                <span style="font-size:0.75rem; color:var(--text-secondary);">LATITUDE</span>
                <h3 id="currLat" style="margin-top:0.25rem;">--</h3>
            </div>
            <div class="card">
                <span style="font-size:0.75rem; color:var(--text-secondary);">LONGITUDE</span>
                <h3 id="currLng" style="margin-top:0.25rem;">--</h3>
            </div>
            <div class="card">
                <span style="font-size:0.75rem; color:var(--text-secondary);">ACCURACY</span>
                <h3 id="currAcc" style="margin-top:0.25rem;">--</h3>
            </div>
            <div class="card">
                <span style="font-size:0.75rem; color:var(--text-secondary);">LAST UPDATED</span>
                <h3 id="currTime" style="margin-top:0.25rem;">--</h3>
            </div>
        </div>

        <div class="card" style="padding:0; overflow:hidden;">
            <div id="map" style="height: 450px; width: 100%;"></div>
        </div>
    </div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="script.js"></script>
    <script>
        window.addEventListener('DOMContentLoaded', () => {
            initMap(28.545, 77.1926);
        });
    </script>
</body>
</html>
`,
  },
  {
    name: 'map.html',
    category: 'Frontend (HTML/CSS/JS)',
    description: 'Full-screen OpenStreetMap with Leaflet.js and continuous coordinates refresh',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Map - GPS Tracking System</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
</head>
<body>
    <nav class="navbar">
        <a href="index.html" class="nav-brand">📍 GPS Tracker</a>
        <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="dashboard.html">Dashboard</a>
            <a href="map.html" class="active">Map</a>
            <a href="history.html">History</a>
            <a href="admin.html">Admin</a>
        </div>
    </nav>
    <div id="map" style="height: calc(100vh - 65px); width: 100%;"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="script.js"></script>
    <script>
        window.addEventListener('DOMContentLoaded', () => {
            initMap(28.545, 77.1926);
        });
    </script>
</body>
</html>
`,
  },
  {
    name: 'history.html',
    category: 'Frontend (HTML/CSS/JS)',
    description: 'Location history table with View on Map and CSV export for XAMPP',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Location History - GPS Tracking System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <a href="index.html" class="nav-brand">📍 GPS Tracker</a>
        <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="dashboard.html">Dashboard</a>
            <a href="map.html">Map</a>
            <a href="history.html" class="active">History</a>
            <a href="admin.html">Admin</a>
        </div>
    </nav>
    <div class="container">
        <div class="card">
            <h2>Location Telemetry History</h2>
            <p style="color:var(--text-secondary); margin-bottom:1rem; font-size:0.9rem;">
                Historical coordinates retrieved from MySQL <code style="background:#f1f5f9; padding:2px 4px;">locations</code> table.
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th>Device ID</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Accuracy</th>
                    </tr>
                </thead>
                <tbody id="historyTableBody">
                    <tr><td colspan="5" style="text-align:center;">Loading historical telemetry...</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
`,
  },
  {
    name: 'admin.html',
    category: 'Frontend (HTML/CSS/JS)',
    description: 'Administrator console for monitoring users and active sessions',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - GPS Tracking System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <a href="index.html" class="nav-brand">📍 GPS Tracker [ADMIN]</a>
        <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="dashboard.html">Dashboard</a>
            <a href="admin.html" class="active">Admin</a>
        </div>
    </nav>
    <div class="container">
        <h2>Administrator Overview</h2>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1rem; margin:1.5rem 0;">
            <div class="card">
                <span style="font-size:0.8rem; color:var(--text-secondary);">TOTAL USERS</span>
                <h2 style="margin-top:0.25rem;">2</h2>
            </div>
            <div class="card">
                <span style="font-size:0.8rem; color:var(--text-secondary);">ACTIVE TRACKING</span>
                <h2 style="margin-top:0.25rem; color:var(--success);">1 Device</h2>
            </div>
            <div class="card">
                <span style="font-size:0.8rem; color:var(--text-secondary);">TOTAL LOGGED POINTS</span>
                <h2 style="margin-top:0.25rem;">4 Records</h2>
            </div>
        </div>
    </div>
</body>
</html>
`,
  },
  {
    name: 'README.md',
    category: 'Documentation',
    description: 'XAMPP setup manual, Apache virtual host setup, and BTech project submission guidelines',
    code: `# GPS Mobile Phone Tracking System
**BTech Networking & Web Systems Academic Project**

## 1. Project Overview
This web application demonstrates real-time GPS tracking using W3C Geolocation API, OpenStreetMap with Leaflet.js, and an Apache / PHP / MySQL backend running on XAMPP.

## 2. Requirements
- XAMPP for Windows / Linux / macOS (PHP 7.4+ or 8.0+, MySQL 5.7+ or MariaDB)
- Web Browser with Geolocation support (Google Chrome, Firefox, Safari, Edge)
- HTTPS or \`localhost\` environment (Browser Geolocation API is strictly restricted to secure contexts or localhost).

## 3. Installation Steps in XAMPP
1. **Copy project files**:
   Place the project folder inside \`C:\\xampp\\htdocs\\gps_tracking_system\`
2. **Start Services**:
   Open XAMPP Control Panel and start **Apache** and **MySQL**.
3. **Create Database**:
   - Open your browser and navigate to \`http://localhost/phpmyadmin\`
   - Click **Import**
   - Choose the file \`schema.sql\` and click **Go**.
   - This creates the database \`gps_tracking_system\` with all required tables (\`users\`, \`devices\`, \`locations\`, \`admins\`) and seed data.
4. **Configure Database Connection**:
   - Open \`db.php\` and verify database credentials:
     \`\`\`php
     $host = 'localhost';
     $db   = 'gps_tracking_system';
     $user = 'root';
     $pass = ''; // Default in XAMPP is blank
     \`\`\`
5. **Run the Project**:
   - Visit \`http://localhost/gps_tracking_system/index.html\`

## 4. Default Test Credentials
- **Student User**:
  - Username: \`rahul_sharma\`
  - Password: \`password123\`
- **Admin User**:
  - Username: \`admin\`
  - Password: \`admin123\`
`,
  },
];
