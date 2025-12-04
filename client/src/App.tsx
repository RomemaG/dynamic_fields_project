import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProjectContainer from './components/projects/ProjectContainer';
import FieldsManager from './components/fields/FieldsManager';
import Modal from './components/common/Modal';
import EmptyState from './components/common/EmptyState';
import styles from './App.module.css';
import './App.css';

function App() {
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [isFieldsManagerOpen, setIsFieldsManagerOpen] = useState<boolean>(false);
    const [reloadCounter, setReloadCounter] = useState<number>(0);

    const handleCloseFieldsManager = () => {
        setIsFieldsManagerOpen(false);
    };

    const handleFieldsChanged = () => {
        setReloadCounter(prev => prev + 1);
    };

    return (
        <div className={styles.app}>
            <div className={styles.layout}>
                {/* Sidebar */}
                <Sidebar 
                    onSelectProject={setSelectedProjectId}
                    selectedProjectId={selectedProjectId}
                />
                
                {/* Main Content */}
                <div className={styles.mainContent}>
                    {selectedProjectId ? (
                        <ProjectContainer 
                            projectId={selectedProjectId}
                            onManageFields={() => setIsFieldsManagerOpen(true)}
                            triggerReload={reloadCounter}
                        />
                    ) : (
                        <div className={styles.emptyStateWrapper}>
                            <EmptyState
                                icon="📁"
                                title="בחר פרויקט כדי להתחיל"
                                description="בחר פרויקט מהרשימה בצד כדי לצפות ולערוך את הפרטים שלו"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Fields Manager Modal */}
            {selectedProjectId && (
                <Modal
                    isOpen={isFieldsManagerOpen}
                    onClose={handleCloseFieldsManager}
                    title="ניהול שדות הפרויקט"
                >
                    <div className={styles.modalContent}>
                        <FieldsManager 
                            projectId={selectedProjectId}
                            onFieldsChange={handleFieldsChanged}
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default App;