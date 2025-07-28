
import React, { useContext, useMemo, useState } from 'react';
import { NotificationContext } from '../src/contexts';
import { AuditLog, AuditLogAction } from '../src/types';
import { ChevronDown, Search } from 'lucide-react';

const actionColors: { [key in AuditLogAction]: string } = {
    created: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    acknowledged: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    commented: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    snoozed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
};

const AuditLogPage: React.FC = () => {
    const { auditLogs } = useContext(NotificationContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('all');

    const filteredLogs = useMemo(() => {
        return auditLogs
            .filter(log => {
                const term = searchTerm.toLowerCase();
                const matchesSearch = term === '' || 
                    log.notificationTitle.toLowerCase().includes(term) ||
                    (log.details && log.details.toLowerCase().includes(term)) ||
                    log.user.toLowerCase().includes(term);

                const matchesAction = actionFilter === 'all' || log.action === actionFilter;

                return matchesSearch && matchesAction;
            })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [auditLogs, searchTerm, actionFilter]);

    return (
        <main className="flex-1 bg-background dark:bg-dark-background p-8 overflow-y-auto">
            <h1 className="text-4xl font-bold text-primary dark:text-dark-primary">Audit Log</h1>
            <p className="text-secondary dark:text-dark-secondary mt-1 text-lg">A detailed history of all notification actions.</p>

            <div className="mt-8 bg-surface dark:bg-dark-surface rounded-lg shadow-sm border dark:border-dark-border">
                <div className="p-4 flex flex-wrap gap-4 justify-between items-center border-b dark:border-dark-border">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full max-w-xs text-sm border-border dark:border-dark-border bg-surface dark:bg-dark-background text-primary dark:text-dark-primary rounded-lg shadow-sm focus:ring-mcm-accent focus:border-mcm-accent"
                        />
                    </div>
                     <select onChange={(e) => setActionFilter(e.target.value)} value={actionFilter} className="appearance-none bg-surface dark:bg-dark-surface text-primary dark:text-dark-primary pl-3 pr-8 py-2 text-sm border border-border dark:border-dark-border rounded-lg focus:ring-mcm-accent focus:border-mcm-accent">
                        <option value="all">All Actions</option>
                        <option value="created">Created</option>
                        <option value="acknowledged">Acknowledged</option>
                        <option value="resolved">Resolved</option>
                        <option value="snoozed">Snoozed</option>
                        <option value="commented">Commented</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-secondary dark:text-dark-secondary">
                        <thead className="text-xs text-primary dark:text-dark-primary uppercase bg-background dark:bg-dark-background/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Timestamp</th>
                                <th scope="col" className="px-6 py-3">Notification</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length > 0 ? filteredLogs.map(log => (
                                <tr key={log.id} className="bg-surface dark:bg-dark-surface border-b dark:border-dark-border hover:bg-background dark:hover:bg-dark-background/50">
                                    <td className="px-6 py-4 font-medium text-primary dark:text-dark-primary whitespace-nowrap">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-secondary dark:text-dark-secondary">
                                        {log.notificationTitle}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${actionColors[log.action]}`}>
                                            {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-secondary dark:text-dark-secondary">{log.user}</td>
                                    <td className="px-6 py-4 text-secondary dark:text-dark-secondary max-w-sm truncate">
                                        {log.details || 'N/A'}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-secondary dark:text-dark-secondary">
                                        No audit logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default AuditLogPage;
