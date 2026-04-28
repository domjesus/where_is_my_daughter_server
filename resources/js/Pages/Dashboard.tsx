import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
    RefreshCw,
    Clock,
    MapPin,
    Wifi,
    Radio as BeaconIcon,
    Smartphone,
    Home,
    X,
    ExternalLink,
    Settings2,
    Loader2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Bluetooth,
    Network,
    Signal
} from 'lucide-react';
import { Transition } from '@headlessui/react';
import MapView from '@/Components/MapView';
import Modal from '@/Components/Modal';

interface Localization {
    id: number;
    latitude: string;
    longitude: string;
    source: 'wifi' | 'beacon' | 'mobile';
    is_home: boolean;
    ble_active: boolean;
    network_type: string;
    last_time_seen: string;
    created_at: string;
}

export default function Dashboard() {
    const [localizations, setLocalizations] = useState<Localization[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
    const [refreshInterval, setRefreshInterval] = useState(10); // seconds
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [selectedLocalization, setSelectedLocalization] = useState<Localization | null>(null);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [lastPage, setLastPage] = useState(1);

    const fetchData = useCallback(async (showFeedback = true, page = currentPage, itemsPerPage = perPage) => {
        if (showFeedback) setIsRefreshing(true);
        try {
            const response = await axios.get(route('localizations.data'), {
                params: {
                    page: page,
                    per_page: itemsPerPage
                }
            });
            
            // Laravel returns paginated data inside response.data.data
            setLocalizations(response.data.data);
            setCurrentPage(response.data.current_page);
            setLastPage(response.data.last_page);
            setTotalItems(response.data.total);
            setLastRefreshed(new Date());
        } catch (error) {
            console.error('Error fetching localization data:', error);
        } finally {
            setLoading(false);
            if (showFeedback) setIsRefreshing(false);
        }
    }, [currentPage, perPage]);

    useEffect(() => {
        fetchData(false, currentPage, perPage);
        const interval = setInterval(() => {
            fetchData(true, currentPage, perPage);
        }, refreshInterval * 1000);

        return () => clearInterval(interval);
    }, [fetchData, refreshInterval, currentPage, perPage]);

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'wifi': return <Wifi className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
            case 'beacon': return <BeaconIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
            case 'mobile': return <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
            default: return <MapPin className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-gray-500">
                        Live Tracking Feed
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-gray-400">
                            <Settings2 className="w-4 h-4" />
                            <span>Refresh every:</span>
                            <select
                                value={refreshInterval}
                                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                                className="bg-transparent border-none py-0 pl-1 pr-8 text-cyan-600 dark:text-cyan-400 focus:ring-0 cursor-pointer font-bold appearance-none"
                            >
                                <option value={5} className="bg-white dark:bg-gray-900">5s</option>
                                <option value={10} className="bg-white dark:bg-gray-900">10s</option>
                                <option value={30} className="bg-white dark:bg-gray-900">30s</option>
                                <option value={60} className="bg-white dark:bg-gray-900">60s</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Syncing...' : 'Live'}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Live Dashboard" />

            <div className="py-12 px-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Status Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            title="Total Sources"
                            value={totalItems.toString()}
                            icon={<MapPin className="w-5 h-5 text-cyan-600 dark:text-cyan-500" />}
                        />
                        <StatsCard
                            title="Last Seen"
                            value={localizations.length > 0
                                ? new Date(localizations.reduce((latest, current) => {
                                    const currentTime = new Date(current.last_time_seen || current.created_at).getTime();
                                    const latestTime = new Date(latest.last_time_seen || latest.created_at).getTime();
                                    return currentTime > latestTime ? current : latest;
                                }, localizations[0]).last_time_seen || localizations[0].created_at).toLocaleTimeString()
                                : '---'}
                            icon={<Clock className="w-5 h-5 text-blue-600 dark:text-blue-500" />}
                        />
                        <StatsCard
                            title="Home Status"
                            value={localizations.some(l => l.is_home) ? 'At Home' : 'Away'}
                            icon={<Home className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />}
                        />
                        <StatsCard
                            title="Sync Delay"
                            value={`${refreshInterval}s`}
                            icon={<RefreshCw className="w-5 h-5 text-purple-600 dark:text-purple-500" />}
                        />
                    </div>

                    {/* Main Table */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                        <div className="relative overflow-hidden bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">#ID</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Source</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Coordinates</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Locality</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Connectivity</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Last Activity</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4 text-slate-400 dark:text-gray-500">
                                                        <RefreshCw className="w-8 h-8 animate-spin text-cyan-600 dark:text-cyan-500" />
                                                        <span className="animate-pulse">Initializing Tracking Feed...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : localizations.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4 text-slate-300 dark:text-gray-500">
                                                        <MapPin className="w-8 h-8 opacity-20" />
                                                        <span>No localization data received yet.</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            localizations.map((loc) => (
                                                <tr key={loc.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group/row">
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-mono font-bold text-slate-400 dark:text-gray-500">#{loc.id}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                                                {getSourceIcon(loc.source)}
                                                            </div>
                                                            <span className="capitalize font-bold text-slate-700 dark:text-gray-200">{loc.source}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-mono text-sm text-cyan-700 dark:text-cyan-500/80 font-medium">
                                                            {loc.latitude}, {loc.longitude}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {loc.is_home ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold ring-1 ring-inset ring-emerald-200 dark:ring-emerald-500/20">
                                                                <Home className="w-3 h-3" />
                                                                Home
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-xs font-bold ring-1 ring-inset ring-orange-200 dark:ring-orange-500/20">
                                                                <ExternalLink className="w-3 h-3" />
                                                                Remote
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            {loc.ble_active && (
                                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-bold ring-1 ring-inset ring-blue-200 dark:ring-blue-500/20" title="BLE Active">
                                                                    <Bluetooth className="w-3 h-3" />
                                                                    BLE
                                                                </span>
                                                            )}
                                                            {loc.network_type && (
                                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 text-[10px] font-bold border border-slate-200 dark:border-white/10" title={`Network: ${loc.network_type}`}>
                                                                    {loc.network_type === 'wifi' ? <Wifi className="w-3 h-3" /> : <Signal className="w-3 h-3" />}
                                                                    {loc.network_type.toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-gray-400 font-medium">
                                                        {new Date(loc.last_time_seen || loc.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedLocalization(loc);
                                                                setIsMapModalOpen(true);
                                                            }}
                                                            className="p-2 text-slate-400 dark:text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-all"
                                                            title="Locate on Map"
                                                        >
                                                            <MapPin className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            <div className="px-6 py-4 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span>Show:</span>
                                        <select 
                                            value={perPage}
                                            onChange={(e) => {
                                                const newPerPage = Number(e.target.value);
                                                setPerPage(newPerPage);
                                                setCurrentPage(1); // Reset to first page
                                            }}
                                            className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-white/10 rounded-md py-1 pl-2 pr-8 text-cyan-600 dark:text-cyan-400 focus:ring-1 focus:ring-cyan-500/50 cursor-pointer text-xs"
                                        >
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </select>
                                    </div>
                                    <span>Showing {localizations.length} of {totalItems} locations</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-500 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronsLeft className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-500 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-1 px-4 text-sm font-bold text-slate-700 dark:text-gray-200">
                                        <span>Page {currentPage}</span>
                                        <span className="text-slate-400 dark:text-gray-600">/</span>
                                        <span>{lastPage}</span>
                                    </div>

                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.min(lastPage, prev + 1))}
                                        disabled={currentPage === lastPage}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-500 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setCurrentPage(lastPage)}
                                        disabled={currentPage === lastPage}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-500 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronsRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Overlay */}
            <Transition
                show={isRefreshing}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 dark:bg-[#020617]/40 backdrop-blur-[2px]">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
                            <Loader2 className="w-10 h-10 text-cyan-600 dark:text-cyan-400 animate-spin relative" />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">Fetching Live Data</span>
                            <span className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-widest font-medium">Synchronizing...</span>
                        </div>
                    </div>
                </div>
            </Transition>
            <Modal show={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} maxWidth="90%">
                <div className="bg-white dark:bg-[#020617] h-[85vh] flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                <MapPin className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                                    {selectedLocalization?.source} Location
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-gray-400">
                                    {selectedLocalization?.latitude}, {selectedLocalization?.longitude}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMapModalOpen(false)}
                            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 min-h-0">
                        {selectedLocalization && (
                            <MapView
                                data={localizations}
                                activeId={selectedLocalization.id}
                                center={[parseFloat(selectedLocalization.latitude), parseFloat(selectedLocalization.longitude)]}
                                className="h-full rounded-none border-none shadow-none"
                            />
                        )}
                    </div>
                </div>
            </Modal>

            <style>{`
                select option {
                    background: white;
                    color: #020617;
                }
                .dark select option {
                    background: #020617;
                    color: white;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}

function StatsCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all group shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">{title}</span>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/5 group-hover:bg-slate-100 dark:group-hover:bg-white/10 transition-colors">
                    {icon}
                </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</div>
        </div>
    );
}
