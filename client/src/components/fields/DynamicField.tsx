import React from 'react';
import { CustomField } from '../../types';
import styles from './DynamicField.module.css';

interface DynamicFieldProps {
    field: CustomField;
    value: string;
    onChange: (value: string) => void;
}

const DynamicField: React.FC<DynamicFieldProps> = ({ field, value, onChange }) => {
    switch (field.field_type) {
        case 'text':
            return (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.is_required}
                    className={styles.input}
                    placeholder={`הכנס ${field.field_name}`}
                />
            );
        
        case 'number':
            return (
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.is_required}
                    className={styles.input}
                    placeholder={`הכנס ${field.field_name}`}
                />
            );
        
        case 'date':
            return (
                <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.is_required}
                    className={styles.input}
                />
            );
        
        case 'select':
            return (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.is_required}
                    className={styles.select}
                >
                    <option value="">בחר...</option>
                    {field.options && field.options.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            );
        
        default:
            return null;
    }
};

export default DynamicField;