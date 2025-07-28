
import React, { useContext } from 'react';
import { NotificationContext } from '../src/contexts';

const StatusIndicator: React.FC<{ color: 'green' | 'yellow' | 'red' | 'gray'; text: string }> = ({ color, text }) => {
    const colorClasses = {
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
        gray: 'bg-gray-500'
    };

    return (
        <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${colorClasses[color]}`}></span>
            <span className="text-sm text-primary dark:text-dark-primary">{text}</span>
        </div>
    );
};

const SystemStatus: React.FC = () => {
    const { isPushSupported, pushPermissionStatus } = useContext(NotificationContext);

    const getPushStatus = (): { color: 'green' | 'yellow' | 'red' | 'gray'; text: string } => {
        if (!isPushSupported) {
            return { color: 'gray', text: 'Push: Unsupported' };
        }
        switch (pushPermissionStatus) {
            case 'granted':
                return { color: 'green', text: 'Push: Enabled' };
            case 'denied':
                return { color: 'red', text: 'Push: Denied' };
            case 'default': // prompt
                return { color: 'yellow', text: 'Push: Needs Permission' };
            default:
                return { color: 'gray', text: 'Push: Unknown' };
        }
    };
    
    const serviceStatus = { color: 'green', text: 'Service: Operational' } as const;
    const dataStatus = { color: 'green', text: 'Data Storage: Local' } as const;
    const pushStatus = getPushStatus();

    // Simulate some active listeners for demonstration
    const inAppListeners = 1;
    const pushListeners = pushPermissionStatus === 'granted' ? 1 : 0;

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-xl font-bold text-primary dark:text-dark-primary mb-4 text-center">System Status</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 flex-grow">
                <StatusIndicator color={serviceStatus.color} text={serviceStatus.text} />
                <StatusIndicator color={dataStatus.color} text={dataStatus.text} />
                <StatusIndicator color={pushStatus.color} text={pushStatus.text} />
            </div>
            <div className="border-t border-border dark:border-dark-border mt-auto pt-3 text-center">
                <p className="text-xs text-secondary dark:text-dark-secondary">
                    In-App Listeners: {inAppListeners} | Push Listeners: {pushListeners}
                </p>
            </div>
        </div>
    );
};

export default SystemStatus;
