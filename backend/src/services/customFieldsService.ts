import { AppDataSource } from '../config/database';
import { Project } from '../entities/Project';
import { CustomField, FieldType } from '../entities/CustomField';
import { FieldValue } from '../entities/FieldValue';

class CustomFieldsService {
    private projectRepo = AppDataSource.getRepository(Project);
    private fieldRepo = AppDataSource.getRepository(CustomField);
    private valueRepo = AppDataSource.getRepository(FieldValue);

    // ==================== PROJECTS ====================

    async getAllProjects(): Promise<Project[]> {
        return await this.projectRepo.find({
            order: { createdAt: 'DESC' }
        });
    }

    async getProjectById(projectId: number): Promise<Project | null> {
        return await this.projectRepo.findOne({
            where: { id: projectId }
        });
    }

    // ==================== FIELDS ====================

    async createField(projectId: number, fieldData: {
        fieldName: string;
        fieldType: FieldType;
        isRequired?: boolean;
        options?: string[] | null;
        fieldOrder?: number;
    }): Promise<CustomField> {
        const { fieldName, fieldType, isRequired = false, options = null, fieldOrder = 0 } = fieldData;

        // Validations
        const validTypes: FieldType[] = ['text', 'number', 'date', 'select'];
        if (!validTypes.includes(fieldType)) {
            throw new Error(`סוג שדה לא תקין. סוגים תקינים: ${validTypes.join(', ')}`);
        }

        if (fieldType === 'select') {
            if (!options || !Array.isArray(options) || options.length === 0) {
                throw new Error('שדה מסוג select חייב להכיל לפחות אפשרות אחת');
            }
        }

        // Check if project exists
        const project = await this.projectRepo.findOne({ where: { id: projectId } });
        if (!project) {
            throw new Error('פרויקט לא נמצא');
        }

        // Check for duplicate field name
        const existing = await this.fieldRepo.findOne({
            where: { projectId, fieldName }
        });
        if (existing) {
            throw new Error(`שדה בשם "${fieldName}" כבר קיים בפרויקט זה`);
        }

        // Create new field
        const field = this.fieldRepo.create({
            projectId,
            fieldName,
            fieldType,
            isRequired,
            options: fieldType === 'select' ? options : null,
            fieldOrder
        });

        return await this.fieldRepo.save(field);
    }

    async updateField(
        fieldId: number,
        projectId: number,
        fieldData: Partial<CustomField>
    ): Promise<CustomField> {
        console.log('🔍 Service updateField called:', { fieldId, projectId, fieldData });

        const field = await this.fieldRepo.findOne({
            where: { id: fieldId, projectId }
        });

        if (!field) {
            throw new Error('שדה לא נמצא או לא שייך לפרויקט זה');
        }

        console.log('📦 Current field before update:', field);

        // Check for duplicate name if changing name
        if (fieldData.fieldName && fieldData.fieldName !== field.fieldName) {
            const duplicate = await this.fieldRepo.findOne({
                where: { projectId, fieldName: fieldData.fieldName }
            });
            if (duplicate) {
                throw new Error(`שדה בשם "${fieldData.fieldName}" כבר קיים בפרויקט זה`);
            }
        }

        const isTypeChanging = fieldData.fieldType && fieldData.fieldType !== field.fieldType;

        if (isTypeChanging) {
            console.log(`⚠️ Field type changing from ${field.fieldType} to ${fieldData.fieldType}`);

            await this.valueRepo.delete({
                fieldId: fieldId,
                projectId: projectId
            });
            console.log('🗑️ Value cleared');

            if (field.fieldType === 'select' && fieldData.fieldType !== 'select') {
                fieldData.options = null;
                console.log('🗑️ Options cleared (changing from select to another type)');
            }

            if (fieldData.fieldType === 'select' && !fieldData.options) {
                console.log('⚠️ Changing to select type - options must be provided');
            }
        }

        if (fieldData.fieldType && fieldData.fieldType !== 'select') {
            fieldData.options = null;
            console.log('🧹 Ensuring options is null for non-select field');
        }

        // Update field
        Object.assign(field, fieldData);
        console.log('📝 Field after Object.assign:', field);

        const savedField = await this.fieldRepo.save(field);
        console.log('💾 Field after save:', savedField);

        return savedField;
    }

