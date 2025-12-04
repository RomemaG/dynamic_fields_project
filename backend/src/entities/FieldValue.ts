import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Unique
} from 'typeorm';
import { Project } from './Project';
import { CustomField } from './CustomField';

@Entity('project_custom_field_values')
@Unique(['fieldId', 'projectId']) 
export class FieldValue {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'field_id' })
    fieldId: number;

    @Column({ name: 'project_id' })
    projectId: number;

    @Column({ type: 'text' })
    value: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relations
    @ManyToOne(() => CustomField, (field) => field.values, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'field_id' })
    field: CustomField;

    @ManyToOne(() => Project, (project) => project.fieldValues, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'project_id' })
    project: Project;
}