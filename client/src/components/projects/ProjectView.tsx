import React from 'react';
import { CustomField } from '../../types';
import styles from './ProjectView.module.css';

interface ProjectViewProps {
    projectId: number;
    fields: CustomField[];
    onEdit: () => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ projectId, fields, onEdit }) => {
    const getFieldTypeLabel = (type: string): string => {
        const types: Record<string, string> = {
            'text': 'טקסט',
            'number': 'מספר',
            'date': 'תאריך',
            'select': 'רשימה נפתחת'
        };
        return types[type] || type;
    };

    const formatValue = (field: CustomField): string => {
        if (!field.value || field.value.trim() === '') {
            return '---';
        }
        
        // עיצוב מיוחד לתאריך
        if (field.field_type === 'date') {
            const date = new Date(field.value);
            return date.toLocaleDateString('he-IL');
        }
        
        return field.value;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>📋 פרטי הפרויקט</h2>
                <button onClick={onEdit} className={styles.editButton}>
                    <span>✏️</span>
                    ערוך ערכים
                </button>
            </div>

            {fields.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>📝</div>
                    <h3 className={styles.emptyStateTitle}>אין שדות בפרויקט זה</h3>
                    <p className={styles.emptyStateDescription}>
                        עבור ל"ניהול שדות" כדי להוסיף שדות לפרויקט
                    </p>
                </div>
            ) : (
                <div className={styles.fieldsList}>
                    {fields.map((field, index) => (
                        <div key={field.id} className={styles.fieldItem}>
                            <div className={styles.fieldContent}>
                                <div className={styles.fieldMeta}>
                                    <span className={styles.fieldName}>{field.field_name}</span>
                                    {field.is_required && (
                                        <span className={styles.requiredBadge}>*</span>
                                    )}
                                    <span className={styles.typeBadge}>
                                        {getFieldTypeLabel(field.field_type)}
                                    </span>
                                </div>
                                <div className={field.value ? styles.fieldValue : styles.fieldValueEmpty}>
                                    {formatValue(field)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {fields.length > 0 && (
                <div className={styles.tip}>
                    💡 <strong>טיפ:</strong> לחץ על "ערוך ערכים" כדי למלא או לשנות את הפרטים
                </div>
            )}
        </div>
    );
};

export default ProjectView;