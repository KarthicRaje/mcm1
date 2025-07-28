
import React, { useState, useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext, NotificationContext, ThemeContext } from '../contexts';
import McmLogo from './McmLogo';
import { Bell, Settings, User, LogOut, BarChart2, Moon, Sun, History, Code, LayoutDashboard, Send } from 'lucide-react';
import { NotificationPriority } from '../types';

const Header: React.FC = () => {
    const { logout } = useContext(AuthContext);
    const { unreadCount, soundEnabled, setSoundEnabled, isPushSupported, pushPermissionStatus, requestPushPermission } = useContext(NotificationContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const renderPushSetting = () => {
        if (!isPushSupported) {
            return (
                <div className="flex items-center justify-between">
                    <span className="text-secondary dark:text-dark-secondary">Push Notifications</span>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-200 dark:bg-gray-700 dark:text-gray-400 px-2 py-1 rounded-full">Unsupported</span>
                </div>
            );
        }
        switch (pushPermissionStatus) {
            case 'granted':
                return (
                    <div className="flex items-center justify-between">
                        <span className="text-secondary dark:text-dark-secondary">Push Notifications</span>
                        <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-300 px-2 py-1 rounded-full">Enabled</span>
                    </div>
                );
            case 'denied':
                return (
                    <div className="flex items-center justify-between">
                        <span className="text-secondary dark:text-dark-secondary">Push Notifications</span>
                        <span className="text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-300 px-2 py-1 rounded-full">Denied</span>
                    </div>
                );
            default: // 'default' (prompt)
                return (
                     <button onClick={() => { requestPushPermission(); setSettingsOpen(false); }} className="w-full flex items-center justify-between cursor-pointer text-left">
                        <span className="text-secondary dark:text-dark-secondary">Enable Push</span>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-1 rounded-full">Request</span>
                    </button>
                );
        }
    };

    return (
        <header className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border px-6 py-4 flex justify-between items-center sticky top-0 z-30 flex-shrink-0">
            <div className="flex items-center space-x-4">
                <McmLogo className="h-9 w-9 text-primary dark:text-dark-primary" />
                <span className="text-2xl font-bold text-primary dark:text-dark-primary hidden sm:inline">MCM Alerts</span>
            </div>
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <Bell className="text-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-dark-primary cursor-pointer" size={26} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="relative">
                    <Settings onClick={() => setSettingsOpen(v => !v)} className="text-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-dark-primary cursor-pointer" size={26} />
                    {settingsOpen && (
                        <div className="absolute right-0 mt-2 w-60 bg-surface dark:bg-dark-surface rounded-md shadow-lg border dark:border-dark-border z-40 p-4">
                            <h4 className="font-bold text-primary dark:text-dark-primary">Settings</h4>
                             <div className="mt-4 space-y-4">
                                <button onClick={() => { toggleTheme(); setSettingsOpen(false); }} className="w-full flex items-center justify-between cursor-pointer text-left">
                                  <span className="text-secondary dark:text-dark-secondary">Theme</span>
                                   <div className="flex items-center space-x-2 text-sm text-secondary dark:text-dark-secondary">
                                       {theme === 'light' ? <Moon size={16}/> : <Sun size={16}/>}
                                       <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
                                   </div>
                                </button>
                                <label className="flex items-center justify-between cursor-pointer">
                                  <span className="text-secondary dark:text-dark-secondary">Enable Sounds</span>
                                  <div className="relative">
                                    <input type="checkbox" className="sr-only" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />
                                    <div className={`block w-10 h-6 rounded-full ${soundEnabled ? 'bg-mcm-accent' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${soundEnabled ? 'transform translate-x-4' : ''}`}></div>
                                  </div>
                                </label>
                                <button onClick={() => { navigate('/dashboard?edit=true'); setSettingsOpen(false); }} className="w-full flex items-center justify-between cursor-pointer text-left">
                                    <span className="text-secondary dark:text-dark-secondary">Edit Dashboard</span>
                                    <LayoutDashboard size={16} className="text-secondary dark:text-dark-secondary"/>
                                </button>
                                {renderPushSetting()}
                            </div>
                        </div>
                    )}
                </div>
                 <div className="relative">
                    <User onClick={() => setProfileOpen(!profileOpen)} className="text-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-dark-primary cursor-pointer" size={26} />
                     {profileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-surface dark:bg-dark-surface rounded-md shadow-lg border dark:border-dark-border z-40">
                            <div className="py-1">
                                <div className="px-4 py-2 text-sm text-primary dark:text-dark-primary">
                                    <p className="font-bold">Admin</p>
                                    <p className="text-secondary dark:text-dark-secondary">admin@mcm.com</p>
                                </div>
                                <div className="border-t border-border dark:border-dark-border"></div>
                                <a onClick={() => {logout(); navigate('/login')}} className="flex items-center px-4 py-2 text-sm text-secondary dark:text-dark-secondary hover:bg-background dark:hover:bg-dark-background cursor-pointer">
                                    <LogOut size={16} className="mr-2" />
                                    Logout
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const Sidebar: React.FC = () => {
    const location = useLocation();
    const { addNotification } = useContext(NotificationContext);
    
    const linkClasses = (path: string) => `flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors text-base ${location.pathname === path ? 'bg-mcm-accent/10 text-mcm-accent font-bold' : 'text-secondary dark:text-dark-secondary hover:bg-gray-100 dark:hover:bg-dark-surface hover:text-primary dark:hover:text-dark-primary'}`;
    
    const sendTestAlert = () => {
        addNotification({
            type: 'custom',
            title: 'Test Alert',
            message: 'This is a test alert generated from the sidebar.',
            site: 'dashboard-sidebar',
            priority: NotificationPriority.Low
        });
    }

    return (
        <aside className="w-64 bg-surface dark:bg-dark-surface border-r border-border dark:border-dark-border p-4 flex-shrink-0 flex flex-col">
          <nav className="flex-grow space-y-2">
            <Link to="/dashboard" className={linkClasses('/dashboard')}>
                <BarChart2 size={20} /><span>Dashboard</span>
            </Link>
            <Link to="/audit-log" className={linkClasses('/audit-log')}>
                <History size={20} /><span>Audit Log</span>
            </Link>
            <Link to="/api-docs" className={linkClasses('/api-docs')}>
                <Code size={20}/>
                <span>API Docs</span>
            </Link>
          </nav>
          <div className="mt-6 flex-shrink-0">
            <button 
              onClick={sendTestAlert} 
              className="w-full flex items-center justify-center space-x-2 bg-mcm-accent text-action-text-dark font-bold py-3 px-4 rounded-lg hover:bg-mcm-accent-light transition-colors"
            >
              <Send size={16} />
              <span>Send Test Alert</span>
            </button>
          </div>
        </aside>
    );
}

const DashboardLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-background dark:bg-dark-background">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
