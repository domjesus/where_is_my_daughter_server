import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Shield, Smartphone, Radio, MapPin, CheckCircle } from 'lucide-react';
import ThemeToggle from '@/Components/ThemeToggle';

export default function Welcome({
    auth,
}: PageProps) {
    return (
        <>
            <Head title="Where's My Daughter - Advanced IoT Tracking" />
            <div className="min-h-screen bg-white text-slate-900 dark:bg-[#020617] dark:text-white selection:bg-cyan-500 selection:text-white overflow-x-hidden transition-colors duration-300">
                {/* Navbar */}
                <nav className="fixed top-0 w-full z-50 border-b border-gray-200 bg-white/80 dark:border-white/10 dark:bg-[#020617]/80 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <Radio className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-gray-400">
                                Where's My Daughter
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <ThemeToggle />
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition-all active:scale-95"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none -z-10 opacity-50 dark:opacity-100" />
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-slide-up">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                </span>
                                Next-Gen IoT Tracking
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                                Precise Tracking <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                    Simplified.
                                </span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-xl">
                                Seamlessly track location using our hybrid system of Smartphone GPS and BLE Beacon technology. Complete with authorized access and privacy-first design.
                            </p>
                            <div className="flex items-center gap-4">
                                <Link href={route('register')} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all active:scale-95">
                                    Start Tracking
                                </Link>
                                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                                    Learn More
                                </button>
                            </div>
                            <div className="flex items-center gap-8 pt-4 grayscale opacity-50">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg" alt="Android" className="h-8" />
                                <div className="flex items-center gap-2 font-bold text-lg"><Radio className="w-5 h-5"/> BLE Beacon</div>
                            </div>
                        </div>
                        <div className="relative animate-fade-in group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <img 
                                    src="/images/hero.png" 
                                    alt="Advanced Tracking Interface" 
                                    className="w-full h-auto transform transition duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 px-6 bg-slate-50 dark:bg-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center space-y-4 mb-16">
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">How It Works</h2>
                            <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto italic">
                                "Track with precision, monitor with ease, respecting privacy at every step."
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={<Smartphone className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />}
                                title="Android Integration"
                                description="Our dedicated companion app continuously updates location via GPS with minimal battery consumption."
                            />
                            <FeatureCard 
                                icon={<Radio className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
                                title="BLE Beacon Support"
                                description="Use Bluetooth Low Energy devices for hyper-local tracking when GPS is unavailable or indoors."
                            />
                            <FeatureCard 
                                icon={<Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />}
                                title="Authorized Privacy"
                                description="Secure tracking that requires explicit user authorization at every step. Your data is encrypted and private."
                            />
                        </div>
                    </div>
                </section>

                {/* Tracking Specs Section */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Hybrid Positioning Protocol</h2>
                            <p className="text-slate-600 dark:text-gray-400 text-lg">
                                Our system intelligently switches between location sources to provide the most accurate data while saving energy.
                            </p>
                            <ul className="space-y-4">
                                <SpecItem text="Wifi, Beacon, and Mobile Network Fallbacks" />
                                <SpecItem text="Real-time last_time_seen recording" />
                                <SpecItem text="Deep Location History Analytics" />
                                <SpecItem text="Geofencing with Home/Work status" />
                            </ul>
                        </div>
                        <div className="bg-slate-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl space-y-8">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-slate-500 dark:text-gray-400">
                                    <span>Precision Accuracy</span>
                                    <span>99%</span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500 w-[99%] shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-slate-500 dark:text-gray-400">
                                    <span>Signal Resilience</span>
                                    <span>95%</span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[95%]"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-slate-500 dark:text-gray-400">
                                    <span>Battery Efficiency</span>
                                    <span>92%</span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[92%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-6 border-t border-slate-200 dark:border-white/10 text-center text-slate-500 dark:text-gray-500">
                    <p className="mb-4">© 2026 Where's My Daughter IoT Tracking System. Built for Precision.</p>
                    <div className="flex justify-center gap-6">
                        <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors text-sm">Privacy Policy</Link>
                        <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors text-sm">Terms of Service</Link>
                    </div>
                </footer>
            </div>

            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.8s ease-out forwards;
                }
                .animate-fade-in {
                    animation: fade-in 1.2s ease-out forwards;
                }
            `}</style>
        </>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-2xl bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 transition-all hover:scale-[1.02] duration-300 shadow-sm dark:shadow-none">
            <div className="mb-6 inline-block">{icon}</div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{title}</h3>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-sm">{description}</p>
        </div>
    );
}

function SpecItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-500" />
            <span className="text-slate-600 dark:text-gray-300">{text}</span>
        </li>
    );
}
