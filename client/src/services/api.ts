import axios, { AxiosResponse } from 'axios';
import { Project, CustomField, CreateFieldData, FieldValue, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Projects
export const getAllProjects = (): Promise<AxiosResponse<ApiResponse<Project[]>>> => 
    api.get('/projects');

export const getProject = (projectId: number): Promise<AxiosResponse<ApiResponse<Project>>> => 
    api.get(`/projects/${projectId}`);

// Fields
export const getProjectFields = (projectId: number): Promise<AxiosResponse<ApiResponse<CustomField[]>>> => 
    api.get(`/projects/${projectId}/fields`);

export const createField = (projectId: number, fieldData: CreateFieldData): Promise<AxiosResponse<ApiResponse<CustomField>>> => 
    api.post(`/projects/${projectId}/fields`, fieldData);

export const updateField = (projectId: number, fieldId: number, fieldData: Partial<CreateFieldData>): Promise<AxiosResponse<ApiResponse<CustomField>>> => 
    api.put(`/projects/${projectId}/fields/${fieldId}`, fieldData);

export const deleteField = (projectId: number, fieldId: number): Promise<AxiosResponse<ApiResponse<void>>> => 
    api.delete(`/projects/${projectId}/fields/${fieldId}`);

// Values
export const saveFieldValue = (projectId: number, fieldId: number, value: string): Promise<AxiosResponse<ApiResponse<any>>> => 
    api.post(`/projects/${projectId}/fields/${fieldId}/value`, { value });

export const saveMultipleValues = (projectId: number, values: FieldValue[]): Promise<AxiosResponse<ApiResponse<any>>> => 
    api.post(`/projects/${projectId}/field-values`, { values });

export default api;