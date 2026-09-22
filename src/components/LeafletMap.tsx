import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LocationRecord } from '../types';
import { Layers, Crosshair, MapPin } from 'lucide-react';

interface LeafletMapProps {
  currentLocation: { latitude: number; longitude: number; accuracy: number } | null;
  history?: LocationRecord[];
  isTrackingActive?: boolean;
  height?: string;
  zoom?: number;
  centerOnUpdate?: boolean;
  selectedRecord?: LocationRecord | null;
}

export default function LeafletMap({
  currentLocation,
  history = [],
  isTrackingActive = false,
  height = '500px',
  zoom = 15,
  centerOnUpdate = true,
  selectedRecord = null,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const liveMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const historyLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const [mapType, setMapType] = useState<'osm' | 'satellite' | 'carto'>('osm');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = currentLocation?.latitude ?? 28.545;
      const initialLng = currentLocation?.longitude ?? 77.1926;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: zoom,
        zoomControl: true,
      });

      // Default OpenStreetMap layer
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Layer storage on map instance
      (map as any)._baseLayer = osmLayer;

      // Group for historical breadcrumbs
      const historyGroup = L.layerGroup().addTo(map);
      historyLayerGroupRef.current = historyGroup;

      // Polyline for trail
      const poly = L.polyline([], {
        color: '#2563eb',
        weight: 4,
        opacity: 0.85,
        dashArray: '2, 6',
      }).addTo(map);
      polylineRef.current = poly;

      mapInstanceRef.current = map;
    }

    // Resize observer to ensure Leaflet renders correctly when container resizes
    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Handle Map Type Switching
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const currentLayer = (map as any)._baseLayer;
    if (currentLayer) {
      map.removeLayer(currentLayer);
    }

    let newLayer: L.TileLayer;
    if (mapType === 'carto') {
      newLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      });
    } else if (mapType === 'satellite') {
      newLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 18,
        }
      );
    } else {
      newLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });
    }

    newLayer.addTo(map);
    (map as any)._baseLayer = newLayer;
  }, [mapType]);

  // Update Current Live Marker and Accuracy Circle
  useEffect(() => {
    if (!mapInstanceRef.current || !currentLocation) return;
    const map = mapInstanceRef.current;
    const { latitude, longitude, accuracy } = currentLocation;
    const latLng = new L.LatLng(latitude, longitude);

    const pulseHtml = `
      <div class="relative flex items-center justify-center w-8 h-8">
        <div class="absolute w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-60"></div>
        <div class="absolute w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    `;

    const customLiveIcon = L.divIcon({
      className: 'custom-gps-marker',
      html: pulseHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (!liveMarkerRef.current) {
      liveMarkerRef.current = L.marker(latLng, { icon: customLiveIcon }).addTo(map);
      liveMarkerRef.current.bindPopup(
        `<div class="p-1 font-sans">
          <strong class="text-blue-600 font-semibold block text-sm">Target Mobile Device</strong>
          <span class="text-xs text-gray-600 block">Lat: ${latitude.toFixed(6)}°</span>
          <span class="text-xs text-gray-600 block">Lng: ${longitude.toFixed(6)}°</span>
          <span class="text-xs text-gray-500 block">Accuracy: ±${Math.round(accuracy)}m</span>
        </div>`
      );
    } else {
      liveMarkerRef.current.setLatLng(latLng);
      liveMarkerRef.current.setPopupContent(
        `<div class="p-1 font-sans">
          <strong class="text-blue-600 font-semibold block text-sm">Target Mobile Device</strong>
          <span class="text-xs text-gray-600 block">Lat: ${latitude.toFixed(6)}°</span>
          <span class="text-xs text-gray-600 block">Lng: ${longitude.toFixed(6)}°</span>
          <span class="text-xs text-gray-500 block">Accuracy: ±${Math.round(accuracy)}m</span>
        </div>`
      );
    }

    if (!accuracyCircleRef.current) {
      accuracyCircleRef.current = L.circle(latLng, {
        radius: Math.max(accuracy, 10),
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
        weight: 1.5,
      }).addTo(map);
    } else {
      accuracyCircleRef.current.setLatLng(latLng);
      accuracyCircleRef.current.setRadius(Math.max(accuracy, 10));
    }

    if (centerOnUpdate) {
      map.panTo(latLng, { animate: true });
    }
  }, [currentLocation, centerOnUpdate]);

  // Update Breadcrumb Polyline & Historical Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !polylineRef.current || !historyLayerGroupRef.current) return;
    const historyGroup = historyLayerGroupRef.current;
    historyGroup.clearLayers();

    if (history.length === 0) {
      polylineRef.current.setLatLngs([]);
      return;
    }

    const latLngs = history.map((rec) => new L.LatLng(rec.latitude, rec.longitude));
    polylineRef.current.setLatLngs(latLngs);

    // Add small dot markers for history points
    history.forEach((rec, idx) => {
      const isStart = idx === 0;
      const isLast = idx === history.length - 1;

      const pointHtml = `
        <div class="w-3.5 h-3.5 rounded-full ${
          isStart
            ? 'bg-emerald-600 ring-2 ring-emerald-200'
            : isLast
            ? 'bg-blue-600 ring-2 ring-blue-200'
            : 'bg-indigo-500 ring-1 ring-white'
        } shadow flex items-center justify-center">
        </div>
      `;

      const dotIcon = L.divIcon({
        className: 'history-dot',
        html: pointHtml,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const pointMarker = L.marker([rec.latitude, rec.longitude], { icon: dotIcon });
      pointMarker.bindPopup(
        `<div class="p-1 font-sans text-xs">
          <strong class="text-gray-900 block font-semibold mb-1">${
            isStart ? '🏁 Start Point' : isLast ? '📍 Current Point' : `Waypoint #${idx + 1}`
          }</strong>
          <div class="text-gray-600 space-y-0.5">
            <div>Lat: ${rec.latitude.toFixed(6)}°</div>
            <div>Lng: ${rec.longitude.toFixed(6)}°</div>
            <div>Acc: ±${rec.accuracy}m</div>
            <div>Time: ${new Date(rec.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>`
      );
      historyGroup.addLayer(pointMarker);
    });
  }, [history]);

  // Handle selected record highlighting
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedRecord) return;
    const map = mapInstanceRef.current;
    const latLng = new L.LatLng(selectedRecord.latitude, selectedRecord.longitude);
    map.flyTo(latLng, 17, { duration: 1.2 });

    const highlightIcon = L.divIcon({
      className: 'highlight-pin',
      html: `
        <div class="flex flex-col items-center">
          <div class="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow font-semibold">SELECTED</div>
          <div class="w-3 h-3 bg-red-600 rotate-45 -mt-1.5"></div>
        </div>
      `,
      iconSize: [60, 40],
      iconAnchor: [30, 36],
    });

    const highlightMarker = L.marker(latLng, { icon: highlightIcon }).addTo(map);
    setTimeout(() => {
      map.removeLayer(highlightMarker);
    }, 4000);
  }, [selectedRecord]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (currentLocation) {
      mapInstanceRef.current.flyTo([currentLocation.latitude, currentLocation.longitude], 16, {
        duration: 0.8,
      });
    } else if (history.length > 0) {
      const last = history[history.length - 1];
      mapInstanceRef.current.flyTo([last.latitude, last.longitude], 16);
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900" style={{ height }}>
      {/* Map Element */}
      <div id="leaflet-map-canvas" ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Controls Bar */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <button
          id="btn-recenter-map"
          onClick={handleRecenter}
          title="Recenter on Device Location"
          className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
        >
          <Crosshair className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </button>

        <div className="h-px bg-slate-200 dark:bg-slate-700 my-0.5" />

        <div className="flex flex-col gap-1 p-1">
          <button
            onClick={() => setMapType('osm')}
            className={`text-[11px] font-medium px-2 py-1 rounded text-left transition ${
              mapType === 'osm'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Street (OSM)
          </button>
          <button
            onClick={() => setMapType('carto')}
            className={`text-[11px] font-medium px-2 py-1 rounded text-left transition ${
              mapType === 'carto'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Voyager
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`text-[11px] font-medium px-2 py-1 rounded text-left transition ${
              mapType === 'satellite'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Floating GPS Status Pill */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow border border-slate-200 dark:border-slate-700 flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isTrackingActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
          }`}
        />
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {isTrackingActive ? 'Live GPS Stream Active' : 'GPS Standby / Ready'}
        </span>
        {currentLocation && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 border-l border-slate-300 dark:border-slate-700 pl-2">
            ±{Math.round(currentLocation.accuracy)}m accuracy
          </span>
        )}
      </div>
    </div>
  );
}
