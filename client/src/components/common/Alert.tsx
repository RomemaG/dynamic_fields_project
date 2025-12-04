import React from 'react';
import styles from './Alert.module.css';

interface AlertProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
    if (!message) return null;

    const getAlertClassName = () => {
        switch (type) {
            case 'success':
                return `${styles.alert} ${styles.alertSuccess}`;
            case 'error':
                return `${styles.alert} ${styles.alertError}`;
            case 'info':
                return `${styles.alert} ${styles.alertInfo}`;
            default:
                return `${styles.alert} ${styles.alertDefault}`;
        }
    };

    return (
        <div className={getAlertClassName()}>
            <span>{message}</span>
            {onClose && (
                <button 
                    onClick={onClose}
                    className={styles.closeButton}
                    aria-label="Close"
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default Alert;