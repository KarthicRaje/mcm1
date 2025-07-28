
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Responsive, WidthProvider, Layouts, Layout } from 'react-grid-layout';
import { NotificationContext } from '../contexts';
import { Notification, NotificationPriority, Topic, NotificationComment } from '../types';
import { CheckCircle, AlertTriangle, MessageSquare, Send, Plus, ChevronDown, Check, Info, ServerCrash, Clock, X, GripVertical } from 'lucide-react';
import DonutChart from '../components/DonutChart';
import SystemStatus from '../components/SystemStatus';

const GridLayout = WidthProvider(Responsive);

const LAYOUT_VERSION = '1.5'; // Removed 'Actions' widget from dashboard

const PriorityBadge: React.FC<{ priority: NotificationPriority }> = ({ priority }) => {
    const colors = {
        [NotificationPriority.Low]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        [NotificationPriority.Medium]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        [NotificationPriority.High]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[priority]}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
    );
};

const NotificationCard: React.FC<{ notification: Notification }> = ({ notification }) => {
    const { resolveNotification, addComment, acknowledgeNotification, snoozeNotification } = useContext(NotificationContext);
    const [expanded, setExpanded] = useState(false);
    const [comment, setComment] = useState('');
    const [snoozeOpen, setSnoozeOpen] = useState(false);
    const isSnoozed = notification.snoozed_until && new Date(notification.snoozed_until) > new Date();

    const handleAddComment = () => {
        if (comment.trim()) {
            addComment(notification.id, comment.trim());
            setComment('');
        }
    };

    const handleSnooze = (minutes: number) => {
        const snoozeUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
        snoozeNotification(notification.id, snoozeUntil);
        setSnoozeOpen(false);
    }
    
    const statusIcon = () => {
        if (notification.resolved) return <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"><CheckCircle size={20}/></div>;
        if (isSnoozed) return <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"><Clock size={20}/></div>;
        if (notification.acknowledged) return <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"><Check size={20}/></div>;
        return <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400"><AlertTriangle size={20}/></div>;
    }

    return (
        <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center space-x-4">
                     {statusIcon()}
                    <div>
                        <h4 className="font-bold text-lg text-primary dark:text-dark-primary">{notification.title}</h4>
                        <p className="text-sm text-secondary dark:text-dark-secondary">{notification.message}</p>
                         {isSnoozed && <p className="text-xs text-gray-500 dark:text-gray-500 italic mt-1">Snoozed until {new Date(notification.snoozed_until!).toLocaleTimeString()}</p>}
                    </div>
                </div>
                <div className="flex flex-col items-end space-y-1 flex-shrink-0 ml-4">
                    <PriorityBadge priority={notification.priority} />
                    <span className="text-xs text-gray-400 dark:text-dark-secondary">{new Date(notification.timestamp).toLocaleString()}</span>
                </div>
            </div>
            {expanded && (
                <div className="mt-4 pt-4 border-t border-border dark:border-dark-border">
                    <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2">
                        {notification.comments && notification.comments.length > 0 ? (notification.comments as NotificationComment[]).map((c, i) => (
                             <div key={i} className="flex items-start space-x-3">
                                <div className="bg-gray-200 dark:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm text-secondary dark:text-dark-primary flex-shrink-0">
                                    {c.user.charAt(0)}
                                </div>
                                <div className="flex-1 bg-background dark:bg-dark-background rounded-lg p-2">
                                    <div className="flex justify-between items-center">
                                       <p className="font-semibold text-sm text-primary dark:text-dark-primary">{c.user}</p>
                                       <p className="text-xs text-gray-400 dark:text-dark-secondary">{new Date(c.timestamp).toLocaleString()}</p>
                                    </div>
                                    <p className="text-sm text-secondary dark:text-dark-secondary">{c.text}</p>
                                </div>
                            </div>
                        )) : (
                             <p className="text-sm text-gray-400 dark:text-dark-secondary italic text-center py-2">No comments yet.</p>
                        )}
                    </div>

                    <div className="flex space-x-2 items-center mb-4">
                        <MessageSquare size={20} className="text-gray-400 dark:text-dark-secondary"/>
                        <input 
                            type="text" 
                            placeholder="Add a comment..." 
                            className="flex-grow bg-surface dark:bg-dark-background border-border dark:border-dark-border text-primary dark:text-dark-primary rounded-lg shadow-sm focus:ring-mcm-accent focus:border-mcm-accent text-sm"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                         <button onClick={handleAddComment} className="p-2 rounded-full bg-primary text-action-text-light dark:bg-mcm-accent dark:text-action-text-dark hover:bg-secondary">
                             <Send size={16}/>
                         </button>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                        {!notification.acknowledged && !notification.resolved && (
                            <button onClick={() => acknowledgeNotification(notification.id)} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center space-x-2">
                                <Check size={16}/>
                                <span>Acknowledge</span>
                            </button>
                        )}
                        {!notification.resolved && (
                             <div className="relative inline-block">
                                <button onClick={() => setSnoozeOpen(v => !v)} className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center space-x-2">
                                    <Clock size={16}/>
                                    <span>Snooze</span>
                                </button>
                                {snoozeOpen && (
                                    <div className="absolute bottom-full right-0 mb-2 w-40 bg-surface dark:bg-dark-surface rounded-md shadow-lg border dark:border-dark-border z-10">
                                        <a onClick={() => handleSnooze(15)} className="block px-4 py-2 text-sm text-primary dark:text-dark-primary hover:bg-background dark:hover:bg-dark-background cursor-pointer">15 Minutes</a>
                                        <a onClick={() => handleSnooze(60)} className="block px-4 py-2 text-sm text-primary dark:text-dark-primary hover:bg-background dark:hover:bg-dark-background cursor-pointer">1 Hour</a>
                                        <a onClick={() => handleSnooze(1440)} className="block px-4 py-2 text-sm text-primary dark:text-dark-primary hover:bg-background dark:hover:bg-dark-background cursor-pointer">1 Day</a>
                                    </div>
                                )}
                            </div>
                        )}
                         {!notification.resolved && (
                            <button onClick={() => resolveNotification(notification.id)} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center space-x-2">
                                <CheckCircle size={16}/>
                                <span>Mark as Resolved</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Extracted form component to prevent re-renders of the entire dashboard on key press
const CreateTopicForm: React.FC<{ onAddTopic: (name: string, description: string) => void }> = ({ onAddTopic }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleAdd = () => {
        if (name.trim()) {
            onAddTopic(name, description);
            setName('');
            setDescription('');
        }
    };

    return (
        <div className="pt-4 border-t border-border dark:border-dark-border mt-auto flex-shrink-0">
            <h4 className="font-semibold text-primary dark:text-dark-primary mb-2">Create New Topic</h4>
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Topic Name"
                    className="w-full border-border dark:border-dark-border bg-surface dark:bg-dark-background text-primary dark:text-dark-primary rounded-lg shadow-sm focus:ring-mcm-accent focus:border-mcm-accent text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    rows={2}
                    className="w-full border-border dark:border-dark-border bg-surface dark:bg-dark-background text-primary dark:text-dark-primary rounded-lg shadow-sm focus:ring-mcm-accent focus:border-mcm-accent text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button
                    onClick={handleAdd}
                    className="w-full flex items-center justify-center space-x-2 bg-primary dark:bg-mcm-accent dark:text-action-text-dark text-action-text-light p-2 rounded-lg hover:bg-secondary"
                >
                    <Plus size={20} /> <span>Add Topic</span>
                </button>
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
    const { notifications, topics, createTopic, toggleTopicSubscription } = useContext(NotificationContext);
    
    const [statusFilter, setStatusFilter] = useState('active');
    const [typeFilter, setTypeFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('all');
    const [customRange, setCustomRange] = useState({ start: '', end: '' });

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isEditMode = searchParams.get('edit') === 'true';

    const defaultLayouts: Layouts = {
        lg: [ // 12 columns
            { i: 'notifications', x: 0, y: 0, w: 8, h: 18, minW: 4, minH: 6 },
            { i: 'stats', x: 8, y: 0, w: 4, h: 7, minW: 3, minH: 6 },
            { i: 'system-status', x: 8, y: 7, w: 4, h: 4, minW: 3, minH: 4 },
            { i: 'subscriptions', x: 8, y: 11, w: 4, h: 7, minW: 3, minH: 6 },
        ],
        md: [ // 10 columns
            { i: 'notifications', x: 0, y: 0, w: 6, h: 18, minW: 4, minH: 6 },
            { i: 'stats', x: 6, y: 0, w: 4, h: 7, minW: 3, minH: 6 },
            { i: 'system-status', x: 6, y: 7, w: 4, h: 4, minW: 3, minH: 4 },
            { i: 'subscriptions', x: 6, y: 11, w: 4, h: 7, minW: 3, minH: 6 },
        ],
        sm: [ // 6 columns
            { i: 'stats', x: 0, y: 0, w: 6, h: 6 },
            { i: 'system-status', x: 0, y: 6, w: 6, h: 4 },
            { i: 'notifications', x: 0, y: 10, w: 6, h: 9 },
            { i: 'subscriptions', x: 0, y: 19, w: 6, h: 7 },
        ],
        xs: [ // 4 columns
            { i: 'stats', x: 0, y: 0, w: 4, h: 6 },
            { i: 'system-status', x: 0, y: 6, w: 4, h: 4 },
            { i: 'notifications', x: 0, y: 10, w: 4, h: 9 },
            { i: 'subscriptions', x: 0, y: 19, w: 4, h: 7 },
        ],
        xxs: [ // 2 columns
            { i: 'stats', x: 0, y: 0, w: 2, h: 6 },
            { i: 'system-status', x: 0, y: 6, w: 2, h: 4 },
            { i: 'notifications', x: 0, y: 10, w: 2, h: 9 },
            { i: 'subscriptions', x: 0, y: 19, w: 2, h: 7 },
        ],
    };

    const getLayoutFromLS = (): Layouts => {
        try {
            const savedItem = localStorage.getItem('dashboardLayout');
            if (savedItem) {
                const { version, layouts } = JSON.parse(savedItem);
                if (version === LAYOUT_VERSION) {
                    return layouts;
                }
            }
            return defaultLayouts;
        } catch (e) {
            return defaultLayouts;
        }
    }

    const [layouts, setLayouts] = useState<Layouts>(getLayoutFromLS());
    const [tempLayouts, setTempLayouts] = useState<Layouts | null>(null);

    useEffect(() => {
        if(isEditMode) {
            setTempLayouts(JSON.parse(JSON.stringify(layouts))); // deep copy
        } else {
            setTempLayouts(null);
        }
    }, [isEditMode, layouts]);

    const handleLayoutChange = (layout: Layout[], allLayouts: Layouts) => {
        if (isEditMode) {
             setTempLayouts(allLayouts);
        }
    };
    
    const onSaveLayout = () => {
        if(tempLayouts) {
            setLayouts(tempLayouts);
            const dataToSave = {
                version: LAYOUT_VERSION,
                layouts: tempLayouts,
            };
            localStorage.setItem('dashboardLayout', JSON.stringify(dataToSave));
        }
        navigate('/dashboard');
    }
    
    const onCancelLayout = () => {
        navigate('/dashboard');
    }
    
    const stats = useMemo(() => {
        const now = new Date();
        const activeNotifications = notifications.filter(n => !n.resolved && (!n.snoozed_until || new Date(n.snoozed_until) < now));
        return {
            total: activeNotifications.length,
            new: activeNotifications.filter(n => !n.acknowledged).length,
            acknowledged: activeNotifications.filter(n => n.acknowledged).length,
            resolved: notifications.filter(n => n.resolved).length, // total resolved
        };
    }, [notifications]);

    const filteredNotifications = useMemo(() => {
        let filtered = notifications;
        const now = new Date();

        if (statusFilter === 'active') {
             filtered = filtered.filter(n => !n.resolved && (!n.snoozed_until || new Date(n.snoozed_until) < now));
        } else if (statusFilter === 'new') {
            filtered = filtered.filter(n => !n.acknowledged && !n.resolved && (!n.snoozed_until || now < new Date(n.snoozed_until)));
        } else if (statusFilter === 'snoozed') {
            filtered = filtered.filter(n => n.snoozed_until && new Date(n.snoozed_until) > now);
        } else if (statusFilter === 'resolved') {
            filtered = filtered.filter(n => n.resolved);
        }
        
        if (timeFilter === '1h') {
            filtered = filtered.filter(n => now.getTime() - new Date(n.timestamp).getTime() < 3600 * 1000);
        } else if (timeFilter === '24h') {
            filtered = filtered.filter(n => now.getTime() - new Date(n.timestamp).getTime() < 24 * 3600 * 1000);
        } else if (timeFilter === '7d') {
            filtered = filtered.filter(n => now.getTime() - new Date(n.timestamp).getTime() < 7 * 24 * 3600 * 1000);
        } else if (timeFilter === 'custom' && customRange.start && customRange.end) {
            const start = new Date(customRange.start).getTime();
            const end = new Date(customRange.end).getTime() + (24 * 3600 * 1000 - 1);
            filtered = filtered.filter(n => {
                const ts = new Date(n.timestamp).getTime();
                return ts >= start && ts <= end;
            });
        }
        if (typeFilter !== 'all') {
            filtered = filtered.filter(n => n.type === typeFilter);
        }
        return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [notifications, statusFilter, typeFilter, timeFilter, customRange]);
    
    const FilterSelect: React.FC<{ value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }> = ({ value, onChange, children }) => (
        <div className="relative">
            <select onChange={onChange} value={value} className="appearance-none w-full bg-surface dark:bg-dark-surface text-primary dark:text-dark-primary pl-3 pr-8 py-2 text-sm border border-border dark:border-dark-border rounded-lg focus:ring-mcm-accent focus:border-mcm-accent">
                {children}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary dark:text-dark-secondary pointer-events-none" />
        </div>
    );
    
    const GridItemWrapper: React.FC<{isEditMode: boolean, children: React.ReactNode}> = ({isEditMode, children}) => (
        <div className={`h-full w-full bg-surface dark:bg-dark-surface rounded-lg shadow-sm border dark:border-dark-border flex flex-col ${isEditMode ? 'border-mcm-accent border-dashed' : ''}`}>
             {isEditMode && <div className="drag-handle cursor-move w-full p-1 bg-mcm-accent/20 flex justify-center items-center text-mcm-accent"><GripVertical size={16}/></div>}
            <div className="flex-1 overflow-y-auto h-full p-4 sm:p-6">
                {children}
            </div>
        </div>
    );

    return (
        <main className="flex-1 bg-background dark:bg-dark-background p-4 sm:p-6 lg:p-8 flex flex-col overflow-y-hidden">
            {isEditMode && (
                <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg mb-4 flex justify-between items-center">
                    <p className="font-semibold">Edit Mode: Drag and resize widgets to customize your dashboard.</p>
                    <div className="space-x-2">
                        <button onClick={onSaveLayout} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600">Save Layout</button>
                        <button onClick={onCancelLayout} className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600">Cancel</button>
                    </div>
                </div>
            )}
            <GridLayout
                className="layout"
                layouts={isEditMode ? tempLayouts ?? layouts : layouts}
                onLayoutChange={handleLayoutChange}
                isDraggable={isEditMode}
                isResizable={isEditMode}
                draggableHandle=".drag-handle"
                rowHeight={30}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                containerPadding={[10, 10]}
            >
                <div key="notifications">
                    <GridItemWrapper isEditMode={isEditMode}>
                        <div className="flex flex-col h-full">
                            <div className="flex flex-wrap gap-4 justify-between items-center mb-6 flex-shrink-0">
                                <h2 className="text-3xl font-bold text-primary dark:text-dark-primary">Recent Notifications</h2>
                                 <div className="flex items-center space-x-2 flex-wrap gap-2">
                                     <FilterSelect onChange={(e) => setTimeFilter(e.target.value)} value={timeFilter}>
                                        <option value="all">All Time</option> <option value="1h">Last Hour</option> <option value="24h">Last 24h</option> <option value="7d">Last 7 Days</option> <option value="custom">Custom</option>
                                    </FilterSelect>
                                    <FilterSelect onChange={(e) => setTypeFilter(e.target.value)} value={typeFilter}>
                                        <option value="all">All Types</option> <option value="site_down">Site Down</option> <option value="server_alert">Server Alert</option> <option value="custom">Custom</option>
                                    </FilterSelect>
                                    <FilterSelect onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                                        <option value="active">Active</option>
                                        <option value="all">All</option>
                                        <option value="new">New</option>
                                        <option value="snoozed">Snoozed</option>
                                        <option value="resolved">Resolved</option>
                                    </FilterSelect>
                                </div>
                            </div>
                             {timeFilter === 'custom' && (
                                <div className="bg-surface dark:bg-dark-surface p-3 rounded-lg border dark:border-dark-border mb-4 flex items-center gap-4 flex-shrink-0">
                                    <input type="date" value={customRange.start} onChange={e => setCustomRange(p => ({...p, start: e.target.value}))} className="text-sm border-border dark:border-dark-border bg-background dark:bg-dark-background rounded-lg shadow-sm"/>
                                     <span className="text-secondary dark:text-dark-secondary">to</span>
                                    <input type="date" value={customRange.end} onChange={e => setCustomRange(p => ({...p, end: e.target.value}))} className="text-sm border-border dark:border-dark-border bg-background dark:bg-dark-background rounded-lg shadow-sm"/>
                                </div>
                            )}
                            <div className="flex-1 space-y-4 overflow-y-auto pr-2 -mr-2">
                                {filteredNotifications.length > 0 ? (
                                    filteredNotifications.map(n => <NotificationCard key={n.id} notification={n} />)
                                ) : (
                                    <div className="text-center py-20 bg-surface dark:bg-dark-surface rounded-lg border-2 border-dashed border-border dark:border-dark-border">
                                         <ServerCrash size={48} className="mx-auto text-gray-300 dark:text-dark-border" />
                                        <h3 className="mt-2 text-xl font-semibold text-primary dark:text-dark-primary">No Notifications</h3>
                                        <p className="mt-1 text-sm text-secondary dark:text-dark-secondary">No alerts match filters. Send a test alert!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </GridItemWrapper>
                </div>
                <div key="stats">
                    <GridItemWrapper isEditMode={isEditMode}>
                        <DonutChart stats={stats} />
                    </GridItemWrapper>
                </div>
                <div key="system-status">
                     <GridItemWrapper isEditMode={isEditMode}>
                        <SystemStatus />
                    </GridItemWrapper>
                </div>
                <div key="subscriptions">
                     <GridItemWrapper isEditMode={isEditMode}>
                        <div className="h-full flex flex-col">
                            <h3 className="text-2xl font-bold text-primary dark:text-dark-primary mb-4 flex-shrink-0">Subscriptions</h3>
                            <div className="flex-1 space-y-4 overflow-y-auto pr-2 -mr-2 mb-4">
                               {topics.length > 0 ? topics.map(topic => (
                                   <div key={topic.id} className="pb-2 border-b last:border-b-0 border-border dark:border-dark-border">
                                       <div className="flex items-center justify-between">
                                           <span className="font-semibold text-lg text-primary dark:text-dark-primary">{topic.name}</span>
                                           <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={topic.subscribed} onChange={() => toggleTopicSubscription(topic.id, topic.subscribed)} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-mcm-accent peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mcm-accent"></div>
                                            </label>
                                       </div>
                                       {topic.description && <p className="text-sm text-secondary dark:text-dark-secondary mt-1">{topic.description}</p>}
                                   </div>
                               )) : <p className="text-sm text-center text-secondary dark:text-dark-secondary py-4">No topics created yet.</p>}
                            </div>
                            <CreateTopicForm onAddTopic={createTopic} />
                        </div>
                    </GridItemWrapper>
                </div>
            </GridLayout>
        </main>
    );
}

export default Dashboard;
