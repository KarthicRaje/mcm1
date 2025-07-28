

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import ApiDocs from './pages/ApiDocs';
import AuditLogPage from './pages/AuditLogPage';
import { AuthContext, NotificationContext, ThemeContext } from './contexts';
import { Notification, AuditLog, Topic } from './types';
import DashboardLayout from './components/DashboardLayout';
import { supabase } from './lib/supabaseClient';
import { VAPID_PUBLIC_KEY } from './config';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showPopup, setShowPopup] = useState<Notification | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(localStorage.getItem('theme') as 'light' | 'dark' || 'light');
  
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [pushPermissionStatus, setPushPermissionStatus] = useState<NotificationPermission>('default');

  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Service Worker Registration
  useEffect(() => {
    const registerServiceWorker = () => {
      if (!('serviceWorker' in navigator)) {
        console.log('Service Worker not supported');
        return;
      }
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered: ', registration))
        .catch(error => console.log('SW registration failed: ', error));
    };
    
    // Defer registration until after the window has loaded to avoid race conditions.
    if (document.readyState === 'complete') {
        registerServiceWorker();
    } else {
        window.addEventListener('load', registerServiceWorker);
        return () => window.removeEventListener('load', registerServiceWorker);
    }
  }, []);

  // Theme management
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Check for push notification support
  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsPushSupported(true);
      setPushPermissionStatus(Notification.permission);
    }
  }, []);
  
  // Fetch initial data from Supabase
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchInitialData = async () => {
      const { data: notificationsData, error: notificationsError } = await supabase.from('notifications').select('*').order('timestamp', { ascending: false });
      if (notificationsError) console.error('Error fetching notifications:', notificationsError);
      else setNotifications((notificationsData as Notification[]) || []);

      const { data: auditLogsData, error: auditLogsError } = await supabase.from('audit_logs').select('*').order('timestamp', { ascending: false });
      if (auditLogsError) console.error('Error fetching audit logs:', auditLogsError);
      else setAuditLogs((auditLogsData as AuditLog[]) || []);

      const { data: topicsData, error: topicsError } = await supabase.from('topics').select('*');
      if (topicsError) console.error('Error fetching topics:', topicsError);
      else setTopics((topicsData as Topic[]) || []);
    };
    
    fetchInitialData();
  }, [isAuthenticated]);
  
  // Set up real-time subscriptions
  useEffect(() => {
    if (!isAuthenticated) return;

    const notificationsChannel = supabase.channel('public:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        const newNotification = payload.new as Notification;
        setNotifications(prev => [newNotification, ...prev]);
        setShowPopup(newNotification);
        if (soundEnabled) {
          const audio = audioRef.current;
          if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => {
                // Ignore user-interrupt errors, log others
                if (e.name !== 'AbortError') {
                    console.error("Error playing sound:", e);
                }
            });
          }
        }
        setTimeout(() => setShowPopup(null), 8000);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications' }, (payload) => {
        const updatedNotification = payload.new as Notification;
        setNotifications(prev => prev.map(n => n.id === updatedNotification.id ? updatedNotification : n));
      })
      .subscribe();

    const auditLogsChannel = supabase.channel('public:audit_logs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, (payload) => {
            setAuditLogs(prev => [payload.new as AuditLog, ...prev]);
        }).subscribe();

    const topicsChannel = supabase.channel('public:topics')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'topics' }, async () => {
            const { data: topicsData, error } = await supabase.from('topics').select('*');
            if (error) console.error('Error refetching topics', error)
            else setTopics((topicsData as Topic[]) || []);
        }).subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(auditLogsChannel);
      supabase.removeChannel(topicsChannel);
    };
  }, [isAuthenticated, soundEnabled]);


  const saveSubscriptionToServer = async (subscription: PushSubscription) => {
      // Use endpoint as a unique ID to prevent duplicate subscriptions for the same browser.
      const subJSON = subscription.toJSON();
      const { error } = await supabase.from('push_subscriptions').upsert({
          subscription_object: subJSON,
      }, { onConflict: 'subscription_object' }); // Use the unique constraint from the DB schema
      if (error) {
          console.error("Error saving push subscription:", error);
      } else {
          console.log("Push subscription saved successfully.");
      }
  };


  const requestPushPermission = async () => {
    if (!isPushSupported || !navigator.serviceWorker.ready) return;

    const permission = await Notification.requestPermission();
    setPushPermissionStatus(permission);

    if (permission === 'granted') {
        if (!VAPID_PUBLIC_KEY || VAPID_PUBLIC_KEY.includes('YOUR_VAPID_PUBLIC_KEY')) {
          console.error("VAPID public key not found or not configured in src/config.ts.");
          return;
        }

        const subscription = await navigator.serviceWorker.ready.then(reg => {
            return reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
        });
        
        await saveSubscriptionToServer(subscription);
    }
  };


  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    setNotifications([]);
    setAuditLogs([]);
    setTopics([]);
  };

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'created_at' | 'acknowledged' | 'resolved' | 'comments' | 'snoozed_until' | 'timestamp'>) => {
    try {
        const { error } = await supabase.functions.invoke('api-ingest', {
            body: { ...notification, timestamp: new Date().toISOString() },
        });
        if (error) throw error;
    } catch (error) {
        console.error('Error sending notification:', error);
    }
  }, []);
  
  const acknowledgeNotification = async (id: number) => {
    await supabase.from('notifications').update({ acknowledged: true }).eq('id', id);
  };
  
  const resolveNotification = async (id: number) => {
     await supabase.from('notifications').update({ resolved: true, acknowledged: true }).eq('id', id);
  };

  const snoozeNotification = async (id: number, snoozeUntil: string) => {
     await supabase.from('notifications').update({ snoozed_until: snoozeUntil }).eq('id', id);
  };

  const addComment = async (id: number, commentText: string) => {
    const { data: notification } = await supabase.from('notifications').select('comments').eq('id', id).single();
    if (notification) {
        const newComment = { user: 'Admin', text: commentText, timestamp: new Date().toISOString() };
        const updatedComments = [...(notification.comments as any || []), newComment];
        await supabase.from('notifications').update({ comments: updatedComments }).eq('id', id);
    }
  };

  const createTopic = async (name: string, description: string) => {
    // IMPORTANT: The URL should be updated with the actual Netlify site name after deployment.
    // e.g. "https://my-awesome-alerts.netlify.app/api/notifications/..."
    const endpoint = `https://<YOUR-SITE-NAME>.netlify.app/api/notifications/${name.toLowerCase().replace(/\s+/g, '-')}`;
    await supabase.from('topics').insert({ name, description, subscribed: true, endpoint });
  };

  const toggleTopicSubscription = async (id: string, subscribed: boolean) => {
    await supabase.from('topics').update({ subscribed: !subscribed }).eq('id', id);
  };
  

  const authContextValue = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated]);
  const notificationContextValue = useMemo(() => ({ 
    notifications,
    auditLogs,
    topics,
    addNotification,
    createTopic,
    toggleTopicSubscription,
    acknowledgeNotification, 
    resolveNotification,
    snoozeNotification,
    addComment,
    unreadCount: notifications.filter(n => !n.acknowledged && (!n.snoozed_until || new Date(n.snoozed_until) < new Date())).length,
    soundEnabled,
    setSoundEnabled,
    isPushSupported,
    pushPermissionStatus,
    requestPushPermission,
  }), [notifications, auditLogs, topics, soundEnabled, isPushSupported, pushPermissionStatus, addNotification, createTopic, toggleTopicSubscription, acknowledgeNotification, resolveNotification, snoozeNotification, addComment]);
  
  const themeContextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <NotificationContext.Provider value={notificationContextValue}>
        <ThemeContext.Provider value={themeContextValue}>
          <div className="bg-background dark:bg-dark-background min-h-screen font-sans">
            <HashRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
                
                <Route element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/api-docs" element={<ApiDocs />} />
                  <Route path="/audit-log" element={<AuditLogPage />} />
                </Route>
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </HashRouter>
            {showPopup && (
              <div className="fixed bottom-5 right-5 w-96 bg-surface dark:bg-dark-surface shadow-2xl rounded-lg p-4 border-l-4 border-mcm-accent z-50 animate-pulse">
                  <h3 className="font-bold text-lg text-primary dark:text-dark-primary">{showPopup.title}</h3>
                  <p className="text-secondary dark:text-dark-secondary">{showPopup.message}</p>
                  <button onClick={() => { acknowledgeNotification(showPopup.id); setShowPopup(null); }} className="mt-2 text-sm text-mcm-accent font-semibold">Acknowledge</button>
              </div>
            )}
            <audio ref={audioRef} src="/alert.wav" preload="auto" />
          </div>
        </ThemeContext.Provider>
      </NotificationContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;