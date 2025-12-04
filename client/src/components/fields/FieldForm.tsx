import React, { useState, useEffect } from 'react';
import { CustomField, FieldType } from '../../types';
import styles from './FieldForm.module.css';

interface FieldFormProps {
    field?: CustomField | null;
    onSubmit: (fieldData: FieldFormData) => Promise<void>;
    onCancel: () => void;
}

export interface FieldFormData {
    field_name: string;
    field_type: FieldType;
    is_required: boolean;
    field_order: number;
    options?: string[];
}

const FieldForm: React.FC<FieldFormProps> = ({ field, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<FieldFormData>({
        field_name: '',
        field_type: 'text',
        is_required: false,
        field_order: 0,
        options: []
    });
    const [optionsText, setOptionsText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [hasChanges, setHasChanges] = useState<boolean>(false);

    useEffect(() => {
        if (field) {
            setFormData({
                field_name: field.field_name,
                field_type: field.field_type,
                is_required: field.is_required,
                field_order: field.field_order,
                options: field.options || []
            });
            setOptionsText('');
            setHasChanges(false);
        }
    }, [field]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (field && field.value && hasChanges) {
            const confirmed = window.confirm(
                `שינוי סוג השדה ימחק את הערך הנוכחי: "${field.value}"\n\nהאם להמשיך?`
            );
            if (!confirmed) {
                return;
            }
        }
        
        try {
            setLoading(true);
            const submitData: FieldFormData = {
                ...formData,
                field_order: parseInt(formData.field_order.toString())
            };

            if (formData.field_type === 'select') {
                submitData.options = formData.options || [];
            }

            await onSubmit(submitData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        if (field && name !== 'field_order') {
            setHasChanges(true);
        }
    };

    const handleAddOption = () => {
        if (optionsText.trim()) {
            const newOptions = [...(formData.options || []), optionsText.trim()];
            setFormData(prev => ({ ...prev, options: newOptions }));
            setOptionsText('');
            if (field) setHasChanges(true);
        }
    };

    const handleDeleteOption = (index: number) => {
        const newOptions = formData.options?.filter((_, i) => i !== index) || [];
        setFormData(prev => ({ ...prev, options: newOptions }));
        if (field) setHasChanges(true);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddOption();
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {field && field.value && hasChanges && (
                <div className={styles.infoAlert}>
                    <span className={styles.infoAlertIcon}>⚠️</span>
                    <div className={styles.infoAlertContent}>
                        <div className={styles.infoAlertValue}>
                            שינוי סוג השדה ימחק את הערך הנוכחי: <strong>{field.value}</strong>
                        </div>
                        {field.field_type === 'select' && field.options && (
                            <div className={styles.infoAlertOptions}>
                                האפשרויות ({field.options.join(', ')}) יימחקו גם כן
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    שם השדה <span className={styles.required}>*</span>
                </label>
                <input 
                    type="text"
                    name="field_name"
                    value={formData.field_name}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="לדוגמה: שם לקוח, תאריך התחלה"
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    סוג השדה <span className={styles.required}>*</span>
                </label>
                <select 
                    name="field_type"
                    value={formData.field_type}
                    onChange={handleInputChange}
                    className={styles.select}
                >
                    <option value="text">טקסט</option>
                    <option value="number">מספר</option>
                    <option value="date">תאריך</option>
                    <option value="select">רשימה נפתחת</option>
                </select>
            </div>

            {formData.field_type === 'select' && (
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        אפשרויות לבחירה
                    </label>
                    
                    <div className={styles.optionsList}>
                        {formData.options && formData.options.length > 0 ? (
                            formData.options.map((option, index) => (
                                <div key={index} className={styles.optionItem}>
                                    <span className={styles.optionText}>{option}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteOption(index)}
                                        className={styles.deleteOptionBtn}
                                    >
                                        🗑️ מחק
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyOptions}>
                                אין אפשרויות עדיין. הוסף אפשרות ראשונה למטה
                            </div>
                        )}
                    </div>

                    <div className={styles.addOptionContainer}>
                        <div className={styles.addOptionInput}>
                            <input 
                                type="text"
                                value={optionsText}
                                onChange={(e) => setOptionsText(e.target.value)}
                                placeholder="הכנס אפשרות חדשה..."
                                className={styles.input}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleAddOption}
                            disabled={!optionsText.trim()}
                            className={styles.addOptionBtn}
                        >
                            ➕ הוסף אפשרות
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    סדר תצוגה
                </label>
                <input 
                    type="number"
                    name="field_order"
                    value={formData.field_order}
                    onChange={handleInputChange}
                    min="0"
                    className={styles.input}
                />
            </div>

            <div className={styles.checkboxContainer}>
                <label className={styles.checkboxLabel}>
                    <input 
                        type="checkbox"
                        name="is_required"
                        checked={formData.is_required}
                        onChange={handleInputChange}
                        className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>שדה חובה</span>
                </label>
            </div>

            <div className={styles.buttonContainer}>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className={styles.cancelBtn}
                >
                    ביטול
                </button>
                <button 
                    type="submit"
                    disabled={loading}
                    className={styles.submitBtn}
                >
                    {loading ? 'שומר...' : field ? 'עדכן שדה' : 'צור שדה'}
                </button>
            </div>
        </form>
    );
};

export default FieldForm;