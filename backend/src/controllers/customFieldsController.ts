import { Request, Response, NextFunction } from 'express';
import customFieldsService from '../services/customFieldsService';

class CustomFieldsController {

    // ==================== PROJECTS ====================

    async getAllProjects(req: Request, res: Response, next: NextFunction) {
        try {
            const projects = await customFieldsService.getAllProjects();
            res.json({
                success: true,
                data: projects
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getProjectById(req: Request, res: Response, next: NextFunction) {
        try {
            const projectId = parseInt(req.params.projectId);
            const project = await customFieldsService.getProjectById(projectId);

            if (!project) {
                return res.status(404).json({
                    success: false,
                    error: 'פרויקט לא נמצא'
                });
            }

            res.json({
                success: true,
                data: project
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ==================== FIELDS ====================

    async getProjectFields(req: Request, res: Response, next: NextFunction) {
        try {
            const projectId = parseInt(req.params.projectId);
            const fields = await customFieldsService.getProjectFieldsWithValues(projectId);
            res.json({
                success: true,
                data: fields
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async createField(req: Request, res: Response, next: NextFunction) {
        try {
            const projectId = parseInt(req.params.projectId);
            const { field_name, field_type, is_required, options, field_order } = req.body;

            const field = await customFieldsService.createField(projectId, {
                fieldName: field_name,
                fieldType: field_type,
                isRequired: is_required,
                options,
                fieldOrder: field_order
            });

            res.status(201).json({
                success: true,
                data: field,
                message: 'השדה נוצר בהצלחה'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async updateField(req: Request, res: Response, next: NextFunction) {
        try {
            const fieldId = parseInt(req.params.fieldId);
            const projectId = parseInt(req.params.projectId);
            const { field_name, field_type, is_required, options, field_order } = req.body;

            // Build update data 
            const updateData: any = {};
            if (field_name !== undefined && field_name !== null) {
                updateData.fieldName = field_name;
            }
            if (field_type !== undefined && field_type !== null) {
                updateData.fieldType = field_type;
            }
            if (is_required !== undefined && is_required !== null) {
                updateData.isRequired = is_required;
            }
            if (options !== undefined && options !== null) {
                updateData.options = options;
            }
            if (field_order !== undefined && field_order !== null) {
                updateData.fieldOrder = field_order;
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'לא נשלחו שדות לעדכון'
                });
            }

            const field = await customFieldsService.updateField(fieldId, projectId, updateData);

            res.json({
                success: true,
                data: field,
                message: 'השדה עודכן בהצלחה'
            });
        } catch (error: any) {
            console.error(' Update error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async deleteField(req: Request, res: Response, next: NextFunction) {
        try {
            const fieldId = parseInt(req.params.fieldId);
            const projectId = parseInt(req.params.projectId);

            const result = await customFieldsService.deleteField(fieldId, projectId);

            res.json({
                success: true,
                message: result.message
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // ==================== FIELD VALUES ====================

    async saveFieldValue(req: Request, res: Response, next: NextFunction) {
        try {
            const fieldId = parseInt(req.params.fieldId);
            const projectId = parseInt(req.params.projectId);
            const { value } = req.body;

            const result = await customFieldsService.saveFieldValue(fieldId, projectId, value);

            res.json({
                success: true,
                data: result,
                message: 'הערך נשמר בהצלחה'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async saveMultipleValues(req: Request, res: Response, next: NextFunction) {
        try {
            const projectId = parseInt(req.params.projectId);
            const { values } = req.body;

            const result = await customFieldsService.saveMultipleValues(projectId, values);

            res.json({
                success: true,
                data: result,
                message: 'הערכים נשמרו בהצלחה'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default new CustomFieldsController();