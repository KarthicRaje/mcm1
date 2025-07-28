import React, { useState } from 'react';
import { Clipboard, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-800 dark:bg-black/50 rounded-lg my-4 relative">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-700 dark:bg-gray-900/50 rounded-t-lg">
                <span className="text-xs font-semibold text-gray-300 uppercase">{language}</span>
                <button onClick={copyToClipboard} className="text-gray-300 hover:text-white text-xs font-semibold flex items-center">
                    <Clipboard size={14} className="mr-1" />
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 text-sm text-white overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
    );
};

const siteDownExample = `{
  "type": "site_down",
  "title": "Site Down Alert",
  "message": "example.com is not responding",
  "site": "example.com",
  "priority": "high",
  "timestamp": "2025-07-28T01:25:13.712Z"
}`;

const serverAlertExample = `{
  "type": "server_alert",
  "title": "High CPU Usage",
  "message": "CPU on app-server-1 reached 95%",
  "site": "app-server-1",
  "priority": "medium"
}`;

const customExample = `{
  "type": "custom",
  "title": "Database Backup Failed",
  "message": "Nightly backup for prod-db failed to complete.",
  "priority": "low"
}`;


const ApiDocs: React.FC = () => {
    const [activeTab, setActiveTab] = useState('site_down');

    return (
        <main className="flex-1 bg-background dark:bg-dark-background p-8 overflow-y-auto">
            <h1 className="text-4xl font-bold text-primary dark:text-dark-primary">API Documentation</h1>
            <p className="text-secondary dark:text-dark-secondary mt-1 text-lg">Integration guide for MCM Alerts API</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Overview */}
                    <div className="bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-sm border dark:border-dark-border">
                        <h2 className="text-2xl font-bold text-primary dark:text-dark-primary mb-4">Overview</h2>
                        <p className="text-secondary dark:text-dark-secondary mb-4">The MCM Alerts API allows you to send real-time notifications to subscribed users. Use this API to integrate with your monitoring systems, applications, or services.</p>
                        <div className="flex space-x-2">
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded-full">REST API</span>
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded-full">JSON</span>
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded-full">No Auth Required</span>
                        </div>
                    </div>

                    {/* API Endpoint */}
                    <div className="bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-sm border dark:border-dark-border">
                        <h2 className="text-2xl font-bold text-primary dark:text-dark-primary mb-4">API Endpoint</h2>
                        <div className="bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg p-4 flex items-center justify-between">
                            <code className="text-sm text-primary dark:text-dark-primary font-mono">
                                <span className="font-bold text-green-600 dark:text-green-400">POST</span> https://mcm-new.netlify.app/api/notifications
                            </code>
                            <Clipboard size={18} className="text-secondary cursor-pointer hover:text-primary dark:hover:text-dark-primary"/>
                        </div>
                         <div className="mt-4 text-base text-secondary dark:text-dark-secondary space-y-1">
                            <p><span className="font-semibold text-primary dark:text-dark-primary">Method:</span> POST</p>
                            <p><span className="font-semibold text-primary dark:text-dark-primary">Auth:</span> None Required</p>
                            <p><span className="font-semibold text-primary dark:text-dark-primary">Content-Type:</span> application/json</p>
                        </div>
                    </div>

                    {/* Request Examples */}
                    <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-sm border dark:border-dark-border">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-primary dark:text-dark-primary mb-4">Request Examples</h2>
                             <div className="border-b border-border dark:border-dark-border">
                                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                    <button onClick={() => setActiveTab('site_down')} className={`${activeTab === 'site_down' ? 'border-mcm-accent text-mcm-accent' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-base`}>
                                        Site Down
                                    </button>
                                    <button onClick={() => setActiveTab('server_alert')} className={`${activeTab === 'server_alert' ? 'border-mcm-accent text-mcm-accent' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-base`}>
                                        Server Alert
                                    </button>
                                    <button onClick={() => setActiveTab('custom')} className={`${activeTab === 'custom' ? 'border-mcm-accent text-mcm-accent' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-base`}>
                                        Custom
                                    </button>
                                </nav>
                            </div>
                        </div>
                        <div className="px-6 pb-6">
                            <h3 className="font-semibold text-primary dark:text-dark-primary mb-2">JSON Payload</h3>
                            {activeTab === 'site_down' && <CodeBlock code={siteDownExample} language="json" />}
                            {activeTab === 'server_alert' && <CodeBlock code={serverAlertExample} language="json" />}
                            {activeTab === 'custom' && <CodeBlock code={customExample} language="json" />}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Quick Reference */}
                    <div className="bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-sm border dark:border-dark-border">
                        <h2 className="text-xl font-bold text-primary dark:text-dark-primary mb-4">Quick Reference</h2>
                        <div>
                            <h3 className="font-semibold text-primary dark:text-dark-primary text-base mb-2">Priority Levels</h3>
                            <div className="flex space-x-2">
                                <span className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">low</span>
                                <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 text-xs font-medium px-2.5 py-0.5 rounded-full">medium</span>
                                <span className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 text-xs font-medium px-2.5 py-0.5 rounded-full">high</span>
                            </div>
                        </div>
                        <div className="mt-4">
                             <h3 className="font-semibold text-primary dark:text-dark-primary text-base mb-2">Required Fields</h3>
                             <ul className="list-disc list-inside text-base text-secondary dark:text-dark-secondary space-y-1">
                                <li>type</li>
                                <li>title</li>
                                <li>message</li>
                             </ul>
                        </div>
                         <div className="mt-4">
                             <h3 className="font-semibold text-primary dark:text-dark-primary text-base mb-2">Response Codes</h3>
                             <ul className="list-disc list-inside text-base text-secondary dark:text-dark-secondary space-y-1">
                                <li><span className="font-mono">200</span>: Success</li>
                                <li><span className="font-mono">400</span>: Bad Request</li>
                                <li><span className="font-mono">500</span>: Server Error</li>
                             </ul>
                        </div>
                    </div>

                    {/* Test API */}
                    <div className="bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-sm border dark:border-dark-border">
                        <h2 className="text-xl font-bold text-primary dark:text-dark-primary mb-4">Test API</h2>
                        <p className="text-base text-secondary dark:text-dark-secondary mb-4">Use the dashboard to send test notifications with different priority levels.</p>
                        <Link to="/dashboard" className="w-full bg-primary text-action-text-light dark:bg-mcm-accent dark:text-action-text-dark font-bold py-2 px-4 rounded-lg hover:bg-secondary transition-colors block text-center">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ApiDocs;