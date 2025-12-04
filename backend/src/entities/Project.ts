import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany 
} from 'typeorm';
import { CustomField } from './CustomField';
import { FieldValue } from './FieldValue';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relations
    @OneToMany(() => CustomField, (field) => field.project)
    customFields: CustomField[];

    @OneToMany(() => FieldValue, (value) => value.project)
    fieldValues: FieldValue[];
}