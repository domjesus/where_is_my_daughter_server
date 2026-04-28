import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Premium SVG Pin Icon
const createPinIcon = (color: string, isActive: boolean) => L.divIcon({
    html: `
        <div class="relative ${isActive ? 'z-50' : 'z-0'}">
            <svg viewBox="0 0 24 24" width="${isActive ? '40' : '32'}" height="${isActive ? '40' : '32'}" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21C16 17.5 19 14.4183 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 14.4183 8 17.5 12 21Z" fill="${color}" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="10" r="3" fill="white"/>
            </svg>
            ${isActive ? `<div class="absolute inset-0 animate-ping rounded-full bg-${color === '#10b981' ? 'emerald' : 'cyan'}-500/40 -z-10 scale-150"></div>` : ''}
        </div>
    `,
    className: 'custom-pin-icon',
    iconSize: isActive ? [40, 40] : [32, 32],
    iconAnchor: isActive ? [20, 40] : [16, 32],
    popupAnchor: [0, isActive ? -40 : -32],
});

interface Localization {
    id: number;
    latitude: string;
    longitude: string;
    source: string;
    is_home: boolean;
    last_time_seen: string;
    created_at: string;
}

interface MapViewProps {
    data: Localization[];
    center?: [number, number];
    activeId?: number;
    className?: string;
}

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (center && center[0] && center[1]) {
            map.setView(center, 16); // Zoom in closer for specific pins
        }
    }, [center, map]);
    return null;
}

export default function MapView({ data, center, activeId, className }: MapViewProps) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const defaultCenter: [number, number] = center || (data.length > 0 
        ? [parseFloat(data[0].latitude), parseFloat(data[0].longitude)] 
        : [-23.550520, -46.633308]);

    const tileUrl = isDark 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    return (
        <div className={`w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg relative z-0 ${className || 'h-[450px]'}`}>
            <MapContainer 
                center={defaultCenter} 
                zoom={14} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url={tileUrl}
                />
                
                {center && <ChangeView center={center} />}

                {data.map((loc) => {
                    const lat = parseFloat(loc.latitude);
                    const lng = parseFloat(loc.longitude);
                    if (isNaN(lat) || isNaN(lng)) return null;
                    
                    const isActive = loc.id === activeId;
                    const color = loc.is_home ? '#10b981' : '#06b6d4';

                    return (
                        <Marker 
                            key={loc.id} 
                            position={[lat, lng]}
                            icon={createPinIcon(color, isActive)}
                        >
                            <Popup className="custom-popup">
                                <div className="p-1 min-w-[120px]">
                                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-white/5">
                                        <div className={`w-2 h-2 rounded-full bg-[${color}]`}></div>
                                        <span className="font-bold text-slate-800 dark:text-white capitalize">{loc.source}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">
                                        <span className="font-medium">Lat:</span> {lat.toFixed(6)}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-gray-400 mb-2">
                                        <span className="font-medium">Lng:</span> {lng.toFixed(6)}
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-gray-500 italic">
                                        Last seen: {new Date(loc.last_time_seen || loc.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            <style>{`
                .leaflet-container {
                    background: #f8fafc !important;
                }
                .dark .leaflet-container {
                    background: #020617 !important;
                }
                .custom-popup .leaflet-popup-content-wrapper {
                    background: rgba(255, 255, 255, 0.95) !important;
                    backdrop-filter: blur(12px);
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
                .dark .custom-popup .leaflet-popup-content-wrapper {
                    background: rgba(15, 23, 42, 0.9) !important;
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .leaflet-popup-tip {
                    background: rgba(255, 255, 255, 0.95) !important;
                }
                .dark .leaflet-popup-tip {
                    background: rgba(15, 23, 42, 0.9) !important;
                }
                .leaflet-bar a {
                    background-color: white !important;
                    color: #020617 !important;
                    border-bottom: 1px solid #e2e8f0 !important;
                }
                .dark .leaflet-bar a {
                    background-color: #1e293b !important;
                    color: white !important;
                    border-bottom: 1px solid #334155 !important;
                }
            `}</style>
        </div>
    );
}
