import { Router } from 'express';
import { body, param } from 'express-validator';
import controller from '../controllers/customFieldsController';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// ==================== PROJECTS ====================

router.get('/projects', controller.getAllProjects.bind(controller));

router.get('/projects/:projectId',
    param('projectId').isInt().withMessage('מזהה פרויקט חייב להיות מספר'),
    handleValidationErrors,
    controller.getProjectById.bind(controller)
);

// ==================== FIELDS ====================

router.get('/projects/:projectId/fields',
    param('projectId').isInt().withMessage('מזהה פרויקט חייב להיות מספר'),
    handleValidationErrors,
    controller.getProjectFields.bind(controller)
);

router.post('/projects/:projectId/fields',
    param('projectId').isInt().withMessage('מזהה פרויקט חייב להיות מספר'),
    body('field_name').notEmpty().withMessage('שם השדה הוא חובה'),
    body('field_type').isIn(['text', 'number', 'date', 'select']).withMessage('סוג שדה לא תקין'),
    body('is_required').optional().isBoolean().withMessage('is_required חייב להיות true/false'),
    body('options').optional().isArray().withMessage('options חייב להיות מערך'),
    body('field_order').optional().isInt().withMessage('field_order חייב להיות מספר'),
    handleValidationErrors,
    controller.createField.bind(controller)
);

router.put('/projects/:projectId/fields/:fieldId',
    param('projectId').isInt().withMessage('מזהה פרויקט חייב להיות מספר'),
    param('fieldId').isInt().withMessage('מזהה שדה חייב להיות מספר'),
    body('field_name').optional().notEmpty().withMessage('שם השדה לא יכול להיות ריק'),
    body('field_type').optional().isIn(['text', 'number', 'date', 'select']).withMessage('סוג שדה לא תקין'),
    body('is_required').optional().isBoolean().withMessage('is_required חייב להיות true/false'),
    body('options').optional().isArray().withMessage('options חייב להיות מערך'),
    body('field_order').optional().isInt().withMessage('field_order חייב להיות מספר'),
    handleValidationErrors,
    controller.updateField.bind(controller)
);

router.delete('/projects/:projectId/fields/:fieldId',
    param('projectId').isInt().withMessage('מזהה פרויקט חייב להיות מספר'),
    param('fieldId').isInt().withMessage('מזהה שדה חייב להיות מספר'),
    handleValidationErrors,
    controller.deleteField.bind(controller)
);

// ==================== FIELD VALUES ====================

router.post('/projects/:projectId/field-values',
    param('projectId').isInt().withMessage('מזהה פרויקט חייב להיות מספר'),
    body('values').isArray().withMessage('values חייב להיות מערך'),
    body('values.*.field_id').isInt().withMessage('field_id חייב להיות מספר'),
    handleValidationErrors,
    controller.saveMultipleValues.bind(controller)
);

router.post('/projects/:projectId/fields/:fieldId/value',
    param('projectId').isInt().withMessage('מזהה פרויקט חייב להיות מספר'),
    param('fieldId').isInt().withMessage('מזהה שדה חייב להיות מספר'),
    body('value').exists().withMessage('value הוא חובה'),
    handleValidationErrors,
    controller.saveFieldValue.bind(controller)
);

export default router;