import React from 'react';
import { Link } from 'react-router-dom';
import McmLogo from '../components/McmLogo';
import { Monitor, Bell, Zap, Shield, GitBranch, BellRing, BarChartHorizontal } from 'lucide-react';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-sm border border-border dark:border-dark-border hover:shadow-lg transition-shadow duration-300">
        <div className="bg-mcm-accent/10 text-mcm-accent w-14 h-14 rounded-full flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-primary dark:text-dark-primary mb-2">{title}</h3>
        <p className="text-secondary dark:text-dark-secondary">{description}</p>
    </div>
);

const HowItWorksCard: React.FC<{ icon: React.ReactNode; step: string; title: string; description: string }> = ({ icon, step, title, description }) => (
    <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-20 h-20 bg-surface dark:bg-dark-surface border-2 border-mcm-accent/30 rounded-full mb-4">
            {icon}
        </div>
        <p className="text-mcm-accent font-bold mb-1">{step}</p>
        <h3 className="text-xl font-bold text-primary dark:text-dark-primary mb-2">{title}</h3>
        <p className="text-secondary dark:text-dark-secondary max-w-xs">{description}</p>
    </div>
);


const LandingPage: React.FC = () => {
    return (
        <div className="bg-surface dark:bg-dark-background text-primary">
            {/* Header */}
            <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-border dark:border-dark-border sticky top-0 bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-md z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <McmLogo className="h-10 w-10" />
                        <span className="text-2xl font-bold text-primary dark:text-dark-primary">MCM Alerts</span>
                    </div>
                    <Link to="/login">
                        <button className="bg-primary text-action-text-light dark:bg-mcm-accent dark:text-action-text-dark font-semibold py-2 px-6 rounded-lg hover:bg-secondary dark:hover:bg-mcm-accent-light transition-colors">
                            Sign In
                        </button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative bg-gradient-to-br from-white to-gray-100 dark:from-dark-background dark:to-black overflow-hidden">
                <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center text-center lg:text-left py-24 sm:py-32 px-4">
                    <div>
                        <h1 className="text-5xl sm:text-7xl font-extrabold text-primary dark:text-dark-primary leading-tight">
                            Stay Informed with Real-Time
                        </h1>
                        <h1 className="text-5xl sm:text-7xl font-extrabold text-primary dark:text-dark-primary leading-tight mb-4">
                            <span className="text-mcm-accent">Alerts</span>
                        </h1>
                        <p className="max-w-xl mx-auto lg:mx-0 text-lg text-secondary dark:text-dark-secondary mb-8">
                            MCM Alerts is your reliable notification system for monitoring website uptime, service status, and critical system events. Get instant alerts when it matters most.
                        </p>
                        <Link to="/login">
                            <button className="bg-primary text-action-text-light dark:bg-mcm-accent dark:text-action-text-dark font-semibold py-3 px-8 rounded-lg text-lg hover:bg-secondary dark:hover:bg-mcm-accent-light transition-colors">
                                Get Started
                            </button>
                        </Link>
                    </div>
                    <div className="relative h-64 lg:h-full">
                         <img src="https://user-images.githubusercontent.com/12971295/206622897-40a2a578-f32a-4663-8f52-e1966d56d45e.png" alt="MCM Alerts Dashboard" className="rounded-xl shadow-2xl border-4 border-surface dark:border-dark-border absolute lg:top-1/2 lg:-translate-y-1/2 w-full max-w-xl mx-auto lg:max-w-none lg:w-[120%] lg:-right-10"/>
                    </div>
                </div>
            </main>

             {/* How It Works Section */}
            <section className="bg-surface dark:bg-dark-background py-20 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto text-center">
                     <h2 className="text-4xl font-bold text-primary dark:text-dark-primary mb-4">Simple, Powerful Alerting</h2>
                     <p className="text-lg text-secondary dark:text-dark-secondary max-w-2xl mx-auto mb-16">Get from setup to notification in just three easy steps.</p>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                         <HowItWorksCard
                            icon={<GitBranch size={40} className="text-primary dark:text-mcm-accent"/>}
                            step="STEP 1"
                            title="Integrate API"
                            description="Use our simple REST API to connect your applications and monitoring tools."
                         />
                         <HowItWorksCard
                            icon={<BellRing size={40} className="text-primary dark:text-mcm-accent"/>}
                            step="STEP 2"
                            title="Trigger Events"
                            description="Send a JSON payload to the API endpoint whenever a critical event occurs."
                         />
                          <HowItWorksCard
                            icon={<BarChartHorizontal size={40} className="text-primary dark:text-mcm-accent"/>}
                            step="STEP 3"
                            title="Get Notified"
                            description="Receive instant push notifications with sound on your subscribed devices."
                         />
                     </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-background dark:bg-dark-background py-20 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard 
                            icon={<Monitor size={28} />}
                            title="Site Monitoring"
                            description="Monitor your websites and get instant notifications when they go up or down."
                        />
                        <FeatureCard 
                            icon={<Bell size={28} />}
                            title="Real-time Alerts"
                            description="Receive push notifications with sound alerts for immediate awareness."
                        />
                        <FeatureCard 
                            icon={<Zap size={28} />}
                            title="API Integration"
                            description="Easy integration with external tools like Postman for custom triggers."
                        />
                        <FeatureCard 
                            icon={<Shield size={28} />}
                            title="Secure & Reliable"
                            description="Built with security in mind using modern authentication and encryption."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-surface dark:bg-dark-background py-8 px-4 sm:px-6 lg:px-8 border-t border-border dark:border-dark-border">
                <div className="container mx-auto text-center text-secondary dark:text-dark-secondary">
                    &copy; {new Date().getFullYear()} MCM Alerts. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;