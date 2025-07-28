
import React from 'react';

interface DonutChartProps {
    stats: {
        new: number;
        acknowledged: number;
        resolved: number;
        total: number;
    };
    size?: number;
    strokeWidth?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ stats, size = 140, strokeWidth = 18 }) => {
    const { new: newCount, acknowledged } = stats;
    const total = stats.total;
    
    const EmptyState = () => (
        <div className="h-full flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-primary dark:text-dark-primary mb-4 text-center">Alerts Overview</h3>
            <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={(size - strokeWidth) / 2}
                        fill="none"
                        stroke="currentColor"
                        className="text-border dark:text-dark-border"
                        strokeWidth={strokeWidth}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-bold text-primary dark:text-dark-primary">0</span>
                    <span className="text-sm text-secondary dark:text-dark-secondary -mt-1">Total</span>
                </div>
            </div>
        </div>
    );

    if (total === 0) {
        return <EmptyState />;
    }

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const newPercent = (newCount / total) * 100;
    const acknowledgedPercent = (acknowledged / total) * 100;
    
    const newOffset = 0;
    const acknowledgedOffset = newPercent;
    
    const segments = [
        { percent: newPercent, color: 'text-yellow-400', offset: newOffset, label: 'New', value: newCount },
        { percent: acknowledgedPercent, color: 'text-blue-400', offset: acknowledgedOffset, label: 'Acknowledged', value: acknowledged },
    ];
    
    return (
        <div className="h-full flex flex-col">
             <h3 className="text-2xl font-bold text-primary dark:text-dark-primary mb-4 text-center flex-shrink-0">Active Alerts</h3>
             <div className="flex-grow flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="relative" style={{width: size, height: size}}>
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                        {/* Background circle */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            className="text-border dark:text-dark-border"
                            strokeWidth={strokeWidth}
                        />
                        {/* Segments */}
                        {segments.map((segment, index) => segment.percent > 0 && (
                            <circle
                                key={index}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke="currentColor"
                                className={segment.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference - (segment.percent / 100) * circumference}
                                style={{ transform: `rotate(${(segment.offset / 100) * 360}deg)`, transformOrigin: 'center' }}
                                strokeLinecap="round"
                                
                            />
                        ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-4xl font-bold text-primary dark:text-dark-primary">{total}</span>
                        <span className="text-sm text-secondary dark:text-dark-secondary -mt-1">Total Active</span>
                    </div>
                </div>

                <div className="w-full sm:w-auto sm:max-w-[200px] space-y-3">
                    {segments.map(s => (
                        <div key={s.label} className="flex justify-between items-center text-base">
                            <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${s.color.replace('text-', 'bg-')}`}></div>
                                <span className="text-secondary dark:text-dark-secondary">{s.label}</span>
                            </div>
                            <span className="font-bold text-primary dark:text-dark-primary">{s.value}</span>
                        </div>
                    ))}
                     <div className="flex justify-between items-center text-base">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            <span className="text-secondary dark:text-dark-secondary">Resolved</span>
                        </div>
                        <span className="font-bold text-primary dark:text-dark-primary">{stats.resolved}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonutChart;
