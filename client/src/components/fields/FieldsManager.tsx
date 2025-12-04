import React, { useState, useEffect } from 'react';
import { getProjectFields, createField, updateField, deleteField } from '../../services/api';
import { CustomField } from '../../types';
import Alert from '../common/Alert';
import Modal from '../common/Modal';
import FieldForm, { FieldFormData } from './FieldForm';
import { useAlert } from '../../hooks/useAlert';
import styles from './FieldsManager.module.css';

interface FieldsManagerProps {
    projectId: number;
    onFieldsChange?: () => void; 
}

const FieldsManager: React.FC<FieldsManagerProps> = ({ projectId, onFieldsChange }) => {
    const [fields, setFields] = useState<CustomField[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingField, setEditingField] = useState<CustomField | null>(null);
    
    const { alert, showAlert, hideAlert } = useAlert();

    useEffect(() => {
        if (projectId) {
            loadFields();
        }
    }, [projectId]);

    const loadFields = async () => {
        try {
            setLoading(true);
            const response = await getProjectFields(projectId);
            setFields(response.data.data || []);
        } catch (err) {
            showAlert('שגיאה בטעינת שדות', 'error');
            console.error('Error loading fields:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditingField(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (field: CustomField) => {
        setEditingField(field);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingField(null);
    };

    const handleSubmitField = async (fieldData: FieldFormData) => {
        try {
            if (editingField) {
                await updateField(projectId, editingField.id, fieldData);
                showAlert('השדה עודכן בהצלחה!', 'success');
            } else {
                await createField(projectId, fieldData);
                showAlert('השדה נוצר בהצלחה!', 'success');
            }
            
            handleCloseModal();
            loadFields();

            if (onFieldsChange) {
                onFieldsChange();
            }

        } catch (err: any) {
            showAlert(err.response?.data?.error || 'שגיאה בשמירת השדה', 'error');
            console.error('Error submitting field:', err);
            throw err;
        }
    };

    const handleDeleteField = async (fieldId: number, fieldName: string) => {
        if (!window.confirm(`האם אתה בטוח שברצונך למחוק את השדה "${fieldName}"?`)) {
            return;
        }
        
        try {
            await deleteField(projectId, fieldId);
            showAlert('השדה נמחק בהצלחה!', 'success');
            loadFields();

            if (onFieldsChange) {
                onFieldsChange();
            }

        } catch (err: any) {
            showAlert(err.response?.data?.error || 'שגיאה במחיקת השדה', 'error');
            console.error('Error deleting field:', err);
        }
    };

    const getFieldTypeLabel = (type: string): string => {
        const types: Record<string, string> = {
            'text': 'טקסט',
            'number': 'מספר',
            'date': 'תאריך',
            'select': 'רשימה נפתחת'
        };
        return types[type] || type;
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div>טוען נתונים...</div>
            </div>
        );
    }

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
                <h2 className={styles.title}>שדות הפרויקט</h2>
                <button onClick={handleOpenAddModal} className={styles.addButton}>
                    <span className={styles.addButtonIcon}>+</span>
                    הוסף שדה
                </button>
            </div>

            {fields.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>📋</div>
                    <h3 className={styles.emptyStateTitle}>אין שדות בפרויקט זה</h3>
                    <p className={styles.emptyStateDescription}>
                        התחל על ידי הוספת השדה הראשון שלך
                    </p>
                    <button onClick={handleOpenAddModal} className={styles.emptyStateButton}>
                        הוסף שדה ראשון
                    </button>
                </div>
            ) : (
                <div className={styles.fieldsList}>
                    {fields.map(field => (
                        <div key={field.id} className={styles.fieldCard}>
                            <div className={styles.fieldContent}>
                                <div className={styles.fieldHeader}>
                                    <h4 className={styles.fieldName}>
                                        {field.field_name}
                                    </h4>
                                    {field.is_required && (
                                        <span className={styles.requiredBadge}>*</span>
                                    )}
                                    <span className={styles.typeBadge}>
                                        {getFieldTypeLabel(field.field_type)}
                                    </span>
                                </div>
                                
                                <div className={styles.fieldDetails}>
                                    {field.options && field.options.length > 0 && (
                                        <div className={styles.fieldOptions}>
                                            <strong>אפשרויות:</strong> {field.options.join(', ')}
                                        </div>
                                    )}
                                    <div className={styles.fieldOrder}>
                                        סדר תצוגה: {field.field_order}
                                    </div>
                                </div>
                            </div>
                            
                            <div className={styles.fieldActions}>
                                <button
                                    onClick={() => handleOpenEditModal(field)}
                                    className={styles.editButton}
                                >
                                    ערוך
                                </button>
                                <button
                                    onClick={() => handleDeleteField(field.id, field.field_name)}
                                    className={styles.deleteButton}
                                >
                                    מחק
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingField ? 'עריכת שדה' : 'הוספת שדה חדש'}
            >
                <FieldForm
                    field={editingField}
                    onSubmit={handleSubmitField}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default FieldsManager;