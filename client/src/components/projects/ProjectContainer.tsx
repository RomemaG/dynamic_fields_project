import React, { useState, useEffect } from 'react';
import { getProjectFields } from '../../services/api';
import { CustomField } from '../../types';
import ProjectView from './ProjectView';
import ProjectValuesForm from './ProjectValuesForm';
import styles from './ProjectContainer.module.css';

interface ProjectContainerProps {
    projectId: number;
    onManageFields: () => void;
    triggerReload?: number;
}

type ViewMode = 'view' | 'edit';

const ProjectContainer: React.FC<ProjectContainerProps> = ({ 
    projectId, 
    onManageFields,
    triggerReload 
}) => {
    const [fields, setFields] = useState<CustomField[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<ViewMode>('view');

    useEffect(() => {
        loadFields();
        setViewMode('view');
    }, [projectId, triggerReload]);

    const loadFields = async () => {
        setLoading(true);
        try {
            const response = await getProjectFields(projectId);
            setFields(response.data.data || []);
        } catch (err) {
            console.error('Error loading fields:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveValues = () => {
        loadFields();
        setViewMode('view');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>פרויקט #{projectId}</h1>
                <button onClick={onManageFields} className={styles.manageButton}>
                    <span>⚙️</span>
                    ניהול שדות
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>
                    טוען נתונים...
                </div>
            ) : (
                <div className={styles.content}>
                    {viewMode === 'view' ? (
                        <ProjectView 
                            projectId={projectId}
                            fields={fields}
                            onEdit={() => setViewMode('edit')}
                        />
                    ) : (
                        <ProjectValuesForm 
                            projectId={projectId}
                            fields={fields}
                            onCancel={() => setViewMode('view')}
                            onSave={handleSaveValues}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectContainer;