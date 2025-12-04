import React from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
    icon = '📋',
    title, 
    description, 
    actionLabel,
    onAction 
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.icon}>
                {icon}
            </div>
            <h3 className={styles.title}>
                {title}
            </h3>
            {description && (
                <p className={styles.description}>
                    {description}
                </p>
            )}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className={styles.actionButton}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;