// Project types
export interface Project {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

// Field types
export type FieldType = 'text' | 'number' | 'date' | 'select';

export interface CustomField {
    id: number;
    project_id: number;
    field_name: string;
    field_type: FieldType;
    field_order: number;
    is_required: boolean;
    options: string[] | null;
    value?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateFieldData {
    field_name: string;
    field_type: FieldType;
    is_required: boolean;
    field_order: number;
    options?: string[];
}

export interface FieldValue {
    field_id: number;
    value: string;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}