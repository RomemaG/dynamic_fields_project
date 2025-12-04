import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne,
    JoinColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Project } from './Project';
import { FieldValue } from './FieldValue';

export type FieldType = 'text' | 'number' | 'date' | 'select';

@Entity('project_custom_fields')
export class CustomField {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'project_id' })
    projectId: number;

    @Column({ name: 'field_name', type: 'varchar', length: 255 })
    fieldName: string;

    @Column({ 
        name: 'field_type', 
        type: 'enum',
        enum: ['text', 'number', 'date', 'select']
    })
    fieldType: FieldType;

    @Column({ name: 'is_required', type: 'boolean', default: false })
    isRequired: boolean;

    @Column({ type: 'json', nullable: true })
    options: string[] | null;

    @Column({ name: 'field_order', type: 'int', default: 0 })
    fieldOrder: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relations
    @ManyToOne(() => Project, (project) => project.customFields, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @OneToMany(() => FieldValue, (value) => value.field)
    values: FieldValue[];
}