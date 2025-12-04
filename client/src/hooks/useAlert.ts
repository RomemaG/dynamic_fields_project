import { useState } from 'react';

type AlertType = 'success' | 'error' | 'info';

interface AlertState {
    message: string;
    type: AlertType;
}

export const useAlert = () => {
    const [alert, setAlert] = useState<AlertState | null>(null);

    const showAlert = (message: string, type: AlertType = 'info', duration: number = 3000) => {
        setAlert({ message, type });
        
        if (duration > 0) {
            setTimeout(() => {
                setAlert(null);
            }, duration);
        }
    };

    const hideAlert = () => {
        setAlert(null);
    };

    return { 
        alert, 
        showAlert, 
        hideAlert 
    };
};