    async deleteField(fieldId: number, projectId: number): Promise<{ success: boolean; message: string }> {
        const result = await this.fieldRepo.delete({ id: fieldId, projectId });

        if (result.affected === 0) {
            throw new Error('שדה לא נמצא או לא שייך לפרויקט זה');
        }

        return { success: true, message: 'השדה נמחק בהצלחה' };
    }

    async getFieldById(fieldId: number): Promise<CustomField | null> {
        return await this.fieldRepo.findOne({
            where: { id: fieldId }
        });
    }

    // ==================== FIELD VALUES ====================

    async saveFieldValue(fieldId: number, projectId: number, value: string): Promise<FieldValue> {
        // Get field and validate
        const field = await this.fieldRepo.findOne({
            where: { id: fieldId, projectId }
        });

        if (!field) {
            throw new Error('שדה לא נמצא או לא שייך לפרויקט זה');
        }

        // Validate value
        this.validateFieldValue(field, value);

        // Check if value exists
        let fieldValue = await this.valueRepo.findOne({
            where: { fieldId, projectId }
        });

        if (fieldValue) {
            // Update existing
            fieldValue.value = value;
        } else {
            // Create new
            fieldValue = this.valueRepo.create({
                fieldId,
                projectId,
                value
            });
        }

        return await this.valueRepo.save(fieldValue);
    }

    async saveMultipleValues(
        projectId: number,
        values: Array<{ field_id: number; value: string }>
    ): Promise<{ success: FieldValue[]; errors: any[] | null }> {
        const results: FieldValue[] = [];
        const errors: any[] = [];

        for (const item of values) {
            try {
                const result = await this.saveFieldValue(item.field_id, projectId, item.value);
                results.push(result);
            } catch (error: any) {
                errors.push({
                    field_id: item.field_id,
                    error: error.message
                });
            }
        }

        return {
            success: results,
            errors: errors.length > 0 ? errors : null
        };
    }

    async getProjectFieldsWithValues(projectId: number): Promise<any[]> {
        const fields = await this.fieldRepo.find({
            where: { projectId },
            relations: ['values'],
            order: { fieldOrder: 'ASC', id: 'ASC' }
        });

        return fields.map(field => {
            const value = field.values.find(v => v.projectId === projectId);
            return {
                id: field.id,
                field_name: field.fieldName,
                field_type: field.fieldType,
                is_required: field.isRequired,
                options: field.options,
                field_order: field.fieldOrder,
                value: value ? value.value : ''
            };
        });
    }

    // ==================== VALIDATION ====================

    private validateFieldValue(field: CustomField, value: string): boolean {
        if (field.isRequired && (!value || value.trim() === '')) {
            throw new Error(`השדה "${field.fieldName}" הוא חובה`);
        }

        if (!value && !field.isRequired) {
            return true;
        }

        switch (field.fieldType) {
            case 'number':
                if (isNaN(Number(value))) {
                    throw new Error(`השדה "${field.fieldName}" חייב להיות מספר תקין`);
                }
                break;

            case 'date':
                if (!this.isValidDate(value)) {
                    throw new Error(`השדה "${field.fieldName}" חייב להיות תאריך תקין (פורמט: YYYY-MM-DD)`);
                }
                break;

            case 'select':
                if (field.options && !field.options.includes(value)) {
                    throw new Error(
                        `ערך לא תקין עבור השדה "${field.fieldName}". אפשרויות תקינות: ${field.options.join(', ')}`
                    );
                }
                break;

            case 'text':
                break;
        }

        return true;
    }

    private isValidDate(dateString: string): boolean {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    }
}

export default new CustomFieldsService();