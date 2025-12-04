import React, { useState, useEffect } from 'react';
import { getAllProjects } from '../services/api';
import { Project } from '../types';
import styles from './Sidebar.module.css';

interface SidebarProps {
    onSelectProject: (projectId: number) => void;
    selectedProjectId: number | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectProject, selectedProjectId }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const response = await getAllProjects();
            const projectsData = response.data.data || [];
            setProjects(projectsData);
            
            if (projectsData.length > 0 && !selectedProjectId) {
                onSelectProject(projectsData[0].id);
            }
        } catch (err) {
            setError('שגיאה בטעינת פרויקטים');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.sidebar}>
                <div className={styles.loading}>טוען פרויקטים...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.sidebar}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.sidebar}>
            <h2 className={styles.title}>פרויקטים</h2>
            <ul className={styles.projectsList}>
                {projects.map(project => (
                    <li 
                        key={project.id}
                        onClick={() => onSelectProject(project.id)}
                        className={`${styles.projectItem} ${
                            selectedProjectId === project.id ? styles.projectItemSelected : ''
                        }`}
                    >
                        <div className={styles.projectName}>{project.name}</div>
                        <div className={styles.projectDescription}>{project.description}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;