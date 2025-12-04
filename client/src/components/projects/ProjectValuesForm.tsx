import React, { useState, useEffect } from 'react';
import { saveMultipleValues } from '../../services/api';
import { CustomField, FieldValue } from '../../types';
import Alert from '../common/Alert';
import DynamicField from '../fields/DynamicField';
import { useAlert } from '../../hooks/useAlert';
import styles from './ProjectValuesForm.module.css';

interface ProjectValuesFormProps {
    projectId: number;
    fields: CustomField[];
    onCancel: () => void;
    onSave: () => void;
}

const ProjectValuesForm: React.FC<ProjectValuesFormProps> = ({ 
    projectId, 
    fields, 
    onCancel,
    onSave 
}) => {
    const [values, setValues] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState<boolean>(false);
    
    const { alert, showAlert, hideAlert } = useAlert();

    useEffect(() => {
        const initialValues: Record<number, string> = {};
        fields.forEach(field => {
            initialValues[field.id] = field.value || '';
        });
        setValues(initialValues);
    }, [fields]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            const valuesArray: FieldValue[] = Object.entries(values).map(([field_id, value]) => ({
                field_id: parseInt(field_id),
                value: value.toString()
            }));

            await saveMultipleValues(projectId, valuesArray);
            
            showAlert('הנתונים נשמרו בהצלחה!', 'success', 1000);
            
            setTimeout(() => {
                onSave();
            }, 1000);
        } catch (err: any) {
            showAlert(err.response?.data?.error || 'שגיאה בשמירת נתונים', 'error');
            console.error('Error saving values:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (fieldId: number, value: string) => {
        setValues(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    return (
        <div className={styles.container}>
            {alert && (
                <Alert 
                    message={alert.message} 
                    type={alert.type} 
                    onClose={hideAlert}
                />
            )}

            <div className={styles.header}>
                <h2 className={styles.title}>📝 מילוי ערכים</h2>
            </div>

            {fields.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>📋</div>
                    <h3 className={styles.emptyStateTitle}>אין שדות בפרויקט זה</h3>
                    <p className={styles.emptyStateDescription}>
                        עבור ל"ניהול שדות" כדי להוסיף שדות לפרויקט
                    </p>
                    <button onClick={onCancel} className={styles.backButton}>
                        חזור
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formContent}>
                        {fields.map((field) => (
                            <div key={field.id} className={styles.fieldGroup}>
                                <label className={styles.label}>
                                    {field.field_name}
                                    {field.is_required && <span className={styles.required}> *</span>}
                                </label>
                                <DynamicField
                                    field={field}
                                    value={values[field.id] || ''}
                                    onChange={(value) => handleFieldChange(field.id, value)}
                                />
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.buttonContainer}>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className={styles.cancelButton}
                        >
                            ❌ ביטול
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className={styles.submitButton}
                        >
                            {loading ? '💾 שומר...' : '💾 שמור'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ProjectValuesForm;