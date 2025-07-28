
export enum NotificationPriority {
    Low = 'low',
    Medium = 'medium',
    High = 'high',
}

export interface NotificationComment {
    user: string;
    text: string;
    timestamp: string;
}

export interface Notification {
    id: number;
    created_at: string;
    type: 'site_down' | 'server_alert' | 'custom';
    title: string;
    message: string;
    site: string | null;
    priority: NotificationPriority;
    timestamp: string;
    acknowledged: boolean;
    resolved: boolean;
    snoozed_until: string | null;
    comments: NotificationComment[];
}

export interface Topic {
    id: string;
    created_at: string;
    name: string;
    description: string | null;
    subscribed: boolean;
    endpoint: string;
}

export type AuditLogAction = 'created' | 'acknowledged' | 'resolved' | 'commented' | 'snoozed';

export interface AuditLog {
    id: number;
    created_at: string;
    notification_id: number | null;
    notification_title: string | null;
    action: AuditLogAction;
    user: string;
    timestamp: string;
    details: string | null;
}
